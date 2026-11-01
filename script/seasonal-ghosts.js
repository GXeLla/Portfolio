/* Original SVG versions of the selected ghost concepts: 01, 05 and 08. */
(() => {
 const number=/-?\d*\.?\d+/g;
 const pathValues=new Map();
 const values=path=>{if(!pathValues.has(path))pathValues.set(path,path.match(number).map(Number));return pathValues.get(path)};
 const shapes={
  '01':{
   calm:'M60 14 C82 14 94 34 94 58 C94 84 99 103 107 116 C114 134 91 139 83 128 C75 116 72 143 59 141 C48 141 44 118 34 129 C21 145 6 133 13 116 C23 99 26 81 26 58 C26 33 38 14 60 14 Z',
   boo:'M60 8 C86 8 99 31 98 58 C96 85 105 100 111 116 C116 139 92 143 83 126 C75 111 75 149 59 145 C43 146 43 111 33 126 C20 146 2 135 10 116 C20 98 22 82 22 58 C21 31 34 8 60 8 Z',
   eyes:[[46,58,6.5,9],[75,64,5,7]],
   smile:'M49 81 C55 87 65 89 73 80 C71 96 52 99 49 81 Z',
   gasp:'M53 80 C53 66 69 66 69 80 C71 103 51 103 53 80 Z'
  },
  '05':{
   calm:'M60 15 C83 15 91 35 91 57 C92 68 102 63 109 55 C120 51 120 66 112 77 C101 91 98 107 104 122 C112 141 90 141 82 130 C73 119 73 142 59 141 C46 141 44 119 34 130 C23 143 7 133 14 119 C22 105 20 87 9 75 C-1 63 1 51 11 55 C19 63 28 69 29 57 C29 36 36 15 60 15 Z',
   boo:'M60 8 C86 8 94 30 92 54 C94 59 101 41 108 36 C118 31 124 45 115 61 C100 82 98 105 106 121 C115 144 91 145 82 126 C73 111 76 148 59 145 C42 146 44 112 33 127 C20 147 3 135 12 118 C21 101 18 81 5 60 C-4 44 3 31 13 37 C21 42 27 60 28 54 C26 30 34 8 60 8 Z',
   eyes:[[44,62,7.5,9],[76,62,7.5,9]],
   smile:'M55 85 C55 75 65 75 65 85 C65 99 55 99 55 85 Z',
   gasp:'M51 82 C51 65 69 65 69 82 C72 111 48 111 51 82 Z'
  },
  '08':{
   calm:'M44 23 C58 18 73 5 86 15 C95 22 97 37 105 42 C110 49 91 45 86 38 C89 65 98 94 107 120 C111 132 91 121 88 128 C83 141 78 145 69 135 C60 126 54 149 43 139 C36 129 31 127 24 131 C8 143 13 124 18 111 C26 83 24 51 31 35 C34 28 38 25 44 23 Z',
   boo:'M42 17 C59 10 75 1 89 10 C99 18 100 29 110 34 C116 44 94 41 89 32 C92 63 104 95 112 121 C117 136 92 119 88 128 C82 147 77 151 67 133 C59 120 55 155 41 143 C34 126 29 124 22 131 C2 148 9 122 14 109 C22 80 20 46 28 31 C32 23 36 20 42 17 Z',
   eyes:[[44,63,6.5,10],[75,63,6.5,10]],
   smile:'M46 86 C54 84 69 79 77 83 C77 99 60 105 46 86 Z',
   gasp:'M52 82 C52 66 70 66 70 82 C74 108 48 110 52 82 Z'
  }
 };
 const smooth=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t)};
 function morph(calm,boo,amount,time,cloth=false){
  const source=values(calm),target=values(boo);let i=0,pointX=0;
  return calm.replace(number,value=>{
   const n=Number(value)*(1-amount)+target[i]*amount;
   let wave=0;
   if(cloth){
    if(i%2===0){pointX=n;const y=source[i+1];wave=Math.sin(time*2.1+y*.045)*Math.max(0,(y-28)/112)*(2.8+amount*2);}
    else wave=Math.sin(time*2.3+pointX*.065)*Math.max(0,(n-85)/60)*2;
   }
   i++;return(n+wave).toFixed(2);
  });
 }

 let instance=0;
 function create(doc){
  const view=doc.defaultView,layer=doc.createElement('div');
  layer.className='season-ghost-layer';layer.setAttribute('aria-hidden','true');doc.body.append(layer);
  const corners=[[.12,.22],[.88,.24],[.14,.76],[.86,.79]];
  const visitors=['01','05','08'].map((variant,i)=>{
   const e=doc.createElement('div');e.className='season-ghost';e.hidden=true;e.dataset.ghostVariant=variant;layer.append(e);
   return{e,variant,index:i,next:1+i*4,visit:0,active:null};
  });
  function arrive(v,time){
   const spec=shapes[v.variant],gradient=`season-ghost-shade-${++instance}`;
   v.e.hidden=false;
   v.e.innerHTML=`<svg viewBox="-5 -5 130 165" aria-hidden="true"><defs><linearGradient id="${gradient}" x1="0%" y1="20%" x2="100%" y2="80%"><stop stop-color="#bac8cf" stop-opacity=".65"/><stop offset=".5" stop-color="#d1dce0" stop-opacity=".9"/><stop offset="1" stop-color="#94a9b5" stop-opacity=".5"/></linearGradient></defs><path class="season-ghost-body" fill="url(#${gradient})" d="${spec.calm}"/><path class="season-ghost-fold light"/><path class="season-ghost-fold dark"/><g class="season-ghost-face">${spec.eyes.map(([cx,cy,rx,ry])=>`<ellipse class="season-ghost-eye" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/>`).join('')}<path class="season-ghost-mouth" d="${spec.smile}"/></g></svg>`;
   const corner=(v.index+v.visit++)%corners.length;v.e.dataset.corner=String(corner);
   v.active={start:time,life:24+v.index*3,spec,corner,phase:v.index*2.1,body:v.e.querySelector('.season-ghost-body'),face:v.e.querySelector('.season-ghost-face'),mouth:v.e.querySelector('.season-ghost-mouth'),eyes:[...v.e.querySelectorAll('.season-ghost-eye')],folds:[...v.e.querySelectorAll('.season-ghost-fold')]};
  }
  function tick(time,px=0,py=0,scroll=0){
   for(const v of visitors){
    if(!v.active){if(time<v.next)continue;arrive(v,time);}
    const a=v.active,age=time-a.start;
    if(age>=a.life){v.e.hidden=true;v.active=null;v.next=time+8+Math.random()*10;continue;}
    const w=view.innerWidth,h=view.innerHeight,small=w<=768||h<=500,size=(small?38:52)+v.index*3;
    const fade=smooth(0,2.5,age)*(1-smooth(a.life-6,a.life,age));
    const scare=.65*smooth(7,10,age)*(1-smooth(13,17,age));
    const [cx,cy]=corners[a.corner],depth=9+v.index*3;
    const gx=Math.max(4,Math.min(w-size-4,w*cx-size/2+Math.sin(age*.17+a.phase)*4-px*depth));
    const gy=Math.max(8,Math.min(h-size*1.27-8,h*cy+Math.sin(age*.23+a.phase)*4-py*depth*.65-Math.min(scroll*.008,5)));
    v.e.style.cssText=`--ghost-size:${size}px;opacity:${doc.body.classList.contains('modal-open')?0:fade*(.52-v.index*.035)};transform:translate3d(${gx.toFixed(2)}px,${gy.toFixed(2)}px,0) rotate(${(Math.sin(age*.2+a.phase)*2).toFixed(2)}deg)`;
    v.e.dataset.expression=scare>.45?'boo':'calm';
    a.body.setAttribute('d',morph(a.spec.calm,a.spec.boo,scare,age*.55+a.phase,true));
    a.face.setAttribute('transform',`translate(0 ${(Math.sin(age*.7)*.6).toFixed(2)})`);
    a.mouth.setAttribute('d',morph(a.spec.smile,a.spec.gasp,scare,age));
    a.eyes.forEach((eye,i)=>{const [,,rx,ry]=a.spec.eyes[i];eye.setAttribute('rx',(rx+scare*1.8).toFixed(2));eye.setAttribute('ry',(ry+scare*3).toFixed(2));});
    const ripple=Math.sin(age*.9+a.phase)*2;
    a.folds[0].setAttribute('d',`M33 88Q${29+ripple} 111 ${28+ripple} 119`);a.folds[1].setAttribute('d',`M87 85Q${90+ripple} 110 ${94+ripple} 119`);
   }
  }
  return{tick,hide(time){visitors.forEach((v,i)=>{v.active=null;v.e.hidden=true;v.next=time+6+i*5;});},dispose(){layer.remove();visitors.forEach(v=>v.active=null);}};
 }
 window.PortfolioSeasonalGhosts={create};
})();
