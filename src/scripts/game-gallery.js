document.querySelectorAll('[data-media-gallery]').forEach((gallery) => {
  const items = [...gallery.querySelectorAll('[data-gallery-item]')];
  const thumbs = [...gallery.querySelectorAll('[data-gallery-thumb]')];
  const thumbsTrack = gallery.querySelector('.media-gallery-thumbs');
  const scrollbar = gallery.querySelector('[data-gallery-scrollbar]');
  const scrollbarThumb = gallery.querySelector('[data-gallery-scrollbar-thumb]');
  let currentIndex = 0;

  const updateScrollbar = () => {
    const maxScroll = thumbsTrack.scrollWidth - thumbsTrack.clientWidth;
    const visibleRatio = Math.min(1, thumbsTrack.clientWidth / thumbsTrack.scrollWidth);
    const thumbWidth = visibleRatio * scrollbar.clientWidth;
    const maxThumbX = scrollbar.clientWidth - thumbWidth;
    const progress = maxScroll > 0 ? thumbsTrack.scrollLeft / maxScroll : 0;

    scrollbarThumb.style.width = `${thumbWidth}px`;
    scrollbarThumb.style.transform = `translateX(${progress * maxThumbX}px)`;
    scrollbar.classList.toggle('is-full', maxScroll <= 1);
    scrollbar.setAttribute('aria-disabled', String(maxScroll <= 1));
    scrollbar.setAttribute('aria-valuenow', String(Math.round(progress * 100)));
  };

  const selectMedia = (index) => {
    currentIndex = (index + items.length) % items.length;
    items.forEach((item, itemIndex) => item.classList.toggle('active', itemIndex === currentIndex));
    thumbs.forEach((thumb, thumbIndex) => {
      const isActive = thumbIndex === currentIndex;
      thumb.classList.toggle('active', isActive);
      thumb.setAttribute('aria-pressed', String(isActive));
    });
    const activeThumb = thumbs[currentIndex];
    if (gallery.closest('.member-page')) {
      thumbsTrack.scrollTo({
        left: activeThumb.offsetLeft - ((thumbsTrack.clientWidth - activeThumb.offsetWidth) / 2),
        behavior: 'smooth'
      });
    } else {
      activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  };

  gallery.querySelector('[data-gallery-prev]').addEventListener('click', () => selectMedia(currentIndex - 1));
  gallery.querySelector('[data-gallery-next]').addEventListener('click', () => selectMedia(currentIndex + 1));
  thumbs.forEach((thumb) => thumb.addEventListener('click', () => selectMedia(Number(thumb.dataset.galleryThumb))));
  thumbsTrack.addEventListener('scroll', updateScrollbar, { passive: true });
  window.addEventListener('resize', updateScrollbar);

  scrollbar.addEventListener('pointerdown', (event) => {
    if (scrollbar.classList.contains('is-full')) return;
    scrollbar.setPointerCapture(event.pointerId);

    const moveScrollbar = (pointerEvent) => {
      const bounds = scrollbar.getBoundingClientRect();
      const thumbWidth = scrollbarThumb.offsetWidth;
      const maxThumbX = bounds.width - thumbWidth;
      const targetX = Math.max(0, Math.min(maxThumbX, pointerEvent.clientX - bounds.left - (thumbWidth / 2)));
      const progress = maxThumbX > 0 ? targetX / maxThumbX : 0;
      thumbsTrack.scrollLeft = progress * (thumbsTrack.scrollWidth - thumbsTrack.clientWidth);
    };

    moveScrollbar(event);
    const stopDragging = () => {
      scrollbar.removeEventListener('pointermove', moveScrollbar);
      scrollbar.removeEventListener('pointerup', stopDragging);
      scrollbar.removeEventListener('pointercancel', stopDragging);
    };
    scrollbar.addEventListener('pointermove', moveScrollbar);
    scrollbar.addEventListener('pointerup', stopDragging);
    scrollbar.addEventListener('pointercancel', stopDragging);
  });

  requestAnimationFrame(updateScrollbar);
});
