/* Only the original cloud's visual slot changes. The original intro owns timing. */
(() => {
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
 }
 window.PortfolioSeasonalLoader={set};
})();
