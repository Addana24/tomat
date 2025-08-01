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

// Utility function to detect mobile
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Create video element with proper mobile support
function createVideoElement() {
    const video = document.createElement('video');
    
    // Basic attributes
    video.controls = true;
    video.muted = true;
    video.loop = true;
    
    // Mobile-specific attributes
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.preload = 'metadata';
    
    // Styling
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.objectFit = 'cover';
    video.style.borderRadius = '10px';
    
    // Conditional autoplay (tidak di mobile)
    if (!isMobile()) {
        video.autoplay = true;
    }
    
    // Create source element
    const source = document.createElement('source');
    source.src = './asset/tomat.mp4';
    source.type = 'video/mp4';
    video.appendChild(source);
    
    // Fallback text
    const fallback = document.createElement('p');
    fallback.textContent = 'Browser Anda tidak mendukung video HTML5.';
    fallback.style.textAlign = 'center';
    fallback.style.color = '#666';
    fallback.style.padding = '2rem';
    video.appendChild(fallback);
    
    return video;
}

// Video Loading Function - FINAL VERSION
function loadVideo() {
    const videoWrapper = document.querySelector('.video-wrapper');
    const placeholder = document.querySelector('.video-placeholder');
    
    // Show loading state
    placeholder.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center;">
            <div style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #e74c3c; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            <p style="margin-top: 1rem;">Memuat video...</p>
            <small style="color: #666; margin-top: 0.5rem;">Mohon tunggu sebentar</small>
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
    
    // Test if video file exists first
    fetch('./asset/tomat.mp4', { method: 'HEAD' })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Video file not found (${response.status})`);
            }
            return response;
        })
        .then(() => {
            // File exists, proceed with video loading
            setTimeout(() => {
                const video = createVideoElement();
                
                // Add comprehensive event listeners
                video.addEventListener('loadstart', () => {
                    console.log('📹 Video loading started');
                });
                
                video.addEventListener('canplay', () => {
                    console.log('✅ Video can play');
                });
                
                video.addEventListener('play', () => {
                    console.log('▶️ Video playing');
                });
                
                video.addEventListener('pause', () => {
                    console.log('⏸️ Video paused');
                });
                
                video.addEventListener('loadeddata', () => {
                    console.log('📊 Video data loaded');
                });
                
                video.addEventListener('error', (e) => {
                    console.error('❌ Video error:', e);
                    console.error('Error details:', video.error);
                    showVideoError(video.error);
                });
                
                // Replace placeholder with video
                videoWrapper.innerHTML = '';
                videoWrapper.appendChild(video);
                
                // Add mobile-specific instructions
                if (isMobile()) {
                    const mobileHint = document.createElement('p');
                    mobileHint.innerHTML = '📱 <small>Tap video to play • Swipe for controls</small>';
                    mobileHint.style.textAlign = 'center';
                    mobileHint.style.color = '#666';
                    mobileHint.style.fontSize = '0.8rem';
                    mobileHint.style.marginTop = '0.5rem';
                    videoWrapper.appendChild(mobileHint);
                }
                
            }, 1500);
        })
        .catch(error => {
            console.error('❌ Video file check failed:', error);
            showVideoError({ message: error.message });
        });
}

// Show video error with helpful information
function showVideoError(error) {
    const videoWrapper = document.querySelector('.video-wrapper');
    const mobile = isMobile();
    
    videoWrapper.innerHTML = `
        <div class="video-placeholder">
            <div style="color: #e74c3c; text-align: center; padding: 2rem;">
                <span style="font-size: 2rem;">⚠️</span>
                <h3 style="margin: 1rem 0; color: #e74c3c;">Video Tidak Dapat Dimuat</h3>
                
                <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin: 1rem 0; text-align: left;">
                    <p><strong>Path:</strong> ./asset/tomat.mp4</p>
                    <p><strong>Error:</strong> ${error?.message || 'Unknown error'}</p>
                    <p><strong>Device:</strong> ${mobile ? 'Mobile' : 'Desktop'}</p>
                </div>
                
                <div style="color: #666; font-size: 0.9rem; margin: 1rem 0;">
                    ${mobile ? 
                        '<p>🔧 <strong>Solusi untuk Mobile:</strong></p><ul style="text-align: left; display: inline-block;"><li>Pastikan koneksi internet stabil</li><li>Coba refresh halaman</li><li>Buka di browser desktop</li></ul>' : 
                        '<p>🔧 <strong>Solusi untuk Desktop:</strong></p><ul style="text-align: left; display: inline-block;"><li>Periksa folder asset/ ada file tomat.mp4</li><li>Pastikan nama file sesuai (case-sensitive)</li><li>Coba refresh halaman</li></ul>'
                    }
                </div>
                
                <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                    <button onclick="location.reload()" 
                            style="padding: 0.5rem 1rem; background: #e74c3c; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        🔄 Muat Ulang
                    </button>
                    <a href="./asset/tomat.mp4" target="_blank" 
                       style="display: inline-block; padding: 0.5rem 1rem; background: #27ae60; color: white; text-decoration: none; border-radius: 5px;">
                        🔗 Buka Langsung
                    </a>
                </div>
            </div>
        </div>
    `;
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
        navigator.serviceWorker.register('./sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Debug function for testing
function debugVideoPath() {
    console.log('🔍 Testing video path...');
    fetch('./asset/tomat.mp4', { method: 'HEAD' })
        .then(response => {
            if (response.ok) {
                console.log('✅ Video file accessible');
                console.log('📊 Content-Type:', response.headers.get('content-type'));
                console.log('📏 Content-Length:', response.headers.get('content-length'));
            } else {
                console.error('❌ Video file not found:', response.status, response.statusText);
            }
        })
        .catch(error => {
            console.error('❌ Network error:', error);
        });
}

// Auto-run debug on page load (remove in production)
document.addEventListener('DOMContentLoaded', () => {
    console.log('🍅 Filosofi Tomat App loaded');
    console.log('📱 Device:', isMobile() ? 'Mobile' : 'Desktop');
    debugVideoPath();
});