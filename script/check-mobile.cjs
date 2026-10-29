const {chromium}=require('playwright'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
(async()=>{
 const browser=await chromium.launch({channel:'chrome'});
 try{
  for(const [width,height]of [[320,568],[390,844],[430,932],[568,320],[844,390],[768,1024],[820,1180],[1024,768],[1440,900]]){
   if(process.env.TEST_WIDTHS&&!process.env.TEST_WIDTHS.split(',').includes(String(width)))continue;
   const context=await browser.newContext({viewport:{width,height},hasTouch:width<1100,permissions:['clipboard-read','clipboard-write']});
   const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.route('**/*',route=>{
    const url=new URL(route.request().url());if(url.hostname!=='portfolio.test')return route.fulfill({body:'<title>Preview fixture</title>'});
    const name=decodeURIComponent(url.pathname.slice(1))||'index.html';
    if(/\.(mp4|mov)$/.test(name))return route.fulfill({status:204,body:''});
    const file=path.resolve(root,name);if(!file.startsWith(root+path.sep)||!fs.existsSync(file))return route.fulfill({status:404,body:''});
    const ext=path.extname(name);return route.fulfill({body:fs.readFileSync(file),contentType:({'.js':'text/javascript','.css':'text/css','.html':'text/html','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.woff2':'font/woff2','.woff':'font/woff','.pdf':'application/pdf'})[ext]||'application/octet-stream'});
   });
   await page.clock.setFixedTime(new Date('2026-06-15T12:00:00+04:00'));
   await page.goto('https://portfolio.test/');await page.waitForTimeout(400);
   const loading=await page.evaluate(()=>{const r=s=>{const e=document.querySelector(s),b=e.getBoundingClientRect();return{top:b.top,bottom:b.bottom,left:b.left,right:b.right}};return{title:r('.header-txt'),bar:r('.progress-bar-main-container'),cloud:r('.loading-container .cloud'),footer:r('.footer_loadingScreen')}});
   assert(loading.title.left>=0&&loading.title.right<=width,'Loader title stays on-screen');
   assert(loading.title.bottom<loading.bar.top,'Loader title clears bar '+JSON.stringify(loading));
   assert(loading.cloud.top-25>loading.bar.bottom,'Cloud clears loading bar');
   assert(loading.cloud.bottom<loading.footer.top,'Cloud clears footer');
   if(width===390)await page.screenshot({path:path.join(process.env.TEMP,'portfolio-loader-fixed.png')});
   await page.locator('.loading-container').waitFor({state:'hidden'});
   await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(100);
   const check=async name=>{
    const box=await page.locator('.border').boundingBox();assert(box.x>=0&&box.x+box.width<=width+1,name+' frame horizontal');assert(box.y>=0&&box.y+box.height<=height+1,name+' frame vertical');
    assert(await page.locator('.messages').evaluate(e=>e.scrollWidth<=e.clientWidth+2),name+' content should not scroll horizontally');
   };
   for(let i=0;i<4;i++){
    const visible=page.locator('.sun[aria-hidden="false"],.moon[aria-hidden="false"]');
    await visible.evaluate(e=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    const point=await visible.evaluate(e=>{
     const r=e.getBoundingClientRect(),f=document.querySelector('.border').getBoundingClientRect();
     for(let i=0;i<10;i++)for(let j=0;j<10;j++){
      const x=r.left+r.width*(i+.5)/10,y=r.top+r.height*(j+.5)/10;
      if(x<2||y<2||x>innerWidth-2||y>innerHeight-2)continue;
      if(x>=f.left&&x<=f.right&&y>=f.top&&y<=f.bottom)continue;
      if(e.contains(document.elementFromPoint(x,y)))return{x,y};
     }return null;
    });
    assert(point,'Exposed weather control must receive touch input '+JSON.stringify({width,height,i}));
    const {x,y}=point;
    const before=await page.locator('body').getAttribute('data-weather');await page.mouse.click(x,y);await page.waitForTimeout(30);
    assert.notEqual(await page.locator('body').getAttribute('data-weather'),before,'Weather must change on a tap');
   }
   for(const id of ['main','experience','projects','faq','contact']){
    const tab=page.locator(`#tab-${id}`);await tab.scrollIntoViewIfNeeded();await tab.click();
    await page.waitForFunction(id=>{const e=document.querySelector('#panel-'+id);return e.classList.contains('active')&&Number(getComputedStyle(e).opacity)>.99},id);
    await check(id);
    if(id==='experience')assert.equal(await page.locator('#panel-experience [data-portfolio-pdf]').count(),0);
    if(id==='projects'){
     if(width<=768||height<=500){
      const folders=await page.locator('.container-library').evaluateAll(nodes=>nodes.map(e=>{const r=e.getBoundingClientRect();return{top:r.top,bottom:r.bottom,height:r.height,scroll:e.scrollHeight,client:e.clientHeight}}));
      for(let j=0;j<folders.length;j++){assert(folders[j].scroll<=folders[j].client+2,'Folder content must not be clipped');if(j)assert(folders[j].top>=folders[j-1].bottom,'Folders must not overlap')}
      const rows=await page.locator('.container-library').first().locator('.timeline-item').evaluateAll(nodes=>nodes.map(e=>{const r=e.getBoundingClientRect();return{top:r.top,bottom:r.bottom}}));
      for(let j=1;j<rows.length;j++)assert(rows[j].top>=rows[j-1].bottom-1,'Project rows must not overlap');
     }
     if(width===390)await page.screenshot({path:path.join(process.env.TEMP,'portfolio-projects-fixed.png')});
     await page.locator('.timeline-item[data-modal]').first().click();await page.locator('#project-modal').waitFor({state:'visible'});await check('preview');await page.locator('.close-btn').click();
    }
    if(id==='faq')assert.equal(await page.locator('#panel-faq [data-portfolio-pdf]').count(),1);
   }
   await page.locator('#contact-email').click();assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),'g.xelashvili2001@gmail.com');
   // Reflowing from desktop to phone clears all desktop clipping state.
   if(width===1440){await page.locator('#tab-projects').click();await page.setViewportSize({width:390,height:844});await page.waitForTimeout(250);assert(await page.locator('.container-library').evaluateAll(nodes=>nodes.every(e=>getComputedStyle(e).clipPath==='none')))}
   assert.deepEqual(errors,[]);console.log(`PASS ${width}x${height}`);await context.close();
  }
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
