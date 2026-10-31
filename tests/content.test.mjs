import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const content = fs.readFileSync(new URL('../dist/content.js', import.meta.url),'utf8');
const language = fs.readFileSync(new URL('../dist/language.js', import.meta.url),'utf8');
const planner = fs.readFileSync(new URL('../dist/planner.js', import.meta.url),'utf8');
const app = fs.readFileSync(new URL('../dist/app.js', import.meta.url),'utf8');
function boot(initial='{}', storageFails=false, reducedMotion=false, randomValue=0) {
  let now=100000, stored=initial;
  const elements=new Map(), handlers=new Map(), intervals=[];
  function element(id) {
    if(elements.has(id)) return elements.get(id);
    const events=new Map(), classes=new Set();
    const e={ id,innerHTML:'',textContent:'',value:'',style:{},dataset:{},maxLength:15000,attributes:{},
      classList:{add:c=>classes.add(c),remove:c=>classes.delete(c),toggle:(c,b)=>b?classes.add(c):classes.delete(c),contains:c=>classes.has(c)},
      setAttribute(k,v){this.attributes[k]=v;},addEventListener(k,v){events.set(k,v);},
      fire(k,event={}){events.get(k)?.(event);},focus(){},scrollIntoView(){},close(){this.open=false;},showModal(){this.open=true;this.shown=(this.shown||0)+1;},
      closest(){return this;}
    };elements.set(id,e);return e;
  }
  const document={getElementById:element,querySelector:element,querySelectorAll:()=>[],addEventListener:(k,v)=>handlers.set(k,v)};
  const testMath=Object.create(Math);testMath.random=()=>randomValue;
  const context={Math:testMath,window:{},document,matchMedia:()=>({matches:reducedMotion,addEventListener(){}}),localStorage:{getItem:()=>{if(storageFails)throw Error('Unavailable');return stored;},setItem:(_,v)=>{if(storageFails)throw Error('Quota exceeded');stored=v;}},Date:class extends Date{static now(){return now;}},setInterval:fn=>intervals.push(fn),setTimeout:()=>0,clearTimeout:()=>{},Blob,URL};
  vm.createContext(context);vm.runInContext(content,context);vm.runInContext(language,context);vm.runInContext(planner,context);vm.runInContext(app,context);
  return {language:context.window.STUDIO_LANGUAGE,model:context.window.STUDIO_PLANNER,data:context.window.STUDIO,element,stored:()=>JSON.parse(stored),advance(ms){now+=ms;intervals.forEach(fn=>fn());},click(id,dataset={}){const e=element(id);e.dataset=dataset;handlers.get('click')({target:e});},input(id,value){const e=element(id);e.value=value;e.fire('input');handlers.get('input')?.({target:e});},submit(value){element('planner-entry').value=value;handlers.get('submit')({target:element('planner-entry-form'),preventDefault(){}});},change(id,value){const e=element(id);e.value=value;handlers.get('change')?.({target:e});}};
}

// A fresh reminder appears whenever a Part 1/3 task opens, including repeat visits.
const reminder=boot();
assert.equal(reminder.element('practice-notice').open,true);
assert.match(reminder.element('practice-notice-part').textContent,/PART 1/);
reminder.click('practice-notice-continue');assert.equal(reminder.element('practice-notice').open,false);
reminder.click('begin-planning');assert.equal(reminder.element('practice-notice').open,false,'Stage changes do not repeat the reminder');
reminder.submit('local park');assert.equal(reminder.element('practice-notice').open,false,'Editing does not repeat the reminder');
reminder.click('next-question');assert.equal(reminder.element('practice-notice').open,true,'Each new question gets a reminder');
reminder.click('practice-notice-continue');reminder.click('part',{part:'p2'});
assert.equal(reminder.element('practice-notice').open,false,'No Part 1/3 reminder in Part 2');
reminder.click('part',{part:'p3'});assert.equal(reminder.element('practice-notice').open,true);
assert.match(reminder.element('practice-notice-part').textContent,/PART 3/);
reminder.click('practice-notice-continue');reminder.click('theme',{theme:'travel'});
assert.equal(reminder.element('practice-notice').open,true,'A new theme starts a new task');
reminder.click('practice-notice-continue');reminder.click('part',{part:'p1'});
assert.equal(reminder.element('practice-notice').open,true,'Returning to Part 1 shows it again');
const reminderReload=boot(JSON.stringify(reminder.stored()));assert.equal(reminderReload.element('practice-notice').open,true);
const part2Start=boot(JSON.stringify({part:'p2'}));assert.notEqual(part2Start.element('practice-notice').open,true);

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

// Each question has contextual vocabulary choices; cue points keep exact relevance.
let bankSections=0;
for(const t of D.themes)for(const part of D.parts){
  const count=part.id==='p2'?1:t[part.id].length;
  for(let q=0;q<count;q++){
    const groups=P.sections(part.id,t,q),assigned=P.normalize(null,groups);
    site.language.assign(assigned,part.id,t,q,groups,()=>.999);
    for(const group of groups){
      const bank=site.language.bank(part.id,t,q,group);
      assert.ok(bank.length>=2,`${t.id}/${part.id}/${q}/${group.id}`);
      assert.equal(new Set(bank.map(item=>item.text)).size,bank.length);
      assert.ok(bank.some(item=>item.text===assigned.vocabulary[group.id]));
      for(const item of bank){
        assert.equal(item.kind,'word');assert.ok(P.validate(item.text).ok,item.text);
        assert.ok(['B2','C1'].includes(item.level));assert.ok(item.meaning.length>10);
      }
      assert.equal(group.expressions.length,3);
      for(const text of group.expressions)assert.ok(P.validate(text).ok,text);
      bankSections++;
    }
    assert.equal(new Set(Object.values(assigned.vocabulary)).size,groups.length,'Avoid duplicate vocabulary within a task');
  }
}
assert.equal(bankSections,318);
const choices=boot();choices.click('begin-planning');
assert.match(choices.element('language-suggestion').innerHTML,/peaceful surroundings/);
assert.equal((choices.element('language-suggestion').innerHTML.match(/class="suggested-text"/g)||[]).length,1);
assert.equal((choices.element('planner-editor').innerHTML.match(/data-plan-expression=/g)||[]).length,3);
assert.doesNotMatch(choices.element('planner-editor').innerHTML,/\b(?:B2|C1)\b|another-suggestion|Try another/);
assert.doesNotMatch(choices.element('language-suggestion').innerHTML,/\b(?:B2|C1)\b|another-suggestion|Try another/);
assert.doesNotMatch(app,/another-suggestion|>Try another <|\b(?:B2|C1)\b/);
choices.input('planner-entry','my draft');choices.click('chunk',{planExpression:'0'});
assert.equal(choices.element('planner-entry').value,'my draft','Adding a chunk preserves the draft');
assert.equal(choices.stored().tasks['home-p1-0'].planner.groups.opinion[0].text,'I’d say…');
assert.equal(choices.stored().tasks['home-p1-0'].planner.groups.opinion[0].kind,'expression');
choices.click('chunk',{planExpression:'0'});
assert.equal(choices.element('planner-entry').value,'my draft','Removing a chunk preserves the draft');
assert.equal(choices.stored().tasks['home-p1-0'].planner.groups.opinion.length,0);
choices.click('pick-suggestion');assert.equal(choices.element('planner-entry').value,'my draft','Picking vocabulary preserves the draft');
choices.click('section',{planSection:'reason'});assert.match(choices.element('language-suggestion').innerHTML,/a sense of belonging/);
choices.click('pick-suggestion');
assert.equal(choices.stored().tasks['home-p1-0'].planner.groups.reason[0].text,'a sense of belonging');
choices.click('section',{planSection:'opinion'});assert.match(choices.element('language-suggestion').innerHTML,/peaceful surroundings/);
const choicesRestored=boot(JSON.stringify(choices.stored()),false,false,.999);
assert.match(choicesRestored.element('language-suggestion').innerHTML,/peaceful surroundings/,'Reloading keeps the assignment');
const randomChoices=boot('{}',false,false,.999);randomChoices.click('begin-planning');
assert.notEqual(randomChoices.stored().tasks['home-p1-0'].planner.vocabulary.opinion,choices.stored().tasks['home-p1-0'].planner.vocabulary.opinion,'Randomness changes fresh assignments');
choices.click('next-question');choices.click('begin-planning');assert.match(choices.element('language-suggestion').innerHTML,/urban development/);
assert.equal(choices.stored().tasks['home-p1-0'].planner.vocabulary.opinion,'peaceful surroundings','Assignments stay independent per question');
const oldChoice=boot(JSON.stringify({tasks:{'home-p1-0':{planner:{suggestions:{opinion:2},groups:{opinion:[{text:'quiet park',kind:'word'}]}}}}}));
assert.equal(oldChoice.stored().tasks['home-p1-0'].planner.groups.opinion[0].text,'quiet park','Older selected words survive migration');

// The shared question block is outside every stage panel and is never hidden.
const html=fs.readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
assert.ok(html.indexOf('id="task-anchor"')<html.indexOf('data-stage-panel="question"'));
assert.doesNotMatch(html,/<(?:section|div)[^>]*id="task-anchor"[^>]*hidden/);
assert.doesNotMatch(html,/Remind me of the question/);

// Exactly one stage is visible, and later work cannot be skipped into.
const panelIds=['question-stage','planner-builder','layout-stage','response-stage','review-stage'];
function stage(app,expected){
  assert.deepEqual(panelIds.filter(id=>!app.element(id).hidden),[expected]);
  assert.notEqual(app.element('task-anchor').hidden,true);
  assert.match(app.element('task-content').innerHTML,/<h3 id="task-title"/);
}
function plan(app,word,layout='list'){
  app.click('begin-planning');app.submit(word);app.click('choose-style');app.click('layout',{layout});
}
stage(site,'question-stage');
site.click('timer-start');site.advance(4000);assert.equal(site.element('clock').textContent,'04:00');
site.click('layout',{layout:'list'});site.click('finish-response');site.click('complete-button');
stage(site,'question-stage');assert.equal(site.stored().tasks['home-p1-0'].done,false);
site.click('begin-planning');stage(site,'planner-builder');
site.click('choose-style');stage(site,'planner-builder');
site.submit('This is five words here');
assert.equal(site.stored().tasks['home-p1-0'].planner.groups.opinion.length,0);
assert.match(site.element('toast').textContent,/Four words maximum/);
site.click('chunk',{planExpression:'0'});site.click('choose-style');stage(site,'planner-builder');
site.submit('quiet park');site.click('choose-style');stage(site,'layout-stage');
site.click('layout',{layout:'spidergram'});stage(site,'response-stage');
assert.match(site.element('plan-display').innerHTML,/spidergram/);
site.click('finish-response');stage(site,'response-stage');
site.click('timer-start');site.advance(4300);assert.equal(site.element('clock').textContent,'03:56');
site.click('edit-plan');stage(site,'planner-builder');
site.advance(10000);assert.equal(site.element('clock').textContent,'03:56','Editing pauses the clock');
site.click('section',{planSection:'reason'});site.submit('fresh air');
site.click('section',{planSection:'example'});site.click('pick-suggestion');
assert.equal(site.stored().tasks['home-p1-0'].planner.groups.example[0].text,'local amenities');
site.click('choose-style');site.click('layout',{layout:'list'});
assert.match(site.element('plan-display').innerHTML,/listing-plan/);
site.click('timer-start');site.advance(1000);site.click('finish-response');stage(site,'review-stage');
site.advance(10000);assert.equal(site.element('clock').textContent,'03:55','Finishing stops the clock');
site.input('next-step','Use clearer examples');
site.input('next-step','This new goal is too long');
assert.equal(site.stored().tasks['home-p1-0'].next,'Use clearer examples');
const check={dataset:{check:'2'},checked:true};site.element('checklist').fire('change',{target:check});
site.click('complete-button');stage(site,'review-stage');
const restored=boot(JSON.stringify(site.stored()));stage(restored,'review-stage');
assert.equal(restored.stored().tasks['home-p1-0'].planner.mode,'list');
assert.equal(restored.stored().tasks['home-p1-0'].checks[2],true);
assert.equal(restored.stored().tasks['home-p1-0'].done,true);
assert.equal(restored.element('next-task').hidden,false);
site.click('motion-toggle');assert.equal(site.stored().motion,false);
assert.ok(site.element('journey-card').classList.contains('motion-off'));
const reduced=boot('{}',false,true);assert.ok(reduced.element('journey-card').classList.contains('motion-off'));
assert.equal(reduced.element('motion-toggle').textContent,'✦ Reduced motion');
const calm=boot(JSON.stringify(site.stored()));assert.ok(calm.element('journey-card').classList.contains('motion-off'));

// New questions start at the question, with separate words and a fresh clock.
site.click('next-task');stage(site,'question-stage');assert.equal(site.element('clock').textContent,'04:00');
plan(site,'new buildings');
site.click('theme',{theme:'travel'});stage(site,'question-stage');
site.click('begin-planning');site.submit('bus commute');
site.click('theme',{theme:'home'});stage(site,'response-stage');
assert.equal(site.stored().tasks['home-p1-1'].planner.groups.opinion[0].text,'new buildings');
site.click('question',{question:'0'});stage(site,'review-stage');
site.click('retry-response');stage(site,'response-stage');
assert.match(site.element('plan-display').innerHTML,/quiet park/);
site.click('timer-start');site.advance(5000);site.click('next-question');site.advance(20000);
assert.equal(site.element('clock').textContent,'04:00','Question navigation stops and resets the clock');
site.click('timer-start');site.advance(241000);assert.equal(site.element('clock').textContent,'00:00');
stage(site,'review-stage');assert.match(site.element('review-success').textContent,/Time’s up/);

// Part 2 preparation only belongs to planning; it never starts the response.
site.click('part',{part:'p2'});stage(site,'question-stage');
assert.equal(site.element('clock').textContent,'02:00');
site.click('prep-start');site.advance(10000);assert.equal(site.element('prep-clock').textContent,'01:00');
site.click('begin-planning');site.click('prep-start');site.advance(61000);
assert.equal(site.element('prep-clock').textContent,'00:00');stage(site,'planner-builder');
assert.equal(site.element('clock').textContent,'02:00');
assert.match(site.element('prep-status').textContent,/Preparation finished/);
site.submit('riverside park');site.click('choose-style');stage(site,'layout-stage');
site.click('layout',{layout:'spidergram'});site.advance(20000);
assert.equal(site.element('clock').textContent,'02:00','A layout never starts speaking automatically');
assert.equal((site.element('plan-display').innerHTML.match(/data-branch=/g)||[]).length,5);
const speakingReload=boot(JSON.stringify(site.stored()));stage(speakingReload,'response-stage');
assert.equal(speakingReload.element('finish-response').disabled,true,'After reload, start the new clock before finishing');
site.click('timer-start');site.advance(121000);stage(site,'review-stage');
assert.equal(site.element('clock').textContent,'00:00');
site.click('retry-response');stage(site,'response-stage');assert.equal(site.element('clock').textContent,'02:00');
site.click('part',{part:'p3'});stage(site,'question-stage');
assert.equal(site.element('preparation-tools').hidden,true);
assert.match(site.element('planner-section-tabs').innerHTML,/Balance/);

// Returning to question and removing the last keyword keep the forward gate closed.
const back=boot();back.click('begin-planning');back.submit('one keyword');back.click('back-question');
stage(back,'question-stage');back.click('begin-planning');back.click('remove',{removeEntry:'0'});
back.click('choose-style');stage(back,'planner-builder');

// Student-entered markup is displayed as text, never inserted as an HTML element.
const safe=boot();plan(safe,'<img src=x>');
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
unavailable.click('begin-planning');unavailable.submit('still works');assert.match(unavailable.element('planner-editor').innerHTML,/still works/);
const corrupt=boot('{bad json');assert.equal(corrupt.element('clock').textContent,'04:00');
const malformed=boot(JSON.stringify({theme:'unknown',part:'p9',indices:[],tasks:[]}));
assert.equal(malformed.element('theme-name').textContent,'Home & hometown');
console.log('Passed: repeated Part 1/3 reminders, 318 vocabulary pools, restored chunks, one saved random word, no level labels or shuffle button, persistent question, five exclusive stages, guarded progression, manual and automatic review, motion preference, 78 tasks, 108 words, four-word limits, both plan layouts, task isolation, saved plans, gated speech clocks, independent preparation and storage recovery.');
