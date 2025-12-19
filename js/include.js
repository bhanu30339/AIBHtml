    async function includeHTML() {
        const elements = document.querySelectorAll("[data-include]");

        for (let el of elements) {
            const file = el.getAttribute("data-include");
            const response = await fetch(file);
            const html = await response.text();
            el.innerHTML = html;
        }
    }

    document.addEventListener("DOMContentLoaded", includeHTML);


// // /js/include.js
// async function includeHTML() {
//     const elements = document.querySelectorAll("[data-include]");

//     for (let el of elements) {
//         const file = el.getAttribute("data-include");
//         try {
//             const response = await fetch(file);
//             if (!response.ok) throw new Error(`Failed to load ${file}: ${response.statusText}`);
//             const html = await response.text();
//             el.innerHTML = html;
            
//             // After inserting HTML, initialize components
//             if (file.includes('header')) {
//                 initHeaderComponents();
//             }
//         } catch (error) {
//             console.error(`Error loading ${file}:`, error);
//             el.innerHTML = `<p>Error loading component: ${file}</p>`;
//         }
//     }
// }

// // Initialize header functionality
// function initHeaderComponents() {
//     console.log('Initializing header components...');
    
//     // Mobile Menu Toggle
//     const mobileBtn = document.getElementById("mobileBtn");
//     const mobileMenu = document.getElementById("mobileMenu");

//     if (mobileBtn && mobileMenu) {
//         mobileBtn.addEventListener("click", (e) => {
//             e.stopPropagation();
//             mobileMenu.classList.toggle("open");
//             // Close other dropdowns when mobile menu opens
//             const searchDropdown = document.getElementById("searchDropdown");
//             const languageDropdown = document.getElementById("languageDropdown");
//             if (searchDropdown) searchDropdown.classList.remove("open");
//             if (languageDropdown) languageDropdown.classList.remove("open");
//         });
//     }

//     // Search Dropdown Toggle
//     const searchBtn = document.getElementById("searchBtn");
//     const searchDropdown = document.getElementById("searchDropdown");

//     if (searchBtn && searchDropdown) {
//         searchBtn.addEventListener("click", (e) => {
//             e.stopPropagation();
//             searchDropdown.classList.toggle("open");
//             const languageDropdown = document.getElementById("languageDropdown");
//             if (languageDropdown) languageDropdown.classList.remove("open");
//         });
//     }

//     // Language Dropdown Toggle
//     const languageBtn = document.getElementById("languageBtn");
//     const languageDropdown = document.getElementById("languageDropdown");

//     if (languageBtn && languageDropdown) {
//         languageBtn.addEventListener("click", (e) => {
//             e.stopPropagation();
//             languageDropdown.classList.toggle("open");
//             const searchDropdown = document.getElementById("searchDropdown");
//             if (searchDropdown) searchDropdown.classList.remove("open");
//         });
//     }

//     // Language Selection Functionality
//     const languageButtons = document.querySelectorAll('#languageDropdown button');
//     if (languageButtons.length > 0) {
//         languageButtons.forEach(button => {
//             button.addEventListener('click', (e) => {
//                 e.preventDefault();
//                 const spans = button.querySelectorAll('span');
//                 if (spans.length >= 2) {
//                     const langCode = spans[1].textContent.replace(/[()]/g, '').trim();
//                     const langName = spans[0].textContent.trim();
                    
//                     console.log(`Language selected: ${langName} (${langCode})`);
                    
//                     // Update the button text
//                     const languageBtnSpan = languageBtn.querySelector('span:nth-child(2)');
//                     if (languageBtnSpan) {
//                         languageBtnSpan.textContent = langCode.toUpperCase();
//                     }
                    
//                     // Store language preference
//                     localStorage.setItem('preferredLanguage', langCode);
//                     localStorage.setItem('languageName', langName);
                    
//                     // Show feedback
//                     showLanguageFeedback(langName);
                    
//                     // Close dropdown
//                     languageDropdown.classList.remove('open');
                    
//                     // Trigger language change event
//                     const languageChangeEvent = new CustomEvent('languageChange', {
//                         detail: { code: langCode, name: langName }
//                     });
//                     document.dispatchEvent(languageChangeEvent);
//                 }
//             });
//         });
//     }

//     // Search Functionality
//     const searchInput = document.querySelector('#searchDropdown input');
//     if (searchInput) {
//         searchInput.addEventListener('keypress', (e) => {
//             if (e.key === 'Enter') {
//                 const query = searchInput.value.trim();
//                 if (query) {
//                     performSearch(query);
//                 }
//             }
//         });
//     }

//     // Close dropdowns when clicking outside
//     document.addEventListener('click', (e) => {
//         if (searchBtn && searchDropdown && !searchBtn.contains(e.target) && !searchDropdown.contains(e.target)) {
//             searchDropdown.classList.remove('open');
//         }
//         if (languageBtn && languageDropdown && !languageBtn.contains(e.target) && !languageDropdown.contains(e.target)) {
//             languageDropdown.classList.remove('open');
//         }
//         if (mobileBtn && mobileMenu && !mobileBtn.contains(e.target) && !mobileMenu.contains(e.target) && !e.target.closest('.mobile-item')) {
//             mobileMenu.classList.remove('open');
//         }
//     });

//     // Theme toggle functionality
//     const themeToggleMobile = document.getElementById('themeToggleMobile');
//     if (themeToggleMobile) {
//         themeToggleMobile.addEventListener('click', toggleTheme);
//     }

//     // Load saved language preference
//     loadLanguagePreference();
// }

// // Show language change feedback
// function showLanguageFeedback(langName) {
//     // Remove existing feedback if any
//     const existingFeedback = document.querySelector('.language-feedback');
//     if (existingFeedback) existingFeedback.remove();
    
//     // Create feedback element
//     const feedback = document.createElement('div');
//     feedback.className = 'language-feedback fixed top-24 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
//     feedback.textContent = `Language changed to ${langName}`;
//     feedback.style.animationDuration = '0.5s';
    
//     document.body.appendChild(feedback);
    
//     // Remove after 3 seconds
//     setTimeout(() => {
//         feedback.style.opacity = '0';
//         feedback.style.transition = 'opacity 0.5s';
//         setTimeout(() => feedback.remove(), 500);
//     }, 3000);
// }

// // Load saved language preference
// function loadLanguagePreference() {
//     const savedLang = localStorage.getItem('preferredLanguage');
//     const savedLangName = localStorage.getItem('languageName');
    
//     if (savedLang) {
//         const languageBtn = document.getElementById("languageBtn");
//         if (languageBtn) {
//             const languageBtnSpan = languageBtn.querySelector('span:nth-child(2)');
//             if (languageBtnSpan) {
//                 languageBtnSpan.textContent = savedLang.toUpperCase();
//             }
//         }
//     }
// }

// // Simple search function
// function performSearch(query) {
//     console.log(`Performing search for: ${query}`);
    
//     // For now, just redirect to a search page or show results
//     const searchDropdown = document.getElementById("searchDropdown");
//     if (searchDropdown) {
//         // Clear previous results
//         const oldResults = searchDropdown.querySelector('.search-results');
//         if (oldResults) oldResults.remove();
        
//         // Create results container
//         const resultsDiv = document.createElement('div');
//         resultsDiv.className = 'search-results mt-2 p-2 border-t dark:border-gray-700';
//         resultsDiv.innerHTML = `
//             <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">Search results for: <strong>${query}</strong></div>
//             <div class="text-xs text-gray-500 dark:text-gray-500">(Search functionality would show results here)</div>
//         `;
        
//         searchDropdown.appendChild(resultsDiv);
//     }
// }

// // Theme toggle function
// function toggleTheme() {
//     const html = document.documentElement;
//     if (html.classList.contains('dark')) {
//         html.classList.remove('dark');
//         localStorage.setItem('theme', 'light');
//     } else {
//         html.classList.add('dark');
//         localStorage.setItem('theme', 'dark');
//     }
// }

// // Load saved theme
// function loadTheme() {
//     const savedTheme = localStorage.getItem('theme');
//     if (savedTheme === 'dark') {
//         document.documentElement.classList.add('dark');
//     }
// }

// // Initialize everything when DOM is loaded
// document.addEventListener("DOMContentLoaded", () => {
//     console.log('DOM loaded, initializing...');
//     loadTheme();
//     includeHTML();
// });