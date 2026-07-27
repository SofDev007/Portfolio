(function () {
  'use strict';

  // Wait until DOM is ready
  document.addEventListener('DOMContentLoaded', () => {

  
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => Array.from(document.querySelectorAll(sel));

    const root = document.documentElement;
    const themeToggle = $('#themeToggle');
    const storedTheme = localStorage.getItem('site-theme');
    if (storedTheme === 'light') root.classList.add('light');

    function updateThemeUI() {
      // if you have a button with inner .name text
      const themeToggleBtn = $('#themeToggle');
      if (themeToggleBtn) {
        const nameEl = themeToggleBtn.querySelector('.name');
        if (nameEl) nameEl.textContent = root.classList.contains('light') ? 'Light' : 'Dark';
      }
    }
    updateThemeUI();

    themeToggle?.addEventListener('click', () => {
      root.classList.toggle('light');
      localStorage.setItem('site-theme', root.classList.contains('light') ? 'light' : 'dark');
      updateParticleTheme(); // update particle colors when theme changes
      updateThemeUI();
    });

    /* 
       NAV toggle (mobile)
       */
    const navToggle = $('#navToggle');
    const navList = $('#navList');
    navToggle?.addEventListener('click', () => {
      if (!navList) return;
      navList.style.display = navList.style.display === 'block' ? '' : 'block';
    });

    /*  
       Smooth scroll for anchor links
         */
    $$('a[href^="#"]').forEach(a => {
      a.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (window.innerWidth < 720 && navList) navList.style.display = '';
      });
    });

    /*  
       Typing effect (respects reduced motion)
         */
    const typedEl = document.getElementById('typed-line');
    const words = ['Creative Coder', 'Photographer', 'Explorer', 'AI Enthusiast'];
    let wIndex = 0, charIndex = 0, deleting = false;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function typeTick() {
      if (!typedEl || prefersReduced) return;
      const current = words[wIndex];
      if (!deleting) {
        typedEl.textContent = current.slice(0, ++charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(typeTick, 900);
          return;
        }
      } else {
        typedEl.textContent = current.slice(0, --charIndex);
        if (charIndex === 0) {
          deleting = false;
          wIndex = (wIndex + 1) % words.length;
        }
      }
      setTimeout(typeTick, deleting ? 40 : 80);
    }
    if (typedEl && !prefersReduced) typeTick();
    if (prefersReduced && typedEl) typedEl.textContent = words[0];

    /*  
       IntersectionObserver reveal-on-scroll
         */
    const reveals = document.querySelectorAll('.reveal');
    if (reveals.length) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      reveals.forEach(r => obs.observe(r));
    }

    // CONTACT FORM → Google Sheets
const form = document.getElementById("contactForm");
const formMsg = document.getElementById("formMsg");

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  formMsg.textContent = "Sending...";

  const formData = new FormData(form);

  try {
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbwwoTk-aqQd_pucIKlcDN5ijDSN1_g9syhZPBmUMk_klLyD3o0wmgWnXbJsjDDDq2rORg/exec",
      {
        method: "POST",
        body: formData,      
        redirect: "follow",
      }
    );

    const text = await response.text();
    console.log("Server Response:", text);

    formMsg.textContent = "Message sent successfully!";
    form.reset();
  } catch (err) {
    console.error("Network Error:", err);
    formMsg.textContent = "Network error!";
  }
});

    /* Scroll-to-top button (rocket) */
    const scrollBtn = document.getElementById('scrollTopBtn');
    if (scrollBtn) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 300) scrollBtn.classList.add('show');
        else scrollBtn.classList.remove('show');
      });

      scrollBtn.addEventListener('click', () => {
        scrollBtn.classList.add('launch');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => scrollBtn.classList.remove('launch'), 1000);
      });
    }

    /*  
       Header scrolled class
         */
    const header = document.querySelector('.site-header');
    if (header) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 20) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
      });
    }

    /*  
       Particle background
       Canvas element: <canvas id="particles"></canvas>
         */
    (function particleSystem() {
      const canvas = document.getElementById('particles');
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      let rafId = null;

      function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      // theme-aware colors - global vars
      window.particleColor = 'rgba(255,204,102,0.95)';
      window.particleGlow = '#ffcc66';

      function updateParticleTheme() {
        if (document.documentElement.classList.contains('light')) {
          window.particleColor = 'rgba(50,50,50,0.85)'; // darker on light bg
          window.particleGlow = '#d4a24a';
        } else {
          window.particleColor = 'rgba(255,204,102,0.95)'; // gold on dark
          window.particleGlow = '#ffcc66';
        }
      }
      // make function available globally for theme toggle to call
      window.updateParticleTheme = updateParticleTheme;
      updateParticleTheme();

      // Respect reduced motion
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const particleCountDefault = window.innerWidth < 700 ? 40 : 100;
      const particleCount = prefersReducedMotion ? Math.min(40, particleCountDefault) : particleCountDefault;

      const glowRadius = 150;
      let particles = [];

      function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 0.5,
            speedX: (Math.random() - 0.5) * 0.6,
            speedY: (Math.random() - 0.5) * 0.6
          });
        }
      }
      initParticles();
      window.addEventListener('resize', initParticles);

      // mouse for glow only
      let mouse = { x: null, y: null };
      window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      });

      function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // draw particles
        particles.forEach((p) => {
          p.x += p.speedX;
          p.y += p.speedY;

          // bounce
          if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
          if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

          // glow calculation
          let glow = 0;
          if (mouse.x !== null && mouse.y !== null) {
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < glowRadius) glow = (glowRadius - dist) / glowRadius;
          }

          // base fill
          ctx.fillStyle = window.particleColor;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size + glow * 2, 0, Math.PI * 2);
          ctx.fill();

          // halo
          if (glow > 0) {
            ctx.save();
            ctx.shadowBlur = 22 * glow;
            ctx.shadowColor = window.particleGlow;
            ctx.fillStyle = window.particleColor.replace(/[\d\.]+\)$/,'0.9)'); // slight tweak
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size + 3 + glow * 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        });

        // constellation lines (O(n^2), keep particleCount reasonable)
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const maxDist = 120;
            if (dist < maxDist) {
              const opacity = 1 - dist / maxDist;
              ctx.strokeStyle = `rgba(255,204,102,${opacity * 0.5})`;
              ctx.lineWidth = 0.6;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
      }

      function animate() {
        if (prefersReducedMotion) {
          drawParticles(); // still draw once
          return;
        }
        drawParticles();
        rafId = requestAnimationFrame(animate);
      }

      animate();

      // expose small controls for debugging if needed
      window.__particles = { restart: initParticles };
    })();

    /*  
       Resume button: ripple + glow + sparks
       Needs .resume-btn in DOM
         */
    (function resumeButton() {
      const resumeBtn = document.querySelector('.resume-btn');
      if (!resumeBtn) return;

      function createSparks(count = 10) {
        const rect = resumeBtn.getBoundingClientRect();
        for (let i = 0; i < count; i++) {
          const spark = document.createElement('span');
          spark.className = 'spark';
          const angle = Math.random() * Math.PI * 2;
          const dist = 30 + Math.random() * 70;
          const tx = Math.cos(angle) * dist + (Math.random() * 20 - 10);
          const ty = Math.sin(angle) * dist + (Math.random() * 20 - 10);
          spark.style.setProperty('--tx', `${tx}px`);
          spark.style.setProperty('--ty', `${ty}px`);
          spark.style.left = `50%`;
          spark.style.top = `50%`;
          resumeBtn.appendChild(spark);
          spark.addEventListener('animationend', () => spark.remove());
        }
      }

      resumeBtn.addEventListener('click', () => {
        resumeBtn.classList.remove('press');
        void resumeBtn.offsetWidth;
        resumeBtn.classList.add('press');

        resumeBtn.classList.remove('ripple', 'clicked');
        void resumeBtn.offsetWidth;
        resumeBtn.classList.add('ripple', 'clicked');

        createSparks(14);
        setTimeout(() => resumeBtn.classList.remove('ripple', 'clicked', 'press'), 900);
      });
    })();

    /*  
       Photo lightbox (click image to open)
       Requires #lightbox, #lightbox-img in DOM
         */
    (function lightbox() {
      const lightbox = document.getElementById('lightbox');
      const lightboxImg = document.getElementById('lightbox-img');
      if (!lightbox || !lightboxImg) return;

      $$('.photo-item img').forEach(img => {
        img.addEventListener('click', () => {
          lightboxImg.src = img.src;
          lightbox.classList.add('show');
        });
      });

      const closeBtn = document.querySelector('.lightbox-close');
      if (closeBtn) closeBtn.addEventListener('click', () => lightbox.classList.remove('show'));
      lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.remove('show'); });
    })();

    /*  
       Certificates modal popup
       Requires #certModal, #certModalImg
         */
    (function certModal() {
      const modal = document.getElementById('certModal');
      const modalImg = document.getElementById('certModalImg');
      if (!modal || !modalImg) return;

      $$('.achievement-card').forEach(card => {
        card.addEventListener('click', () => {
          const imgSrc = card.getAttribute('data-cert');
          if (!imgSrc) return;
          modalImg.src = imgSrc;
          modal.classList.add('show');
        });
      });

      const closeBtn = document.querySelector('.cert-close');
      if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('show'));
      modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('show'); });
    })();

    /*  
       Certificate list: achievements cards click already handled above
         */

    /*  
       Utility: update particle theme on initial load
         */
    // Run updateParticleTheme once more to ensure particle system sees the correct theme
    if (typeof window.updateParticleTheme === 'function') window.updateParticleTheme();

    /*  
       End of DOMContentLoaded
         */
  }); // DOMContentLoaded
})(); // IIFE

/*    
   Achievements Modal Popup (clickable)
    */
(function achievementModal() {
  const modal = document.getElementById("certModal");
  const modalImg = document.getElementById("certModalImg");
  const closeBtn = document.querySelector(".cert-close");

  if (!modal || !modalImg) return;

  document.querySelectorAll(".achievement-card img").forEach(img => {
    img.style.cursor = "pointer"; // make pointer
    img.addEventListener("click", () => {
      modalImg.src = img.src;
      modal.classList.add("show");
    });
  });

  // Close modal
  closeBtn?.addEventListener("click", () => modal.classList.remove("show"));

  // Close when clicking outside image
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("show");
  });
})();

