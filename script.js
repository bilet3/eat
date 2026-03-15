// Анимация бегущих строк
(function() {
    const word = 'EAT!';
    const repeatCount = 10;
    let content = '';
    for (let i = 0; i < repeatCount; i++) {
        content += '<span>' + word + ' </span>';
    }
    const doubleContent = content + content;

    const trackTop = document.getElementById('trackTop');
    const trackBottom = document.getElementById('trackBottom');
    trackTop.innerHTML = doubleContent;
    trackBottom.innerHTML = doubleContent;

    let offsetTop = 0;
    let offsetBottom = -trackBottom.scrollWidth / 2;
    const speed = 2;

    function step() {
        offsetTop -= speed;
        if (offsetTop <= -trackTop.scrollWidth / 2) {
            offsetTop = 0;
        }
        trackTop.style.transform = `translateX(${offsetTop}px)`;

        offsetBottom -= speed;
        if (offsetBottom <= -trackBottom.scrollWidth) {
            offsetBottom = -trackBottom.scrollWidth / 2;
        }
        trackBottom.style.transform = `translateX(${offsetBottom}px)`;

        requestAnimationFrame(step);
    }
    step();
})();

// Плавное появление секций при скролле
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('section').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});