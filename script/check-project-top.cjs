const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const base=process.env.PORTFOLIO_TEST_URL||'http://127.0.0.1:8864/';
(async()=>{
 const browser=await chromium.launch({channel:'chrome'});
 try{
  for(const [width,height,theme]of[[320,568,'silver'],[390,844,'silver'],[430,932,'silver'],[430,932,'snow'],[430,932,'original'],[844,390,'silver'],[844,390,'snow'],[844,390,'original']]){
   const page=await browser.newPage({viewport:{width,height},hasTouch:true});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.route(/\.(mp4|mov)(\?.*)?$/,r=>r.fulfill({status:204,body:''}));
   await page.clock.setFixedTime(new Date(theme==='original'?'2026-06-15T12:00:00+04:00':theme==='snow'?'2026-12-25T12:00:00+04:00':'2026-10-29T12:00:00+04:00'));
   await page.addInitScript(theme=>{
    Math.random=()=>.99;
    if(theme!=='original')localStorage.setItem('portfolio-seasonal-choice-v1',JSON.stringify({version:1,event:theme==='snow'?'christmas':'halloween',cycle:theme==='snow'?'2026-christmas':'2026-halloween',theme}));
   },theme);
   await page.goto(base,{waitUntil:'domcontentloaded'});
   await page.locator('.loading-container').waitFor({state:'hidden'});
   await page.locator('#tab-projects').tap();
   await page.locator('#panel-projects.fade-in').waitFor();
   const button=page.locator('.project-mobile-top');
   await button.scrollIntoViewIfNeeded();
   assert(await page.locator('.messages').evaluate(e=>e.scrollTop>100),'Scrolled to bottom');
   await button.tap();
   assert(await page.evaluate(()=>{
    const messages=document.querySelector('.messages'),pages=document.querySelector('.project-pages');
    const first=pages.querySelector('.timeline-item.text-only');
    return messages.scrollTop===0&&pages.scrollTop===0&&document.activeElement===first&&first.getBoundingClientRect().top>=messages.getBoundingClientRect().top-1;
   }),'Tap returns immediately to the first folder and moves focus there');
   await page.waitForTimeout(400);
   assert.equal(await page.locator('.messages').evaluate(e=>e.scrollTop),0,'Focus does not pull content back down');
   await button.scrollIntoViewIfNeeded();await button.focus();await button.press('Enter');
   assert.equal(await page.locator('.messages').evaluate(e=>e.scrollTop),0,'Keyboard activation also works');
   assert.deepEqual(errors,[]);
   console.log(`PASS ${width}x${height} ${theme}: touch, focus, stable top, keyboard`);
   await page.close();
  }
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
