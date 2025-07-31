// Tab Navigation
document.addEventListener('DOMContentLoaded', function() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            btn.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
            
            // Add haptic feedback for mobile
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        });
    });
});

// Video Loading Function
function loadVideo() {
    const videoWrapper = document.querySelector('.video-wrapper');
    const placeholder = document.querySelector('.video-placeholder');
    
    // Create video element
    const video = document.createElement('video');
    video.controls = true;
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.objectFit = 'cover';
    
    // For demo purposes, using a placeholder video URL
    // In real implementation, replace with actual timelapse video
    video.innerHTML = `
        <source src="asset/tomat.mp4" type="video/mp4">
        <p>Browser Anda tidak mendukung video HTML5.</p>
    `;
    
    // Show loading state
    placeholder.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center;">
            <div style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #e74c3c; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            <p style="margin-top: 1rem;">Memuat video...</p>
        </div>
    `;
    
    // Add CSS for loading spinner
    if (!document.querySelector('#loading-spinner-css')) {
        const style = document.createElement('style');
        style.id = 'loading-spinner-css';
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Simulate loading delay
    setTimeout(() => {
        videoWrapper.innerHTML = '';
        videoWrapper.appendChild(video);
        
        // Add video event listeners
        video.addEventListener('loadstart', () => {
            console.log('Video loading started');
        });
        
        video.addEventListener('canplay', () => {
            console.log('Video can start playing');
        });
        
        video.addEventListener('error', () => {
            videoWrapper.innerHTML = `
                <div class="video-placeholder">
                    <div style="color: #e74c3c; text-align: center;">
                        <span style="font-size: 2rem;">⚠️</span>
                        <p>Video tidak dapat dimuat</p>
                        <small>Silakan coba lagi nanti</small>
                        <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #e74c3c; color: white; border: none; border-radius: 5px; cursor: pointer;">Muat Ulang</button>
                    </div>
                </div>
            `;
        });
    }, 1500);
}

// Reflection Save Function
function saveReflection() {
    const reflection = document.getElementById('reflection').value;
    
    if (reflection.trim() === '') {
        alert('Silakan tulis refleksi Anda terlebih dahulu.');
        return;
    }
    
    // Save to localStorage
    const reflections = JSON.parse(localStorage.getItem('tomatoReflections') || '[]');
    const newReflection = {
        id: Date.now(),
        text: reflection,
        date: new Date().toLocaleDateString('id-ID'),
        timestamp: new Date().toISOString()
    };
    
    reflections.unshift(newReflection);
    localStorage.setItem('tomatoReflections', JSON.stringify(reflections));
    
    // Show success message
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = '✅ Tersimpan!';
    button.style.background = '#27ae60';
    
    // Add haptic feedback
    if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
    }
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '#e74c3c';
        document.getElementById('reflection').value = '';
    }, 2000);
    
    // Show saved reflections count
    updateReflectionCount();
}

// Update reflection count
function updateReflectionCount() {
    const reflections = JSON.parse(localStorage.getItem('tomatoReflections') || '[]');
    const count = reflections.length;
    
    if (count > 0) {
        const reflectionBox = document.querySelector('.reflection-box');
        let countElement = reflectionBox.querySelector('.reflection-count');
        
        if (!countElement) {
            countElement = document.createElement('p');
            countElement.className = 'reflection-count';
            countElement.style.cssText = 'color: #666; font-size: 0.9rem; margin-top: 1rem; text-align: center;';
            reflectionBox.appendChild(countElement);
        }
        
        countElement.textContent = `📝 Anda telah menyimpan ${count} refleksi`;
    }
}

// Initialize reflection count on page load
document.addEventListener('DOMContentLoaded', updateReflectionCount);

// Philosophy card animations
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe philosophy cards
    const cards = document.querySelectorAll('.philosophy-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
});

// Touch gestures for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const swipeDistance = touchEndX - touchStartX;
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
        const currentTab = document.querySelector('.tab-btn.active');
        const tabs = Array.from(document.querySelectorAll('.tab-btn'));
        const currentIndex = tabs.indexOf(currentTab);
        
        let nextIndex;
        if (swipeDistance > 0 && currentIndex > 0) {
            // Swipe right - previous tab
            nextIndex = currentIndex - 1;
        } else if (swipeDistance < 0 && currentIndex < tabs.length - 1) {
            // Swipe left - next tab
            nextIndex = currentIndex + 1;
        }
        
        if (nextIndex !== undefined) {
            tabs[nextIndex].click();
        }
    }
}

// PWA Installation
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Show install button
    const installBtn = document.createElement('button');
    installBtn.textContent = '📱 Install App';
    installBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #e74c3c;
        color: white;
        border: none;
        padding: 0.8rem 1rem;
        border-radius: 25px;
        font-size: 0.9rem;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
        z-index: 1000;
        transition: transform 0.3s ease;
    `;
    
    installBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            
            if (outcome === 'accepted') {
                console.log('PWA installed');
            }
            
            deferredPrompt = null;
            installBtn.remove();
        }
    });
    
    installBtn.addEventListener('mouseenter', () => {
        installBtn.style.transform = 'scale(1.05)';
    });
    
    installBtn.addEventListener('mouseleave', () => {
        installBtn.style.transform = 'scale(1)';
    });
    
    document.body.appendChild(installBtn);
});

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}