import {BUNDLE_PROMPT_VERSION,BUNDLE_KB_VERSION,parseStructuredItems,bundleParserPrompt} from './parser.mjs';
import {knownClassification,classifyItems,classificationCatalog,classifierPrompt} from './classifier.mjs';
import {retrieveKnowledge,relevantBundleRules,bundleTaxonomy} from './kb-retriever.mjs';
import {buildItemHypotheses,aggregateHypotheses,candidateFindingGroups,findingTargets,reasonInterpretationPrompt} from './hypothesis-engine.mjs';
import {validateApprovedFindings,repairApprovedFindings,VALIDATION_VERSION,bundleCriticInput,bundleCriticPrompt} from './critic.mjs';
import {validateBundleWriting,repairBundleWriting,bundleWriterPrompt,fallbackBundleWriting,adaptBundleResult} from './writer.mjs';
import {verifyAnalysisState,signAnalysisState,previousFindingActions,retainValidFindings} from './reanalysis.mjs';
import {bundleSchemas} from './bundle-schemas.mjs';
export async function runBundleAnalysis(rawInput,env,complete,previousAnalysis=null){
 const trace={prompt_version:BUNDLE_PROMPT_VERSION,kb_version:BUNDLE_KB_VERSION,raw_input:rawInput,validation_version:VALIDATION_VERSION,repair_log:[]};
 const ask=async(stage,prompt,data,schemaName=stage)=>complete(env,[{role:'system',content:prompt},{role:'user',content:typeof data==='string'?data:JSON.stringify(data)}],stage,bundleSchemas[schemaName]);
 async function checked(stage,operation){try{return operation()}catch(error){error.stage=stage;error.code='validation_failed';throw error}}
 let parsed=await ask('parser',bundleParserPrompt,rawInput);
 const items=await checked('parser',()=>parseStructuredItems(parsed));trace.parsed_items=items;
 if(items.length<3)return {insufficient:true,error:'Расскажи хотя бы о трёх разных вещах или занятиях. Можно обычным текстом. Текст сохранён.',code:'too_few_choices'};
 const unknown=items.filter(i=>!knownClassification(i));const classified=unknown.length?await ask('classification',classifierPrompt,{items:unknown,catalog:classificationCatalog()}):{items:[]};
 const classifications=await checked('classification',()=>classifyItems(items,classified));trace.classifications=classifications;
 const retrieved=retrieveKnowledge(classifications);trace.retrieved_kb_rows=retrieved;
 const explicit=items.filter(i=>i.explicit_user_reason);const reasonData=explicit.length?await ask('explicit_reasons',reasonInterpretationPrompt,{items:explicit,taxonomy:bundleTaxonomy()}):{items:[]};
 const itemHypotheses=await checked('item_hypotheses',()=>buildItemHypotheses(items,classifications,retrieved,reasonData));trace.item_hypotheses=itemHypotheses;
 const aggregated=aggregateHypotheses(itemHypotheses);trace.aggregated_hypotheses=aggregated;
 const candidates=candidateFindingGroups(aggregated),targets=findingTargets(items,classifications);
 const previous=await verifyAnalysisState(previousAnalysis,env.OPENAI_API_KEY);const actions=previousFindingActions(previous,items,classifications,aggregated);trace.reanalysis_actions=actions.map(({retained,...action})=>action);
 const criticInput=bundleCriticInput({items,classifications,retrieved,itemHypotheses,aggregated,candidates,targets,previous:actions});
 const context={items,classifications,aggregated};
 function cleanFindings(value,phase){
  const cleaned=repairApprovedFindings(value,context);
  if(Object.values(cleaned.repair_log).some(entries=>entries.length)){
   const entry={phase,...cleaned.repair_log};trace.repair_log.push(entry);
   console.info(JSON.stringify({event:'analysis_repaired',validation_version:VALIDATION_VERSION,...entry}));
  }
  return cleaned.findings;
 }
 let approvedOutput,findings=[],retry=false,failedCheck=null;
 try{approvedOutput=await ask('critic',bundleCriticPrompt,criticInput);findings=await checked('critic',()=>cleanFindings(approvedOutput,'critic_initial'));retry=!findings.length&&approvedOutput.findings.length>0;failedCheck=retry?'no_valid_primary_findings':null}catch(error){if(!['validation_failed','invalid_json'].includes(error.code))throw error;retry=true;failedCheck=error.check||error.code}
 if(retry){
  const repairedOutput=await ask('critic',bundleCriticPrompt,{...criticInput,repair:{check:failedCheck,previous_output:approvedOutput??null,instruction:'Восстанови valid primary findings по реальным support IDs. Secondary optional: при сомнении пустой массив. Повреждённые optional поля можно убрать. Не выдумывай доказательства. Верни корректный JSON по схеме.'}});
  findings=await checked('critic',()=>cleanFindings(repairedOutput,'critic_retry'));
 }
 findings=cleanFindings({findings:retainValidFindings(findings,actions)},'reanalysis_merge');
 if(targets.rich_input&&findings.length===1){
  trace.coverage_recheck=true;
  try{
   const recheck=await ask('critic',bundleCriticPrompt,{...criticInput,coverage_recheck:{approved:findings,instruction:'Для богатого набора найден только один механизм. Проверь другие domains и candidate_findings. Не повторяй первый и не выдумывай ради 3–5. Still-valid finding сохрани.'}});
   const next=cleanFindings(recheck,'coverage_recheck');
   if(next.length>findings.length){const combined=new Map(findings.map(f=>[f.primary_function_id,f]));for(const f of next)if(!combined.has(f.primary_function_id))combined.set(f.primary_function_id,f);const merged=cleanFindings({findings:[...combined.values()]},'coverage_merge');if(merged.length>findings.length)findings=cleanFindings({findings:retainValidFindings(merged,actions)},'coverage_reanalysis_merge')}
  }catch{trace.optional_stage_failures=[{stage:'coverage_recheck',reason:'optional_expansion_unavailable'}]}
 }
 if(!findings.length)return {insufficient:true,error:'Пока не удалось подтвердить даже одну содержательную связь. Можно уточнить, что нравится в выбранных вещах. Текст сохранён.',code:'no_supported_findings'};
 trace.approved_findings=findings;
 const used=new Set(findings.flatMap(f=>f.evidence.map(e=>e.item_id)));trace.unused_items=items.filter(i=>!used.has(i.item_id)).map(i=>({item_id:i.item_id,reason:'no_strong_evidence'}));
 let writing;try{writing=await ask('writer',bundleWriterPrompt,{approved_findings:findings,rich_input:targets.rich_input});const cleanedWriting=repairBundleWriting(writing,findings);writing=await checked('writer',()=>validateBundleWriting(cleanedWriting.output,findings));if(cleanedWriting.repaired_fields.length)trace.repair_log.push({phase:'writer',normalized_optional_fields:cleanedWriting.repaired_fields})}catch(error){console.warn(JSON.stringify({event:'approved_writer_fallback',code:typeof error?.code==='string'&&/^[a-zA-Z0-9_.-]{1,80}$/.test(error.code)?error.code:'writer_unavailable'}));writing=fallbackBundleWriting(findings)}
 trace.writer_output=writing;
 const result={...adaptBundleResult(items,classifications,findings,writing),prompt_version:BUNDLE_PROMPT_VERSION,validation_version:VALIDATION_VERSION,kb_version:BUNDLE_KB_VERSION,knowledge_base_version:BUNDLE_KB_VERSION,reanalysis_actions:trace.reanalysis_actions};
 const analysisState=await signAnalysisState({version:BUNDLE_PROMPT_VERSION,items,classifications,findings},env.OPENAI_API_KEY);
 return {result,trace,analysisState};
}
