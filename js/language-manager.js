// /js/language-manager.js
class SimpleLanguageManager {
    constructor() {
        console.log('LanguageManager initialized');
        this.translations = {
            'EN': {
                'home': 'Home',
                'about': 'About',
                'political': 'Political',
                'strategic': 'Strategic Approach',
                'charity': 'Charity',
                'leadership': 'Leadership',
                'board': 'Board',
                'getInTouch': 'Get in Touch',
                'foundation': 'Foundation',
                'news': 'News',
                'media': 'Media',
                'searchPlaceholder': 'Search website...',
                'selectLanguage': 'Select Language'
            },
            'HI': {
                'home': 'होम',
                'about': 'हमारे बारे में',
                'political': 'राजनीतिक',
                'strategic': 'रणनीतिक दृष्टिकोण',
                'charity': 'चैरिटी',
                'leadership': 'नेतृत्व',
                'board': 'बोर्ड',
                'getInTouch': 'संपर्क करें',
                'foundation': 'फाउंडेशन',
                'news': 'समाचार',
                'media': 'मीडिया',
                'searchPlaceholder': 'वेबसाइट खोजें...',
                'selectLanguage': 'भाषा चुनें'
            },
            'ES': {
                'home': 'Inicio',
                'about': 'Acerca de',
                'political': 'Político',
                'strategic': 'Enfoque Estratégico',
                'charity': 'Caridad',
                'leadership': 'Liderazgo',
                'board': 'Junta',
                'getInTouch': 'Contáctenos',
                'foundation': 'Fundación',
                'news': 'Noticias',
                'media': 'Medios',
                'searchPlaceholder': 'Buscar en el sitio web...',
                'selectLanguage': 'Seleccionar idioma'
            }
        };
        
        this.currentLang = localStorage.getItem('preferredLanguage') || 'EN';
        this.init();
    }
    
    init() {
        console.log('LanguageManager init, current lang:', this.currentLang);
        
        // Listen for language change events
        document.addEventListener('languageChange', (e) => {
            console.log('Language change event received:', e.detail);
            this.setLanguage(e.detail.code);
        });
        
        // Initial translation
        setTimeout(() => this.translatePage(), 100);
    }
    
    setLanguage(langCode) {
        const normalizedLang = langCode.toUpperCase();
        console.log('Setting language to:', normalizedLang);
        
        if (this.translations[normalizedLang]) {
            this.currentLang = normalizedLang;
            localStorage.setItem('preferredLanguage', normalizedLang);
            this.translatePage();
        } else {
            console.error('Language not found:', normalizedLang);
        }
    }
    
    translatePage() {
        console.log('Translating page to:', this.currentLang);
        
        // Update HTML lang attribute
        document.documentElement.lang = this.currentLang.toLowerCase();
        
        // Translate all elements with data-translate attribute
        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.getAttribute('data-translate');
            const translation = this.translations[this.currentLang]?.[key];
            
            if (translation) {
                if (el.tagName === 'INPUT' && el.type === 'text') {
                    el.placeholder = translation;
                } else {
                    el.textContent = translation;
                }
                console.log(`Translated ${key} to ${translation}`);
            }
        });
        
        // Update language dropdown title
        const dropdownTitle = document.querySelector('.language-dropdown .px-4.py-2.text-xs');
        if (dropdownTitle && this.translations[this.currentLang]?.selectLanguage) {
            dropdownTitle.textContent = this.translations[this.currentLang].selectLanguage;
        }
    }
    
    getTranslation(key) {
        return this.translations[this.currentLang]?.[key] || key;
    }
}

// Initialize language manager immediately
window.languageManager = new SimpleLanguageManager();