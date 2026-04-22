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
}, 7500);
// });
// edit this to 7500ms when everything is done

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

// main outside border rain

const rainContainer = document.querySelector(".weather");

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
  setTimeout(
    () => {
      const splat = document.createElement("div");
      splat.className = "splat";
      splat.style.left = dropLeft + "px"; // Position splat at the center of the drop
      splat.style.bottom = "0"; // Align it to the bottom
      rainContainer.appendChild(splat);

      // Remove the splat after animation is done
      splat.addEventListener("animationend", () => {
        splat.remove();
      });
    },
    fallDuration * 1000 * 0.9,
  ); // Add splat at 90% of fall time

  // Remove drop after it falls
  drop.addEventListener("animationend", () => {
    drop.remove(); // Remove drop after it falls
  });
}

// 🌥 clouds
function createCloud() {
  const weather = document.querySelector(".weather");

  const cloud = document.createElement("div");
  cloud.classList.add("cloud-item");

  //size
  const scale = Math.random() * 1.2 + 0.8;

  const baseWidth = Math.random() * 140 + 120;
  const baseHeight = baseWidth * 0.45;

  cloud.style.width = baseWidth + "px";
  cloud.style.height = baseHeight + "px";

  // spawn position
  const x = Math.random() * 90 + 5; // 5–95vw
  const y = Math.random() * 75 + 1; // 1–76vh

  cloud.style.left = x + "vw";
  cloud.style.top = y + "vh";

  //parralax system
  const depth = Math.random(); // 0 = far, 1 = near

  cloud.style.opacity = depth * 0.5 + 0.35;
  cloud.style.filter = `blur(${depth * 2}px)`;

  // start invisible → fade in
  cloud.style.opacity = 0;
  weather.appendChild(cloud);

  requestAnimationFrame(() => {
    cloud.style.transition = "opacity 2.5s ease";
    cloud.style.opacity = depth * 0.5 + 0.4;
  });

  //cloud shape
  const puffs = 4 + Math.floor(Math.random() * 3);

  for (let i = 0; i < puffs; i++) {
    const puff = document.createElement("span");

    const size = Math.random() * 70 + 40;

    puff.style.position = "absolute";
    puff.style.width = size + "px";
    puff.style.height = size + "px";
    puff.style.background = "white";
    puff.style.borderRadius = "50%";

    puff.style.left = Math.random() * 120 + "px";
    puff.style.top = Math.random() * 50 + "px";

    puff.style.opacity = 0.9;

    cloud.appendChild(puff);
  }

  const direction = Math.random() > 0.5 ? 1 : -1;

  // far clouds = slower, near clouds = slightly faster
  const duration =
    depth < 0.5
      ? Math.random() * 55 + 40 // far (slow)
      : Math.random() * 45 + 35; // near (faster )

  const distance = Math.random() * 120 + 80;

  cloud.animate(
    [
      { transform: `translateX(0px) scale(${scale})` },
      { transform: `translateX(${direction * distance}vw) scale(${scale})` },
    ],
    {
      duration: duration * 1000,
      iterations: 1,
      easing: "linear",
      fill: "forwards",
    },
  );

  //fadeout
  setTimeout(
    () => {
      cloud.style.transition = "opacity 3s ease";
      cloud.style.opacity = "0";

      setTimeout(() => {
        cloud.remove();
      }, 3000);
    },
    (duration - 3) * 1000,
  );
}

const links = document.querySelectorAll(".link");
const messages = document.querySelectorAll(".message");
let currentIndex = 0;

links.forEach((link, index) => {
  link.addEventListener("click", () => {
    if (index === currentIndex) return;

    // fade out current
    messages[currentIndex].classList.remove("fade-in");

    setTimeout(() => {
      messages[currentIndex].classList.remove("active");

      // show new
      messages[index].classList.add("active");

      requestAnimationFrame(() => {
        messages[index].classList.add("fade-in");
      });

      currentIndex = index;
    }, 500); // match CSS transition
  });
});

// show first message initially
messages[0].classList.add("fade-in");

const data = {
  p1: {
    title: "Navbar animation tabs",
    desc: "Simple navbar animation tabs using HTML & CSS.",
    links: ["https://gxella.github.io/example/contact.html"],
  },
  p2: {
    title: "Restaurant Menu",
    desc: "Restaurant menu built with HTML & CSS.",
    links: ["https://gxella.github.io/Restaurant-Menu/"],
  },
  p3: {
    title: "Wix-style Website",
    desc: "Website similar to Wix built 100% without JavaScript.",
    links: ["https://gxella.github.io/Wix-Template-James-Consulting/"],
  },
  p4: {
    title: "Profile Example",
    desc: "Simple profile example using HTML & CSS.",
    links: ["https://gxella.github.io/portfolio-example_01/"],
  },
  p5: {
    title: "Social Media Dashboard",
    desc: "Dashboard UI practice project.",
    links: ["https://gxella.github.io/Social-media-dashbord-practive/"],
  },
  p6: {
    title: "Ticket Purchase – Georgian Railway",
    desc: "Full website example for buying tickets online.",
    links: ["https://gxella.github.io/Ticket-purchase---Georgian-Railway/"],
  },
  p7: {
    title: "Christmas Stylings",
    desc: "Christmas theme variations for future use.",
    links: ["https://gxella.github.io/Christmas-stylings/"],
  },
  p8: {
    title: "Angular E-shop",
    desc: "First Angular e-commerce project.",
    links: ["https://serene-maamoul-6e75cf.netlify.app/"],
  },
  p9: {
    title: "Product Shop (Real APIs)",
    desc: "Product shop using real APIs.",
    links: ["https://product-shop-example01.netlify.app/"],
  },
  p10: {
    title: "Thai Food Ordering (Angular + APIs)",
    desc: "A full Angular project for ordering Thai food online. Uses real APIs for products, cart, and checkout functionality.",
    links: ["https://dynamic-dolphin-91bcea.netlify.app"],
  },
  p11: {
    title: "Text Comparison App (React)",
    desc: `Text Compare Tool
A text comparison tool that lets you compare two blocks of text side by side, highlighting added and deleted words.`,
    links: ["https://gxella.github.io/Text-comparison/"],
  },
  p12: {
    title: "Idle Game Loading Screens (Angular)",
    desc: `This is an idle game built with Angular, designed to showcase game mechanics, world progression, and UI interactions in a web app environment. Unlike a traditional clicker, this game runs in the background, giving players resources and progress even while they’re idle.`,
    links: ["https://idle-loader.netlify.app/"],
  },
};

const modal = document.getElementById("modal");
const titleEl = document.getElementById("modal-title");
const descEl = document.getElementById("modal-desc");
const linksEl = document.getElementById("modal-links");
const overlay = document.querySelector(".video-overlay");

document.querySelectorAll(".timeline-item[data-modal]").forEach((item) => {
  item.addEventListener("click", () => {
    const key = item.dataset.modal;
    titleEl.textContent = data[key].title;
    descEl.textContent = data[key].desc;

    linksEl.innerHTML = "";
    data[key].links.forEach((link) => {
      const a = document.createElement("a");
      a.href = link;
      a.target = "_blank";
      a.textContent = "Visit project";
      linksEl.appendChild(a);
    });

    modal.classList.add("active");
  });
});

document.querySelector(".close-btn").onclick = () => modal.classList.remove("active");
modal.onclick = (e) => {
  if (e.target === modal) modal.classList.remove("active");
};

// moon - sun toggle
const moon = document.querySelector(".moon");
const sun = document.querySelector(".sun");
const bgVideo = document.getElementById("bg_main");

let isDay = false;
let cloudRainInterval;
let borderRainInterval;
let cloudInterval;

function startRain() {
  cloudRainInterval = setInterval(rain, 20);
  borderRainInterval = setInterval(createDrop, 25);
}

function stopRain() {
  clearInterval(cloudRainInterval);
  clearInterval(borderRainInterval);
}

function showClouds() {
  function spawn() {
    createCloud();

    cloudInterval = setTimeout(spawn, Math.random() * 400 + 500);
  }

  spawn();
}

function hideClouds() {
  clearInterval(cloudInterval);

  document.querySelectorAll(".cloud-item").forEach((c) => c.remove());
}

function playVideo() {
  bgVideo.play();
}

function stopVideo() {
  bgVideo.pause();
}

moon.addEventListener("click", toggle);
sun.addEventListener("click", toggle);

function toggle() {
  isDay ? goNight() : goDay();
}

//// DAY/NIGHT TOGGLE
function goDay() {
  sun.classList.remove("go-down");
  moon.classList.remove("go-up");

  void sun.offsetWidth;
  void moon.offsetWidth;

  sun.classList.add("go-up");
  moon.classList.add("go-down");

  stopRain();
  showClouds();
  stopVideo();

  overlay.style.background = "rgb(162 175 200 / 0.85)";

  isDay = true;
}

function goNight() {
  sun.classList.remove("go-up");
  moon.classList.remove("go-down");

  void sun.offsetWidth;
  void moon.offsetWidth;

  sun.classList.add("go-down");
  moon.classList.add("go-up");

  startRain();
  hideClouds();
  playVideo();

  overlay.style.background = "rgba(20, 20, 20, 0.79)";

  isDay = false;
}

startRain();
