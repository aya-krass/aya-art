// Explicit opt-in runner: uses paid OpenAI calls and never updates prompts/KB automatically.
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import worker,{completion,PROMPT_VERSION,KNOWLEDGE_VERSION} from '../dist/server/index.js';
const personas=JSON.parse(await readFile(new URL('../tests/personas-intelligence-v1.json',import.meta.url),'utf8'));
if(!process.argv.includes('--live')){console.log('Offline regression: node --test tests/*.test.mjs\nPaid semantic evaluation: OPENAI_API_KEY from environment; node scripts/evaluate-intelligence.mjs --live');process.exit(0)}
if(!process.env.OPENAI_API_KEY){console.error('OPENAI_API_KEY is not set in this execution environment. Hosted secrets are not copied locally.');process.exit(1)}
const env={OPENAI_API_KEY:process.env.OPENAI_API_KEY,OPENAI_MODEL:process.env.OPENAI_MODEL||'gpt-4.1'};
const metrics=['diversity','specificity','coverage','evidence','no_fabrication','surprise','no_personality_labels'];
const judgeSchema={type:'object',properties:Object.fromEntries([...metrics.map(name=>[name,{type:'integer',minimum:0,maximum:10}]),['notes',{type:'string'}]]),required:[...metrics,'notes'],additionalProperties:false};
const report={prompt_version:PROMPT_VERSION,knowledge_base_version:KNOWLEDGE_VERSION,model:env.OPENAI_MODEL,created_at:new Date().toISOString(),runs:[]};
for(const persona of personas){
 try{const response=await worker.fetch(new Request('https://evaluation.local/api/analyze',{method:'POST',body:JSON.stringify({text:persona.raw_input,research_consent:false})}),env);const result=await response.json();if(!response.ok){report.runs.push({persona:persona.id,status:response.status,code:result.code,stage:result.stage,check:result.check});console.log(persona.id+': HTTP '+response.status);continue}
 const evaluation=await completion(env,[{role:'system',content:'Ты независимый оценщик качества продукта, не психолог. Сравни конкретный результат с исходными выборами и рубрикой. Оцени каждый критерий 0–10. Не давай личности баллы. Не принимай гипотезу за установленную причину выбора. Выдуманные факты, одинаковые универсальные ответы, проигнорированные категории и неоправданная уверенность снижают оценки. Разные области предпочтительны, но не обязательны для качественной связи. notes — короткие проверяемые замечания, не скрытые рассуждения.'},{role:'user',content:JSON.stringify({persona,result,metrics})}],'semantic_evaluation',judgeSchema);
 const {visual_token,research,analysis_state,...publicOutput}=result;report.runs.push({persona:persona.id,status:200,result:publicOutput,evaluation});console.log(persona.id+': '+JSON.stringify(evaluation));
 }catch{report.runs.push({persona:persona.id,status:'evaluation_failed'});console.log(persona.id+': evaluation failed')}
}
report.repeated_headlines=report.runs.filter(r=>r.result).map(r=>r.result.headline).filter((s,i,a)=>a.indexOf(s)!==i);
await mkdir(new URL('../.eval-output/',import.meta.url),{recursive:true});await writeFile(new URL('../.eval-output/intelligence-v1-report.json',import.meta.url),JSON.stringify(report,null,2));console.log('Saved .eval-output/intelligence-v1-report.json. Review manually; no auto-learning.');
