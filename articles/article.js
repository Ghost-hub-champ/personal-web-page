// ARTICLE PAGE - READING RHYTHM ANIMATIONS
// Subtle scroll reveals that mimic natural reading flow

document.addEventListener('DOMContentLoaded', () => {
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -10% 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all animated elements
  const elements = document.querySelectorAll(
    '.article-title, .article-content h2, .article-content p, .article-content ul, blockquote, .article-divider'
  );
  
  elements.forEach(el => observer.observe(el));

  console.log('Article loaded. Focus on reading.');
});