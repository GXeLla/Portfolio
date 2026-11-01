/* The original intro owns timing; seasonal art and tube decorations follow it. */
(() => {
 const garlandCleanups=new WeakMap();
 function christmasWrap(doc,loader){
  const ns='http://www.w3.org/2000/svg',view=doc.defaultView;
  const layers=['back','front'].map(depth=>{const svg=doc.createElementNS(ns,'svg');svg.classList.add('tube-string-wrap',depth);svg.setAttribute('aria-hidden','true');loader.append(svg);return svg;});
  function position(){
   const w=loader.clientWidth,h=loader.clientHeight;
   if(!w||!h)return;
   layers.forEach(svg=>{svg.setAttribute('viewBox',`0 0 ${w} ${h}`);svg.replaceChildren();});
   const colors=['#d8bd87','#91b9a9','#b8a4c8','#c59387'];
   for(const tube of loader.querySelectorAll('.light')){
    const style=view.getComputedStyle(tube);if(style.display==='none')continue;
    const width=tube.offsetWidth,height=tube.offsetHeight,[ox,oy]=style.transformOrigin.split(' ').map(parseFloat);
    const matrix=new view.DOMMatrix().translate(tube.offsetLeft+ox,tube.offsetTop+oy).rotate(parseFloat(style.rotate)||0).multiply(new view.DOMMatrix(style.transform)).translate(-ox,-oy);
    const groups=layers.map(svg=>{const g=doc.createElementNS(ns,'g');g.setAttribute('transform',matrix.toString());svg.append(g);return g;});
    const pitch=56,radius=height*.5+3;
    for(let x=-pitch;x<width+pitch;x+=pitch){
     const center=new view.DOMPoint(x+pitch*.5,height*.5).matrixTransform(matrix);
     if(center.x< -120||center.x>w+120||center.y< -120||center.y>h+120)continue;
     for(let front=0;front<2;front++){
      const group=groups[front],start=front?-Math.PI/2:Math.PI/2;
      const offset=front?0:pitch*.5;
      const point=t=>[x+offset+t*pitch*.5,height*.5+Math.sin(start+t*Math.PI)*radius];
      const d=Array.from({length:21},(_,i)=>{const [a,b]=point(i/20);return`${i?'L':'M'}${a.toFixed(2)} ${b.toFixed(2)}`;}).join(' ');
      const wire=doc.createElementNS(ns,'path');wire.setAttribute('d',d);wire.classList.add('tube-string-wire');group.append(wire);
      for(const [i,t]of[.24,.73].entries()){
       const [a,b]=point(t),bulb=doc.createElementNS(ns,'g');bulb.classList.add('tube-string-bulb');
       bulb.style.setProperty('--fairy-color',colors[(Math.round(x/pitch)+i+400)%colors.length]);
       bulb.style.setProperty('--fairy-delay',`${-((x/pitch+i)%7)}s`);
       bulb.setAttribute('transform',`translate(${a.toFixed(2)} ${b.toFixed(2)}) rotate(${(Math.cos(start+t*Math.PI)*24).toFixed(2)}) scale(${front?1:.72})`);
       bulb.innerHTML='<path class="tube-string-socket" d="M-1.3 0H1.3V2H-1.3Z"/><ellipse class="tube-string-glass" cx="0" cy="4" rx="2.1" ry="3.2"/><path class="tube-string-highlight" d="M-.7 3V4.5"/>';
       group.append(bulb);
      }
     }
    }
   }
  }
  return{position,dispose(){layers.forEach(e=>e.remove());}};
 }

 function hangSeasonalGarland(doc,loader,family){
  const tube=loader.querySelector('.light:not(.bot)'),view=doc.defaultView;
  if(!tube||!view)return;
  const garland=doc.createElement('div');
  garland.className='seasonal-loader-garland';garland.dataset.garland=family;garland.setAttribute('aria-hidden','true');
  // Original CSS artwork inspired by Coding Maker's pumpkin light garland.
  // Keep the pumpkins upright while their attachment points follow the angled tube.
  garland.innerHTML=Array.from({length:7},(_,i)=>`<span class="tube-lantern" data-face="${i%3}" style="--sway-delay:-${i*.47}s;--glow-delay:-${i*.61}s;--sway-duration:${family==='winter'?3.8+i%3*.6:2.6+i%3*.4}s;--bulb-color:${['#d1a96c','#8eada8','#b7a2b9'][i%3]}"><span class="tube-lantern-cord"></span>${family==='winter'?'<span class="tube-winter-bulb"><i class="tube-bulb-cap"></i></span>':'<span class="tube-lantern-pumpkin"><i class="tube-lantern-stem"></i><i class="tube-lantern-eye left"></i><i class="tube-lantern-eye right"></i><i class="tube-lantern-mouth"></i></span>'}</span>`).join('');
  loader.append(garland);
  const lanterns=[...garland.children];
  const wrap=family==='winter'?christmasWrap(doc,loader):null;
  function position(){
   if(!garland.isConnected||!loader.clientWidth||!loader.clientHeight)return;
   wrap?.position();
   const style=view.getComputedStyle(tube),width=tube.offsetWidth,height=tube.offsetHeight;
   const [ox,oy]=style.transformOrigin.split(' ').map(parseFloat);
   const matrix=new view.DOMMatrix().translate(tube.offsetLeft+ox,tube.offsetTop+oy)
    .rotate(parseFloat(style.rotate)||0).multiply(new view.DOMMatrix(style.transform))
    .translate(-ox,-oy);
   const start=new view.DOMPoint(0,height).matrixTransform(matrix);
   const end=new view.DOMPoint(width,height).matrixTransform(matrix);
   const slope=(end.y-start.y)/(end.x-start.x);
   const yAt=x=>start.y+(x-start.x)*slope;
   const size=Math.max(27,Math.min(52,loader.clientWidth*.04));
   const margin=size*.75;
   // Use only the visible upper section of the existing tube.
   const bounds=[margin,loader.clientWidth-margin,(20-start.y)/slope+start.x,(loader.clientHeight*.65-start.y)/slope+start.x];
   const left=Math.max(bounds[0],Math.min(bounds[2],bounds[3]));
   const right=Math.min(bounds[1],Math.max(bounds[2],bounds[3]));
   const count=Math.max(0,Math.min(lanterns.length,Math.floor((right-left)/(size*1.85))+1));
   const loaderBox=loader.getBoundingClientRect();
   const textBoxes=[...loader.querySelectorAll('.header-txt,.progress-bar-main-container,.footer_loadingScreen')].map(e=>e.getBoundingClientRect());
   lanterns.forEach((lantern,i)=>{
    lantern.hidden=i>=count;if(lantern.hidden)return;
    const x=count===1?(left+right)/2:left+(right-left)*(i+.5)/count;
    const y=yAt(x),cord=20+i%3*11;
    const bottom=y+cord+size*.86,top=y-8;
    // Leave the original loading copy and progress bar unobstructed.
    lantern.hidden=textBoxes.some(b=>x+size*.65>b.left-loaderBox.left-8&&x-size*.65<b.right-loaderBox.left+8&&bottom>b.top-loaderBox.top-8&&top<b.bottom-loaderBox.top+8);
    lantern.style.setProperty('--anchor-x',`${x}px`);
    lantern.style.setProperty('--anchor-y',`${y}px`);
    lantern.style.setProperty('--lantern-size',`${size}px`);
    lantern.style.setProperty('--cord-length',`${cord}px`);
   });
  }
  position();
  const observer=new view.ResizeObserver(position);observer.observe(loader);
  doc.fonts?.ready.then(position);
  garlandCleanups.set(loader,()=>{observer.disconnect();garland.remove();wrap?.dispose();});
 }
 const snowman=`<svg viewBox="0 0 340 180" aria-hidden="true"><defs><radialGradient id="loaderSnow" cx="35%" cy="25%"><stop stop-color="#ffffff"/><stop offset=".7" stop-color="#e8f2f7"/><stop offset="1" stop-color="#9eb6ce"/></radialGradient></defs><ellipse cx="170" cy="168" rx="66" ry="7" fill="#d2e5fa" opacity=".12"/>
 <g class="build-part snow-base" style="--arrive:.05s"><circle cx="170" cy="138" r="33" fill="url(#loaderSnow)"/></g>
 <g class="build-part snow-middle" style="--arrive:.65s"><circle cx="170" cy="98" r="26" fill="url(#loaderSnow)"/></g>
 <g class="build-part snow-top" style="--arrive:1.25s"><circle cx="170" cy="59" r="20" fill="url(#loaderSnow)"/></g>
 <g class="build-part snow-arms" style="--arrive:1.65s" fill="none" stroke="#87684d" stroke-width="3" stroke-linecap="round"><path d="M147 100L120 83 116 73M124 85L111 85M194 100L219 80 225 70M216 83L229 83"/></g>
 <g class="build-part snow-top" style="--arrive:1.9s"><rect x="154" y="17" width="32" height="25" rx="3" fill="#263348"/><path d="M154 35H186V42H154Z" fill="#b45c50"/><rect x="147" y="40" width="46" height="5" rx="2" fill="#182638"/></g>
 <g class="build-part snow-carrot" style="--arrive:2.35s"><path d="M173 60L195 66 173 68Z" fill="#ed9b46"/><path d="M175 62L189 65" stroke="#ffcc7b"/></g>
 <g fill="#253246"><circle class="build-part snow-stone" style="--arrive:2.55s" cx="163" cy="55" r="2.3"/><circle class="build-part snow-stone" style="--arrive:2.62s" cx="178" cy="55" r="2.3"/><circle class="build-part snow-stone" style="--arrive:2.69s" cx="160" cy="69" r="1.4"/><circle class="build-part snow-stone" style="--arrive:2.73s" cx="165" cy="72" r="1.4"/><circle class="build-part snow-stone" style="--arrive:2.77s" cx="171" cy="73" r="1.4"/><circle class="build-part snow-stone" style="--arrive:2.81s" cx="177" cy="71" r="1.4"/><circle class="build-part snow-stone" style="--arrive:2.85s" cx="170" cy="92" r="2.5"/><circle class="build-part snow-stone" style="--arrive:2.92s" cx="170" cy="105" r="2.5"/><circle class="build-part snow-stone" style="--arrive:2.99s" cx="170" cy="132" r="2.8"/><circle class="build-part snow-stone" style="--arrive:3.06s" cx="170" cy="148" r="2.8"/></g></svg>`;
 // Each feature is cut separately; the knife follows that exact closed contour.
 const faces=[
  ['M-25 -8L-10 -25 -4 -6Z','M6 -6L14 -24 28 -7Z','M-4 5L2 -3 8 6Z','M-28 12L-18 17 -13 11 -7 21 0 21 6 13 12 17 29 10 22 28 11 34 -10 33 -22 26Z'],
  ['M-25 -6Q-17 -26 -7 -8Q-16 -14 -25 -6Z','M7 -8Q17 -26 26 -6Q16 -14 7 -8Z','M-3 4L2 -2 7 4 2 8Z','M-27 11Q-19 20 -10 22L-10 28 -4 28 -4 24Q6 26 13 22L13 28 19 25 19 19Q24 15 28 10Q23 39 0 40Q-23 38 -27 11Z']
 ];
 const pumpkin=(x,delay,variant,scale=1)=>{
  const features=faces[variant];
  const face=features.map(d=>`<path d="${d}"/>`).join('');
  const cuts=features.map((d,i)=>`<g class="carve-feature" style="--cut-at:${.7+delay+i*.31}s;--cut-path:path('${d}')"><path class="cut-outline" d="${d}" pathLength="1"/><path class="cut-hole" d="${d}"/><path class="cut-piece" d="${d}" fill="url(#loaderPumpkin)"/><g class="carving-knife"><path d="M0 0L-6 -14 3 -10Z" fill="#d5e2e6"/><path d="M-6 -14L-10 -23 -5 -25 0 -13Z" fill="#8b6747"/><path d="M0 0L-3 -11" stroke="#faf7e8" stroke-width=".8"/></g></g>`).join('');
  // Model volume with curved lobes, a visible crown and shaded side walls.
  // Project the cuts and knife together onto a gently turned front surface.
  const projection=variant===0?'matrix(.9 -.075 .025 .96 7 1)':'matrix(.88 .065 -.02 .97 -6 0)';
  return `<g class="loader-pumpkin" data-face="${variant}" transform="translate(${x} ${variant===0?106:112}) scale(${scale})" style="--arrival:${delay}s;--lit:${2.05+delay}s"><g class="pumpkin-arrive"><ellipse class="pumpkin-aura" cx="0" cy="7" rx="69" ry="58" fill="url(#loaderFire)"/><ellipse cx="2" cy="53" rx="43" ry="5" fill="#080604" opacity=".38"/><g class="pumpkin-volume" transform="rotate(${variant===0?-4:5} 0 10)"><path d="M-4 -37C-23 -43 -44 -27 -49 -5C-58 20 -39 48 -19 51C-8 57 4 52 12 52C33 55 50 32 51 10C54 -13 35 -38 13 -37C6 -40 2 -36 -4 -37Z" fill="url(#loaderPumpkin)" stroke="#823411" stroke-width=".7"/>
   <path d="M-26 -31C-48 -12 -49 23 -25 47C-42 29 -35 -11 -17 -35Z" fill="#62250c" opacity=".32"/>
   <path d="M28 -30C48 -10 49 27 24 48C39 27 33 -12 20 -35Z" fill="#6c290d" opacity=".42"/>
   <ellipse cx="-15" cy="7" rx="25" ry="44" fill="url(#loaderLobe)"/>
   <ellipse cx="12" cy="8" rx="23" ry="44" fill="url(#loaderLobe)"/>
   <path d="M-5 -36C-22 -10 -21 27 -6 51M16 -34C31 -8 29 28 14 50" fill="none" stroke="#742a0e" stroke-opacity=".48" stroke-width="1.6"/>
   <path d="M-12 -29C-23 -6 -24 17 -15 33M9 -29C17 -11 19 -1 18 8" fill="none" stroke="#ffd597" stroke-opacity=".22" stroke-width="2" stroke-linecap="round"/>
   <ellipse cx="0" cy="-30" rx="20" ry="6" fill="#a44e1f" opacity=".7"/>
   <path d="M-7 -31Q-12 -49 1 -55L11 -51Q-1 -45 3 -32Z" fill="url(#loaderStem)" stroke="#665234" stroke-width=".7"/>
   <path d="M-3 -33Q-7 -47 3 -51" fill="none" stroke="#c3af74" stroke-opacity=".55" stroke-width="1.3"/>
   <g class="pumpkin-face-plane" transform="${projection}"><g class="pumpkin-carving">${cuts}</g><g class="pumpkin-light" fill="#ffda78">${face}</g></g>
  </g></g></g>`;
 };
 const pumpkins=`<svg viewBox="0 0 340 180" aria-hidden="true"><defs><radialGradient id="loaderPumpkin" cx="32%" cy="24%" r="78%"><stop stop-color="#ffc071"/><stop offset=".42" stop-color="#e78030"/><stop offset=".78" stop-color="#a74718"/><stop offset="1" stop-color="#5c250e"/></radialGradient><radialGradient id="loaderLobe" cx="34%" cy="25%" r="80%"><stop stop-color="#ffbd684f"/><stop offset=".55" stop-color="#ed8a3520"/><stop offset="1" stop-color="#56200d70"/></radialGradient><linearGradient id="loaderStem"><stop stop-color="#514328"/><stop offset=".45" stop-color="#998851"/><stop offset="1" stop-color="#65512f"/></linearGradient><linearGradient id="loaderCutRim" x2=".2" y2="1"><stop stop-color="#7b320e"/><stop offset=".6" stop-color="#d87b32"/><stop offset="1" stop-color="#ffd18a"/></linearGradient><radialGradient id="loaderFire"><stop stop-color="#ffb442" stop-opacity=".32"/><stop offset="1" stop-color="#f98322" stop-opacity="0"/></radialGradient></defs><ellipse cx="170" cy="164" rx="123" ry="6" fill="#ed9440" opacity=".09"/>${pumpkin(104,0,0,1.1)}${pumpkin(236,.3,1)}</svg>`;
 const leaf='<svg viewBox="0 0 30 40" fill="currentColor"><path d="M15 1L19 12 28 8 25 20 30 24 19 29 16 39 13 29 2 25 7 20 3 9 12 12Z"/></svg>';
 function set(doc,id){
  const loader=doc.querySelector('.loading-container');if(!loader)return;
  const family=id==='original'?'':(['snow','fireside'].includes(id)?'winter':'halloween');
  if(loader.dataset.seasonLoader===family)return;
  garlandCleanups.get(loader)?.();garlandCleanups.delete(loader);
  loader.querySelector('.seasonal-loader-art')?.remove();
  if(!family){delete loader.dataset.seasonLoader;return;}
  loader.dataset.seasonLoader=family;
  const art=doc.createElement('div');art.className='seasonal-loader-art';art.setAttribute('aria-hidden','true');art.innerHTML=family==='winter'?snowman:pumpkins;
  for(let i=0;i<(family==='winter'?22:12);i++){
   const p=doc.createElement('span');p.className='intro-particle '+(family==='winter'?'flake':'leaf');
   p.style.cssText=`--left:${i*43.7%100}%;--duration:${2.8+i%7*.3}s;--delay:-${i*.31}s;--size:${family==='winter'?6+i%4*2:9+i%4*2}px`;
   p.innerHTML=family==='winter'?'❄':leaf;art.append(p);
  }
  loader.append(art);
  hangSeasonalGarland(doc,loader,family);
 }
 window.PortfolioSeasonalLoader={set};
})();
