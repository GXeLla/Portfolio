(() => {
 const frame=document.querySelector('.border');
 const shell=document.querySelector('.moon')?.parentElement;
 if(!frame||!shell)return;
 shell.classList.add('weather-shell');
 // No geometric cutouts: scenery remains visible through the glass.
 // The higher interactive panel blocks clicks on covered moon/sun parts.
})();
