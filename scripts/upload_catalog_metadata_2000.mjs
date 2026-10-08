import fs from "node:fs/promises";
import path from "node:path";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
const root=process.cwd(), stage=path.join(root,"assets","catalog-2000");
function env(text){return Object.fromEntries(text.split(/\r?\n/).map(x=>x.trim()).filter(x=>x&&!x.startsWith('#')&&x.includes('=')).map(x=>{const i=x.indexOf('=');return [x.slice(0,i),x.slice(i+1).trim().replace(/^['"]|['"]$/g,'')] }));}
const e=env(await fs.readFile(path.join(root,'.env.r2'),'utf8'));
const c=new S3Client({region:'auto',endpoint:e.R2_ENDPOINT,forcePathStyle:true,credentials:{accessKeyId:e.R2_ACCESS_KEY_ID,secretAccessKey:e.R2_SECRET_ACCESS_KEY}});
const files=[];
for(const d of ['A','B']) for(let n=1;n<=1000;n++){const code=`HL-${d}${String(n).padStart(6,'0')}`;files.push([path.join(stage,'metadata',`${code}.json`),`hosierylab/${d}/metadata/${code}.json`,'application/json'],[path.join(stage,'prompts','original',`${code}.md`),`hosierylab/${d}/prompts/${code}/original.md`,'text/markdown; charset=utf-8'],[path.join(stage,'prompts','full-body',`${code}.md`),`hosierylab/${d}/prompts/${code}/full-body.md`,'text/markdown; charset=utf-8'],[path.join(stage,'prompts','hosiery',`${code}.md`),`hosierylab/${d}/prompts/${code}/hosiery.md`,'text/markdown; charset=utf-8']);}
let done=0;for(let i=0;i<files.length;i+=24){await Promise.all(files.slice(i,i+24).map(async([f,k,t])=>c.send(new PutObjectCommand({Bucket:e.R2_BUCKET,Key:k,Body:await fs.readFile(f),ContentType:t,CacheControl:'no-cache'}))));done+=Math.min(24,files.length-i);if(done%600===0||done===files.length)console.log(`uploaded ${done}/${files.length}`)}
console.log('metadata and prompts updated');
