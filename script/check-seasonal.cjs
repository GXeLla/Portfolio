const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
const base=process.env.PORTFOLIO_TEST_URL||'http://127.0.0.1:8864/';
async function open(browser,{date='2026-10-29T12:00:00+04:00',theme,viewport={width:1440,height:900},storage=true}={}){
 const page=await browser.newPage({viewport,timezoneId:'Asia/Tbilisi'}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.route(/\.(mp4|mov)(\?.*)?$/,r=>r.fulfill({status:204,body:''}));
 await page.clock.setFixedTime(new Date(date));
 await page.addInitScript(({theme,storage})=>{
  if(!localStorage.getItem('season-test-roll'))localStorage.setItem('season-test-roll','.99');
  if(theme&&!localStorage.getItem('portfolio-seasonal-choice-v1')){const christmas=['snow','fireside'].includes(theme);localStorage.setItem('portfolio-seasonal-choice-v1',JSON.stringify({version:1,event:christmas?'christmas':'halloween',cycle:christmas?'2026-christmas':'2026-halloween',theme}));}
  const roll=Number(localStorage.getItem('season-test-roll')||'.99');Math.random=()=>roll;
  if(!storage){Storage.prototype.getItem=Storage.prototype.setItem=Storage.prototype.removeItem=()=>{throw new DOMException('Blocked','SecurityError')};}
 },{theme,storage});
 await page.goto(base,{waitUntil:'domcontentloaded'});
 return{page,errors};
}
async function clickWeather(page){
 const control=page.locator('.sun[aria-hidden="false"],.moon[aria-hidden="false"]');
 await control.evaluate(e=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
 const point=await control.evaluate(e=>{
  const r=e.getBoundingClientRect(),f=document.querySelector('.border').getBoundingClientRect();
  for(let i=0;i<10;i++)for(let j=0;j<10;j++){
   const x=r.left+r.width*(i+.5)/10,y=r.top+r.height*(j+.5)/10;
   if(x<2||y<2||x>innerWidth-2||y>innerHeight-2)continue;
   if(x>=f.left&&x<=f.right&&y>=f.top&&y<=f.bottom)continue;
   if(e.contains(document.elementFromPoint(x,y)))return{x,y};
  }return null;
 });
 assert(point,'Exposed original celestial control receives input');
 const before=await page.locator('body').getAttribute('data-weather');await page.mouse.click(point.x,point.y);
 assert.notEqual(await page.locator('body').getAttribute('data-weather'),before);
}
(async()=>{
 const browser=await chromium.launch({channel:'chrome'});
 try{
  for(const viewport of[{width:1440,height:900},{width:430,height:932},{width:844,height:390}])for(const theme of['amber','silver','snow','fireside']){
   const winter=['snow','fireside'].includes(theme);
   const{page,errors}=await open(browser,{viewport,theme,date:winter?'2026-12-25T12:00:00+04:00':undefined});
   await page.locator(`body[data-season="${theme}"]`).waitFor();
   assert.equal(await page.locator('.studio,#choices,#replay-intro,#portfolio').count(),0,'No preview UI or iframe');
   assert.equal(await page.locator('.loading-container').getAttribute('data-season-loader'),winter?'winter':'halloween');
   await page.locator('.season-art').waitFor();
   const image=await page.locator('.season-art').evaluate(e=>new Promise(resolve=>{const img=new Image();img.onload=()=>resolve(img.naturalWidth);img.onerror=()=>resolve(0);img.src=getComputedStyle(e).backgroundImage.slice(5,-2)}));
   assert.equal(image,viewport.width<=768&&viewport.height>500?1290:3840);
   await page.locator('.loading-container').waitFor({state:'hidden'});
   await page.emulateMedia({reducedMotion:'reduce'});
   for(let i=0;i<4;i++){await clickWeather(page);assert.equal(await page.locator('body').getAttribute('data-season'),theme);}
   for(const tab of['main','experience','projects','faq','contact']){
    await page.locator('#tab-'+tab).click();await page.locator('#panel-'+tab+'.active').waitFor({state:'visible'});
    assert(await page.locator('.messages').evaluate(e=>e.scrollWidth<=e.clientWidth+2),'Content fits '+tab);
   }
   await page.locator('#tab-main').click();await page.locator('#panel-main.fade-in').waitFor();
   const r=await page.locator('.border').boundingBox();assert(r.x>=0&&r.y>=0&&r.x+r.width<=viewport.width+1&&r.y+r.height<=viewport.height+1);
   assert(Math.abs(r.y-(viewport.height-r.y-r.height))<=3,'Balanced frame margins');
   assert(await page.locator('.weather-shell,.season-motion').evaluateAll(nodes=>nodes.every(e=>getComputedStyle(e).clipPath==='none')),'Continuous transparent atmosphere');
   await page.emulateMedia({reducedMotion:'no-preference'});
   for(const[x,y]of[[2,2],[viewport.width-2,viewport.height-2]]){
    await page.mouse.move(x,y);await page.waitForTimeout(200);
    assert(await page.locator('.season-art,.season-foreground').evaluateAll(nodes=>nodes.every(e=>{const b=e.getBoundingClientRect();return b.left<=0&&b.top<=0&&b.right>=innerWidth&&b.bottom>=innerHeight})),'Parallax covers edges');
   }
   if(!winter){
    const bat=page.locator('.season-bat').first(),before=await bat.locator('path').first().getAttribute('d');await page.waitForTimeout(150);
    assert.notEqual(await bat.locator('path').first().getAttribute('d'),before,'Wings animate after promotion');
   }
   if(viewport.height>500)await page.screenshot({path:path.join(process.env.TEMP,`portfolio-auto-${theme}-${viewport.width}.png`)});
   assert.deepEqual(errors,[]);console.log(`PASS ${viewport.width}x${viewport.height} ${theme}: calendar, loader, assets, no toolbar, four weather modes, tabs, transparency, motion`);await page.close();
  }
  for(const[date,event]of[['2026-10-19T23:59:59+04:00',null],['2026-10-20T00:00:00+04:00','halloween'],['2026-11-03T23:59:59+04:00','halloween'],['2026-11-04T00:00:00+04:00',null],['2026-12-19T23:59:59+04:00',null],['2026-12-20T00:00:00+04:00','christmas'],['2027-01-20T23:59:59+04:00','christmas'],['2027-01-21T00:00:00+04:00',null]]){
   const{page,errors}=await open(browser,{date});assert.equal(await page.locator('body').getAttribute('data-calendar-event'),event);
   if(event)await page.locator('.season-art').waitFor();else assert.equal(await page.locator('.season-scene,.seasonal-loader-art').count(),0);
   assert.deepEqual(errors,[]);await page.close();
  }
  console.log('PASS inclusive date boundaries and Original outside events');
  for(const[date,after]of[['2026-10-19T23:59:59+04:00','halloween'],['2026-11-03T23:59:59+04:00',null],['2026-12-19T23:59:59+04:00','christmas'],['2027-01-20T23:59:59+04:00',null]]){
   const page=await browser.newPage({timezoneId:'Asia/Tbilisi'});
   await page.route(/\.(mp4|mov)(\?.*)?$/,r=>r.fulfill({status:204,body:''}));
   await page.clock.install({time:new Date(date)});await page.clock.pauseAt(new Date(date));
   await page.goto(base,{waitUntil:'domcontentloaded'});await page.clock.runFor(1200);
   assert.equal(await page.locator('body').getAttribute('data-calendar-event'),after);await page.close();
  }
  console.log('PASS all four local-midnight event transitions');

  {
   const{page,errors}=await open(browser,{theme:'amber'});await page.locator('body[data-season="amber"]').waitFor();
   for(let i=0;i<3;i++){await page.reload({waitUntil:'domcontentloaded'});await page.locator('body[data-season="amber"]').waitFor();}
   await page.evaluate(()=>localStorage.setItem('season-test-roll','.1'));await page.reload({waitUntil:'domcontentloaded'});await page.locator('body[data-season="silver"]').waitFor();
   await page.evaluate(()=>{for(let i=0;i<20;i++)document.dispatchEvent(new Event('visibilitychange'));});assert.equal(await page.locator('body').getAttribute('data-season'),'silver','No random rerolls while open');
   await page.clock.setFixedTime(new Date('2026-11-04T00:00:01+04:00'));await page.evaluate(()=>document.dispatchEvent(new Event('visibilitychange')));await page.locator('body:not([data-season])').waitFor();assert.equal(await page.locator('.season-scene').count(),0,'Event clears in open tab');
   await page.clock.setFixedTime(new Date('2026-12-20T00:00:01+04:00'));await page.evaluate(()=>document.dispatchEvent(new Event('visibilitychange')));await page.locator('body[data-calendar-event="christmas"]').waitFor();await page.locator('.season-art').waitFor();assert(['snow','fireside'].includes(await page.locator('body').getAttribute('data-season')));
   assert.deepEqual(errors,[]);await page.close();console.log('PASS reload persistence, controlled switch, no visibility rerolls, open-tab event transitions');
  }
  {const{page,errors}=await open(browser,{storage:false});await page.locator('.season-art').waitFor();assert.deepEqual(errors,[]);await page.close();console.log('PASS storage blocked fallback');}
  {
   const page=await browser.newPage();await page.clock.setFixedTime(new Date('2026-10-29T12:00:00+04:00'));await page.route('**/images/seasons/**',r=>r.fulfill({status:404,body:''}));await page.goto(base,{waitUntil:'domcontentloaded'});await page.locator('body:not([data-season])').waitFor();assert.equal(await page.locator('.season-scene').count(),0);await page.close();console.log('PASS asset failure restores Original');
  }
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
