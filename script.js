// Indonesian Historical Timeline Experience
class IndonesianTimeline {
    constructor() {
        this.currentYear = 1200;
        this.startYear = 1200;
        this.endYear = 2025;
        this.eras = [
            { name: 'Kerajaan Singhasari', start: 1222, end: 1292, color: '#8B4513', bgGradient: 'linear-gradient(135deg, #8B4513, #A0522D)' },
            { name: 'Kerajaan Majapahit', start: 1293, end: 1527, color: '#CD853F', bgGradient: 'linear-gradient(135deg, #CD853F, #DAA520)' },
            { name: 'Masuknya Pengaruh Islam', start: 1200, end: 1596, color: '#228B22', bgGradient: 'linear-gradient(135deg, #228B22, #006400)' },
            { name: 'Era Kolonialisme', start: 1596, end: 1945, color: '#8B0000', bgGradient: 'linear-gradient(135deg, #8B0000, #800000)' },
            { name: 'Perang Kemerdekaan', start: 1945, end: 1949, color: '#FF4500', bgGradient: 'linear-gradient(135deg, #FF4500, #FF8C00)' },
            { name: 'Indonesia Modern', start: 1950, end: 2025, color: '#FFD700', bgGradient: 'linear-gradient(135deg, #FFD700, #FF6347)' }
        ];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateDisplay();
        this.setupScrollEffects();
        this.setupParallax();
    }

    setupEventListeners() {
        window.addEventListener('scroll', () => this.handleScroll());
        window.addEventListener('resize', () => this.updateDisplay());
    }

    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = scrollTop / scrollHeight;
        
        this.currentYear = Math.round(this.startYear + (scrollPercent * (this.endYear - this.startYear)));
        this.updateDisplay();
        this.updateBackground();
        this.updateEraLabel();
        this.updateParallax();
    }

    updateDisplay() {
        const yearElement = document.getElementById('current-year');
        if (yearElement) {
            yearElement.textContent = this.currentYear.toLocaleString();
        }
    }

    updateEraLabel() {
        const eraLabel = document.getElementById('era-label');
        if (!eraLabel) return;

        const currentEra = this.getCurrentEra();
        eraLabel.textContent = currentEra.name;
        
        // Add transition effect
        eraLabel.style.opacity = '0.7';
        setTimeout(() => {
            eraLabel.style.opacity = '1';
        }, 300);
    }

    getCurrentEra() {
        for (let era of this.eras) {
            if (this.currentYear >= era.start && this.currentYear <= era.end) {
                return era;
            }
        }
        return this.eras[this.eras.length - 1];
    }

    updateBackground() {
        const scrollPercent = (this.currentYear - this.startYear) / (this.endYear - this.startYear);
        
        // Smooth color transition based on era
        const currentEra = this.getCurrentEra();
        const nextEraIndex = Math.min(this.eras.indexOf(currentEra) + 1, this.eras.length - 1);
        const nextEra = this.eras[nextEraIndex];
        
        // Calculate transition between eras
        const eraRange = nextEra.start - currentEra.start;
        const eraProgress = (this.currentYear - currentEra.start) / eraRange;
        const clampedProgress = Math.max(0, Math.min(1, eraProgress));
        
        // Update background
        this.setBackgroundGradient(scrollPercent);
    }

    setBackgroundGradient(scrollPercent) {
        const body = document.body;
        
        // Define era-specific color stops
        const colors = [
            { percent: 0, color: '#8B4513' },      // Singhasari - Ancient earth
            { percent: 0.15, color: '#CD853F' },   // Majapahit - Gold
            { percent: 0.3, color: '#228B22' },    // Islamic - Green
            { percent: 0.45, color: '#8B0000' },   // Colonial - Dark red
            { percent: 0.6, color: '#FF4500' },    // Awakening - Orange
            { percent: 0.75, color: '#FFD700' },   // Independence - Gold
            { percent: 0.9, color: '#FF6347' },    // Modern - Tomato
            { percent: 1, color: '#DC143C' }       // Present - Crimson
        ];
        
        // Find the two colors to interpolate between
        let startColor = colors[0];
        let endColor = colors[colors.length - 1];
        
        for (let i = 0; i < colors.length - 1; i++) {
            if (scrollPercent >= colors[i].percent && scrollPercent <= colors[i + 1].percent) {
                startColor = colors[i];
                endColor = colors[i + 1];
                break;
            }
        }
        
        // Calculate interpolation factor
        const range = endColor.percent - startColor.percent;
        const progress = (scrollPercent - startColor.percent) / range;
        
        // Create gradient
        const gradient = `linear-gradient(to bottom, ${startColor.color} 0%, ${this.interpolateColor(startColor.color, endColor.color, progress)} 100%)`;
        
        body.style.background = gradient;
    }

    interpolateColor(color1, color2, factor) {
        // Convert hex to RGB
        const hex1 = color1.replace('#', '');
        const hex2 = color2.replace('#', '');
        
        const r1 = parseInt(hex1.substr(0, 2), 16);
        const g1 = parseInt(hex1.substr(2, 2), 16);
        const b1 = parseInt(hex1.substr(4, 2), 16);
        
        const r2 = parseInt(hex2.substr(0, 2), 16);
        const g2 = parseInt(hex2.substr(2, 2), 16);
        const b2 = parseInt(hex2.substr(4, 2), 16);
        
        const r = Math.round(r1 + (r2 - r1) * factor);
        const g = Math.round(g1 + (g2 - g1) * factor);
        const b = Math.round(b1 + (b2 - b1) * factor);
        
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    setupScrollEffects() {
        // Remove parallax effect from historical figures to prevent overlap
        // Only keep fade-in effects for better user experience
        
        // Add intersection observer for fade-in effects
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);

        // Observe all eras
        document.querySelectorAll('.era').forEach(era => {
            observer.observe(era);
        });

        // Observe historical figures for individual fade-in
        document.querySelectorAll('.historical-figure').forEach(figure => {
            observer.observe(figure);
        });
    }

    setupParallax() {
        // Create parallax layers
        const parallaxContainer = document.createElement('div');
        parallaxContainer.className = 'parallax-container';
        
        // Add subtle parallax elements
        for (let i = 0; i < 3; i++) {
            const layer = document.createElement('div');
            layer.className = `parallax-layer parallax-layer-${i + 1}`;
            layer.style.animationDelay = `${i * 2}s`;
            document.body.appendChild(layer);
        }
    }

    updateParallax() {
        const scrollTop = window.pageYOffset;
        const parallaxLayers = document.querySelectorAll('.parallax-layer');
        
        parallaxLayers.forEach((layer, index) => {
            const speed = 0.5 + (index * 0.2);
            const yPos = -(scrollTop * speed * 0.05);
            layer.style.transform = `translateY(${yPos}px)`;
        });
    }

    // Add smooth scrolling to specific years
    scrollToYear(year) {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const targetScroll = ((year - this.startYear) / (this.endYear - this.startYear)) * scrollHeight;
        
        window.scrollTo({
            top: targetScroll,
            behavior: 'smooth'
        });
    }
}

// Initialize the timeline when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const timeline = new IndonesianTimeline();
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === ' ') {
            e.preventDefault();
            window.scrollBy({ top: 100, behavior: 'smooth' });
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            window.scrollBy({ top: -100, behavior: 'smooth' });
        }
    });

    // Add touch/swipe support for mobile
    let touchStartY = 0;
    let touchEndY = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartY = e.changedTouches[0].screenY;
    });

    document.addEventListener('touchend', (e) => {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartY - touchEndY;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe up - scroll down
                window.scrollBy({ top: 200, behavior: 'smooth' });
            } else {
                // Swipe down - scroll up
                window.scrollBy({ top: -200, behavior: 'smooth' });
            }
        }
    }
});

// Add CSS for fade-in animation
const style = document.createElement('style');
style.textContent = `
    .era {
        opacity: 0;
        transform: translateY(50px);
        transition: opacity 0.8s ease, transform 0.8s ease;
    }
    
    .era.fade-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .historical-figure {
        transition: all 0.4s ease;
    }
    
    .historical-figure:hover {
        transform: scale(1.05) translateY(-5px);
    }
    
    .parallax-layer {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
    }
    
    .parallax-layer-1 {
        background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="25" cy="25" r="0.5" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="50" r="0.5" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="75" r="0.5" fill="rgba(255,255,255,0.1)"/></svg>');
    }
    
    .parallax-layer-2 {
        background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M15,60 Q35,20 55,60 T95,60" stroke="rgba(255,255,255,0.05)" stroke-width="0.3" fill="none"/></svg>');
    }
    
    .parallax-layer-3 {
        background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="20,20 25,15 30,20 25,25" fill="rgba(255,255,255,0.03)"/><polygon points="70,40 75,35 80,40 75,45" fill="rgba(255,255,255,0.03)"/></svg>');
    }
`;
document.head.appendChild(style);
