'use strict';
// Small, reusable planning rules. Every chip is limited to four words.
window.STUDIO_PLANNER = (() => {
  const MAX_WORDS = 4;
  const MAX_ITEMS = 12;
  const words = text => String(text).trim().split(/\s+/u).filter(Boolean);
  function validate(value) {
    const text = String(value || '').trim().replace(/\s+/gu,' ');
    const count = words(text).length;
    if (!count) return {ok:false,text,count,error:'Add a word or short expression.'};
    if (count > MAX_WORDS) return {ok:false,text,count,error:`Four words maximum. You have ${count}; shorten your entry.`};
    if (text.length > 100) return {ok:false,text,count,error:'Keep this entry under 100 characters.'};
    return {ok:true,text,count,error:''};
  }
  function sections(partId, theme, index=0) {
    if (partId === 'p1') return [
      {id:'opinion',label:'Answer / opinion',hint:'Your direct answer or preference.',expressions:['I’d say…','Personally, I…','I usually…']},
      {id:'reason',label:'Reason',hint:'Why is this true for you?',expressions:['Mainly because…','One reason is…','It helps me…']},
      {id:'example',label:'Example / detail',hint:'A real moment, name or detail.',expressions:['For example,…','For instance,…','Last time,…']}
    ];
    if (partId === 'p2') return [
      {id:'opening',label:'Opening / choice',hint:'Name your person, place, experience or thing.',expressions:['I’d choose…','I remember…','Let me describe…']},
      ...theme.p2.bullets.map((bullet,i) => {
        const expressions = /where/.test(bullet) ? ['It’s located in…','We went to…','Not far from…'] : /when/.test(bullet) ? ['This happened when…','At the time,…','A while ago,…'] : /who/.test(bullet) ? ['I was with…','We met through…','Someone I know…'] : /how/.test(bullet) ? ['First, I…','Step by step,…','Eventually, I…'] : ['What stood out…','I noticed…','One detail was…'];
        return {id:`cue${i+1}`,label:bullet[0].toUpperCase()+bullet.slice(1),hint:'Use a few keywords for this cue point.',expressions};
      }),
      {id:'meaning',label:'Why / significance',hint:theme.p2.end.replace(/^and /,''),expressions:['It mattered because…','I felt…','Looking back,…']}
    ];
    const question = theme.p3[index]?.[1] || '';
    const prediction = /future|might|will .*important/i.test(question);
    const comparison = /differ|compared|past|today.*past/i.test(question);
    return [
      {id:'opinion',label:prediction?'Prediction':comparison?'Main comparison':'Opinion / main idea',hint:prediction?'What could happen?':comparison?'What is the main difference?':'State your position or explanation.',expressions:prediction?['It might…','I’d expect…','Perhaps we’ll see…']:comparison?['Compared with…','These days,…','The main difference…']:['In my view,…','I’d argue…','On the whole,…']},
      {id:'reason',label:'Reason / explanation',hint:'Explain a cause or support your main idea.',expressions:['One reason is…','This could mean…','As a result,…']},
      {id:'example',label:'Example',hint:'Use a wider example, not only your own experience.',expressions:['For instance,…','A useful example…','In many cities,…']},
      {id:'balance',label:prediction?'Conditions / balance':'Balance / other view',hint:'Consider another group, condition or limitation.',expressions:['That said,…','On the other hand,…','It depends on…']},
      {id:'conclusion',label:'Conclusion',hint:'Bring your main idea together briefly.',expressions:['On balance,…','Overall, I think…','So, I’d say…']}
    ];
  }
  function normalize(raw, groups, legacyNotes='') {
    const input = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
    const mode = ['spidergram','list'].includes(input.mode) ? input.mode : null;
    const result = {mode,editing:input.editing === true || !mode,active:groups.some(g=>g.id===input.active)?input.active:groups[0].id,groups:{},vocabulary:{}};
    for (const group of groups) {
      if(typeof input.vocabulary?.[group.id]==='string' && validate(input.vocabulary[group.id]).ok)result.vocabulary[group.id]=input.vocabulary[group.id];
      const entries = Array.isArray(input.groups?.[group.id]) ? input.groups[group.id] : [];
      const seen = new Set();
      result.groups[group.id] = entries.flatMap(entry=>{
        if (!entry || typeof entry.text !== 'string') return [];
        const v=validate(entry.text),key=v.text.toLocaleLowerCase();
        if(!v.ok||seen.has(key))return [];
        seen.add(key);return [{text:v.text,kind:entry.kind==='expression'?'expression':'word'}];
      }).slice(0,MAX_ITEMS);
    }
    // Retain the original notes in the task export; import short chunks for the new plan.
    if (!raw && legacyNotes.trim()) {
      const tokens=words(legacyNotes);
      for(let i=0;i<tokens.length&&result.groups[groups[0].id].length<MAX_ITEMS;i+=MAX_WORDS){
        const v=validate(tokens.slice(i,i+MAX_WORDS).join(' '));
        if(v.ok)result.groups[groups[0].id].push({text:v.text,kind:'word'});
      }
    }
    return result;
  }
  const countWords = plan => Object.values(plan.groups).flat().filter(item=>item.kind==='word').length;
  const ready = plan => !!plan.mode && !plan.editing && countWords(plan)>0;
  function add(plan,section,value,kind='word') {
    const v=validate(value);
    if(!v.ok)return v;
    const entries=plan.groups[section];
    if(!Array.isArray(entries))return {...v,ok:false,error:'Choose a plan section first.'};
    if(entries.some(e=>e.text.toLocaleLowerCase()===v.text.toLocaleLowerCase()))return {...v,ok:false,error:'Already in this section.'};
    if(entries.length>=MAX_ITEMS)return {...v,ok:false,error:'This section has 12 entries. Remove one before adding another.'};
    entries.push({text:v.text,kind:kind==='expression'?'expression':'word'});
    return v;
  }
  function remove(plan,section,index) {
    if(!Array.isArray(plan.groups[section])||!Number.isInteger(index)||index<0||index>=plan.groups[section].length)return;
    plan.groups[section].splice(index,1);
    if(!countWords(plan))plan.editing=true;
  }
  function chooseMode(plan,mode) {
    if(!['spidergram','list'].includes(mode)||!countWords(plan))return false;
    plan.mode=mode;plan.editing=false;return true;
  }
  return {MAX_WORDS,MAX_ITEMS,words,validate,sections,normalize,countWords,ready,add,remove,chooseMode};
})();
