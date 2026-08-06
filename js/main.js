const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const typingEl = document.querySelector('.typing');
document.documentElement.classList.replace('no-js', 'js');

if (typingEl && reduceMotion) {
  typingEl.textContent = 'a Senior Apple Software Developer';
} else if (typingEl && window.Typed) {
  new Typed('.typing', {
    strings: [
      'Arturo. Hello, World!',
      'a Senior Apple Software Developer',
      'part-time indie game dev at home',
      'a scuba diver'
    ],
    loop: true,
    typeSpeed: 75,
    backSpeed: 75
  });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (event) {
    if (this.classList.contains('skip-link')) {
      return;
    }

    event.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

const hamburgerButton = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburgerButton && navMenu) {
  const navLinks = [...document.querySelectorAll('.nav-link')];

  hamburgerButton.addEventListener('click', () => {
    const isExpanded = hamburgerButton.classList.toggle('active');
    navMenu.classList.toggle('active');
    hamburgerButton.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburgerButton.classList.remove('active');
      navMenu.classList.remove('active');
      hamburgerButton.setAttribute('aria-expanded', 'false');
    });
  });
}

window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (!navbar) {
    return;
  }

  if (window.scrollY > 100) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

const sections = document.querySelectorAll('section');
const sectionNavLinks = [...document.querySelectorAll('.nav-link[href^="#"]')];

const updateActiveNavLink = id => {
  sectionNavLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
  });
};

if ('IntersectionObserver' in window && !reduceMotion) {
  const observerOptions = {
    threshold: 0,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    section.classList.add('reveal-on-scroll');
    observer.observe(section);
  });
} else {
  sections.forEach(section => {
    section.classList.add('animate');
  });
}

if ('IntersectionObserver' in window && sectionNavLinks.length > 0) {
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        updateActiveNavLink(entry.target.id);
      }
    });
  }, {
    rootMargin: '-35% 0px -55% 0px',
    threshold: 0
  });

  sections.forEach(section => {
    navObserver.observe(section);
  });
}

const currentYearEl = document.getElementById('current-year');
if (currentYearEl) {
  currentYearEl.textContent = new Date().getFullYear();
}
