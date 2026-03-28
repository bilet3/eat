// ========== Анимация бегущих строк ==========
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
    if (trackTop && trackBottom) {
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
    }
})();

// ========== Плавное появление секций ==========
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

// ========== ПОДКЛЮЧЕНИЕ К SUPABASE ==========
const SUPABASE_URL = 'https://baxsvodhzgylczbmbufb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_G20irQKnTp9XhGqhjEmrKQ_I-w9Lhhe';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function loadRestaurants() {
    const container = document.getElementById('restaurants-container');
    
    if (!container) {
        console.error('Контейнер не найден');
        return;
    }
    
    try {
        console.log('Загружаем рестораны...');
        
        // Запрашиваем image_url вместе с остальными полями
        const { data, error } = await supabaseClient
            .from('restaurants')
            .select('id, name, address, image_url') // добавляем image_url
            .order('name');
        
        if (error) {
            console.error('Ошибка:', error);
            container.innerHTML = `<div class="col-12 text-center py-5"><p class="text-danger">Ошибка: ${error.message}</p></div>`;
            return;
        }
        
        console.log('Получено ресторанов:', data?.length || 0);
        
        if (!data || data.length === 0) {
            container.innerHTML = `<div class="col-12 text-center py-5"><p>Нет ресторанов в базе данных</p></div>`;
            return;
        }
        
        // Генерируем карточки, используя image_url из базы
        container.innerHTML = data.map((restaurant) => {
            // Если image_url не заполнен, используем заглушку
            const imageUrl = restaurant.image_url || 'https://placehold.co/600x400?text=No+Image';
            
            return `
                <div class="col">
                    <div class="card restaurant-card h-100 border-0 overflow-hidden">
                        <img src="${imageUrl}" class="card-img-top" alt="${restaurant.name}" style="height: 200px; object-fit: cover;">
                        <div class="card-body p-0 pt-3">
                            <h5 class="card-title fw-medium text-uppercase mb-1">${restaurant.name}</h5>
                            <p class="card-text fw-bold text-secondary mb-0">${restaurant.address}</p>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
    } catch (err) {
        console.error('Критическая ошибка:', err);
        container.innerHTML = `<div class="col-12 text-center py-5"><p class="text-danger">Ошибка: ${err.message}</p></div>`;
    }
}

// Запускаем загрузку
document.addEventListener('DOMContentLoaded', loadRestaurants);