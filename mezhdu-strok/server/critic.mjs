import {bundleFunctionIds,relevantBundleRules} from './kb-retriever.mjs';
import {assertSafeOutput} from './guardrails.mjs';
const confidenceOrder=['LOW','MEDIUM','MEDIUM_HIGH','HIGH'];
const crowdClasses=new Set(['live_sport_stadium','live_music','festival_music','concert_festival_stadium_crowd']);
export const VALIDATION_VERSION='critic-repair-v1';
function secondarySupportReason(id,f,context){
 if(!bundleFunctionIds.has(id))return 'unknown_function';
 if(id===f.primary_function_id)return 'duplicates_primary';
 if(id==='collective_energy'&&f.primary_function_id==='intimacy_attachment'||id==='intimacy_attachment'&&f.primary_function_id==='collective_energy')return 'incompatible_mechanism';
 const known=new Map(context.items.map(i=>[i.item_id,i]));const classes=new Map(context.classifications.map(c=>[c.item_id,c]));const alternative=context.aggregated.find(h=>h.function_id===id);const ids=f.evidence.map(e=>e.item_id);const signals=(alternative?.support||[]).filter(s=>ids.includes(s.item_id));
 const explicit=signals.some(s=>s.basis==='explicit_user_reason'&&known.get(s.item_id)?.explicit_user_reason);
 if(f.primary_function_id==='mastery'&&id==='competence'&&!explicit)return 'redundant_with_primary';
 if(signals.length>=2||explicit)return null;
 const commonType=new Set(ids.map(itemId=>classes.get(itemId)?.experience_type));
 const contradicted=alternative?.counterevidence?.some(e=>ids.includes(e.item_id)&&e.kind==='explicit_reason_conflict');
 if(!contradicted&&commonType.size===1&&!commonType.has('unknown')&&!commonType.has(undefined)&&signals.some(s=>s.basis==='structural_affordance'&&s.evidence_strength==='HIGH'))return null;
 return 'insufficient_support';
}
function cleanAnalyticalText(value,max=1800){if(typeof value!=='string'||!value.trim()||value.length>max)return null;try{assertSafeOutput([value]);return value}catch{return null}}
export function repairApprovedFindings(value,context){
 if(!Array.isArray(value?.findings))throw Object.assign(Error('Findings shape'),{check:'findings_shape'});
 const log={removed_secondary_functions:[],removed_evidence:[],removed_findings:[],removed_counterevidence:[],normalized_optional_fields:[]};
 const known=new Map(context.items.map(i=>[i.item_id,i]));const hypotheses=new Map(context.aggregated.map(h=>[h.function_id,h]));const prepared=[];
 for(const [index,raw] of value.findings.slice(0,50).entries()){
  const h=hypotheses.get(raw?.primary_function_id);const findingId=h?'finding_'+h.function_id:'candidate_'+(index+1);
  if(!h){log.removed_findings.push({finding_id:findingId,reason:'unsupported_primary'});continue}
  const evidence=[],seen=new Set();
  for(const entry of Array.isArray(raw.evidence)?raw.evidence:[]){
   const reason=cleanAnalyticalText(entry?.reason);const valid=known.has(entry?.item_id)&&h.support.some(s=>s.item_id===entry.item_id)&&!seen.has(entry.item_id)&&reason;
   if(!valid){log.removed_evidence.push({finding_id:findingId,reason:seen.has(entry?.item_id)?'duplicate_evidence':'unsupported_or_invalid_evidence'});continue}
   seen.add(entry.item_id);evidence.push({item_id:entry.item_id,role:'support',reason});
  }
  if(evidence.length<2){log.removed_findings.push({finding_id:findingId,reason:'insufficient_primary_support'});continue}
  if(evidence.length>12){evidence.length=12;log.normalized_optional_fields.push({finding_id:findingId,field:'evidence',reason:'bounded_count'})}
  const supportingText=evidence.map(e=>e.reason).join(' ').slice(0,1800);
  const description=cleanAnalyticalText(raw.description)||cleanAnalyticalText(raw.reason_selected)||supportingText;
  const title=cleanAnalyticalText(raw.title,140)||evidence.slice(0,2).map(e=>known.get(e.item_id).label).join(' и ').slice(0,140);
  const reasonSelected=cleanAnalyticalText(raw.reason_selected)||description;
  const f={primary_function_id:h.function_id,finding_id:findingId,evidence,title,description,reason_selected:reasonSelected,secondary_function_ids:[],counterevidence:[],competing_functions:[],user_fit_confidence:confidenceOrder.includes(raw.user_fit_confidence)?raw.user_fit_confidence:h.user_fit_confidence};
  for(const field of ['title','description','reason_selected','user_fit_confidence'])if(raw[field]!==f[field])log.normalized_optional_fields.push({finding_id:findingId,field,reason:'invalid_or_unsafe_value'});
  const secondarySeen=new Set();
  if(!Array.isArray(raw.secondary_function_ids))log.normalized_optional_fields.push({finding_id:findingId,field:'secondary_function_ids',reason:'invalid_optional_array'});
  for(const id of Array.isArray(raw.secondary_function_ids)?raw.secondary_function_ids:[]){
   const reason=secondarySeen.has(id)?'duplicate_secondary':secondarySupportReason(id,f,context);secondarySeen.add(id);
   if(reason){log.removed_secondary_functions.push({finding_id:findingId,function_id:bundleFunctionIds.has(id)?id:'unrecognized',reason});continue}
   if(f.secondary_function_ids.length===3){log.removed_secondary_functions.push({finding_id:findingId,function_id:id,reason:'bounded_count'});continue}f.secondary_function_ids.push(id);
  }
  const counters=new Set();
  for(const entry of Array.isArray(raw.counterevidence)?raw.counterevidence:[]){const reason=cleanAnalyticalText(entry?.reason);if(!known.has(entry?.item_id)||!h.counterevidence.some(c=>c.item_id===entry.item_id)||counters.has(entry.item_id)||!reason){log.removed_counterevidence.push({finding_id:findingId,reason:'unsupported_or_invalid_counterevidence'});continue}counters.add(entry.item_id);f.counterevidence.push({item_id:entry.item_id,reason})}
  f.competing_functions=[...new Set((Array.isArray(raw.competing_functions)?raw.competing_functions:[]).filter(id=>bundleFunctionIds.has(id)&&id!==f.primary_function_id))].slice(0,8);
  if(!Array.isArray(raw.competing_functions)||JSON.stringify(raw.competing_functions)!==JSON.stringify(f.competing_functions))log.normalized_optional_fields.push({finding_id:findingId,field:'competing_functions',reason:'invalid_optional_values'});
  prepared.push(f);
 }
 // Prefer the better-supported duplicate while preserving the model's ordering of distinct mechanisms.
 const best=new Map();for(const f of prepared){const old=best.get(f.primary_function_id);if(!old||f.evidence.length>old.evidence.length)best.set(f.primary_function_id,f)}
 const selected=[];const retained=new Set();
 for(const f of prepared){if(best.get(f.primary_function_id)!==f||retained.has(f.primary_function_id)){log.removed_findings.push({finding_id:f.finding_id,reason:'duplicate_finding'});continue}if(selected.length===5){log.removed_findings.push({finding_id:f.finding_id,reason:'bounded_count'});continue}
  try{const checked=validateApprovedFindings({findings:[...selected,f]},context);selected.splice(0,selected.length,...checked);retained.add(f.primary_function_id)}catch(error){log.removed_findings.push({finding_id:f.finding_id,reason:/^[a-z_]{1,80}$/.test(error?.check||'')?error.check:'unrecoverable_primary'})}
 }
 return {findings:validateApprovedFindings({findings:selected},context),repair_log:log};
}
export function validateApprovedFindings(value,{items,classifications,aggregated}){
 if(!Array.isArray(value?.findings)||value.findings.length>5)throw Object.assign(Error('Findings shape'),{check:'findings_shape'});
 const known=new Map(items.map(i=>[i.item_id,i]));const classes=new Map(classifications.map(c=>[c.item_id,c]));const hypotheses=new Map(aggregated.map(h=>[h.function_id,h]));const selectedFunctions=new Set();const evidenceSignatures=new Set();
 return value.findings.map(f=>{
  const h=hypotheses.get(f.primary_function_id);
  if(!h||selectedFunctions.has(f.primary_function_id)||!Array.isArray(f.evidence)||f.evidence.length<2||f.evidence.length>12)throw Object.assign(Error('Finding evidence'),{check:'finding_support_count'});
  const ids=f.evidence.map(e=>e.item_id);if(new Set(ids).size!==ids.length||ids.some(id=>!known.has(id)||!h.support.some(s=>s.item_id===id)))throw Object.assign(Error('Unsupported finding item'),{check:'finding_item_ids'});
  if(f.secondary_function_ids?.includes('collective_energy')&&f.primary_function_id==='intimacy_attachment'||f.secondary_function_ids?.includes('intimacy_attachment')&&f.primary_function_id==='collective_energy')throw Object.assign(Error('Mixed social mechanisms'),{check:'social_distinction'});
  if(!Array.isArray(f.secondary_function_ids)||f.secondary_function_ids.some(id=>!bundleFunctionIds.has(id))||!Array.isArray(f.competing_functions)||f.competing_functions.some(id=>!bundleFunctionIds.has(id)))throw Object.assign(Error('Unknown finding function'),{check:'finding_function_ids'});
  for(const id of f.secondary_function_ids)if(secondarySupportReason(id,f,{items,classifications,aggregated}))throw Object.assign(Error('Unconfirmed secondary function'),{check:'secondary_function_support'})
  if(!Array.isArray(f.counterevidence)||f.counterevidence.some(e=>!known.has(e.item_id)||!h.counterevidence.some(c=>c.item_id===e.item_id)))throw Object.assign(Error('Unsupported counterevidence'),{check:'finding_counterevidence'});
  const close=ids.some(id=>classes.get(id)?.context.close_relationship),crowd=ids.some(id=>crowdClasses.has(classes.get(id)?.experience_type));
  if(f.primary_function_id==='collective_energy'&&close||['shared_experience','belonging'].includes(f.primary_function_id)&&close&&crowd)throw Object.assign(Error('Close bond is not collective energy'),{check:'social_distinction'});
  if(ids.some(id=>classes.get(id)?.experience_type==='specific_city_country_place'&&!known.get(id).explicit_user_reason))throw Object.assign(Error('Place motive needs context'),{check:'place_zero_motive_prior'});
  for(const old of selectedFunctions){const oldFinding=value.findings.find(x=>x.primary_function_id===old);const same=oldFinding?.evidence.length===ids.length&&oldFinding.evidence.every(e=>ids.includes(e.item_id));if(same&&h.competing_functions.includes(old))throw Object.assign(Error('Duplicate neighbouring explanation'),{check:'duplicate_neighbour_finding'})}
  const sorted=ids.slice().sort().join('|');const signature=f.primary_function_id+'|'+sorted;if(evidenceSignatures.has(signature))throw Object.assign(Error('Duplicate finding'),{check:'duplicate_finding'});
  assertSafeOutput([f.title,f.description,f.reason_selected,...f.evidence.map(e=>e.reason)]);
  for(const text of [f.title,f.description,f.reason_selected,...f.evidence.map(e=>e.reason)])if(typeof text!=='string'||!text.trim()||text.length>1800)throw Object.assign(Error('Finding explanation'),{check:'finding_text'});
  selectedFunctions.add(f.primary_function_id);evidenceSignatures.add(signature);
  const requested=confidenceOrder.indexOf(f.user_fit_confidence),runtime=confidenceOrder.indexOf(h.user_fit_confidence);if(requested<0)throw Error('Confidence band');
  return {...f,finding_id:'finding_'+f.primary_function_id,user_fit_confidence:confidenceOrder[Math.min(requested,runtime)],evidence:f.evidence.map(e=>({...e,role:'support',label:known.get(e.item_id).label})),secondary_function_ids:[...new Set(f.secondary_function_ids.filter(id=>id!==f.primary_function_id))],confidence_basis:h.confidence_basis};
 });
}
export function bundleCriticInput({items,classifications,retrieved,itemHypotheses,aggregated,candidates,targets,previous}){return {parsed_items:items,classifications,retrieved_rows:retrieved,item_hypotheses:itemHypotheses,aggregated_hypotheses:aggregated,candidate_findings:candidates,targets,previous_findings:previous,guardrails:relevantBundleRules([...retrieved,...itemHypotheses])}}
export const bundleCriticPrompt=`Проверь и выбери distinct findings — несколько независимых повторяющихся rewarding mechanisms, не master theory о человеке. Перед тобой parsed items, observable classifications, только retrieved KB rows, несколько item hypotheses, агрегированные support/counterevidence, конкурирующие functions, distinctions и traps. Не считай structural affordance пользовательским мотивом. evidence_strength из KB и user_fit_confidence — разные ordinal labels, не вероятности. User-fit нельзя повышать выше runtime confidence, явная причина важнее prior.
Каждый finding: primary_function_id из aggregate, минимум 2 разных supporting item_id именно из support этой функции, желательно 3+ и разные domains; title, description и короткий reason для каждого item описывают конкретный общий процесс, не личность. Не выдумывай действия (слушание не равно исполнению, зритель не игрок). Secondary functions — optional enrichment, [] полностью валиден. Если нюанс не подтверждён, удали его и сохрани доказанный primary. Нужны минимум два relevant signals ИЛИ один explicit_user_reason ИЛИ почти structural общий experience context. Не дублируй primary (например, mastery/competence без нового уточнения). Не отменяй finding из-за слабого secondary. Secondary functions должны быть нужны, не декоративны. Рассмотри competing functions, укажи контрпримеры только из переданного counterevidence и короткий reason_selected, а не private chain-of-thought.
Rich input >=10 choices и несколько domains: цель 3–5 разных findings; малый ввод: 1–3. Не force-fit, но один finding для богатого списка требует повторного coverage pass. Не дублируй mastery и challenge на одинаковых объектах, добавь близкую функцию в secondary либо выбери более точное объяснение. Исследуй все фактически присутствующие domains; outliers разрешены. Верни unused_items с причиной no_strong_evidence, не оставляй их из-за ранней остановки.
HARD: intimacy_attachment != belonging != collective_energy, shared_experience != collective_energy, cooperation != belonging. Partner/child нельзя автоматически включать в коллективную энергию стадиона/концерта. Named places имеют near-zero motive prior: без причины не выбирай порядок/гостеприимство/романтику/архитектуру. Никаких running→discipline, chess→IQ, boxing→aggression, parties→extroversion, wine→hedonist, luxury→materialism. Никогда не выводи политики, религии, ориентации, здоровья, психиатрии, этничности, криминальности или зависимости.
Предыдущие still-valid findings нельзя убирать из-за случайности повторного запуска; действия KEEP/STRENGTHEN/REVISE/REMOVE определяются evidence. Без достаточной связи findings может быть пустым; не выдумывай. Не показывай пользователю ontology ids или оценки. Только structured output.`;
