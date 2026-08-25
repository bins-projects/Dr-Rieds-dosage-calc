import fs from 'node:fs';
import assert from 'node:assert/strict';

const source=fs.readFileSync('cloudflare/instructor-worker.js','utf8');
const worker=(await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`)).default;

class MemoryKV {
  constructor(){this.values=new Map()}
  async get(key){return this.values.get(key)??null}
  async put(key,value){this.values.set(key,value)}
}

const kv=new MemoryKV(),env={INSTRUCTOR_QUIZZES:kv};
const quiz={id:'test-publication',title:'Test Publication',questions:[{prompt:'Test?',answer:1,unit:'mL'}],questionTypes:['basic-dose']};
const publishRequest=new Request('https://dev.example/instructor-api/instructor-quizzes',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(quiz)});
const publishResponse=await worker.fetch(publishRequest,env);
assert.equal(publishResponse.status,201);
assert.deepEqual(await publishResponse.json(),{ok:true,id:'test-publication'});

const catalogResponse=await worker.fetch(new Request('https://public.example/api/instructor-quizzes'),env);
assert.equal(catalogResponse.status,200);
const catalog=await catalogResponse.json();
assert.equal(catalog.quizzes.length,1);
assert.equal(catalog.quizzes[0].id,'test-publication');

const quizResponse=await worker.fetch(new Request('https://public.example/api/instructor-quizzes/test-publication'),env);
assert.equal(quizResponse.status,200);
const published=await quizResponse.json();
assert.equal(published.status,'published');
assert.equal(published.publishedBy,'dev-instructor');
assert.equal(published.questionCount,1);

const invalidResponse=await worker.fetch(new Request('https://dev.example/instructor-api/instructor-quizzes',{method:'POST',headers:{'content-type':'application/json'},body:'{}'}),env);
assert.equal(invalidResponse.status,400);
assert.equal(catalog.quizzes.length,1);

console.log('PASS: dev publish writes a frozen quiz that the public read API can list and load.');
