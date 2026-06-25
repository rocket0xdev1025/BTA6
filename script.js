/**
 * $BTA6 — Binance City Meme Token
 * Particles, scroll reveals, parallax, copy-to-clipboard
 */

(function () {
  "use strict";

  /* ---- DOM refs ---- */
  const header = document.getElementById("header");
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  const copyBtn = document.getElementById("copyBtn");
  const contractInput = document.getElementById("contractAddress");
  const toast = document.getElementById("toast");
  const canvas = document.getElementById("particles");
  const ctx = canvas.getContext("2d");

  function getContractAddress() {
    return contractInput?.value.trim() || "0xTBA";
  }

  function getUniswapUrl() {
    return `https://pancakeswap.finance/swap?outputCurrency==${getContractAddress()}`;
  }

  function getEtherscanUrl() {
    const ca = getContractAddress();
    return ca && ca !== "0xTBA"
      ? `https://etherscan.io/token/${ca}`
      : "https://etherscan.io/";
  }

  function updateExternalLinks() {
    const uniswapUrl = getUniswapUrl();
    const etherscanUrl = getEtherscanUrl();
    document.querySelectorAll('[data-link="uniswap"]').forEach((el) => {
      el.href = uniswapUrl;
    });
    document.querySelectorAll('[data-link="etherscan"]').forEach((el) => {
      el.href = etherscanUrl;
    });
  }

  updateExternalLinks();

  /* ---- Header scroll ---- */
  function onScroll() {
    header.classList.toggle("scrolled", window.scrollY > 50);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Mobile nav ---- */
  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    navToggle.classList.toggle("active", open);
    navToggle.setAttribute("aria-expanded", open);
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle.classList.remove("active");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ---- Copy contract ---- */
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => toast.classList.remove("show"), 2500);
  }

  async function copyContract() {
    const text = contractInput.value;
    try {
      await navigator.clipboard.writeText(text);
      copyBtn.classList.add("copied");
      copyBtn.querySelector(".copy-text").textContent = "Copied!";
      showToast("Contract address copied to clipboard");
      setTimeout(() => {
        copyBtn.classList.remove("copied");
        copyBtn.querySelector(".copy-text").textContent = "Copy";
      }, 2000);
    } catch {
      contractInput.select();
      document.execCommand("copy");
      showToast("Contract address copied");
    }
  }

  copyBtn.addEventListener("click", copyContract);

  document
    .querySelector('.btn-secondary[href="#contract"]')
    ?.addEventListener("click", (e) => {
      e.preventDefault();
      document
        .getElementById("contract")
        .scrollIntoView({ behavior: "smooth" });
      setTimeout(copyContract, 600);
    });

  /* ---- Scroll reveal ---- */
  const revealEls = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  revealEls.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 0.1}s`;
    revealObserver.observe(el);
  });

  /* ---- Parallax ---- */
  const heroVideo = document.querySelector(".hero-video");
  const parallaxBgs = document.querySelectorAll(".parallax-bg");

  let ticking = false;

  function parallax() {
    const scrollY = window.scrollY;

    if (heroVideo) {
      const scale = 1 + Math.min(scrollY * 0.0001, 0.08);
      heroVideo.style.transform = `scale(${scale}) translateY(${
        scrollY * 0.25
      }px)`;
    }

    parallaxBgs.forEach((bg) => {
      const speed = parseFloat(bg.dataset.speed) || 0.2;
      const rect = bg.getBoundingClientRect();
      const offset =
        (rect.top + scrollY - window.innerHeight / 2) * speed * -0.1;
      bg.style.transform = `translateY(${offset}px)`;
    });

    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(parallax);
        ticking = true;
      }
    },
    { passive: true }
  );

  parallax();

  /* ---- Neon particles ---- */
  let particles = [];
  let animId = null;
  let mouse = { x: -1000, y: -1000 };

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
  }

  function initParticles() {
    const count = Math.min(80, Math.floor(window.innerWidth / 18));
    particles = [];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.6 + 0.2,
        hue: Math.random() > 0.5 ? 330 : Math.random() > 0.5 ? 25 : 280,
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        p.x -= dx * 0.008;
        p.y -= dy * 0.008;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${p.opacity})`;
      ctx.shadowBlur = 12;
      ctx.shadowColor = `hsla(${p.hue}, 100%, 60%, 0.8)`;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    /* Connect nearby particles */
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(255, 107, 157, ${0.08 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    animId = requestAnimationFrame(drawParticles);
  }

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();
  drawParticles();

  /* ---- Gallery lightbox ---- */
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.innerHTML =
    '<button class="lightbox-close" aria-label="Close">&times;</button><img src="" alt="">';
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector("img");
  const lightboxClose = lightbox.querySelector(".lightbox-close");

  document.querySelectorAll(".gallery-item img").forEach((img) => {
    img.parentElement.addEventListener("click", () => {
      lightboxImg.src = img.src.replace(/imwidth=\d+/, "imwidth=1920");
      lightboxImg.alt = img.alt;
      lightbox.classList.add("open");
      document.body.style.overflow = "hidden";
    });
  });

  function closeLightbox() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  }

  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });

  /* ---- Smooth anchor offset fix ---- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const id = this.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  /* ---- Typing glitch on hero ticker (subtle) ---- */
  const titleMain = document.querySelector(".title-main");
  if (
    titleMain &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    setInterval(() => {
      if (Math.random() > 0.92) {
        titleMain.style.textShadow = "2px 0 #ff6b9d, -2px 0 #c44dff";
        setTimeout(() => {
          titleMain.style.textShadow = "";
        }, 80);
      }
    }, 3000);
  }
})();
