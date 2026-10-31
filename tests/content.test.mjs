import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const content = fs.readFileSync(new URL('../dist/content.js', import.meta.url),'utf8');
const planner = fs.readFileSync(new URL('../dist/planner.js', import.meta.url),'utf8');
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
  vm.createContext(context);vm.runInContext(content,context);vm.runInContext(planner,context);vm.runInContext(app,context);
  return {model:context.window.STUDIO_PLANNER,data:context.window.STUDIO,element,stored:()=>JSON.parse(stored),advance(ms){now+=ms;intervals.forEach(fn=>fn());},click(id,dataset={}){const e=element(id);e.dataset=dataset;handlers.get('click')({target:e});},input(id,value){const e=element(id);e.value=value;e.fire('input');handlers.get('input')?.({target:e});},submit(value){element('planner-entry').value=value;handlers.get('submit')({target:element('planner-entry-form'),preventDefault(){}});},change(id,value){const e=element(id);e.value=value;handlers.get('change')?.({target:e});}};
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

// All suggested note entries and expression starters obey the same four-word rule.
const P=site.model;
for(const t of D.themes)for(const part of D.parts){
  for(const group of P.sections(part.id,t,0))for(const phrase of group.expressions)assert.ok(P.validate(phrase).ok,phrase);
  assert.ok(P.validate(t.plannerStarter[part.id]).ok);
  for(const word of t.words[part.id])assert.ok(P.validate(word[0]).ok,word[0]);
  for(const phrase of D.phrases[part.id])assert.ok(P.validate(phrase[1]).ok,phrase[1]);
}
const groups=P.sections('p1',D.themes[0]);
const sample=P.normalize(null,groups);
assert.equal(P.chooseMode(sample,'spidergram'),false,'Cannot skip adding target words');
assert.ok(P.add(sample,'opinion','In my view,…','expression').ok);
assert.equal(P.chooseMode(sample,'list'),false,'An expression alone is not a target keyword');
assert.ok(P.add(sample,'opinion','quiet local neighbourhood').ok);
assert.equal(P.add(sample,'opinion','QUIET local neighbourhood').ok,false,'Duplicate entries are ignored');
assert.equal(P.add(sample,'reason','this entry has five words').ok,false);
assert.equal(P.add(sample,'reason','  one  two\nthree\tfour  ').ok,true);
assert.ok(P.chooseMode(sample,'spidergram'));assert.ok(P.ready(sample));
P.remove(sample,'opinion',1);P.remove(sample,'reason',0);
assert.equal(P.ready(sample),false,'Removing all keywords returns to planning');
const malformedPlan=P.normalize({mode:'html',active:'missing',groups:{opinion:[{text:'<img src=x>',kind:'word'},{text:'one two three four five',kind:'word'}]}},groups);
assert.equal(malformedPlan.mode,null);assert.equal(malformedPlan.active,'opinion');
assert.equal(malformedPlan.groups.opinion.length,1,'Overlong stored entries are rejected');

// The speaking clock is unavailable until words and a layout are chosen.
site.click('timer-start');site.advance(4000);assert.equal(site.element('clock').textContent,'04:00');
site.click('layout',{layout:'list'});assert.equal(site.element('response-stage').hidden,true);
site.submit('This is five words here');
assert.equal(site.stored().tasks['home-p1-0'].planner.groups.opinion.length,0);
assert.match(site.element('toast').textContent,/Four words maximum/);
site.submit('quiet park');site.click('layout',{layout:'spidergram'});
assert.equal(site.element('response-stage').hidden,false);
assert.match(site.element('plan-display').innerHTML,/spidergram/);
site.click('timer-start');site.advance(4300);assert.equal(site.element('clock').textContent,'03:56');
site.click('edit-plan');site.advance(10000);assert.equal(site.element('clock').textContent,'03:56','Editing pauses the response clock');
site.click('section',{planSection:'reason'});site.submit('fresh air');
site.change('planner-target','example');site.click('word',{addWord:'0'});
assert.equal(site.stored().tasks['home-p1-0'].planner.groups.example[0].text,'within walking distance');
site.click('layout',{layout:'list'});assert.match(site.element('plan-display').innerHTML,/listing-plan/);
site.input('next-step','Use clearer examples');
site.input('next-step','This new goal is too long');
assert.equal(site.stored().tasks['home-p1-0'].next,'Use clearer examples');
const check={dataset:{check:'2'},checked:true};site.element('checklist').fire('change',{target:check});
site.click('complete-button');
const restored=boot(JSON.stringify(site.stored()));
assert.equal(restored.stored().tasks['home-p1-0'].planner.mode,'list');
assert.equal(restored.element('response-stage').hidden,false);
assert.equal(restored.stored().tasks['home-p1-0'].checks[2],true);
assert.equal(restored.stored().tasks['home-p1-0'].done,true);

// Words, chosen layout and reflection stay independent for every task and theme.
site.click('next-question');assert.equal(site.element('response-stage').hidden,true);
site.submit('new buildings');site.click('layout',{layout:'list'});
site.click('theme',{theme:'travel'});assert.equal(site.element('response-stage').hidden,true);
site.submit('bus commute');
site.click('theme',{theme:'home'});assert.equal(site.stored().tasks['home-p1-1'].planner.groups.opinion[0].text,'new buildings');
site.click('question',{question:'0'});assert.match(site.element('plan-display').innerHTML,/quiet park/);
site.click('timer-start');site.advance(5000);site.click('next-question');site.advance(20000);
assert.equal(site.element('clock').textContent,'03:55','Question navigation pauses a running clock');
site.click('timer-start');site.advance(235000);assert.equal(site.element('clock').textContent,'00:00');

// Part 2 preparation is independent: it cannot automatically start a response.
site.click('part',{part:'p2'});assert.equal(site.element('clock').textContent,'02:00');
assert.equal(site.element('preparation-tools').hidden,false);
site.click('prep-start');site.advance(61000);assert.equal(site.element('prep-clock').textContent,'00:00');
assert.equal(site.element('clock').textContent,'02:00');assert.equal(site.element('response-stage').hidden,true);
assert.match(site.element('prep-status').textContent,/Preparation finished/);
site.submit('riverside park');site.click('layout',{layout:'spidergram'});site.advance(20000);
assert.equal(site.element('clock').textContent,'02:00','Choosing a map never starts speaking automatically');
assert.equal((site.element('plan-display').innerHTML.match(/data-branch=/g)||[]).length,5);
site.click('timer-start');site.advance(121000);assert.equal(site.element('clock').textContent,'00:00');
assert.match(site.element('timer-message').textContent,/Time is up/);
site.click('timer-reset');assert.equal(site.element('clock').textContent,'02:00');
site.click('part',{part:'p3'});assert.equal(site.element('preparation-tools').hidden,true);
assert.match(site.element('planner-section-tabs').innerHTML,/Balance/);

// Student-entered markup is displayed as text, never inserted as an HTML element.
const safe=boot();safe.submit('<img src=x>');safe.click('layout',{layout:'list'});
assert.match(safe.element('plan-display').innerHTML,/&lt;img/);
assert.doesNotMatch(safe.element('plan-display').innerHTML,/<img/);

// Existing long notes are preserved; migrated chips never exceed four words.
const legacy=boot(JSON.stringify({theme:'home',part:'p1',tasks:{'home-p1-0':{notes:'I used to visit this quiet place every weekend with my friends.'}}}));
const migrated=legacy.stored().tasks['home-p1-0'];
assert.equal(migrated.notes,'I used to visit this quiet place every weekend with my friends.');
assert.ok(migrated.planner.groups.opinion.every(item=>P.validate(item.text).ok));
assert.equal(legacy.element('legacy-notes-message').hidden,false);

// Bad or unavailable storage must never prevent planning from opening.
const unavailable=boot('{}',true);assert.match(unavailable.element('save-status').textContent,/Not saved/);
unavailable.submit('still works');assert.match(unavailable.element('planner-editor').innerHTML,/still works/);
const corrupt=boot('{bad json');assert.equal(corrupt.element('clock').textContent,'04:00');
const malformed=boot(JSON.stringify({theme:'unknown',part:'p9',indices:[],tasks:[]}));
assert.equal(malformed.element('theme-name').textContent,'Home & hometown');
console.log('Passed: 78 tasks, 108 words, four-word limits, both plan layouts, task isolation, saved plans, gated speech clocks, independent preparation and storage recovery.');
