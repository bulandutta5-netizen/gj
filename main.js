/* ==========================================================================
   BETA CLASSES AHMEDABAD - INTERACTIVE LOGIC & EFFECTS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileDrawer();
  initScrollReveal();
  initTestimonialSlider();
  initFAQAccordion();
  initGalleryLightbox();
  initEnquiryForm();
  initCourseApplyButtons();
  initResultsCounter();
});

/* --------------------------------------------------------------------------
   1. Navbar Scroll Effect & Active Section Indicator
   -------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  // Add shadow and reduce height on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    highlightActiveLink();
  });

  // Smooth scroll active state highlighting
  function highlightActiveLink() {
    let scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
}

/* --------------------------------------------------------------------------
   2. Mobile Drawer Navigation
   -------------------------------------------------------------------------- */
function initMobileDrawer() {
  const hamburger = document.getElementById('hamburger');
  const drawer = document.getElementById('mobile-drawer');
  const drawerClose = document.getElementById('drawer-close');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  hamburger.addEventListener('click', () => {
    drawer.classList.add('open');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  });

  const closeDrawer = () => {
    drawer.classList.remove('open');
    document.body.style.overflow = '';
  };

  drawerClose.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Close on clicking outside drawer (overlay area)
  document.addEventListener('click', (e) => {
    if (drawer.classList.contains('open') && !drawer.contains(e.target) && !hamburger.contains(e.target)) {
      closeDrawer();
    }
  });
}

/* --------------------------------------------------------------------------
   3. Scroll Reveal Animations (IntersectionObserver)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.scroll-reveal');
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Once revealed, no need to track it further
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px' // Trigger slightly before element enters viewport
    });
    
    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback: Reveal all instantly if browser lacks IntersectionObserver support
    revealElements.forEach(el => el.classList.add('active'));
  }
}

/* --------------------------------------------------------------------------
   4. Testimonials Slider (Carousel) with Touch Gestures
   -------------------------------------------------------------------------- */
function initTestimonialSlider() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.slider-dots .dot');
  const btnPrev = document.getElementById('slider-prev');
  const btnNext = document.getElementById('slider-next');
  let currentSlide = 0;
  let slideInterval;
  
  if (slides.length === 0) return;

  function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function prevSlide() {
    showSlide(currentSlide - 1);
  }

  // Event Listeners for Controls
  btnNext?.addEventListener('click', () => {
    nextSlide();
    resetInterval();
  });

  btnPrev?.addEventListener('click', () => {
    prevSlide();
    resetInterval();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      resetInterval();
    });
  });

  // Touch Gestures support (Swipe left/right)
  let touchStartX = 0;
  let touchEndX = 0;
  const sliderContainer = document.querySelector('.testimonial-slider-container');
  
  sliderContainer?.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  sliderContainer?.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });
  
  function handleSwipe() {
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) { // threshold of 50px
      if (diff > 0) {
        nextSlide(); // swipe left -> next slide
      } else {
        prevSlide(); // swipe right -> prev slide
      }
      resetInterval();
    }
  }

  // Auto scroll
  function startInterval() {
    slideInterval = setInterval(nextSlide, 5000);
  }

  function resetInterval() {
    clearInterval(slideInterval);
    startInterval();
  }

  startInterval();
}

/* --------------------------------------------------------------------------
   5. FAQ Accordion Animation
   -------------------------------------------------------------------------- */
function initFAQAccordion() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(q => {
    q.addEventListener('click', () => {
      const faqItem = q.parentElement;
      const faqAnswer = faqItem.querySelector('.faq-answer');
      const isActive = faqItem.classList.contains('active');
      
      // Close all other FAQs
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        item.querySelector('.faq-answer').style.maxHeight = null;
      });
      
      if (!isActive) {
        faqItem.classList.add('active');
        // Slide down animation usingscrollHeight
        faqAnswer.style.maxHeight = faqAnswer.scrollHeight + 'px';
      }
    });
  });
}

/* --------------------------------------------------------------------------
   6. Gallery Masonry Lightbox with touch support
   -------------------------------------------------------------------------- */
function initGalleryLightbox() {
  const cards = document.querySelectorAll('.gallery-card');
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  const modalTitle = document.getElementById('lightbox-title');
  const modalDesc = document.getElementById('lightbox-desc');
  const btnClose = document.getElementById('lightbox-close');
  const btnPrev = document.getElementById('lightbox-prev');
  const btnNext = document.getElementById('lightbox-next');
  let currentIndex = 0;
  
  if (cards.length === 0) return;

  function openLightbox(index) {
    currentIndex = index;
    const card = cards[currentIndex];
    const src = card.getAttribute('data-src');
    const title = card.getAttribute('data-title');
    const desc = card.getAttribute('data-desc');
    
    modalImg.src = src;
    modalTitle.textContent = title;
    modalDesc.textContent = desc;
    
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    modalImg.src = '';
  }

  function nextImage() {
    openLightbox((currentIndex + 1) % cards.length);
  }

  function prevImage() {
    openLightbox((currentIndex - 1 + cards.length) % cards.length);
  }

  // Event Listeners
  cards.forEach((card, index) => {
    card.addEventListener('click', () => openLightbox(index));
  });

  btnClose?.addEventListener('click', closeLightbox);
  btnNext?.addEventListener('click', (e) => { e.stopPropagation(); nextImage(); });
  btnPrev?.addEventListener('click', (e) => { e.stopPropagation(); prevImage(); });
  
  // Close on modal background click
  modal?.addEventListener('click', (e) => {
    if (e.target === modal || e.target === document.getElementById('lightbox-content')) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!modal?.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  });

  // Swipe support inside Lightbox
  let touchStartX = 0;
  let touchEndX = 0;
  modal?.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  modal?.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextImage();
      else prevImage();
    }
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   7. Enquiry Form Validation & Dynamic Success Popup
   -------------------------------------------------------------------------- */
function initEnquiryForm() {
  const form = document.getElementById('enquiry-form');
  const successModal = document.getElementById('success-modal');
  const successCloseBtn = document.getElementById('success-close-btn');
  
  if (!form) return;

  const fields = {
    name: {
      input: document.getElementById('form-name'),
      error: document.getElementById('error-name'),
      validate: (val) => val.trim().length > 1
    },
    phone: {
      input: document.getElementById('form-phone'),
      error: document.getElementById('error-phone'),
      validate: (val) => /^[6-9]\d{9}$/.test(val.trim())
    },
    class: {
      input: document.getElementById('form-class'),
      error: document.getElementById('error-class'),
      validate: (val) => val !== ''
    },
    medium: {
      input: document.getElementById('form-medium'),
      error: document.getElementById('error-medium'),
      validate: (val) => val !== ''
    },
    course: {
      input: document.getElementById('form-course'),
      error: document.getElementById('error-course'),
      validate: (val) => val !== ''
    }
  };

  // Only allow numbers in Phone input
  fields.phone.input?.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '');
  });

  // Validate single field on input
  Object.keys(fields).forEach(key => {
    const field = fields[key];
    field.input?.addEventListener('blur', () => {
      const isValid = field.validate(field.input.value);
      toggleErrorState(field, isValid);
    });
    
    field.input?.addEventListener('change', () => {
      const isValid = field.validate(field.input.value);
      toggleErrorState(field, isValid);
    });
  });

  function toggleErrorState(field, isValid) {
    const group = field.input.closest('.form-group');
    if (isValid) {
      group.classList.remove('error');
    } else {
      group.classList.add('error');
    }
  }

  // Handle Form Submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let isFormValid = true;
    
    // Validate all fields
    Object.keys(fields).forEach(key => {
      const field = fields[key];
      const isValid = field.validate(field.input.value);
      toggleErrorState(field, isValid);
      if (!isValid) isFormValid = false;
    });

    if (isFormValid) {
      // Form is fully validated!
      // Fill success details
      document.getElementById('summary-name').textContent = fields.name.input.value;
      document.getElementById('summary-course').textContent = fields.course.input.options[fields.course.input.selectedIndex].text;
      document.getElementById('summary-medium').textContent = fields.medium.input.options[fields.medium.input.selectedIndex].text;
      
      // Open success modal
      successModal.classList.add('open');
      successModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      
      // Reset Form
      form.reset();
      // Remove any lingering focus states
      document.activeElement.blur();
    }
  });

  // Close Success Modal
  const closeSuccess = () => {
    successModal.classList.remove('open');
    successModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  successCloseBtn?.addEventListener('click', closeSuccess);
  
  successModal?.addEventListener('click', (e) => {
    if (e.target === successModal) {
      closeSuccess();
    }
  });
}

/* --------------------------------------------------------------------------
   8. Course Apply Buttons Linkage to Form
   -------------------------------------------------------------------------- */
function initCourseApplyButtons() {
  const applyButtons = document.querySelectorAll('.apply-course-btn');
  const courseSelect = document.getElementById('form-course');
  
  applyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const courseName = btn.getAttribute('data-course');
      
      // Match key strings in select dropdown
      if (courseSelect) {
        if (courseName.includes('Science')) {
          courseSelect.value = 'Science';
        } else if (courseName.includes('Commerce')) {
          courseSelect.value = 'Commerce';
        } else if (courseName.includes('NEET')) {
          courseSelect.value = 'NEET';
        } else if (courseName.includes('GUJCET')) {
          courseSelect.value = 'GUJCET';
        } else if (courseName.includes('Foundation')) {
          courseSelect.value = 'Foundation';
        }
        
        // Trigger visual validation update for select
        const group = courseSelect.closest('.form-group');
        group.classList.remove('error');
      }
      
      // Smooth scroll to contact/enquiry form
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        const offset = 80; // navbar height
        const top = contactSection.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/* --------------------------------------------------------------------------
   9. Animated Count-Up Counters for Results Section
   -------------------------------------------------------------------------- */
function initResultsCounter() {
  const counters = document.querySelectorAll('.counter');
  const intCounters = document.querySelectorAll('.counter-int');
  
  if (counters.length === 0 && intCounters.length === 0) return;
  
  const countOptions = {
    threshold: 0.2,
    rootMargin: '0px'
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        
        // Start decimals count-up
        card.querySelectorAll('.counter').forEach(ctr => {
          const target = parseFloat(ctr.getAttribute('data-target'));
          animateFloatCounter(ctr, target);
        });
        
        // Start integers count-up
        card.querySelectorAll('.counter-int').forEach(ctr => {
          const target = parseInt(ctr.getAttribute('data-target'), 10);
          animateIntCounter(ctr, target);
        });
        
        observer.unobserve(card);
      }
    });
  }, countOptions);

  // Observe each result card individually
  document.querySelectorAll('.result-card').forEach(card => {
    counterObserver.observe(card);
  });

  // Decimal count-up logic
  function animateFloatCounter(el, target) {
    let start = 0;
    const duration = 1500; // ms
    const startTime = performance.now();
    
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quad formula
      const easeProgress = progress * (2 - progress);
      const current = start + easeProgress * target;
      
      el.textContent = current.toFixed(2);
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toFixed(2);
      }
    }
    
    requestAnimationFrame(update);
  }

  // Integer count-up logic
  function animateIntCounter(el, target) {
    let start = 0;
    const duration = 1200; // ms
    const startTime = performance.now();
    
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = progress * (2 - progress);
      const current = Math.floor(start + easeProgress * target);
      
      el.textContent = current;
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    }
    
    requestAnimationFrame(update);
  }
}
