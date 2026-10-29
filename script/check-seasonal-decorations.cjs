const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const base=process.env.PORTFOLIO_TEST_URL||'http://127.0.0.1:8864/';

(async()=>{
 const browser=await chromium.launch({channel:'chrome'});
 try{
  for(const viewport of[{width:1440,height:900},{width:430,height:932},{width:844,height:390}]){
   for(const theme of['amber','snow']){
    const page=await browser.newPage({viewport}),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.route(/\.(mp4|mov)(\?.*)?$/,r=>r.fulfill({status:204,body:''}));
    await page.clock.setFixedTime(new Date(theme==='snow'?'2026-12-25T12:00:00+04:00':'2026-10-29T12:00:00+04:00'));
    await page.addInitScript(theme=>{
     Math.random=()=>.99;
     localStorage.setItem('portfolio-seasonal-choice-v1',JSON.stringify({version:1,event:theme==='snow'?'christmas':'halloween',cycle:theme==='snow'?'2026-christmas':'2026-halloween',theme}));
    },theme);
    await page.goto(base,{waitUntil:'domcontentloaded'});
    await page.locator('.seasonal-loader-garland').waitFor();
    assert(await page.locator('.tube-lantern:not([hidden])').count()>0,'Visible hanging decorations');
    assert.equal(await page.locator(theme==='snow'?'.tube-lantern-pumpkin':'.tube-winter-bulb').count(),0,'Correct event artwork');
    if(theme==='snow'){
     assert(await page.locator('.tube-string-wrap.front .tube-string-bulb').count()>=8,'Dense wrapped fairy lights');
     assert(await page.locator('.tube-string-wrap.back .tube-string-bulb').count()>=8,'Rear half-turns');
     assert(await page.locator('.loading-container').evaluate(e=>{
      const z=s=>+getComputedStyle(e.querySelector(s)).zIndex;
      return z('.tube-string-wrap.back')<z('.light')&&z('.light')<z('.tube-string-wrap.front')&&z('.header-txt')>z('.tube-string-wrap.front');
     }),'Tube occludes rear coils, with readable loading text');
    }else assert.equal(await page.locator('.tube-string-wrap').count(),0);
    await page.locator('.season-art').waitFor();
    if(theme==='snow')assert(await page.evaluate(()=>{
     const z=s=>+getComputedStyle(document.querySelector(s)).zIndex;
     return z('.season-foreground-back')<z('.season-glass')&&z('.season-glass')<z('.season-foreground:not(.season-foreground-back)');
    }),'Snow left foliage behind glass, right foliage in front');
    assert(await page.evaluate(()=>{
     const z=s=>+getComputedStyle(document.querySelector(s)).zIndex;
     const a=document.querySelector('.border').getBoundingClientRect();
     const b=document.querySelector('.season-glass').getBoundingClientRect();
     return z('.weather-shell')<z('.season-glass')&&z('.season-glass')<z('.season-foreground')&&z('.season-foreground')<z('.border')&&['x','y','width','height'].every(k=>Math.abs(a[k]-b[k])<1);
    }),'Near foliage crosses the aligned glass frame below readable content');
    if(theme==='amber'){
     assert.equal(await page.locator('.season-bat').count(),9);
     assert.equal(await page.locator('[data-bat-style="frontal"]').count(),0);
     const result=await page.evaluate(()=>{
      // Probe visitor staging on an isolated instance while the real scene is paused.
      const layerCount=document.querySelectorAll('.season-ghost-layer').length;
      const g=window.PortfolioSeasonalGhosts.create(document);
      const layer=document.querySelector('.season-ghost-layer:last-child');
      g.tick(4);g.tick(9);g.tick(14);g.tick(18);
      const nodes=[...layer.children];
      const info=nodes.map(e=>({variant:e.dataset.ghostVariant,hidden:e.hidden,opacity:+getComputedStyle(e).opacity,rect:e.getBoundingClientRect().toJSON(),filter:getComputedStyle(e.querySelector('svg')).filter}));
      const before=nodes[0].getBoundingClientRect().x;
      g.tick(18,1,-1);const moved=Math.abs(nodes[0].getBoundingClientRect().x-before);
      const pathsValid=[...layer.querySelectorAll('path')].every(e=>!e.getAttribute('d')?.includes('NaN'));
      document.body.classList.add('modal-open');g.tick(18);const modalHidden=nodes.every(e=>+getComputedStyle(e).opacity===0);document.body.classList.remove('modal-open');
      g.tick(27);const fading=+getComputedStyle(nodes[0]).opacity;
      g.tick(29);const disappeared=nodes[0].hidden;
      g.hide(30);const hidden=nodes.every(e=>e.hidden);g.dispose();
      return{info,moved,pathsValid,modalHidden,fading,disappeared,hidden,disposed:document.querySelectorAll('.season-ghost-layer').length===layerCount};
     });
     assert.deepEqual(result.info.map(e=>e.variant),['01','05','08']);
     assert(result.info.every(e=>!e.hidden&&e.opacity>0&&e.opacity<=.55&&e.rect.width<70&&e.filter==='none'),'Small translucent visitors without glow');
     assert(result.info.every(e=>e.rect.left<viewport.width*.18||e.rect.right>viewport.width*.82),'No center spawns');
     assert(result.moved>=3,'Ghosts respond to parallax');
     assert(result.pathsValid&&result.modalHidden&&result.hidden&&result.disposed);
     assert(result.fading<.1&&result.disappeared,'Slow dissolve ends in disappearance');
     await page.emulateMedia({reducedMotion:'reduce'});
     await page.waitForFunction(()=>getComputedStyle(document.querySelector('.season-ghost-layer')).display==='none');
    }else assert.equal(await page.locator('.season-ghost-layer').count(),0);
    await page.evaluate(()=>window.PortfolioSeasonalEffects.clear());
    assert.equal(await page.locator('.season-ghost-layer,.seasonal-loader-garland,.season-glass,.tube-string-wrap,.season-foreground').count(),0,'Theme cleanup');
    assert.deepEqual(errors,[]);
    console.log(`PASS ${viewport.width}x${viewport.height} ${theme}: garland, event isolation, visitors, cleanup`);
    await page.close();
   }
  }
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
