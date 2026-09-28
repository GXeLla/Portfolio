/*
 * Portfolio content source.
 *
 * The local admin writes edits back to this file. Keeping content separate from
 * the rendering code means new projects and experience entries can be committed
 * without rebuilding the HTML by hand.
 */
window.PORTFOLIO_CONTENT = {
  version: 2,
  settings: {
    defaultWeather: "storm",
  },
  profile: {
    name: "Giorgi Khelashvili",
    role: "Front End Web Developer",
    intro: [
      "I am a front-end developer learning and building my skills in JavaScript and Angular. Most of my experience comes from self-study, school projects, and personal side-projects, where I’ve practiced creating real applications and experimenting with new ideas.",
      "I am eager to learn and grow, and I believe I can bring value through my curiosity, persistence, and willingness to take on challenges. I’m looking for opportunities to contribute, improve my skills, and grow alongside a supportive team.",
    ],
    experiencePlaceholder: {
      label: "Draft section",
      title: "Experience details are coming soon.",
      body: "I’m currently working on this section. I’ll add my role, responsibilities, tools, and the work I’m most proud of here.",
      note: "Placeholder content — ready for me to update later.",
    },
    opinion:
      "It’s completely normal to feel inspired by someone’s work and want to imitate it — that’s how I’ve honed my skills as well.",
    contactHeading: "Personal Info",
    educationHeading: "Education",
    contact: {
      phone: "+995 544 111 895",
      email: "g.xelashvili2001@gmail.com",
      location: "Tbilisi, Georgia",
      birthDate: "12.05.2001",
      linkedin: "https://www.linkedin.com/in/giorgi-khelashvili-701978248/",
      github: "https://github.com/GXeLla/",
    },
    education: [
      {
        degree: "Computer Science",
        institution: "International Black Sea University",
        period: "2019 – 2020",
        note: "Drop-out after 1 year",
      },
      {
        degree: "Front-End Web Programming",
        institution: "IT Step Academy",
        period: "2025 – 2026",
        note: "",
      },
    ],
    certification: {
      heading: "Certifications",
      label: "View my certificates (PDF)",
      url: "./assets/certificate.pdf",
    },
  },
  experience: [
    {
      id: "codevelop-experience-developer",
      role: "Ad Experience Developer",
      company: "Codevelop.io",
      employmentType: "",
      dates: "Jul 1, 2026 – Present",
      location: "",
      description:
        "Building performance-first, visually engaging advertising experiences with polished motion, strong visual quality, and reliable delivery.",
      responsibilities: [
        "Develop interactive ad experiences with HTML, CSS, and JavaScript.",
        "Optimize visual assets, including videos and images, to support fast, high-quality delivery.",
        "Balance animation, responsive behavior, visual quality, and performance across projects.",
        "Have hands-on experience with Canvas, SVG, Three.js, and Python; these are optional tools selected when they suit a project, including 3D banner work.",
      ],
      technologies: [
        "HTML",
        "CSS",
        "JavaScript",
        "Canvas",
        "SVG",
        "Three.js",
        "Python",
      ],
      current: true,
    },
  ],
  projectSections: [
    {
      id: "html",
      eyebrow: "2022 – 2023",
      title: "Learning start",
    },
    {
      id: "javascript",
      eyebrow: "Oct 12, 2025",
      title: "Started JavaScript journey",
    },
    {
      id: "angular",
      eyebrow: "Jan 6, 2026",
      title: "Started Angular journey",
    },
    {
      id: "react",
      eyebrow: "Mar 6, 2026",
      title: "Started React journey",
    },
    {
      id: "banner",
      eyebrow: "Creative development",
      title: "Banner & ad work",
    },
  ],
  faq: [
    {
      question: "Where can I find your code?",
      answer: "On my GitHub.",
    },
    {
      question: "Can I use your code?",
      answer: "I don‘t really encourage copying, but it’s a public repository. I won’t report anyone for using it.",
    },
    {
      question: "Do you have professional work experience?",
      answer:
        "I’ve been working since I was 18, mostly in general jobs. I haven’t worked in this industry yet, but I’ve always wanted to and have been preparing through self-study and personal projects.",
    },
    {
      question: "How did you learn programming?",
      answer: "By practicing daily, breaking things, fixing them, and constantly challenging myself with harder projects.",
    },
    {
      question: "What’s your next step?",
      answer:
        "I aim to become stronger in front-end development first, then expand into back-end to move toward full-stack development — and continue learning and growing beyond that.",
    },
    {
      question: "Do you work alone or in a team?",
      answer:
        "I’ve worked both alone and in teams. I enjoy collaboration but I’m also comfortable building projects independently.",
    },
    {
      question: "What technologies do you use?",
      answer:
        "Mainly HTML, CSS/SCSS, JavaScript, and modern front-end frameworks. I focus on clean UI and smooth UX.",
    },
  ],
  projects: [
    {
      id: "p1",
      group: "html",
      date: "Aug 9, 2025",
      title: "Navbar animation tabs",
      technologies: ["HTML", "CSS"],
      description: "Simple navbar animation tabs using HTML & CSS.",
      liveUrl: "https://gxella.github.io/example/contact.html",
      repoUrl: "https://github.com/GXeLla/example",
      favorite: false,
    },
    {
      id: "p2",
      group: "html",
      date: "Sep 16, 2025",
      title: "Restaurant Menu",
      technologies: ["HTML", "CSS"],
      description: "Restaurant menu built with HTML & CSS.",
      liveUrl: "https://gxella.github.io/Restaurant-Menu/",
      repoUrl: "https://github.com/GXeLla/Restaurant-Menu",
      favorite: false,
    },
    {
      id: "p3",
      group: "html",
      date: "Sep 18, 2025",
      title: "Wix-style Website (no JS)",
      technologies: ["HTML", "Sass"],
      description: "Website similar to Wix built 100% without JavaScript.",
      liveUrl: "https://gxella.github.io/Wix-Template-James-Consulting/",
      repoUrl: "https://github.com/GXeLla/Wix-Template-James-Consulting",
      favorite: false,
    },
    {
      id: "p4",
      group: "html",
      date: "Sep 30, 2025",
      title: "Profile Example",
      technologies: ["HTML", "CSS"],
      description: "Simple profile example using HTML & CSS.",
      liveUrl: "https://gxella.github.io/portfolio-example_01/",
      repoUrl: "https://github.com/GXeLla/portfolio-example_01",
      favorite: false,
    },
    {
      id: "p5",
      group: "javascript",
      date: "Nov 11, 2025",
      title: "Social Media Dashboard Practice",
      technologies: ["HTML", "CSS", "JavaScript"],
      description: "Dashboard UI practice project.",
      liveUrl: "https://gxella.github.io/Social-media-dashbord-practive/",
      repoUrl: "https://github.com/GXeLla/Social-media-dashbord-practive",
      favorite: false,
    },
    {
      id: "p6",
      group: "javascript",
      date: "Dec 3, 2025",
      title: "Ticket Purchase – Georgian Railway",
      technologies: ["HTML", "CSS", "JavaScript"],
      description: "Full website example for buying tickets online.",
      liveUrl: "https://gxella.github.io/Ticket-purchase---Georgian-Railway/",
      repoUrl: "https://github.com/GXeLla/Ticket-purchase---Georgian-Railway",
      favorite: false,
    },
    {
      id: "p7",
      group: "javascript",
      date: "Dec 28, 2025",
      title: "Christmas Stylings",
      technologies: ["HTML", "CSS", "JavaScript"],
      description: "Christmas theme variations for future use.",
      liveUrl: "https://gxella.github.io/Christmas-stylings/",
      repoUrl: "https://github.com/GXeLla/Christmas-stylings",
      favorite: false,
    },
    {
      id: "p8",
      group: "angular",
      date: "Jan 8, 2026",
      title: "Angular E-shop",
      technologies: ["Angular", "TypeScript", "SCSS"],
      description: "First Angular e-commerce project.",
      liveUrl: "https://serene-maamoul-6e75cf.netlify.app/",
      repoUrl: "",
      favorite: false,
    },
    {
      id: "p9",
      group: "angular",
      date: "Jan 27, 2026",
      title: "Product Shop (Real APIs)",
      technologies: ["Angular", "TypeScript", "SCSS"],
      description: "Product shop using real APIs.",
      liveUrl: "https://product-shop-example01.netlify.app/",
      repoUrl: "https://github.com/GXeLla/ecommerce-app",
      favorite: false,
    },
    {
      id: "p10",
      group: "angular",
      date: "Feb 28, 2026",
      title: "Thai Food Ordering (Angular + APIs)",
      technologies: ["Angular", "TypeScript", "CSS"],
      description:
        "A full Angular project for ordering Thai food online. Uses real APIs for products, cart, and checkout functionality.",
      liveUrl: "https://dynamic-dolphin-91bcea.netlify.app",
      repoUrl: "https://github.com/GXeLla/food-ordering-app",
      favorite: false,
    },
    {
      id: "p12",
      group: "angular",
      date: "Mar 16, 2026",
      title: "Idle Game Loading Screens (Angular)",
      technologies: ["Angular", "TypeScript", "SCSS"],
      description:
        "This is an idle game built with Angular, designed to showcase game mechanics, world progression, and UI interactions in a web app environment. Unlike a traditional clicker, this game runs in the background, giving players resources and progress even while they’re idle.",
      liveUrl: "https://idle-loader.netlify.app/",
      repoUrl: "https://github.com/GXeLla/Idle-Loader",
      favorite: false,
    },
    {
      id: "p11",
      group: "react",
      date: "Mar 8, 2026",
      title: "Text Comparison App (React)",
      technologies: ["React", "JavaScript", "CSS"],
      description:
        "A text comparison tool that lets you compare two blocks of text side by side, highlighting added and deleted words.",
      liveUrl: "https://gxella.github.io/Text-comparison/",
      repoUrl: "https://github.com/GXeLla/Text-comparison",
      favorite: false,
    },
    {
      id: "p13",
      group: "banner",
      date: "Aug 10, 2026",
      title: "Motion Shelf — Visual CSS Animation Library",
      technologies: ["HTML", "Sass", "JavaScript"],
      description:
        "My favourite current project: a visual CSS animation library for creating, previewing, organizing, copying, and exporting reusable animations.",
      liveUrl: "https://gxella.github.io/motion-shelf/",
      repoUrl: "https://github.com/GXeLla/motion-shelf",
      favorite: true,
    },
  ],
};
