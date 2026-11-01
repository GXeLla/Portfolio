const assert=require('node:assert/strict');
const {eventForDate,selectTheme}=require('./seasonal-calendar.js');
const date=(y,m,d,h=12)=>new Date(y,m-1,d,h,59,59,999);
let checks=0;
function check(value,message){assert(value,message);checks++;}
for(const year of[2026,2027,2028,2030,2040,2100]){
 check(eventForDate(date(year,10,19))===null,'No early Halloween');
 check(eventForDate(date(year,10,20,0)).cycle===`${year}-halloween`,'Halloween starts October 20');
 check(eventForDate(date(year,11,3,23)).event==='halloween','November 3 is included');
 check(eventForDate(date(year,11,4,0))===null,'Halloween ends before November 4');
 check(eventForDate(date(year,12,19))===null,'No early Christmas');
 check(eventForDate(date(year,12,20,0)).cycle===`${year}-christmas`,'Christmas starts December 20');
 check(eventForDate(date(year+1,1,1)).cycle===`${year}-christmas`,'Christmas cycle survives New Year');
 check(eventForDate(date(year+1,1,20,23)).cycle===`${year}-christmas`,'January 20 is included');
 check(eventForDate(date(year+1,1,21,0))===null,'Christmas ends before January 21');
 check(eventForDate(date(year,6,15))===null,'Original in summer');
}
const halloween=date(2026,10,23),christmas=date(2026,12,25);
const amber=selectTheme(halloween,null,()=>0),silver=selectTheme(halloween,null,()=>.99);
check(amber.theme==='amber'&&silver.theme==='silver','First load picks either Halloween scene');
check(selectTheme(christmas,null,()=>0).theme==='snow'&&selectTheme(christmas,null,()=>.99).theme==='fireside','First load picks either Christmas scene');
check(selectTheme(halloween,amber,()=>.249).theme==='silver','25 percent interval changes theme');
check(selectTheme(halloween,amber,()=>.25).theme==='amber','Boundary and remaining 75 percent keep theme');
check(selectTheme(halloween,silver,()=>.1).theme==='amber','Switch always picks the other scene');
check(selectTheme(christmas,amber,()=>0).theme==='snow','No Halloween theme leaks into Christmas');
check(selectTheme(date(2027,10,23),amber,()=>.99).theme==='silver','New annual cycle gets a fresh pick');
for(const stored of[{},'garbage',{...amber,theme:'crimson'},{...amber,version:9},{...amber,event:'christmas'}])
 check(selectTheme(halloween,stored,()=>.99).theme==='silver','Invalid storage safely replaced');
check(selectTheme(date(2026,6,15),amber,()=>{throw Error('Must not roll outside event')}).theme==='original','No event means Original');
check(eventForDate(new Date('invalid'))===null,'Invalid date handled');
let state=amber,changes=0,seed=42;
const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
for(let i=0;i<10000;i++){const next=selectTheme(halloween,state,random);if(next.theme!==state.theme)changes++;state=next;}
check(changes>2350&&changes<2650,'Long-run refresh switch rate is approximately 25 percent');
console.log(`PASS ${checks} calendar/selection checks; ${changes}/10000 refreshes switched`);
