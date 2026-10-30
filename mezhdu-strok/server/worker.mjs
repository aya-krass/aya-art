import {BUNDLE_PROMPT_VERSION,BUNDLE_KB_VERSION} from './parser.mjs';
import {runBundleAnalysis} from './analysis-pipeline.mjs';
import {saveResearch,researchRequest} from './research.mjs';
import {bundleSchemas} from './bundle-schemas.mjs';
import {knowledgeSnapshot} from './kb-retriever.mjs';
import {VALIDATION_VERSION} from './critic.mjs';
export * from './parser.mjs';
export * from './classifier.mjs';
export * from './kb-retriever.mjs';
export * from './hypothesis-engine.mjs';
export * from './critic.mjs';
export * from './writer.mjs';
export * from './reanalysis.mjs';
export * from './analysis-pipeline.mjs';
export * from './bundle-schemas.mjs';
export * from './guardrails.mjs';
export * from './research.mjs';
const json=(body,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store'}});
const text=(v,max=2000)=>typeof v==='string'&&v.trim().length>0&&v.length<=max;
export function validateInput(data){if(!data||!text(data.text,20000))throw Error('Напиши, что тебе нравится: до 20 000 символов.');return data.text.trim()}
class AnalysisFault extends Error{constructor(stage,code,httpStatus=0,requestId=null){super(code);this.stage=stage;this.code=code;this.httpStatus=httpStatus;this.upstreamRequestId=requestId}}
const safeCode=s=>typeof s==='string'&&/^[a-zA-Z0-9_.-]{1,120}$/.test(s)?s:null;
export async function completion(env,messages,name,jsonSchema){
 let resp;try{resp=await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',headers:{Authorization:`Bearer ${env.OPENAI_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({model:env.OPENAI_MODEL||'gpt-4.1',messages,response_format:{type:'json_schema',json_schema:{name,strict:true,schema:jsonSchema}},temperature:name==='writer'?.4:0,max_completion_tokens:name==='parser'?6000:12000}),signal:AbortSignal.timeout(80000)})}catch(e){throw new AnalysisFault(name,e?.name==='TimeoutError'?'timeout':'upstream_unreachable')}
 if(!resp.ok){const body=await resp.json().catch(()=>({}));throw new AnalysisFault(name,safeCode(body.error?.code)||safeCode(body.error?.type)||'upstream_http_error',resp.status,safeCode(resp.headers.get('x-request-id')))}
 const body=await resp.json(),c=body.choices?.[0];if(c?.message?.refusal)throw new AnalysisFault(name,'model_refusal');if(c?.finish_reason!=='stop'||!c.message?.content)throw new AnalysisFault(name,c?.finish_reason==='length'?'output_truncated':'empty_response');try{return JSON.parse(c.message.content)}catch{throw new AnalysisFault(name,'invalid_json')}
}
function failureResponse(error){
 const e=error instanceof AnalysisFault?error:new AnalysisFault(safeCode(error?.stage)||'server',safeCode(error?.code)||'internal_error');e.check=safeCode(error?.check);const reference=crypto.randomUUID().slice(0,8);
 console.error(JSON.stringify({event:'analysis_failed',reference,stage:e.stage,code:e.code,http_status:e.httpStatus,upstream_request_id:e.upstreamRequestId,check:e.check}));
 const message=e.httpStatus===401?'Сервис анализа не смог авторизоваться. Нужно проверить серверный API-ключ.':e.httpStatus===403?'Нет доступа к выбранной модели или проекту.':['insufficient_quota','billing_hard_limit_reached'].includes(e.code)?'OpenAI отклонила запрос из-за баланса или лимита расходов проекта.':e.httpStatus===429?'Сервис временно перегружен. Попробуй через минуту.':e.code==='validation_failed'?'Не удалось проверить этот результат. Попробуй ещё раз; менять ответы не обязательно.':'Не удалось завершить анализ. Попробуй ещё раз.';
 return json({error:message+' Текст сохранён. Код обращения: '+reference,reference},e.httpStatus===429?429:502);
}
const bundleVisualPrompt=`Составь только визуальную интерпретацию уже одобренных findings в результате. Никакого нового анализа. central_idea равна headline. 1–5 sections: meaning, caption, evidence только из реальных item_id одобренных patterns, visual_metaphor, image_prompt по-английски. Не создавай зоны ради количества. highlight_connection — одна уже существующая unexpected_connection или null. Каждый image_prompt описывает самостоятельный cropped photographic fragment: architectural editorial collage, monochrome ivory, tactile physical material, grain, restrained carmine/gold, no text, no logos. Не весь постер, не диаграмма, не портрет личности.`;
export default {async fetch(request,env){
 const url=new URL(request.url);
 if(url.pathname.startsWith('/api/research/'))return researchRequest(request,env);
 if(url.pathname==='/api/visuals')return generateVisuals(request,env);
 if(url.pathname==='/api/version'&&request.method==='GET')return json({prompt_version:BUNDLE_PROMPT_VERSION,kb_version:BUNDLE_KB_VERSION,validation_version:VALIDATION_VERSION,knowledge:knowledgeSnapshot(),research_storage:!!env.RESEARCH});
 if(url.pathname!=='/api/analyze'){
  if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405});
  if(['/', '/index.html'].includes(url.pathname))return new Response(request.method==='HEAD'?null:HTML,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-cache'}});
  if(url.pathname.startsWith('/assets/')&&ASSETS[url.pathname]){const a=ASSETS[url.pathname];return new Response(request.method==='HEAD'?null:Uint8Array.from(atob(a.data),c=>c.charCodeAt(0)),{headers:{'Content-Type':a.type,'Cache-Control':'public, max-age=86400'}})}
  if(url.pathname==='/app.js')return new Response(request.method==='HEAD'?null:APP,{headers:{'Content-Type':'text/javascript; charset=utf-8','Cache-Control':'no-cache'}});return new Response('Not found',{status:404});
 }
 if(request.method!=='POST')return json({error:'Используй отправку формы.'},405);
 if(request.headers.get('Origin')&&request.headers.get('Origin')!==url.origin)return json({error:'Недопустимый источник запроса.'},403);
 if(!env.OPENAI_API_KEY)return json({error:'AI-анализ пока не подключён. Текст остаётся в этой вкладке.'},503);
 let input,source;try{if(Number(request.headers.get('Content-Length'))>500000)return json({error:'Слишком много данных.'},413);const raw=await request.text();if(raw.length>200000)return json({error:'Слишком много данных.'},413);input=JSON.parse(raw);source=validateInput(input)}catch{return json({error:'Проверь текст: до 20 000 символов.'},400)}
 try{
  const analyzed=await runBundleAnalysis(source,env,completion,input.previous_analysis);
  if(analyzed.insufficient)return json({error:analyzed.error,code:analyzed.code},422);
  const result=analyzed.result;let brief;try{brief=validateBrief(await completion(env,[{role:'system',content:bundleVisualPrompt},{role:'user',content:JSON.stringify(result)}],'visual_brief',bundleSchemas.visual_brief),result)}catch{brief=fallbackBrief(result)}
  const publicResponse={...result,visual_brief:brief};
  const research=await saveResearch(env,{consent:input.research_consent===true,priorToken:typeof input.prior_research_token==='string'?input.prior_research_token:null,rawInput:source,result:publicResponse,trace:analyzed.trace});
  return json({...publicResponse,visual_token:await signBrief(brief,env.OPENAI_API_KEY),analysis_state:analyzed.analysisState,research});
 }catch(error){return failureResponse(error)}
}};
export function validateBrief(b,r){const ids=new Set(r.items.map(i=>i.id));const allowed=new Set([...r.main_evidence,...r.patterns.flatMap(p=>p.evidence)].map(e=>e.item_id));r.unexpected_connections.forEach(p=>{allowed.add(p.item_1_id);allowed.add(p.item_2_id)});if(!b||b.central_idea!==r.headline||!Array.isArray(b.sections)||b.sections.length<1||b.sections.length>5)throw Error('Bad visual brief');for(const s of b.sections)if(!text(s.meaning,140)||!text(s.caption,600)||!text(s.visual_metaphor,600)||!text(s.image_prompt,2200)||!Array.isArray(s.evidence)||!s.evidence.length||s.evidence.some(id=>!ids.has(id)||!allowed.has(id)))throw Error('Unknown visual evidence');const h=b.highlight_connection;if(h!==null&&(!h||!text(h.meaning,300)||!r.unexpected_connections.some(p=>p.item_1_id===h.item_1_id&&p.item_2_id===h.item_2_id)))throw Error('Unknown visual pair');return b}
export function fallbackBrief(r){
 const sections=r.patterns.map(p=>({meaning:p.title,caption:p.description,evidence:p.evidence.map(e=>e.item_id),visual_metaphor:p.title,image_prompt:'editorial conceptual photography, tactile physical materials, monochrome ivory paper, cropped detail, strong negative space, no text, no logos; visual mechanism: '+p.description}));
 for(const p of r.unexpected_connections.slice(0,5-sections.length))sections.push({meaning:'Неожиданная связь',caption:p.connection,evidence:[p.item_1_id,p.item_2_id],visual_metaphor:p.connection,image_prompt:'editorial cropped detail, monochrome tactile materials, no text; '+p.connection});
 const p=r.unexpected_connections[0];
 return {central_idea:r.headline,sections,highlight_connection:p?{item_1_id:p.item_1_id,item_2_id:p.item_2_id,meaning:p.connection}:null};
}
async function signBrief(brief,secret){const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);const data=await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(JSON.stringify(brief)));return Array.from(new Uint8Array(data),b=>b.toString(16).padStart(2,'0')).join('')}
async function generateVisuals(request,env){if(request.method!=='POST')return json({error:'Method not allowed'},405);const origin=request.headers.get('Origin');if(origin&&origin!==new URL(request.url).origin)return json({error:'Forbidden'},403);if(!env.OPENAI_API_KEY)return json({visuals:[]},503);try{if(Number(request.headers.get('Content-Length'))>50000)return json({visuals:[]},413);const raw=await request.text();if(raw.length>30000)return json({visuals:[]},413);const {brief,token}=JSON.parse(raw);if(!brief?.sections||!Array.isArray(brief.sections)||brief.sections.length<1||brief.sections.length>5||typeof token!=='string'||token!==await signBrief(brief,env.OPENAI_API_KEY))return json({visuals:[]},403);const visuals=await Promise.all(brief.sections.slice(0,5).map(async(s,i)=>{try{const response=await fetch('https://api.openai.com/v1/images/generations',{method:'POST',headers:{Authorization:`Bearer ${env.OPENAI_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({model:env.OPENAI_IMAGE_MODEL||'gpt-image-2',prompt:s.image_prompt+'\nStandalone photographic fragment for architectural editorial collage. Monochrome, ivory, tactile grain, no text, no typography, no infographic, no logos.',size:'1024x1536',quality:'low',output_format:'webp',output_compression:80,n:1}),signal:AbortSignal.timeout(130000)});if(!response.ok)return null;const data=await response.json();const b64=data.data?.[0]?.b64_json;if(typeof b64!=='string'||b64.length>10000000)return null;return {section_index:i,image_url:'data:image/webp;base64,'+b64,alt:s.visual_metaphor}}catch{return null}}));return json({visuals:visuals.filter(Boolean)})}catch{return json({visuals:[]},502)}}
