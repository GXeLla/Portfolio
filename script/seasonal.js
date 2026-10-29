/* Pick once per page load; an open tab only changes at an event boundary. */
(() => {
 const calendar=window.PortfolioSeasonalCalendar;
 let currentCycle,midnightTimer;
 const localAdmin=['localhost','127.0.0.1','::1'].includes(location.hostname)&&new URLSearchParams(location.search).get('admin')==='1';
 const previewThemes=['original','amber','silver','snow','fireside'];
 const requestedPreview=new URLSearchParams(location.search).get('preview');
 let preview=localAdmin&&previewThemes.includes(requestedPreview)?requestedPreview:null;
 function reconcile(isPageLoad=false){
  if(preview){if(document.body.dataset.seasonPreview!==preview){document.body.dataset.seasonPreview=preview;window.PortfolioSeasonalEffects.apply(preview);}return;}
  delete document.body.dataset.seasonPreview;
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
 if(localAdmin)window.PortfolioSeasonalPreview={
  get:()=>preview,
  set(theme){
   if(theme!==null&&!previewThemes.includes(theme))return;
   preview=theme;
   const url=new URL(location.href);
   if(theme)url.searchParams.set('preview',theme);else url.searchParams.delete('preview');
   history.replaceState(null,'',url);reconcile(true);
  }
 };
 reconcile(true);scheduleMidnight();
})();
