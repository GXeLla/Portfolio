const {chromium}=require('playwright'),assert=require('node:assert/strict'),path=require('node:path');
(async()=>{
 const browser=await chromium.launch({channel:'chrome'});
 try{
  for(const[width,height]of[[1440,900],[430,932],[844,390]])for(const theme of['amber','silver','snow','fireside','original']){
   const page=await browser.newPage({viewport:{width,height}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.clock.setFixedTime(new Date(theme==='original'?'2026-06-15T12:00:00+04:00':['snow','fireside'].includes(theme)?'2026-12-25T12:00:00+04:00':'2026-10-29T12:00:00+04:00'));
   await page.addInitScript(theme=>{Math.random=()=>.99;if(theme!=='original'){const winter=['snow','fireside'].includes(theme);localStorage.setItem('portfolio-seasonal-choice-v1',JSON.stringify({version:1,event:winter?'christmas':'halloween',cycle:winter?'2026-christmas':'2026-halloween',theme}));}},theme);
   await page.route(/\.(mp4|mov)(\?.*)?$/,r=>r.fulfill({status:204,body:''}));
   await page.goto(process.env.PORTFOLIO_TEST_URL||'http://127.0.0.1:8864/',{waitUntil:'domcontentloaded'});
   const f=page;
   await f.locator('.loading-container').waitFor({state:'visible'});
   if(theme==='original'){
    assert.equal(await f.locator('.seasonal-loader-art').count(),0);assert.notEqual(await f.locator('.cloud').evaluate(e=>getComputedStyle(e).display),'none','Original rain cloud remains');
   }else{
    const family=['snow','fireside'].includes(theme)?'winter':'halloween';
    await f.locator(`.loading-container[data-season-loader="${family}"]`).waitFor();
    await f.locator('.seasonal-loader-art').evaluate(e=>{for(const a of e.parentElement.getAnimations({subtree:true})){a.pause();a.currentTime=300}});
    if(family==='winter'){
     assert(Number(await f.locator('.snow-base').evaluate(e=>getComputedStyle(e).opacity))>0);
     assert.equal(await f.locator('.snow-middle').evaluate(e=>getComputedStyle(e).opacity),'0','Second ball waits its turn');
     assert.equal(await f.locator('.snow-top').first().evaluate(e=>getComputedStyle(e).opacity),'0','Head and hat wait');
     assert.equal(await f.locator('.snow-stone').first().evaluate(e=>getComputedStyle(e).opacity),'0','Stones arrive last');
    }else{
     assert.equal(await f.locator('.loader-pumpkin').count(),2);
     const shapes=await f.locator('.loader-pumpkin').evaluateAll(nodes=>nodes.map(e=>({scale:e.transform.baseVal.consolidate().matrix.a,face:[...e.querySelectorAll('.pumpkin-light path')].map(p=>p.getAttribute('d')).join(' ')})));
     assert.notEqual(shapes[0].face,shapes[1].face,'Pumpkins have different carvings');
     assert(Math.abs(shapes[0].scale/shapes[1].scale-1.1)<.001,'Left pumpkin is ten percent larger');
     assert.equal(await f.locator('.carve-feature').count(),8,'Each face is cut feature by feature');
     assert.equal(await f.locator('.pumpkin-light').first().evaluate(e=>getComputedStyle(e).opacity),'0','Pumpkins are unlit before carving');
     await f.locator('.seasonal-loader-art').evaluate(e=>{for(const a of e.parentElement.getAnimations({subtree:true})){a.pause();a.currentTime=1100}});
     const holes=await f.locator('.loader-pumpkin').first().locator('.cut-hole').evaluateAll(nodes=>nodes.map(e=>+getComputedStyle(e).opacity));
     assert(holes[0]>.99&&holes[1]===0,'Carving opens one cut before the next');
     assert(await f.locator('.loader-pumpkin').first().locator('.carve-feature').nth(1).evaluate(e=>{
      const knife=e.querySelector('.carving-knife'),outline=e.querySelector('.cut-outline');
      const fraction=parseFloat(getComputedStyle(knife).offsetDistance)/100;
      const expected=outline.getPointAtLength(outline.getTotalLength()*fraction);
      const actual=new DOMPoint(0,0).matrixTransform(knife.getScreenCTM()).matrixTransform(e.getScreenCTM().inverse());
      return Math.hypot(actual.x-expected.x,actual.y-expected.y)<1;
     }),'Knife tip follows the exact carving contour');
     if(height>500&&theme==='amber')await page.screenshot({path:path.join(process.env.TEMP,`portfolio-pumpkin-carving-${width}.png`)});
    }
    assert.equal(await f.locator('.cloud').evaluate(e=>getComputedStyle(e).display),'none','Seasonal intro hides rain cloud');
    await f.locator('.seasonal-loader-art').evaluate(e=>{for(const a of e.parentElement.getAnimations({subtree:true})){a.pause();a.currentTime=3290}});
    if(family==='winter')assert(await f.locator('.build-part').evaluateAll(nodes=>nodes.every(e=>+getComputedStyle(e).opacity>.99)),'Snowman fully assembled before original fade');
    else assert(await f.locator('.pumpkin-light').evaluateAll(nodes=>nodes.every(e=>+getComputedStyle(e).opacity>.99)),'Both carved pumpkins lit before fade');
    const boxes=await f.locator('.loading-container').evaluate(e=>{const b=s=>e.querySelector(s).getBoundingClientRect().toJSON();return{art:b('.seasonal-loader-art'),progress:b('.progress-bar-main-container'),footer:b('.footer_loadingScreen')}});
    assert(boxes.art.top>boxes.progress.bottom,'Scene clears original progress bar');
    assert(boxes.art.bottom<boxes.footer.top,'Scene clears original footer '+JSON.stringify({width,height,boxes}));
    assert(boxes.art.left>=0&&boxes.art.right<=width,'Scene fits width');
    assert.equal(await f.locator('.intro-particle').count(),family==='winter'?22:12);
    if(height>500&&['amber','snow'].includes(theme))await page.screenshot({path:path.join(process.env.TEMP,`portfolio-loader-${theme}-${width}.png`)});
   }
   assert((await f.locator('.footer_loadingScreen').innerText()).includes('I tried to make some unique portfolio'));
   assert.deepEqual(errors,[]);console.log(`PASS ${width}x${height} ${theme}: original loader preserved, themed cloud-slot sequence`);await page.close();
  }
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
