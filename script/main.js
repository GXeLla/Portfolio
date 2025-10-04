// loading bar gets hidden after X comes up 
setTimeout(function(){
    let preloaditms = document.querySelector('.progress-bar-main-container')
    preloaditms.classList.add('hidden');
},18500);

setTimeout(function() {
    let preloader = document.querySelector('.loading-container');
    preloader.classList.add('hidden');

    
    // after fade animation set display none
    setTimeout(function() {
        preloader.style.display = 'none';
    }, 1000); 
}, 22000);
