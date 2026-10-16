/* =====================================
   PORTFOLIO JAVASCRIPT — SIDRA QURBAN
   ===================================== */

(function () {
  'use strict';

  /* ---- LUCIDE ICONS INIT ---- */
  if (typeof lucide !== 'undefined') lucide.createIcons();

  /* ---- CUSTOM CURSOR ---- */
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
  document.addEventListener('mouseup', () => cursor.classList.remove('clicking'));

  // Hover effects for interactive elements
  const interactives = document.querySelectorAll('a, button, .project-card, .filter-btn, .contact-item, .tag, .skill-category');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => follower.classList.add('hovering'));
    el.addEventListener('mouseleave', () => follower.classList.remove('hovering'));
  });

  /* ---- HERO CANVAS PARTICLE SYSTEM ---- */
  const canvas = document.getElementById('heroCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animFrame;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.5 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.5 + 0.1;
      const colors = ['124, 58, 237', '6, 182, 212', '236, 72, 153', '167, 139, 250'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = `rgba(${this.color}, 1)`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Create grid of particles
  for (let i = 0; i < 80; i++) {
    particles.push(new Particle());
  }

  // Connection lines
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.save();
          ctx.globalAlpha = (1 - dist / 100) * 0.06;
          ctx.strokeStyle = 'rgba(124, 58, 237, 1)';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  function animateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    animFrame = requestAnimationFrame(animateCanvas);
  }
  animateCanvas();

  window.addEventListener('resize', () => {
    resizeCanvas();
    particles.forEach(p => p.reset());
  });

  /* ---- NAVBAR SCROLL BEHAVIOR ---- */
  const navbar = document.getElementById('navbar');
  const backTop = document.getElementById('backTop');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Navbar sticky style
    if (scrollY > 60) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');

    // Back to top visibility
    if (scrollY > 400) backTop.classList.add('visible');
    else backTop.classList.remove('visible');

    // Active nav link
    updateActiveLink();
  }, { passive: true });

  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---- ACTIVE NAV LINK ON SCROLL ---- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveLink() {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      if (scrollY >= top && scrollY < bottom) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[data-section="${section.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }

  /* ---- HAMBURGER MENU ---- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobLinks = document.querySelectorAll('.mob-link');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  mobLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });

  /* ---- ROLE TEXT ANIMATION RESET ---- */
  // Role slider is pure CSS — no JS needed

  /* ---- SCROLL ANIMATIONS (IntersectionObserver) ---- */
  const animatedEls = document.querySelectorAll('[data-animate]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Stagger children if the element has multiple [data-animate] children
        const el = entry.target;
        el.classList.add('in-view');

        // Animate skill bars inside
        const fills = el.querySelectorAll('.skill-fill');
        fills.forEach((fill, i) => {
          setTimeout(() => fill.classList.add('animated'), i * 120);
        });

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  animatedEls.forEach((el, i) => {
    // Stagger sibling animations
    el.style.transitionDelay = `${(i % 6) * 0.08}s`;
    observer.observe(el);
  });

  /* ---- COUNTER ANIMATION ---- */
  const statNums = document.querySelectorAll('.stat-num[data-target]');
  let countersStarted = false;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        statNums.forEach(el => animateCounter(el));
      }
    });
  }, { threshold: 0.5 });

  if (statNums.length > 0) counterObserver.observe(statNums[0]);

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current);
    }, 16);
  }

  /* ---- PROJECT FILTER ---- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'none';
          requestAnimationFrame(() => {
            card.style.animation = 'cardAppear 0.4s ease forwards';
          });
        } else {
          card.classList.add('hidden');
        }
      });

      // Re-handle featured spanning
      const visibleCards = [...projectCards].filter(c => !c.classList.contains('hidden'));
      visibleCards.forEach((c, idx) => {
        if (filter === 'all' && idx === 0) {
          c.style.gridColumn = 'span 2';
        } else {
          c.style.gridColumn = '';
        }
      });
    });
  });

  /* ---- CONTACT FORM ---- */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const span = btn.querySelector('span');
      const originalText = span.textContent;

      btn.disabled = true;
      span.textContent = 'Sending...';

      // Simulate send (in a real project, you'd POST to a backend/form service)
      setTimeout(() => {
        btn.disabled = false;
        span.textContent = originalText;
        formSuccess.classList.add('visible');
        contactForm.reset();

        setTimeout(() => {
          formSuccess.classList.remove('visible');
        }, 5000);
      }, 1200);
    });
  }

  /* ---- SMOOTH SCROLL FOR ANCHOR LINKS ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---- PARALLAX BLOBS ON MOUSE MOVE ---- */
  const blobs = document.querySelectorAll('.blob');
  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    blobs.forEach((blob, i) => {
      const factor = (i + 1) * 10;
      blob.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });
  }, { passive: true });

  /* ---- TYPING EFFECT FOR HERO (optional enhancement) ---- */
  // Role slider handled by CSS, hero name by CSS animation

  /* ---- CARD TILT EFFECT ---- */
  const tiltCards = document.querySelectorAll('.project-card, .skill-category, .about-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ---- HERO IMAGE LOAD FALLBACK ---- */
  const heroAvatar = document.getElementById('heroAvatar');
  if (heroAvatar) {
    heroAvatar.addEventListener('error', () => {
      heroAvatar.style.background = 'linear-gradient(135deg, #7c3aed, #06b6d4)';
      heroAvatar.src = '';
    });
  }

  /* ---- RE-INIT LUCIDE ICONS AFTER DOM READY ---- */
  window.addEventListener('load', () => {
    if (typeof lucide !== 'undefined') lucide.createIcons();
  });

  /* ---- CSS CARD APPEAR KEYFRAME ---- */
  const style = document.createElement('style');
  style.textContent = `
    @keyframes cardAppear {
      from { opacity: 0; transform: scale(0.95) translateY(10px); }
      to { opacity: 1; transform: none; }
    }
  `;
  document.head.appendChild(style);

  console.log('%c Sidra Qurban Portfolio ', 'background: linear-gradient(135deg,#7c3aed,#06b6d4); color:#fff; padding:8px 16px; border-radius:8px; font-weight:bold; font-size:14px;');
  console.log('%c Built with ❤️ ', 'color: #a78bfa; font-size:12px;');

})();
