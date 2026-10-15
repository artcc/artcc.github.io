const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const typingEl = document.querySelector('.typing');
document.documentElement.classList.replace('no-js', 'js');

if (typingEl && !reduceMotion && window.Typed) {
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

const hamburgerButton = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburgerButton && navMenu) {
  const navLinks = [...document.querySelectorAll('.nav-link')];
  const mobileNavigation = window.matchMedia('(max-width: 768px)');

  const closeNavigation = () => {
    hamburgerButton.classList.remove('active');
    navMenu.classList.remove('active');
    hamburgerButton.setAttribute('aria-expanded', 'false');
  };

  hamburgerButton.addEventListener('click', () => {
    const isExpanded = hamburgerButton.classList.toggle('active');
    navMenu.classList.toggle('active');
    hamburgerButton.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', closeNavigation);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && navMenu.classList.contains('active')) {
      closeNavigation();
      hamburgerButton.focus();
    }
  });

  mobileNavigation.addEventListener('change', () => {
    if (mobileNavigation.matches && navMenu.contains(document.activeElement)) {
      hamburgerButton.focus();
    } else if (!mobileNavigation.matches && document.activeElement === hamburgerButton) {
      navLinks[0]?.focus();
    }
    closeNavigation();
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
const revealSections = document.querySelectorAll('section:not(.hero)');
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

  revealSections.forEach(section => {
    section.classList.add('reveal-on-scroll');
    observer.observe(section);
  });
} else {
  revealSections.forEach(section => {
    section.classList.add('animate');
  });
}

if ('IntersectionObserver' in window && sectionNavLinks.length > 0) {
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        updateActiveNavLink(entry.target.id === 'featured-projects' ? 'projects' : entry.target.id);
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

const projectFilters = document.querySelector('.project-filters');
const projectResults = document.querySelector('.project-results');
const projectCards = [...document.querySelectorAll('#projects-grid .project-card')];

const featuredProjects = document.getElementById('featured-projects');
const featuredProjectsGrid = document.getElementById('featured-projects-grid');

if (featuredProjects && featuredProjectsGrid) {
  const featuredCards = projectCards.filter(card => card.classList.contains('project-card--featured'));

  featuredCards.forEach(card => {
    const heading = card.querySelector('h3');
    if (heading && !heading.querySelector('.project-featured-label')) {
      const label = document.createElement('span');
      label.className = 'project-featured-label';
      label.textContent = 'Featured';
      heading.prepend(label);
    }
    featuredProjectsGrid.append(card.cloneNode(true));
  });

  featuredProjects.hidden = featuredCards.length === 0;
}

if (projectFilters && projectResults && projectCards.length > 0) {
  const filterButtons = [...projectFilters.querySelectorAll('[data-filter]')];
  const matchesCategory = (card, category) => category === 'all'
    || card.dataset.categories.split(' ').includes(category);

  const filterProjects = button => {
    const category = button.dataset.filter;
    let visibleCount = 0;

    projectCards.forEach(card => {
      const matches = matchesCategory(card, category);
      card.hidden = !matches;
      if (matches) {
        visibleCount += 1;
      }
    });

    filterButtons.forEach(filter => {
      filter.setAttribute('aria-pressed', String(filter === button));
    });

    const label = button.childNodes[0].textContent.trim();
    projectResults.textContent = category === 'all'
      ? `Showing all ${visibleCount} projects`
      : `${label}: ${visibleCount} ${visibleCount === 1 ? 'project' : 'projects'}`;
  };

  filterButtons.forEach(button => {
    const count = projectCards.filter(card => matchesCategory(card, button.dataset.filter)).length;
    button.querySelector('.project-filter-count').textContent = count;
    button.addEventListener('click', () => filterProjects(button));
  });

  filterProjects(filterButtons[0]);
  projectFilters.hidden = false;
  projectResults.hidden = false;
}
