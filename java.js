document.addEventListener("DOMContentLoaded", () => {

  // ===================================
  // PAGE LOAD ANIMATION
  // ===================================
  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
  });

  // ===================================
  // SCROLL PROGRESS BAR
  // ===================================
  const scrollProgress = document.querySelector('.scroll-progress');
  
  if (scrollProgress) {
    window.addEventListener('scroll', () => {
      const winScroll = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (winScroll / height) * 100;
      scrollProgress.style.width = scrolled + '%';
    });
  }

  // ===================================
  // JOURNEY TIMELINE REVEAL
  // ===================================
  const journeyItems = document.querySelectorAll(".timeline-item");

  if (journeyItems.length) {
    const journeyObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    }, { threshold: 0.2 });

    journeyItems.forEach(item => {
      item.style.opacity = "0";
      item.style.transform = "translateY(8px)";
      item.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      journeyObserver.observe(item);
    });
  }

  // ===================================
  // PRINCIPLES REVEAL
  // ===================================
  const principles = document.querySelectorAll(".principle");

  if (principles.length) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = 1;
          e.target.style.transform = "translateY(0)";
        }
      });
    }, { threshold: 0.2 });

    principles.forEach(p => {
      p.style.opacity = 0;
      p.style.transform = "translateY(6px)";
      p.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      obs.observe(p);
    });
  }

  // ===================================
  // MINDSET CARDS REVEAL
  // ===================================
  const mindsetCards = document.querySelectorAll(".mindset-card");

  if (mindsetCards.length) {
    const mindsetObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, { threshold: 0.2 });

    mindsetCards.forEach(card => mindsetObserver.observe(card));
  }

  // ===================================
  // SKILLS LADDER
  // ===================================
  const steps = document.querySelectorAll(".step");
  const images = document.querySelectorAll(".bg-img");
  const baseImage = document.querySelector(".bg-img.base");

  if (steps.length && images.length) {
    // Reveal animation with staggered timing
    const observer = new IntersectionObserver(entries => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add("visible");
          }, index * 100);
        } else {
          entry.target.classList.remove("visible");
        }
      });
    }, {
      threshold: 0.25
    });

    steps.forEach(step => observer.observe(step));

    // Background switching
    function activateImage(key) {
      if (baseImage) baseImage.classList.remove("active");
      
      images.forEach(img => {
        if (img.dataset.key === key) {
          img.classList.add("active");
        } else if (!img.classList.contains("base")) {
          img.classList.remove("active");
        }
      });
    }

    function resetToBase() {
      images.forEach(img => {
        if (!img.classList.contains("base")) {
          img.classList.remove("active");
        }
      });
      if (baseImage) baseImage.classList.add("active");
    }

    steps.forEach(step => {
      step.addEventListener("mouseenter", () => {
        activateImage(step.dataset.image);
      });
      step.addEventListener("mouseleave", () => {
    resetToBase();
  });
    });

    const ladderCard = document.querySelector(".ladder-card");
    if (ladderCard) {
      ladderCard.addEventListener("mouseleave", () => {
        resetToBase();
      });
    }
  }

  // ===================================
  // ARTICLES CAROUSEL
  // ===================================
  const ARTICLES = [
    { 
      title: "A strong mind does not ask for pity.", 
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=750&fit=crop",
      link: "articles/article-draft.html"
    },
    { 
      title: "Motivation fades. Systems stay.", 
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=750&fit=crop", 
      link: "articles/article-2.html"
    },
    { 
      title: "Long-term thinking is a competitive advantage.", 
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=750&fit=crop&sat=-100", 
      link: "articles/article-draft.html"
    },
    { 
      title: "Discipline is quieter than motivation.", 
      image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&h=750&fit=crop", 
      link: "articles/article-draft.html"
    },
    { 
      title: "Your mindset shapes your reality.", 
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=750&fit=crop", 
      link: "articles/article-draft.html"
    },
    { 
      title: "Growth happens outside comfort zones.", 
       image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=750&fit=crop&hue=180", 
      link: "articles/article-draft.html"
    }
  ];

  const GAP = 320;
  const MAX_ROT = 22;
  const MAX_Z = 280;
  const MIN_SCALE = 0.58;
  const SCALE_BOOST = 0.42;
  const FRICTION = 0.88;
  const SNAP_THRESHOLD = 1.8;
  const SNAP_STRENGTH = 0.16;

  const cardsRoot = document.getElementById("cards");
  
  if (!cardsRoot) {
    console.error("Cards container not found!");
    return;
  }

  let items = [];
  let scrollX = 0;
  let velocity = 0;
  let activeIndex = 0;
  let rafId = null;

  const mod = (n, m) => ((n % m) + m) % m;

  // Create cards
  ARTICLES.forEach((a, i) => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div class="card-inner">
        <img src="${a.image}" alt="${a.title}" draggable="false" loading="lazy">
        <div class="card__text">${a.title}</div>
        <div class="read-more">Read More</div>
      </div>
    `;
    
    card.addEventListener("click", () => {
      if (i === activeIndex) {
        // Store state before navigation
        sessionStorage.setItem("homeScrollY", window.scrollY);
        sessionStorage.setItem("carouselScrollX", scrollX);
        sessionStorage.setItem("lastActiveCard", i);

        // Navigate (only if link is not #)
        if (a.link !== "#") {
          window.location.href = a.link;
        } else {
          console.log("Article link coming soon!");
        }
      } else {
        // Navigate to clicked card
        const targetIndex = i;
        const diff = targetIndex - activeIndex;
        const len = items.length;
        
        let shortestDiff = diff;
        if (Math.abs(diff + len) < Math.abs(shortestDiff)) shortestDiff = diff + len;
        if (Math.abs(diff - len) < Math.abs(shortestDiff)) shortestDiff = diff - len;
        
        velocity = shortestDiff * GAP * 0.18;
      }
    });
    
    cardsRoot.appendChild(card);
    items.push({ el: card, targetX: i * GAP });
  });

  console.log(`✅ Created ${items.length} cards`);

  // Check if returning from an article
  const savedIndex = sessionStorage.getItem("lastActiveCard");
  const savedScrollX = sessionStorage.getItem("carouselScrollX");
  const savedScrollY = sessionStorage.getItem("homeScrollY");

  if (savedIndex !== null) {
    activeIndex = parseInt(savedIndex, 10);

    if (!Number.isNaN(savedScrollX)) {
      scrollX = parseFloat(savedScrollX);
    } else {
      scrollX = items[activeIndex].targetX;
    }

    // Restore page scroll after layout
    requestAnimationFrame(() => {
      window.scrollTo(0, parseInt(savedScrollY || 0, 10));
    });

    items.forEach((item, i) => {
      item.el.classList.toggle("active", i === activeIndex);
    });

    // Cleanup
    sessionStorage.removeItem("lastActiveCard");
    sessionStorage.removeItem("carouselScrollX");
    sessionStorage.removeItem("homeScrollY");
  }

  function update() {
    const track = items.length * GAP;
    const half = track / 2;
    const visibilityThreshold = 570;

    let closest = Infinity;
    let closestIndex = 0;

    items.forEach((item, i) => {
      let offsetX = item.targetX - scrollX;
      
      while (offsetX < -half) offsetX += track;
      while (offsetX > half) offsetX -= track;

      const absOffset = Math.abs(offsetX);
      const depth = Math.max(0, 1 - Math.pow(absOffset / visibilityThreshold, 0.9));

      const scale = MIN_SCALE + (depth * SCALE_BOOST);
      const z = depth * MAX_Z;

      const rotationFactor = offsetX / visibilityThreshold;
      const rot = rotationFactor * MAX_ROT;

      let opacity = 0.32 + (depth * 0.68);
      
      if (absOffset > visibilityThreshold * 1.08) {
        opacity = 0;
      }

      // Store transform values for hover state
      item.el.style.setProperty('--x', `${offsetX}px`);
      item.el.style.setProperty('--z', `${z}px`);
      item.el.style.setProperty('--rot', `${rot}deg`);
      item.el.style.setProperty('--scale', scale);

      item.el.style.transform = 
        `translate3d(${offsetX}px, -50%, ${z}px) rotateY(${rot}deg) scale(${scale})`;
      
      item.el.style.zIndex = Math.round(1000 + z);
      item.el.style.opacity = opacity;
      item.el.style.pointerEvents = opacity < 0.15 ? 'none' : 'auto';

      if (absOffset < closest) {
        closest = absOffset;
        closestIndex = i;
      }
    });

    if (activeIndex !== closestIndex) {
      activeIndex = closestIndex;
      items.forEach((item, i) => {
        item.el.classList.toggle("active", i === activeIndex);
      });
    }
  }

  function tick() {
    scrollX += velocity;
    velocity *= FRICTION;

    const track = items.length * GAP;
    scrollX = mod(scrollX, track);

    const targetX = items[activeIndex].targetX;
    let delta = targetX - scrollX;

    if (delta > track / 2) delta -= track;
    if (delta < -track / 2) delta += track;

    if (Math.abs(velocity) < SNAP_THRESHOLD) {
      scrollX += delta * SNAP_STRENGTH;
      
      if (Math.abs(delta) < 0.4 && Math.abs(velocity) < 0.08) {
        scrollX = targetX;
        velocity = 0;
      }
    } else {
      scrollX += delta * 0.045;
    }

    update();
    rafId = requestAnimationFrame(tick);
  }

  // Button controls
  const leftBtn = document.querySelector(".carousel-btn.left");
  const rightBtn = document.querySelector(".carousel-btn.right");
  
  if (leftBtn) {
    leftBtn.addEventListener("click", () => {
      velocity -= GAP * 0.18;
    });
  }
  
  if (rightBtn) {
    rightBtn.addEventListener("click", () => {
      velocity += GAP * 0.18;
    });
  }

  // Keyboard controls
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      velocity -= GAP * 0.18;
      e.preventDefault();
    } else if (e.key === "ArrowRight") {
      velocity += GAP * 0.18;
      e.preventDefault();
    }
  });

  // Initialize
  update();

  // Force active class on initial load
  items.forEach((item, i) => {
    item.el.classList.toggle("active", i === activeIndex);
  });

  tick();

  // Cleanup
  window.addEventListener("beforeunload", () => {
    if (rafId) cancelAnimationFrame(rafId);
  });

});