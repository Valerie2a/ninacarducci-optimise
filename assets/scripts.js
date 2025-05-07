import {galleryData} from './galleryData.js';

document.addEventListener('DOMContentLoaded', () => {
  // SLIDER
  const slide = document.querySelector('.carousel-slide');
  const images = slide.querySelectorAll('img');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');
  const dotsContainer = document.querySelector('.carousel-dots');
  let currentIndex = 0;

  function createDots(slideCount) {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < slideCount; i++) {
      const dot = document.createElement('span');
      dot.classList.add('carousel-dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        currentIndex = i;
        updateCarousel();
      });
      dotsContainer.appendChild(dot);
    }
  }

  function updateCarousel() {
    slide.style.transform = `translateX(-${currentIndex * 100}%)`;
    dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % images.length;
    updateCarousel();
  });

  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateCarousel();
  });

  createDots(images.length);
  updateCarousel();
  setInterval(() => {
    currentIndex = (currentIndex + 1) % images.length;
    updateCarousel();
  }, 5000);

  // GALLERY
  const gallery = document.querySelector('.gallery');
  const buttons = document.querySelectorAll('.filter-buttons button');
  let currentImages = [];
  let currentLightboxIndex = 0;

  galleryData.forEach((item) => {
    const img = document.createElement('img');
    img.classList.add('gallery-item');
    img.src = item.src;
    img.alt = item.alt;
    img.dataset.galleryTag = item.tag;
    img.loading = 'lazy';
    gallery.appendChild(img);
  });

  gallery.classList.add('visible');
  updateCurrentImages();

  function updateCurrentImages() {
    currentImages = Array.from(
      document.querySelectorAll('.gallery-item:not(.hidden)')
    );
  }

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const selectedTag = button.dataset.tag;
      buttons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');

      document.querySelectorAll('.gallery-item').forEach((item) => {
        const itemTag = item.dataset.galleryTag;
        if (selectedTag === 'all' || itemTag === selectedTag) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });

      updateCurrentImages();
    });
  });

  // LIGHTBOX
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxPrev = lightbox.querySelector('.lightbox-prev');
  const lightboxNext = lightbox.querySelector('.lightbox-next');

  function showImage(index) {
    if (currentImages.length === 0) return;
    if (index < 0) index = currentImages.length - 1;
    if (index >= currentImages.length) index = 0;
    currentLightboxIndex = index;
    const img = currentImages[index];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.remove('hidden');
    document.body.classList.add('lightbox-open');
  }

  gallery.addEventListener('click', (e) => {
    if (e.target.classList.contains('gallery-item')) {
      updateCurrentImages();
      const index = currentImages.indexOf(e.target);
      showImage(index);
    }
  });

  lightboxPrev.addEventListener('click', () => {
    showImage(currentLightboxIndex - 1);
  });

  lightboxNext.addEventListener('click', () => {
    showImage(currentLightboxIndex + 1);
  });

  document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('hidden')) return;
    if (e.key === 'Escape') {
      lightbox.classList.add('hidden');
      document.body.classList.remove('lightbox-open');
    } else if (e.key === 'ArrowLeft') {
      showImage(currentLightboxIndex - 1);
    } else if (e.key === 'ArrowRight') {
      showImage(currentLightboxIndex + 1);
    }
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.add('hidden');
      document.body.classList.remove('lightbox-open');
    }
  });
});
