/* Pick once per page load; an open tab only changes at an event boundary. */
(() => {
 const calendar=window.PortfolioSeasonalCalendar;
 let currentCycle,midnightTimer;
 function reconcile(isPageLoad=false){
  const date=new Date(),event=calendar.eventForDate(date);
  if(!isPageLoad&&(event?.cycle??null)===currentCycle)return;
  let stored=null;
  try{stored=JSON.parse(localStorage.getItem(calendar.storageKey));}catch{}
  const choice=calendar.selectTheme(date,stored);
  currentCycle=choice.cycle;
  try{
   if(choice.event)localStorage.setItem(calendar.storageKey,JSON.stringify(choice));
   else localStorage.removeItem(calendar.storageKey);
  }catch{}
  if(choice.event){document.body.dataset.calendarEvent=choice.event;document.body.dataset.eventCycle=choice.cycle;}
  else{delete document.body.dataset.calendarEvent;delete document.body.dataset.eventCycle;}
  window.PortfolioSeasonalEffects.apply(choice.theme);
 }
 function scheduleMidnight(){
  clearTimeout(midnightTimer);
  const now=new Date(),next=new Date(now.getFullYear(),now.getMonth(),now.getDate()+1);
  midnightTimer=setTimeout(()=>{reconcile();scheduleMidnight();},Math.max(1000,next-now+50));
 }
 document.addEventListener('visibilitychange',()=>{if(!document.hidden){reconcile();scheduleMidnight();}});
 reconcile(true);scheduleMidnight();
})();
