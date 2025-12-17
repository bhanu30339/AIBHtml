// /js/search.js
class SiteSearch {
    constructor() {
        this.searchIndex = [];
        this.init();
    }
    
    async init() {
        // Fetch search index (you'll need to create this)
        try {
            const response = await fetch('/search-index.json');
            this.searchIndex = await response.json();
        } catch (error) {
            console.error('Failed to load search index:', error);
        }
    }
    
    search(query) {
        if (!this.searchIndex.length || !query.trim()) return [];
        
        const searchTerm = query.toLowerCase();
        return this.searchIndex.filter(item => {
            return item.title.toLowerCase().includes(searchTerm) ||
                   item.content.toLowerCase().includes(searchTerm) ||
                   item.keywords.toLowerCase().includes(searchTerm);
        });
    }
}

// Initialize search
window.siteSearch = new SiteSearch();