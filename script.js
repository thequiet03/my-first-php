/* ==========================================================================
   SHANTO ISLAM — PORTFOLIO INTERACTIONS
   ========================================================================== */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;

  /* ---------------- Year ---------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- Preloader ---------------- */
  const preloader = document.getElementById("preloader");
  window.addEventListener("load", () => {
    setTimeout(() => {
      if (preloader) preloader.classList.add("hidden");
      document.body.classList.add("loaded");
      startHeroTextReveal();
    }, 1300);
  });

  /* ---------------- Header scroll state ---------------- */
  const header = document.getElementById("siteHeader");
  const progressBar = document.getElementById("scrollProgress");
  const onScrollHeader = () => {
    if (window.scrollY > 30) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
    if (progressBar) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      progressBar.style.width = pct + "%";
    }
  };
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------------- Active nav link tracking ---------------- */
  const navLinkMap = new Map();
  document.querySelectorAll(".nav-links a[href^='#']").forEach((a) => {
    const id = a.getAttribute("href").slice(1);
    const sec = document.getElementById(id);
    if (sec) navLinkMap.set(sec, a);
  });
  if (navLinkMap.size) {
    const navIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const link = navLinkMap.get(entry.target);
          if (!link) return;
          if (entry.isIntersecting) {
            document.querySelectorAll(".nav-links a.active").forEach((a) => a.classList.remove("active"));
            link.classList.add("active");
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    navLinkMap.forEach((_, sec) => navIO.observe(sec));
  }

  /* ---------------- Mobile drawer ---------------- */
  const navToggle = document.getElementById("navToggle");
  const drawer = document.getElementById("mobileDrawer");
  const closeDrawer = document.getElementById("closeDrawer");
  if (navToggle && drawer) {
    const getFocusable = () =>
      Array.from(drawer.querySelectorAll('a[href], button:not([disabled])'));

    function openDrawer() {
      drawer.classList.add("open");
      navToggle.setAttribute("aria-expanded", "true");
      navToggle.setAttribute("aria-label", "Close menu");
      const focusable = getFocusable();
      if (focusable.length) focusable[0].focus();
      document.addEventListener("keydown", onDrawerKeydown);
    }
    function closeDrawerFn() {
      drawer.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open menu");
      document.removeEventListener("keydown", onDrawerKeydown);
      navToggle.focus();
    }
    function onDrawerKeydown(e) {
      if (e.key === "Escape") {
        closeDrawerFn();
        return;
      }
      if (e.key === "Tab") {
        const focusable = getFocusable();
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    navToggle.addEventListener("click", openDrawer);
    closeDrawer.addEventListener("click", closeDrawerFn);
    drawer.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", closeDrawerFn)
    );
  }

  /* ---------------- Custom cursor ---------------- */
  if (!isTouch && !reduceMotion) {
    const dot = document.querySelector(".cursor-dot");
    const ring = document.querySelector(".cursor-ring");
    let mx = 0, my = 0, rx = 0, ry = 0;
    window.addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
    });
    function loop() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    }
    loop();
    document.querySelectorAll("a, button, .tilt, .magnetic").forEach((el) => {
      el.addEventListener("mouseenter", () => ring.classList.add("active"));
      el.addEventListener("mouseleave", () => ring.classList.remove("active"));
    });
  }

  /* ---------------- Hero photo parallax ---------------- */
  if (!isTouch && !reduceMotion) {
    const heroPhoto = document.getElementById("heroPhotoFrame");
    const heroSection = document.getElementById("hero");
    if (heroPhoto && heroSection) {
      heroSection.addEventListener("mousemove", (e) => {
        const r = heroSection.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        heroPhoto.style.transform = `rotateY(${px * 10}deg) rotateX(${-py * 10}deg)`;
      });
      heroSection.addEventListener("mouseleave", () => {
        heroPhoto.style.transform = "rotateY(0) rotateX(0)";
      });
    }
  }

  /* ---------------- Magnetic buttons ---------------- */
  if (!isTouch && !reduceMotion) {
    document.querySelectorAll(".magnetic").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "translate(0,0)";
      });
    });
  }

  /* ---------------- Tilt cards ---------------- */
  if (!isTouch && !reduceMotion) {
    document.querySelectorAll(".tilt").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(800px) rotateX(${-py * 6}deg) rotateY(${px * 6}deg) translateY(-4px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "perspective(800px) rotateX(0) rotateY(0) translateY(0)";
      });
    });
  }

  /* ---------------- Scroll reveal ---------------- */
  const revealEls = document.querySelectorAll(".reveal, .reveal-stagger");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          if (entry.target.id === "hero" || entry.target.contains?.(document.getElementById("hero"))) {}
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => io.observe(el));

  /* ---------------- Animated counters ---------------- */
  const counters = document.querySelectorAll("[data-count]");
  const counterIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.getAttribute("data-count"), 10);
        const suffix = el.getAttribute("data-suffix") || "";
        const dur = 1400;
        const start = performance.now();
        function tick(now) {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(eased * target) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        counterIO.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((el) => counterIO.observe(el));

  /* ---------------- Animated skill bars ---------------- */
  const fills = document.querySelectorAll(".skill-fill");
  const fillIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.style.width = el.getAttribute("data-fill") + "%";
          fillIO.unobserve(el);
        }
      });
    },
    { threshold: 0.4 }
  );
  fills.forEach((el) => fillIO.observe(el));

  /* ---------------- Hero text reveal ---------------- */
  function startHeroTextReveal() {
    document.querySelectorAll(".hero h1 .line span").forEach((span, i) => {
      span.style.transition = `transform .9s cubic-bezier(.16,.84,.44,1) ${0.15 + i * 0.12}s`;
      requestAnimationFrame(() => {
        span.style.transform = "translateY(0)";
      });
    });
    document.querySelectorAll(".hero .reveal, .hero .reveal-stagger").forEach((el) => {
      el.classList.add("is-visible");
    });
  }

  /* ---------------- Project filters ---------------- */
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projCards = document.querySelectorAll(".proj-card");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.getAttribute("data-filter");
      projCards.forEach((card) => {
        const cats = card.getAttribute("data-cat");
        const show = filter === "all" || cats.includes(filter);
        card.style.display = show ? "flex" : "none";
      });
    });
  });

  /* ---------------- Testimonial slider ---------------- */
  const track = document.getElementById("testiTrack");
  const navWrap = document.getElementById("testiNav");
  if (track && navWrap) {
    const slides = track.children.length;
    let idx = 0;
    for (let i = 0; i < slides; i++) {
      const dot = document.createElement("button");
      dot.className = "testi-dot" + (i === 0 ? " active" : "");
      dot.setAttribute("aria-label", "Show testimonial " + (i + 1));
      dot.addEventListener("click", () => goTo(i));
      navWrap.appendChild(dot);
    }
    function goTo(i) {
      idx = i;
      track.style.transform = `translateX(-${idx * 100}%)`;
      navWrap.querySelectorAll(".testi-dot").forEach((d, di) => d.classList.toggle("active", di === idx));
    }
    let autoplay = setInterval(() => goTo((idx + 1) % slides), 6000);
    track.addEventListener("mouseenter", () => clearInterval(autoplay));
    track.addEventListener("mouseleave", () => {
      autoplay = setInterval(() => goTo((idx + 1) % slides), 6000);
    });
  }

  /* ---------------- Contact form ---------------- */
  const form = document.getElementById("contactForm");
  const note = document.getElementById("formNote");
  const submitBtn = document.getElementById("cfSubmit");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const endpoint = form.getAttribute("action") || "";
      const placeholderNotConfigured = endpoint.includes("YOUR_FORM_ID");

      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";
      note.className = "form-note";
      note.textContent = "";

      if (placeholderNotConfigured) {
        // The site owner hasn't connected a real form backend yet (see the
        // TODO comment above the <form> in index.html). Fail gracefully
        // with a mailto fallback instead of pretending it worked.
        note.className = "form-note is-error";
        note.innerHTML =
          'This form isn\'t connected to an inbox yet. ' +
          'Please email <a href="mailto:hello@shantoislam.dev" style="text-decoration:underline;">hello@shantoislam.dev</a> directly in the meantime.';
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Message";
        return;
      }

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });
        if (res.ok) {
          note.className = "form-note is-success";
          note.textContent = "Thanks — your message is on its way. I'll reply within one business day.";
          form.reset();
        } else {
          throw new Error("Form submission failed");
        }
      } catch (err) {
        note.className = "form-note is-error";
        note.innerHTML =
          'Something went wrong sending that. Please email ' +
          '<a href="mailto:hello@shantoislam.dev" style="text-decoration:underline;">hello@shantoislam.dev</a> directly.';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Message";
      }
    });
  }

  /* ---------------- Constellation canvas (hero signature element) ---------------- */
  const canvas = document.getElementById("constellation");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let w, h, nodes, mouse = { x: -9999, y: -9999 };
    const NODE_COUNT_BASE = 70;

    function resize() {
      const hero = canvas.closest(".hero");
      w = canvas.width = hero.offsetWidth;
      h = canvas.height = hero.offsetHeight;
      const count = Math.round(NODE_COUNT_BASE * (w / 1400));
      nodes = Array.from({ length: Math.max(28, count) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 0.6,
      }));
    }
    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    });
    canvas.addEventListener("mouseleave", () => { mouse.x = -9999; mouse.y = -9999; });

    const maxDist = 150;
    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;

        const dxm = n.x - mouse.x, dym = n.y - mouse.y;
        const distM = Math.sqrt(dxm * dxm + dym * dym);
        if (distM < 140) {
          n.x += dxm * 0.012;
          n.y += dym * 0.012;
        }

        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j];
          const dx = n.x - m.x, dy = n.y - m.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            ctx.strokeStyle = `rgba(99,102,241,${0.22 * (1 - dist / maxDist)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);
            ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(34,211,238,0.6)";
        ctx.fill();
      }
      if (!reduceMotion) requestAnimationFrame(draw);
    }
    draw();
  }
})();
