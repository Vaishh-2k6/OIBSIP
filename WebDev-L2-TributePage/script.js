const revealItems = document.querySelectorAll('.reveal');
const particleLayer = document.querySelector('.particle-layer');
const backToTopButton = document.querySelector('.back-to-top');
const topNavLinks = document.querySelectorAll('.top-nav a');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item) => observer.observe(item));

if (particleLayer) {
  const particleCount = 28;

  for (let i = 0; i < particleCount; i += 1) {
    const particle = document.createElement('span');
    particle.className = 'particle';
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.animationDuration = `${8 + Math.random() * 6}s`;
    particle.style.animationDelay = `${Math.random() * 5}s`;
    particleLayer.appendChild(particle);
  }
}

window.addEventListener('scroll', () => {
  if (window.scrollY > 600) {
    backToTopButton?.classList.add('show');
  } else {
    backToTopButton?.classList.remove('show');
  }
});

backToTopButton?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

topNavLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href');
    if (targetId?.startsWith('#')) {
      event.preventDefault();
      const target = document.querySelector(targetId);
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

const heroText = document.querySelector('.hero-text');
heroText?.classList.add('visible');

// Hero image upload / persistence
const heroImage = document.getElementById('hero-image');
const heroFileInput = document.getElementById('hero-file');

function loadHeroFromStorage() {
  try {
    const data = localStorage.getItem('heroImageData');
    if (data && heroImage) heroImage.src = data;
  } catch (e) {
    // ignore storage errors
  }
}

loadHeroFromStorage();

heroFileInput?.addEventListener('change', () => {
  const file = heroFileInput.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const result = reader.result;
    if (heroImage && typeof result === 'string') {
      heroImage.src = result;
      try {
        localStorage.setItem('heroImageData', result);
      } catch (e) {
        // ignore storage quota errors
      }
    }
  };
  reader.readAsDataURL(file);
});

// Portrait image upload / persistence (Maryada Purushottam)
const portraitImage = document.getElementById('portrait-image');
const portraitFileInput = document.getElementById('portrait-file');

function loadPortraitFromStorage() {
  try {
    const data = localStorage.getItem('portraitImageData');
    if (data && portraitImage) portraitImage.src = data;
  } catch (e) {
    // ignore storage errors
  }
}

loadPortraitFromStorage();

portraitFileInput?.addEventListener('change', () => {
  const file = portraitFileInput.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const result = reader.result;
    if (portraitImage && typeof result === 'string') {
      portraitImage.src = result;
      try {
        localStorage.setItem('portraitImageData', result);
      } catch (e) {
        // ignore storage quota errors
      }
    }
  };
  reader.readAsDataURL(file);
});

// Load external fallback images when available
function loadExternalImages() {
  const images = document.querySelectorAll('img[data-fallback]');
  images.forEach((img) => {
    const fallbackUrl = img.dataset.fallback;
    if (!fallbackUrl) return;

    const testImg = new Image();
    testImg.onload = () => {
      img.src = fallbackUrl;
    };
    testImg.onerror = () => {
      // Keep the current src (placeholder SVG)
    };
    testImg.src = fallbackUrl;
  });
}

// Try loading external images after a short delay
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(loadExternalImages, 500);
  });
} else {
  setTimeout(loadExternalImages, 500);
}
