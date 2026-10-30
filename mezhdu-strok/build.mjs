import {readFile,mkdir,writeFile,readdir} from 'node:fs/promises';
const dataFiles={reportKB:'knowledge/preference-kb.report-derived.v1.json',reportTaxonomy:'knowledge/function-taxonomy.v1.json',reportTraps:'knowledge/interpretation-traps.v1.json',reportDistinctions:'knowledge/distinctions.v1.json'};
const moduleFiles=['parser','classifier','kb-retriever','hypothesis-engine','guardrails','critic','writer','reanalysis','bundle-schemas','analysis-pipeline','research','worker'];
let code='';for(const [name,path] of Object.entries(dataFiles))code+='const '+name+'='+await readFile(path,'utf8')+';\n';
for(const file of moduleFiles)code+=(await readFile('server/'+file+'.mjs','utf8')).replace(/^import .*;$/gm,'').replace(/^export \* from .*;$/gm,'')+'\n';
const html=await readFile('dist/index.html','utf8'),app=await readFile('dist/app.js','utf8');
const assets={};for(const f of await readdir('dist/assets').catch(()=>[])){if(!f.endsWith('.webp'))continue;assets['/assets/'+f]={type:'image/webp',data:(await readFile('dist/assets/'+f)).toString('base64')}}
await mkdir('dist/server',{recursive:true});
await writeFile('dist/server/index.js',`const ASSETS=${JSON.stringify(assets)};\nconst HTML=${JSON.stringify(html)};\nconst APP=${JSON.stringify(app)};\n${code}`);
console.log('Built intelligence-v1 with report-derived KB, distinct findings and signed reanalysis state.');
