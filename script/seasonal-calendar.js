/* Annual dates use the visitor's local calendar. End dates include the full day. */
((root,factory)=>{
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.PortfolioSeasonalCalendar=api;
})(typeof globalThis!=='undefined'?globalThis:this,()=>{
 const storageKey='portfolio-seasonal-choice-v1';
 const choices={halloween:['amber','silver'],christmas:['snow','fireside']};
 function eventForDate(date){
  if(!(date instanceof Date)||Number.isNaN(date.getTime()))return null;
  const year=date.getFullYear(),day=(date.getMonth()+1)*100+date.getDate();
  if(day>=1020&&day<=1103)return{event:'halloween',cycle:`${year}-halloween`,themes:choices.halloween};
  if(day>=1220||day<=120)return{event:'christmas',cycle:`${day>=1220?year:year-1}-christmas`,themes:choices.christmas};
  return null;
 }
 function selectTheme(date,stored,random=Math.random){
  const active=eventForDate(date);
  if(!active)return{version:1,event:null,cycle:null,theme:'original'};
  const valid=stored?.version===1&&stored.event===active.event&&stored.cycle===active.cycle&&active.themes.includes(stored.theme);
  let theme;
  if(!valid)theme=active.themes[random()<.5?0:1];
  else theme=random()<.25?active.themes.find(id=>id!==stored.theme):stored.theme;
  return{version:1,event:active.event,cycle:active.cycle,theme};
 }
 return{storageKey,eventForDate,selectTheme};
});
