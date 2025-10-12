// loading bar gets hidden after X comes up
setTimeout(function () {
  let preloaditms = document.querySelector(".progress-bar-main-container");
  preloaditms.classList.add("hidden");
}, 8500);

setTimeout(function () {
  let preloader = document.querySelector(".loading-container");
  preloader.classList.add("hidden");

  // after fade animation set display none
  setTimeout(function () {
    preloader.style.display = "none";
  }, 1000);
}, 11000);
// });
// edit this with bottom!!!

//cloud raindrops
function rain() {
  let cloud = document.querySelector(".cloud");
  let e = document.createElement("div");
  let left = Math.floor(Math.random() * 235) + 45;
  let width = Math.random() * 5;
  let height = Math.random() * 50;
  let duration = Math.floor(Math.random() * 6) + 1;

  e.classList.add("drop");
  cloud.appendChild(e);
  e.style.left = left + "px";
  e.style.width = 0.3 + width + "px";
  e.style.height = 0.5 + height + "px";
  e.style.animationDuration = duration + "s";

  setTimeout(function () {
    cloud.removeChild(e);
  }, 2000);
}
setInterval(function () {
  rain();
}, 20);
