// loading bar,cloud gets hidden before X comes up
setTimeout(function () {
  let preloaditms = document.querySelector(".progress-bar-main-container");
  let cloud = document.querySelector(".cloud");
  preloaditms.classList.add("hidden");
  cloud.classList.add("hidden");
}, 5800);

setTimeout(function () {
  let preloader = document.querySelector(".loading-container");
  preloader.classList.add("hidden");

  // after fade animation set display none
  setTimeout(function () {
    preloader.style.display = "none";
  }, 1000);
}, 10);
// });
// edit this to 8000ms when everything is done

//cloud raindrops
function rain() {
  //creating rain properties
  let cloud = document.querySelector(".cloud");
  let e = document.createElement("div");
  let left = Math.floor(Math.random() * 235) + 45;
  let width = Math.random() * 5;
  let height = Math.random() * 50;
  let duration = Math.floor(Math.random() * 6) + 1;

  //styling
  e.classList.add("drop");
  cloud.appendChild(e);
  e.style.left = left + "px";
  e.style.width = 0.3 + width + "px";
  e.style.height = 0.5 + height + "px";
  e.style.animationDuration = duration + "s";

  // removes each drop after 2 s
  setTimeout(function () {
    cloud.removeChild(e);
  }, 2000);
}

//creates every 20ms each drop
let intervalId = setInterval(function () {
  rain();
}, 20);

//timeout after 9s it stops creating divs
setTimeout(function () {
  clearInterval(intervalId);
}, 9000);

// main ourside border rain

const rainContainer = document.querySelector(".rain");

function createDrop() {
  const drop = document.createElement("div");
  drop.className = "drop";

  // Set random height between 10px and 30px
  const height = Math.random() * (30 - 10) + 10;
  drop.style.height = height + "px";

  // Set random horizontal position
  drop.style.left = Math.random() * 100 + "vw";

  // Set random fall duration
  const fallDuration = Math.random() * (1.5 - 0.5) + 0.5; // Between 0.5s and 1.5s
  drop.style.animationDuration = fallDuration + "s";

  // Append drop to container
  rainContainer.appendChild(drop);

  // Calculate drop's actual position for the splat
  const dropPosition = drop.getBoundingClientRect(); // Get the position of the drop
  const dropLeft = dropPosition.left + dropPosition.width / 2 - 7.5; // Center the splat

  // Add the splat class when drop reaches near the bottom
  setTimeout(() => {
    const splat = document.createElement("div");
    splat.className = "splat";
    splat.style.left = dropLeft + "px"; // Position splat at the center of the drop
    splat.style.bottom = "0"; // Align it to the bottom
    rainContainer.appendChild(splat);

    // Remove the splat after animation is done
    splat.addEventListener("animationend", () => {
      splat.remove();
    });
  }, fallDuration * 1000 * 0.9); // Add splat at 90% of fall time

  // Remove drop after it falls
  drop.addEventListener("animationend", () => {
    drop.remove(); // Remove drop after it falls
  });
}

setInterval(createDrop, 25); // Create a new drop every 100ms
