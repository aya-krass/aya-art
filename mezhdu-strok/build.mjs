import {readFile,mkdir,writeFile} from 'node:fs/promises';
const prompts=await readFile('server/prompts.mjs','utf8');
const worker=(await readFile('server/worker.mjs','utf8')).replace("import {analysisPrompt,criticPrompt,schema} from './prompts.mjs';",prompts.replaceAll('export const ','const '));
const html=await readFile('dist/index.html','utf8'),app=await readFile('dist/app.js','utf8');
await mkdir('dist/server',{recursive:true});
await writeFile('dist/server/index.js',`const HTML=${JSON.stringify(html)};\nconst APP=${JSON.stringify(app)};\n${worker}`);
console.log('Worker built with HTML, app and Analyst → Critic prompts.');
