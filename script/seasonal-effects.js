/* Continuous seasonal scene, using the original portfolio's weather controls. */
(() => {
 const doc=document,view=window;
 let pending=0,dispose=()=>{};
 const batSVG='<svg viewBox="0 0 120 64" fill="currentColor"><g class="wing left"><path d="M59 29Q35 12 3 6L13 35Q23 22 34 43Q44 31 58 48Z"/></g><g transform="translate(120 0) scale(-1 1)"><g class="wing right"><path d="M59 29Q35 12 3 6L13 35Q23 22 34 43Q44 31 58 48Z"/></g></g><path d="M54 25L52 12 59 19 66 12 65 26Q73 42 60 58Q47 42 54 25Z"/></svg>';
 const leafSVG='<svg viewBox="0 0 30 40" fill="currentColor"><path d="M15 1L19 12 28 8 25 20 30 24 19 29 16 39 13 29 2 25 7 20 3 9 12 12Z"/></svg>';
 const snowSVG='<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M16 1V31M3 8L29 24M3 24L29 8M12 5L16 9 20 5M12 27L16 23 20 27M4 13L10 13 10 7M22 25L22 19 28 19M4 19L10 19 10 25M22 7L22 13 28 13"/></svg>';
 async function apply(id){
  const request=++pending;
  dispose();dispose=()=>{};
  if(id==='original')return;
  const scene=doc.createElement('div'),front=doc.createElement('div'),glass=doc.createElement('div');
  scene.className='season-scene';front.className='season-foreground';glass.className='season-glass';glass.setAttribute('aria-hidden','true');
  scene.setAttribute('aria-hidden','true');front.setAttribute('aria-hidden','true');
  doc.body.prepend(scene,glass);doc.body.append(front);
  const video=doc.querySelector('#bg_main');
  const sources=[...video.querySelectorAll('source')].map(e=>[e,e.getAttribute('src')]);
  let stopScene=()=>{},cancelled=false,rearForeground=null;
  dispose=()=>{
   cancelled=true;stopScene();scene.remove();front.remove();glass.remove();rearForeground?.remove();
   delete doc.body.dataset.season;
   window.PortfolioSeasonalLoader.set(doc,'original');
   sources.forEach(([e,src])=>{if(src)e.src=src;});
   video.load();
   if(doc.body.dataset.weather==='storm')video.play().catch(()=>{});
  };
  window.PortfolioSeasonalLoader.set(doc,id);
  doc.body.dataset.season=id;
  video.pause();sources.forEach(([e])=>e.removeAttribute('src'));video.load();
  const kind=view.innerWidth<=768&&view.innerHeight>500?'mobile':'desktop';
  const decoded=await Promise.all([kind,'foreground'].map(async kind=>{
   const image=new Image();image.src=new URL(`./images/seasons/${id}-${kind}.webp`,doc.baseURI).href;
   try{await image.decode();return true;}catch{return false;}
  }));
  if(request!==pending||cancelled)return;
  if(decoded.some(ok=>!ok)){dispose();dispose=()=>{};return;}
  const panel=doc.querySelector('.border');
  function syncGlass(){
   const rect=panel.getBoundingClientRect();
   Object.assign(glass.style,{left:`${rect.left}px`,top:`${rect.top}px`,width:`${rect.width}px`,height:`${rect.height}px`,borderRadius:view.getComputedStyle(panel).borderRadius,visibility:'visible'});
  }
  syncGlass();
  const glassObserver=new view.ResizeObserver(syncGlass);glassObserver.observe(panel);
  view.addEventListener('resize',syncGlass,{passive:true});
  const winter=['snow','fireside'].includes(id);
  scene.innerHTML='<div class="season-art"></div><div class="season-colorwash"></div><div class="season-horizon"></div><div class="season-fog far"></div><div class="season-fog near"></div><div class="season-water"></div><div class="season-lights"></div><div class="season-vignette"></div><div class="season-motion"></div>';
  const motionLayer=scene.querySelector('.season-motion');
  scene.querySelectorAll('.season-fog').forEach(fog=>motionLayer.append(fog));
  if(winter)motionLayer.insertAdjacentHTML('beforeend','<div class="season-snowman"><i class="snow-body"></i><i class="snow-head"></i><i class="snow-hat"></i><i class="snow-scarf"></i><i class="snow-nose"></i></div>');
  const asset=kind=>new URL(`./images/seasons/${id}-${kind}.webp`,doc.baseURI).href;
  scene.querySelector('.season-art').style.cssText=`--landscape:url("${asset('desktop')}");--portrait:url("${asset('mobile')}")`;
  front.innerHTML='<div class="season-front-art full"></div><div class="season-front-art left"></div><div class="season-front-art right"></div><div class="season-front-art floor"></div><div class="season-front-art corner"></div><div class="season-front-art top"></div>';
  front.style.setProperty('--foreground',`url("${asset('foreground')}")`);
  if(id==='snow'){
   rearForeground=front.cloneNode(true);rearForeground.classList.add('season-foreground-back');
   doc.body.append(rearForeground);
  }

  const bats=[];
  if(!winter)for(let i=0;i<9;i++){
   const e=doc.createElement('span');e.className='season-bat';e.innerHTML=batSVG;
   e.style.cssText=`--size:${14+i%4*8}px;--wing-speed:${.13+i%4*.025}s;--phase:-${i*.17}s;opacity:${.55+i%3*.13}`;
   motionLayer.append(e);bats.push({e,wings:[...e.querySelectorAll('.wing')],seed:i*2.399,depth:.7+i%3*.5,speed:.024+i%4*.005,direction:i%3===0?-1:1});
  }
  for(let i=0;i<(winter?54:12);i++){
   const e=doc.createElement('span');e.className=winter?'season-snow':'season-leaf';
   e.style.cssText=`--x:${i*47.31%100}%;--y:${i*19.7%100}%;--size:${winter?2+i%6:10+i%4*4}px;--duration:${winter?12+i%17:18+i%13}s;--delay:-${i*2.7}s;--drift:${40+i%7*13}px;--opacity:${.22+i%5*.11}`;
   if(winter&&i%5===0){e.classList.add('crystal');e.innerHTML=snowSVG}
   if(!winter)e.innerHTML=leafSVG;
   motionLayer.append(e);
  }
  const motion=view.matchMedia('(prefers-reduced-motion: reduce)');
  const ghosts=!winter?view.PortfolioSeasonalGhosts?.create(doc):null;
  let tx=0,ty=0,x=0,y=0,scroll=0,raf=0,last=0,time=0,disposed=false;
  const pointer=e=>{tx=e.clientX/view.innerWidth*2-1;ty=e.clientY/view.innerHeight*2-1};
  const reset=()=>{tx=0;ty=0};
  const scrolling=e=>{if(e.target.matches?.('.messages'))scroll=e.target.scrollTop};
  doc.addEventListener('pointermove',pointer,{passive:true});doc.addEventListener('pointerleave',reset);doc.addEventListener('scroll',scrolling,{capture:true,passive:true});
  function tick(now){
   if(disposed)return;
   const dt=last?Math.min((now-last)/1000,.05):0;last=now;time+=dt;
   x+=(tx-x)*Math.min(1,dt*3.8);y+=(ty-y)*Math.min(1,dt*3.8);
   scene.style.setProperty('--px',`${x*7+Math.sin(time*.09)*1.2}px`);
   scene.style.setProperty('--py',`${y*5+Math.sin(time*.13)-Math.min(scroll*.012,5)}px`);
   const frontY=-y*12+Math.cos(time*.14)-Math.min(scroll*.025,10);
   front.style.transform=`translate3d(${-x*18+Math.sin(time*.18)*1.5}px,${frontY}px,0)`;
   // Keep the shallow upper canopy near the viewport edge while the deeper
   // foreground moves farther. Its eight-pixel bleed covers this smaller motion.
   front.style.setProperty('--canopy-offset',`${-frontY*.75}px`);
   if(rearForeground){rearForeground.style.transform=front.style.transform;rearForeground.style.setProperty('--canopy-offset',`${-frontY*.75}px`);}
   const w=view.innerWidth,h=view.innerHeight;
   bats.forEach(bat=>{
    const {e,wings,seed,depth,speed,direction}=bat;
    const p=(time*speed+seed*.19)%1,pace=p+Math.sin(p*Math.PI*2+seed)*.018;
    const bx=((direction===1?pace:1-pace)*1.38-.19)*w;
    const base=.1+(seed%.65)*.48;
    const by=h*base+Math.sin(p*Math.PI*4+seed)*h*.055+Math.sin(time*1.7+seed)*8+Math.sin(time*.37+seed)*13;
    const vx=direction*1.38*w*speed*(1+Math.cos(p*Math.PI*2+seed)*.018*Math.PI*2);
    const vy=Math.cos(p*Math.PI*4+seed)*h*.055*speed*Math.PI*4+Math.cos(time*1.7+seed)*13.6+Math.cos(time*.37+seed)*4.81;
    // The SVG's nose points upward. Rotate its forward axis to the path tangent;
    // never mirror a wing stroke or send an upward-facing bat sideways.
    const targetHeading=Math.atan2(vy,vx)*180/Math.PI+90;
    if(bat.heading===undefined)bat.heading=targetHeading;
    const turn=((targetHeading-bat.heading+540)%360)-180;
    bat.heading+=turn*Math.min(1,dt*9);
    e.dataset.heading=bat.heading.toFixed(2);
    e.dataset.velocity=`${vx.toFixed(2)},${vy.toFixed(2)}`;
    // Shoulder, elbow and membrane flex together. Blend into an extended glide,
    // instead of freezing a CSS animation midway through a stroke.
    const glide=Math.max(0,(Math.sin(time*.6+seed)-.55)/.45);
    wings.forEach((wing,j)=>{
     const phase=time*(5.2+seed%.9)+seed+j*.025;
     const flap=Math.sin(phase*Math.PI*2)*(1-glide)-glide*.18;
     const tipY=8+flap*25,elbowY=17+flap*9,tipX=4+(flap+1)*4;
     wing.firstElementChild.setAttribute('d',`M59 29 Q40 ${elbowY.toFixed(2)} ${tipX.toFixed(2)} ${tipY.toFixed(2)} Q10 ${(23+flap*13).toFixed(2)} 14 ${(35+flap*10).toFixed(2)} Q24 ${(23+flap*5).toFixed(2)} 34 ${(43+flap*4).toFixed(2)} Q46 32 58 48 Z`);
     wing.setAttribute('transform',`rotate(${(flap*10).toFixed(2)} 59 29)`);
    });
    e.style.transform=`translate3d(${bx-x*depth*12}px,${by-y*depth*7}px,0) rotate(${bat.heading}deg) scale(${depth*(.78+Math.sin(p*Math.PI)*.22)})`;
   });
   ghosts?.tick(time,x,y,scroll);
   raf=view.requestAnimationFrame(tick);
  }
  const schedule=()=>{view.cancelAnimationFrame(raf);last=0;if(!doc.hidden&&!motion.matches)raf=view.requestAnimationFrame(tick);if(motion.matches){ghosts?.hide(time);front.style.transform='none';front.style.removeProperty('--canopy-offset');if(rearForeground){rearForeground.style.transform='none';rearForeground.style.removeProperty('--canopy-offset');}bats.forEach(({e},i)=>e.style.transform=`translate(${i*137%view.innerWidth}px,${30+i*33}px)`)}};
  doc.addEventListener('visibilitychange',schedule);motion.addEventListener('change',schedule);schedule();
  stopScene=()=>{disposed=true;view.cancelAnimationFrame(raf);ghosts?.dispose();glassObserver.disconnect();view.removeEventListener('resize',syncGlass);doc.removeEventListener('pointermove',pointer);doc.removeEventListener('pointerleave',reset);doc.removeEventListener('scroll',scrolling,true);doc.removeEventListener('visibilitychange',schedule);motion.removeEventListener('change',schedule);scene.style.removeProperty('--px');scene.style.removeProperty('--py')};
 }
 window.PortfolioSeasonalEffects={apply,clear(){++pending;dispose();dispose=()=>{};}};
})();
