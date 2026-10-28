import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const content = fs.readFileSync(new URL('../dist/content.js', import.meta.url),'utf8');
const app = fs.readFileSync(new URL('../dist/app.js', import.meta.url),'utf8');
function boot(initial='{}', storageFails=false) {
  let now=100000, stored=initial;
  const elements=new Map(), handlers=new Map(), intervals=[];
  function element(id) {
    if(elements.has(id)) return elements.get(id);
    const events=new Map(), classes=new Set();
    const e={ id,innerHTML:'',textContent:'',value:'',style:{},dataset:{},maxLength:15000,attributes:{},
      classList:{add:c=>classes.add(c),remove:c=>classes.delete(c),toggle:(c,b)=>b?classes.add(c):classes.delete(c),contains:c=>classes.has(c)},
      setAttribute(k,v){this.attributes[k]=v;},addEventListener(k,v){events.set(k,v);},
      fire(k,event={}){events.get(k)?.(event);},focus(){},scrollIntoView(){},close(){},showModal(){},
      closest(){return this;}
    };elements.set(id,e);return e;
  }
  const document={getElementById:element,querySelector:element,querySelectorAll:()=>[],addEventListener:(k,v)=>handlers.set(k,v)};
  const context={window:{},document,localStorage:{getItem:()=>{if(storageFails)throw Error('Unavailable');return stored;},setItem:(_,v)=>{if(storageFails)throw Error('Quota exceeded');stored=v;}},Date:class extends Date{static now(){return now;}},setInterval:fn=>intervals.push(fn),setTimeout:()=>0,clearTimeout:()=>{},Blob,URL};
  vm.createContext(context);vm.runInContext(content,context);vm.runInContext(app,context);
  return {data:context.window.STUDIO,element,stored:()=>JSON.parse(stored),advance(ms){now+=ms;intervals.forEach(fn=>fn());},click(id,dataset={}){const e=element(id);e.dataset=dataset;handlers.get('click')({target:e});},input(id,value){const e=element(id);e.value=value;e.fire('input');}};
}

const site=boot();
const D=site.data;
assert.equal(D.themes.length,6);
assert.equal(new Set(D.themes.map(t=>t.id)).size,6);
let tasks=0,words=0;
for(const t of D.themes){
  assert.ok(t.name && t.context && t.subtitle);
  for(const p of ['p1','p2','p3']){
    assert.equal(t.words[p].length,6,`${t.id}/${p} word bank`);
    for(const word of t.words[p]){assert.equal(word.length,3);word.forEach(x=>assert.ok(x.trim().length>3));words++;}
    assert.ok(t.starter[p]);
    if(p==='p2'){assert.equal(t.p2.bullets.length,3);assert.equal(t.p2.followups.length,2);assert.ok(t.p2.title&&t.p2.end);tasks++;}
    else{assert.equal(t[p].length,6);for(const q of t[p]){assert.equal(q.length,3);assert.ok(q[1].endsWith('?'));assert.ok(q[2]);tasks++;}}
  }
}
assert.equal(tasks,78);assert.equal(words,108);
for(const p of D.parts){assert.equal(D.checks[p.id].length,5);assert.equal(D.phrases[p.id].length,5);}

// Every question, part and theme has independent persisted notes and reflection.
site.input('student-notes','My home example');
site.input('next-step','Use a clearer past tense');
const check={dataset:{check:'2'},checked:true};
site.element('checklist').fire('change',{target:check});
site.click('complete-button');
site.click('next-question');
assert.equal(site.element('student-notes').value,'');
site.input('student-notes','My second answer');
site.click('theme',{theme:'travel'});
assert.equal(site.element('student-notes').value,'');
site.input('student-notes','A travel example');
site.click('theme',{theme:'home'});
assert.equal(site.element('student-notes').value,'My second answer');
site.click('question',{question:'0'});
assert.equal(site.element('student-notes').value,'My home example');
assert.equal(site.element('next-step').value,'Use a clearer past tense');
assert.equal(site.stored().tasks['home-p1-0'].checks[2],true);
assert.equal(site.stored().tasks['home-p1-0'].done,true);
const restored=boot(JSON.stringify(site.stored()));
assert.equal(restored.element('student-notes').value,'My home example');

// A whole-set clock continues between questions and accounts for background time.
site.click('timer-start');site.advance(4300);
assert.equal(site.element('clock').textContent,'03:56');
site.click('next-question');
assert.equal(site.element('clock').textContent,'03:56');
site.advance(12000);assert.equal(site.element('clock').textContent,'03:44');
site.click('timer-start');site.advance(30000);
assert.equal(site.element('clock').textContent,'03:44','Paused time stays unchanged');
site.click('timer-start');site.advance(224000);
assert.equal(site.element('clock').textContent,'00:00');
assert.match(site.element('timer-message').textContent,/Time is up/);

// Preparation never automatically starts the long-turn clock.
site.click('part',{part:'p2'});assert.equal(site.element('clock').textContent,'01:00');
site.click('timer-start');site.advance(61000);
assert.equal(site.element('clock').textContent,'00:00');
assert.match(site.element('timer-message').textContent,/Select.*Speak/);
site.advance(120000);assert.equal(site.element('clock').textContent,'00:00');
site.click('preset',{preset:'1'});assert.equal(site.element('clock').textContent,'02:00');
site.advance(20000);assert.equal(site.element('clock').textContent,'02:00','Stage selection does not start a clock');
site.click('timer-start');site.advance(121000);assert.equal(site.element('clock').textContent,'00:00');
site.click('timer-reset');assert.equal(site.element('clock').textContent,'02:00');
site.click('part',{part:'p3'});assert.equal(site.element('clock').textContent,'04:00');
site.click('timer-start');site.advance(5000);site.click('theme',{theme:'food'});assert.equal(site.element('clock').textContent,'04:00');
site.advance(5000);assert.equal(site.element('clock').textContent,'04:00');

// Bad or unavailable storage must never prevent practice from opening.
const unavailable=boot('{}',true);
assert.match(unavailable.element('save-status').textContent,/Not saved/);
unavailable.input('student-notes','Still able to practise');
assert.equal(unavailable.element('student-notes').value,'Still able to practise');
const corrupt=boot('{bad json');assert.equal(corrupt.element('clock').textContent,'04:00');
const malformed=boot(JSON.stringify({theme:'unknown',part:'p9',indices:[],tasks:[]}));
assert.equal(malformed.element('theme-name').textContent,'Home & hometown');
assert.equal(malformed.element('clock').textContent,'04:00');
console.log('Passed: 78 tasks, 108 vocabulary entries, persistence/isolation, timers, manual transitions, and storage recovery.');
