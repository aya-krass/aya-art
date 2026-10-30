import {BUNDLE_PROMPT_VERSION as PROMPT_VERSION,BUNDLE_KB_VERSION as KNOWLEDGE_VERSION} from './parser.mjs';
const RESEARCH_PREFIX='pseudonymous-research/intelligence-v1/';
const researchJSON=(value,status=200)=>Response.json(value,{status,headers:{'Cache-Control':'no-store'}});
const uuidPattern=/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
async function researchKey(env){return crypto.subtle.importKey('raw',new TextEncoder().encode(env.OPENAI_API_KEY),{name:'HMAC',hash:'SHA-256'},false,['sign','verify'])}
async function researchToken(id,env){const exp=Math.floor(Date.now()/1000)+30*86400;const message='research-v7:'+id+':'+exp;const signature=await crypto.subtle.sign('HMAC',await researchKey(env),new TextEncoder().encode(message));return id+'.'+exp+'.'+Array.from(new Uint8Array(signature),b=>b.toString(16).padStart(2,'0')).join('')}
async function researchIdentity(token,env){
 if(typeof token!=='string'||token.length>180||!env.OPENAI_API_KEY)return null;
 const [id,expiry,signature]=token.split('.');if(!uuidPattern.test(id)||!/^\d{10}$/.test(expiry)||Number(expiry)<Date.now()/1000||!/^[0-9a-f]{64}$/.test(signature||''))return null;
 const bytes=Uint8Array.from(signature.match(/../g),h=>parseInt(h,16));const valid=await crypto.subtle.verify('HMAC',await researchKey(env),bytes,new TextEncoder().encode('research-v7:'+id+':'+expiry));return valid?id:null;
}
export async function saveResearch(env,{consent,priorToken,rawInput,parsedItems,interpretations,candidates,result,internalQuality,trace}){
 // No account, IP, location, headers or authentication identifiers are read or persisted.
 if(consent!==true)return {saved:false,status:'not_consented'};
 if(!env.RESEARCH)return {saved:false,status:'unavailable'};
 try{
  let initialResultId=null;
  const previousId=await researchIdentity(priorToken,env);
  if(previousId){const previous=await env.RESEARCH.get(RESEARCH_PREFIX+previousId+'/session.json');if(previous){const record=await previous.json();initialResultId=record.initial_result_id||previousId}}
  const id=crypto.randomUUID();const record={data_classification:'pseudonymous research data',anonymous_session_id:id,result_id:id,initial_result_id:initialResultId,created_at:new Date().toISOString(),consent:{granted:true,version:'research-consent-v1'},prompt_version:PROMPT_VERSION,knowledge_base_version:KNOWLEDGE_VERSION,kb_version:KNOWLEDGE_VERSION,model:env.OPENAI_MODEL||'gpt-4.1',raw_input:rawInput,parsed_items:trace?.parsed_items??parsedItems??[],classifications:trace?.classifications??[],retrieved_kb_rows:trace?.retrieved_kb_rows??[],item_hypotheses:trace?.item_hypotheses??interpretations??[],aggregated_hypotheses:trace?.aggregated_hypotheses??[],approved_findings:trace?.approved_findings??[],reanalysis_actions:trace?.reanalysis_actions??[],unused_items:trace?.unused_items??[],writer_output:trace?.writer_output??null,validation_version:trace?.validation_version??null,repair_log:trace?.repair_log??[],final_result:result,feedback:{}};
  await env.RESEARCH.put(RESEARCH_PREFIX+id+'/session.json',JSON.stringify(record),{httpMetadata:{contentType:'application/json'}});
  return {saved:true,status:'saved',anonymous_session_id:id,result_id:id,initial_result_id:initialResultId,token:await researchToken(id,env)};
 }catch{console.warn(JSON.stringify({event:'research_save_failed',code:'storage_unavailable'}));return {saved:false,status:'unavailable'}}
}
export async function researchRequest(request,env){
 const url=new URL(request.url);
 if(request.method!=='POST')return researchJSON({error:'Method not allowed'},405);
 if(request.headers.get('Origin')&&request.headers.get('Origin')!==url.origin)return researchJSON({error:'Недопустимый источник'},403);
 if(!env.RESEARCH)return researchJSON({error:'Сохранение сейчас недоступно'},503);
 try{
  const raw=await request.text();if(raw.length>5000)return researchJSON({error:'Слишком много текста'},413);const body=JSON.parse(raw);
  if(body.consent!==true)return researchJSON({saved:false,status:'not_consented'},403);
  const id=await researchIdentity(body.token,env);if(!id)return researchJSON({error:'Недействительная сессия'},403);
  // The capability authorizes writes only for this consented record, never public reads.
  if(!await env.RESEARCH.get(RESEARCH_PREFIX+id+'/session.json'))return researchJSON({error:'Сессия не найдена'},404);
  if(url.pathname==='/api/research/feedback'){
   const f=body.feedback;const interests=['main_insight','patterns','unexpected_connection','visualization','nothing'];
   if(!f||!(f.rating===null||Number.isInteger(f.rating)&&f.rating>=1&&f.rating<=5)||!(f.most_interesting===null||interests.includes(f.most_interesting))||typeof f.not_about_me!=='string'||f.not_about_me.length>600)return researchJSON({error:'Проверь оценку'},400);
   await env.RESEARCH.put(RESEARCH_PREFIX+id+'/feedback.json',JSON.stringify({anonymous_session_id:id,updated_at:new Date().toISOString(),prompt_version:PROMPT_VERSION,knowledge_base_version:KNOWLEDGE_VERSION,kb_version:KNOWLEDGE_VERSION,feedback:{rating:f.rating,most_interesting:f.most_interesting,not_about_me:f.not_about_me}}),{httpMetadata:{contentType:'application/json'}});
  }else if(url.pathname==='/api/research/event'){
   if(!['enrich_input','repeat_analysis','save_share_card'].includes(body.event))return researchJSON({error:'Недопустимое событие'},400);
   await env.RESEARCH.put(RESEARCH_PREFIX+id+'/events/'+crypto.randomUUID()+'.json',JSON.stringify({anonymous_session_id:id,event:body.event,created_at:new Date().toISOString()}),{httpMetadata:{contentType:'application/json'}});
  }else return researchJSON({error:'Not found'},404);
  return researchJSON({saved:true});
 }catch{return researchJSON({error:'Не удалось сохранить оценку. Результат остаётся доступным.'},503)}
}
