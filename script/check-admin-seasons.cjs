const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
(async()=>{
 const browser=await chromium.launch({channel:'chrome'});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route(/\.(mp4|mov)(\?.*)?$/,r=>r.fulfill({status:204,body:''}));
  await page.clock.setFixedTime(new Date('2026-10-29T12:00:00+04:00'));
  await page.goto('http://127.0.0.1:8864/?admin=1');
  await page.locator('.loading-container').waitFor({state:'hidden'});
  await page.locator('#admin-launcher').click();await page.locator('#admin-panel.is-open').waitFor();
  const name=page.locator('[data-admin-field="profile.name"]');await name.fill('Unsaved preview test');
  await page.locator('[data-admin-tab="themes"]').click();
  for(const theme of['amber','silver','snow','fireside','original']){
   await page.locator(`[data-admin-season="${theme}"]`).click();
   await page.locator(`body[data-season-preview="${theme}"]`).waitFor();
   if(theme==='original')assert.equal(await page.locator('.season-scene').count(),0);
   else await page.locator('.season-art').waitFor();
   assert.equal(new URL(page.url()).searchParams.get('preview'),theme);
   assert.equal(await page.locator(`[data-admin-season="${theme}"]`).getAttribute('aria-pressed'),'true');
  }
  assert.equal(await name.inputValue(),'Unsaved preview test','Preview switches preserve form edits');
  await page.locator('[data-admin-season="snow"]').click();
  const popupPromise=page.waitForEvent('popup');await page.locator('#admin-season-replay').click();const popup=await popupPromise;
  await popup.locator('.loading-container[data-season-loader="winter"]').waitFor();
  assert.equal(new URL(popup.url()).searchParams.get('preview'),'snow');await popup.close();
  await page.locator('[data-admin-season="automatic"]').click();
  assert.equal(new URL(page.url()).searchParams.get('preview'),null);
  await page.locator('body[data-calendar-event="halloween"]').waitFor();
  assert.deepEqual(errors,[]);await page.close();
  console.log('PASS admin theme buttons, URL, unsaved edits, loading replay, automatic calendar');

  const publicPage=await browser.newPage();
  await publicPage.clock.setFixedTime(new Date('2026-10-29T12:00:00+04:00'));
  await publicPage.route('https://portfolio.test/**',route=>{
   const name=new URL(route.request().url()).pathname.slice(1)||'index.html';
   if(/\.(mp4|mov)$/.test(name))return route.fulfill({status:204,body:''});
   const file=path.resolve(root,name);if(!file.startsWith(root+path.sep)||!fs.existsSync(file))return route.fulfill({status:404,body:''});
   const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.woff2':'font/woff2','.woff':'font/woff','.png':'image/png','.svg':'image/svg+xml'};
   return route.fulfill({body:fs.readFileSync(file),contentType:mime[path.extname(file)]||'application/octet-stream'});
  });
  await publicPage.goto('https://portfolio.test/?admin=1&preview=snow');
  await publicPage.locator('body[data-calendar-event="halloween"]').waitFor();
  assert.equal(await publicPage.locator('#admin-launcher').count(),0);
  assert.equal(await publicPage.evaluate(()=>typeof window.PortfolioSeasonalPreview),'undefined');
  assert.equal(await publicPage.locator('body').getAttribute('data-season-preview'),null);
  await publicPage.close();console.log('PASS public URLs cannot activate admin or override the event calendar');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
