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
    links: ["https://gxella.github.io/example/contact.html"]
  },
  p2: {
    title: "Restaurant Menu",
    desc: "Restaurant menu built with HTML & CSS.",
    links: ["https://gxella.github.io/Restaurant-Menu/"]
  },
  p3: {
    title: "Wix-style Website",
    desc: "Website similar to Wix built 100% without JavaScript.",
    links: ["https://gxella.github.io/Wix-Template-James-Consulting/"]
  },
  p4: {
    title: "Profile Example",
    desc: "Simple profile example using HTML & CSS.",
    links: ["https://gxella.github.io/portfolio-example_01/"]
  },
  p5: {
    title: "Social Media Dashboard",
    desc: "Dashboard UI practice project.",
    links: ["https://gxella.github.io/Social-media-dashbord-practive/"]
  },
  p6: {
    title: "Ticket Purchase – Georgian Railway",
    desc: "Full website example for buying tickets online.",
    links: ["https://gxella.github.io/Ticket-purchase---Georgian-Railway/"]
  },
  p7: {
    title: "Christmas Stylings",
    desc: "Christmas theme variations for future use.",
    links: ["https://gxella.github.io/Christmas-stylings/"]
  },
  p8: {
    title: "Angular E-shop",
    desc: "First Angular e-commerce project.",
    links: ["https://serene-maamoul-6e75cf.netlify.app/"]
  },
  p9: {
    title: "Product Shop (Real APIs)",
    desc: "Product shop using real APIs.",
    links: ["https://product-shop-example01.netlify.app/welcome"]
  }
};

const modal = document.getElementById("modal");
const titleEl = document.getElementById("modal-title");
const descEl = document.getElementById("modal-desc");
const linksEl = document.getElementById("modal-links");

document.querySelectorAll(".timeline-item[data-modal]").forEach(item => {
  item.addEventListener("click", () => {
    const key = item.dataset.modal;
    titleEl.textContent = data[key].title;
    descEl.textContent = data[key].desc;

    linksEl.innerHTML = "";
    data[key].links.forEach(link => {
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
modal.onclick = e => { if (e.target === modal) modal.classList.remove("active"); };
