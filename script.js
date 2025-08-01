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

// Device Detection Functions
function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function isSafari() {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

// Video Loading Function - OPTIMIZED FOR IPHONE
function loadVideo() {
    const videoWrapper = document.querySelector('.video-wrapper');
    const placeholder = document.querySelector('.video-placeholder');
    
    console.log('🔍 Device Detection:');
    console.log('iOS:', isIOS());
    console.log('Mobile:', isMobile());
    console.log('Safari:', isSafari());
    
    if (isIOS()) {
        console.log('🍎 Loading iOS-optimized video');
        loadIOSVideo();
    } else if (isMobile()) {
        console.log('📱 Loading mobile-optimized video');
        loadMobileVideo();
    } else {
        console.log('🖥️ Loading desktop video');
        loadDesktopVideo();
    }
}

// iOS-Specific Video Loading
function loadIOSVideo() {
    const videoWrapper = document.querySelector('.video-wrapper');
    
    // Show loading first
    videoWrapper.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 2rem;">
            <div style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #e74c3c; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 1rem;"></div>
            <p>Menyiapkan video untuk iOS...</p>
        </div>
    `;
    
    // Add spinner CSS
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
    
    // Test video accessibility first
    fetch('./asset/tomat.mp4', { method: 'HEAD' })
        .then(response => {
            if (response.ok) {
                console.log('✅ Video file accessible for iOS');
                setupIOSVideoPlayer();
            } else {
                console.log('❌ Video file not accessible, using fallback');
                showIOSFallback();
            }
        })
        .catch(error => {
            console.error('❌ Video test failed:', error);
            showIOSFallback();
        });
}

function setupIOSVideoPlayer() {
    const videoWrapper = document.querySelector('.video-wrapper');
    
    videoWrapper.innerHTML = `
        <div style="position: relative; width: 100%; height: 100%; background: linear-gradient(135deg, #e74c3c, #c0392b); border-radius: 10px; display: flex; align-items: center; justify-content: center;">
            
            <!-- Hidden Video Element -->
            <video 
                id="ios-video"
                controls 
                muted 
                playsinline
                webkit-playsinline
                preload="none"
                x-webkit-airplay="allow"
                style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px; display: none; background: #000;"
                poster="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 250'><rect width='400' height='250' fill='%23e74c3c'/><text x='200' y='120' text-anchor='middle' fill='white' font-size='30'>🍅</text><text x='200' y='150' text-anchor='middle' fill='white' font-size='16'>Timelapse Tomat</text></svg>">
                
                <source src="./asset/tomat.mp4" type="video/mp4">
                
                <!-- iOS Fallback -->
                <div style="padding: 2rem; text-align: center; color: white;">
                    <p>Video tidak dapat dimuat di Safari iOS</p>
                    <a href="./asset/tomat.mp4" target="_blank" style="color: #fff; text-decoration: underline;">Buka video langsung</a>
                </div>
            </video>
            
            <!-- iOS Custom Play Button -->
            <div id="ios-play-overlay" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(0,0,0,0.3); border-radius: 10px; cursor: pointer; transition: all 0.3s ease;">
                
                <div style="width: 100px; height: 100px; background: rgba(255,255,255,0.9); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem; box-shadow: 0 4px 20px rgba(0,0,0,0.3); transition: transform 0.3s ease;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                    <span style="color: #e74c3c; font-size: 2.5rem; margin-left: 8px;">▶</span>
                </div>
                
                <div style="text-align: center; color: white;">
                    <h3 style="margin: 0 0 0.5rem 0; font-size: 1.2rem; font-weight: bold;">Timelapse Pertumbuhan Tomat</h3>
                    <p style="margin: 0; opacity: 0.9; font-size: 0.9rem;">Tap untuk memutar video</p>
                    <small style="opacity: 0.7; font-size: 0.8rem;">Optimized for iOS Safari</small>
                </div>
                
            </div>
            
        </div>
    `;
    
    // iOS Play Handler
    const playOverlay = document.getElementById('ios-play-overlay');
    const video = document.getElementById('ios-video');
    
    playOverlay.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('🍎 iOS play overlay clicked');
        
        // Add loading state to overlay
        playOverlay.innerHTML = `
            <div style="text-align: center; color: white;">
                <div style="width: 60px; height: 60px; border: 4px solid rgba(255,255,255,0.3); border-top: 4px solid white; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
                <p>Memuat video...</p>
            </div>
        `;
        
        // Setup video events BEFORE loading
        video.addEventListener('loadstart', function() {
            console.log('📹 iOS video loading started');
        });
        
        video.addEventListener('loadedmetadata', function() {
            console.log('📊 iOS video metadata loaded');
        });
        
        video.addEventListener('canplay', function() {
            console.log('✅ iOS video can play');
            
            // Hide overlay and show video
            playOverlay.style.display = 'none';
            video.style.display = 'block';
            
            // Try to play
            const playPromise = video.play();
            
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        console.log('🎬 iOS video playing successfully');
                    })
                    .catch(error => {
                        console.error('❌ iOS video play failed:', error);
                        showIOSPlayError(error);
                    });
            }
        });
        
        video.addEventListener('error', function(e) {
            console.error('❌ iOS video error:', e);
            console.error('Error code:', video.error?.code);
            console.error('Error message:', video.error?.message);
            showIOSVideoError(video.error);
        });
        
        video.addEventListener('stalled', function() {
            console.warn('⚠️ iOS video stalled');
        });
        
        video.addEventListener('waiting', function() {
            console.warn('⏳ iOS video waiting');
        });
        
        // Force load the video
        video.load();
        
        // Fallback timeout
        setTimeout(() => {
            if (video.readyState === 0) {
                console.error('⏰ iOS video load timeout');
                showIOSVideoError({ message: 'Video load timeout' });
            }
        }, 10000);
    });
}

function showIOSVideoError(error) {
    const videoWrapper = document.querySelector('.video-wrapper');
    
    videoWrapper.innerHTML = `
        <div style="padding: 2rem; text-align: center; background: #f8f9fa; border-radius: 10px; border: 2px dashed #e74c3c;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">🍎</div>
            <h3 style="color: #e74c3c; margin-bottom: 1rem;">Video Tidak Kompatibel dengan iOS Safari</h3>
            
            <div style="background: #fff; padding: 1.5rem; border-radius: 8px; margin: 1.5rem 0; text-align: left;">
                <p style="margin: 0 0 1rem 0; font-weight: bold; color: #333;">Kemungkinan Penyebab:</p>
                <ul style="color: #666; margin: 0; padding-left: 1.5rem; line-height: 1.6;">
                    <li>Format video tidak didukung iOS Safari</li>
                    <li>Video memerlukan codec H.264 + AAC</li>
                    <li>File video terlalu besar untuk mobile</li>
                    <li>Koneksi internet tidak stabil</li>
                </ul>
                
                ${error?.message ? `<p style="margin-top: 1rem; padding: 0.5rem; background: #ffe6e6; border-radius: 4px; font-size: 0.9rem; color: #d63031;"><strong>Error:</strong> ${error.message}</p>` : ''}
            </div>
            
            <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                <a href="./asset/tomat.mp4" target="_blank" 
                   style="display: inline-block; padding: 1rem 1.5rem; background: #e74c3c; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; box-shadow: 0 2px 10px rgba(231,76,60,0.3);">
                    📱 Buka di App Video
                </a>
                <button onclick="location.reload()" 
                        style="padding: 1rem 1.5rem; background: #666; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">
                    🔄 Coba Lagi
                </button>
            </div>
            
            <div style="margin-top: 2rem; padding: 1rem; background: #e8f4fd; border-radius: 8px;">
                <p style="margin: 0; color: #0066cc; font-size: 0.9rem;">
                    💡 <strong>Tip:</strong> Coba buka website ini di <strong>Chrome</strong> atau <strong>Firefox</strong> mobile untuk hasil terbaik
                </p>
            </div>
        </div>
    `;
}

function showIOSPlayError(error) {
    const videoWrapper = document.querySelector('.video-wrapper');
    
    videoWrapper.innerHTML = `
        <div style="padding: 2rem; text-align: center; background: #fff3cd; border-radius: 10px; border: 2px solid #ffc107;">
            <div style="font-size: 2rem; margin-bottom: 1rem;">⚠️</div>
            <h3 style="color: #856404; margin-bottom: 1rem;">Video Tidak Dapat Diputar</h3>
            <p style="color: #856404; margin-bottom: 1.5rem;">iOS Safari memblokir pemutaran video otomatis</p>
            
            <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                <button onclick="document.getElementById('ios-video').play()" 
                        style="padding: 1rem 1.5rem; background: #e74c3c; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">
                    ▶️ Coba Putar Manual
                </button>
                <a href="./asset/tomat.mp4" target="_blank" 
                   style="display: inline-block; padding: 1rem 1.5rem; background: #28a745; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
                    🔗 Buka Langsung
                </a>
            </div>
        </div>
    `;
}

function showIOSFallback() {
    const videoWrapper = document.querySelector('.video-wrapper');
    
    videoWrapper.innerHTML = `
        <div style="padding: 2rem; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">🍅</div>
            <h3 style="margin-bottom: 1rem;">Timelapse Pertumbuhan Tomat</h3>
            <p style="opacity: 0.9; margin-bottom: 2rem; line-height: 1.6;">
                Saksikan perjalanan menakjubkan dari benih kecil hingga menjadi buah tomat yang matang
            </p>
            
            <div style="background: rgba(255,255,255,0.1); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
                <p style="margin: 0; font-size: 0.9rem; opacity: 0.8;">
                    Video sedang dioptimalkan untuk perangkat iOS
                </p>
            </div>
            
            <a href="./asset/tomat.mp4" target="_blank" 
               style="display: inline-block; padding: 1rem 2rem; background: rgba(255,255,255,0.2); color: white; text-decoration: none; border-radius: 25px; font-weight: bold; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.3);">
                📱 Tonton Video
            </a>
        </div>
    `;
}

// Mobile Video (Non-iOS)
function loadMobileVideo() {
    const videoWrapper = document.querySelector('.video-wrapper');
    
    videoWrapper.innerHTML = `
        <video 
            controls 
            muted 
            playsinline
            preload="metadata"
            style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;">
            
            <source src="./asset/tomat.mp4" type="video/mp4">
            
            <div style="padding: 2rem; text-align: center; background: #f8f9fa;">
                <p style="color: #e74c3c;">Video tidak dapat dimuat di perangkat mobile ini</p>
                <a href="./asset/tomat.mp4" target="_blank" style="color: #e74c3c;">Buka video langsung</a>
            </div>
        </video>
    `;
}

// Desktop Video
function loadDesktopVideo() {
    const videoWrapper = document.querySelector('.video-wrapper');
    const placeholder = document.querySelector('.video-placeholder');
    
    placeholder.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center;">
            <div style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #e74c3c; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            <p style="margin-top: 1rem;">Memuat video...</p>
        </div>
    `;
    
    setTimeout(() => {
        const video = document.createElement('video');
        video.controls = true;
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'cover';
        video.style.borderRadius = '10px';
        
        video.src = './asset/tomat.mp4';
        
        video.addEventListener('error', () => {
            videoWrapper.innerHTML = `
                <div style="padding: 2rem; text-align: center; background: #f8f9fa; border-radius: 10px;">
                    <p style="color: #e74c3c; font-weight: bold;">❌ Video tidak dapat dimuat</p>
                    <p style="color: #666;">Pastikan file tomat.mp4 ada di folder asset/</p>
                </div>
            `;
        });
        
        videoWrapper.innerHTML = '';
        videoWrapper.appendChild(video);
    }, 1000);
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

// Debug logging
document.addEventListener('DOMContentLoaded', () => {
    console.log('🍅 Filosofi Tomat App loaded');
    console.log('📱 Device Info:');
    console.log('- iOS:', isIOS());
    console.log('- Mobile:', isMobile());
    console.log('- Safari:', isSafari());
    console.log('- User Agent:', navigator.userAgent);
    
    // Test video file accessibility
    fetch('./asset/tomat.mp4', { method: 'HEAD' })
        .then(response => {
            console.log('🎬 Video file status:', response.status);
            console.log('📊 Content-Type:', response.headers.get('content-type'));
            console.log('📏 Content-Length:', response.headers.get('content-length'));
        })
        .catch(error => {
            console.error('❌ Video file test failed:', error);
        });
});