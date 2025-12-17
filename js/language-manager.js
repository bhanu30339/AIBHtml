// /js/language-manager.js
class LanguageManager {
    constructor() {
        this.translations = {
            'en': {
                // Navigation
                'home': 'Home',
                'about': 'About',
                'political': 'Political',
                'strategic': 'Strategic Approach',
                'charity': 'Charity',
                'leadership': 'Leadership',
                'board': 'Board',
                'getInTouch': 'Get in Touch',
                
                // Page specific - can be extended per page
                'welcome': 'Welcome to AIBF',
                'mission': 'Our Mission',
                'vision': 'Our Vision'
            },
            'hi': {
                'home': 'होम',
                'about': 'हमारे बारे में',
                'political': 'राजनीतिक',
                'strategic': 'रणनीतिक दृष्टिकोण',
                'charity': 'चैरिटी',
                'leadership': 'नेतृत्व',
                'board': 'बोर्ड',
                'getInTouch': 'संपर्क करें',
                
                'welcome': 'एआईबीएफ में आपका स्वागत है',
                'mission': 'हमारा मिशन',
                'vision': 'हमारी दृष्टि'
            },
            'zh': {
                'home': '首页',
                'about': '关于我们',
                'political': '政治',
                'strategic': '战略方针',
                'charity': '慈善',
                'leadership': '领导',
                'board': '董事会',
                'getInTouch': '联系我们',
                
                'welcome': '欢迎来到 AIBF',
                'mission': '我们的使命',
                'vision': '我们的愿景'
            },
            'es': {
                'home': 'Inicio',
                'about': 'Acerca de',
                'political': 'Político',
                'strategic': 'Enfoque Estratégico',
                'charity': 'Caridad',
                'leadership': 'Liderazgo',
                'board': 'Junta',
                'getInTouch': 'Contáctenos',
                
                'welcome': 'Bienvenido a AIBF',
                'mission': 'Nuestra Misión',
                'vision': 'Nuestra Visión'
            },
            'ar': {
                'home': 'الصفحة الرئيسية',
                'about': 'معلومات عنا',
                'political': 'السياسية',
                'strategic': 'النهج الاستراتيجي',
                'charity': 'الجمعية الخيرية',
                'leadership': 'القيادة',
                'board': 'المجلس',
                'getInTouch': 'تواصل معنا',
                
                'welcome': 'مرحبًا بكم في AIBF',
                'mission': 'مهمتنا',
                'vision': 'رؤيتنا'
            }
        };
        
        this.currentLang = localStorage.getItem('preferredLanguage') || 'en';
        this.init();
    }
    
    init() {
        // Listen for language change events
        document.addEventListener('languageChange', (e) => {
            this.setLanguage(e.detail.code);
        });
        
        // Initial translation
        this.translatePage();
    }
    
    setLanguage(langCode) {
        if (this.translations[langCode]) {
            this.currentLang = langCode;
            localStorage.setItem('preferredLanguage', langCode);
            this.translatePage();
        }
    }
    
    translatePage() {
        // Translate all elements with data-translate attribute
        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.getAttribute('data-translate');
            if (this.translations[this.currentLang] && this.translations[this.currentLang][key]) {
                el.textContent = this.translations[this.currentLang][key];
            }
        });
        
        // Update HTML lang attribute
        document.documentElement.lang = this.currentLang;
        
        // Dispatch event for other components to react
        document.dispatchEvent(new CustomEvent('pageTranslated', {
            detail: { language: this.currentLang }
        }));
    }
    
    getTranslation(key) {
        return this.translations[this.currentLang]?.[key] || key;
    }
}

// Initialize language manager
window.languageManager = new LanguageManager();