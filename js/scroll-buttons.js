// Scroll-to-top and scroll-to-bottom button functionality
document.addEventListener('DOMContentLoaded', function() {
    // Create scroll buttons container
    const scrollButtonsHTML = `
        <div id="scrollButtons" class="fixed right-6 bottom-8 flex flex-col gap-3 z-40">
            <button id="scrollTopBtn" 
                    class="w-12 h-12 bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:shadow-xl hover:scale-110"
                    title="Scroll to top"
                    aria-label="Scroll to top">
                <i class="fas fa-chevron-up text-lg"></i>
            </button>
            <button id="scrollBottomBtn" 
                    class="w-12 h-12 bg-secondary hover:bg-secondary/90 text-primary rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:shadow-xl hover:scale-110"
                    title="Scroll to bottom"
                    aria-label="Scroll to bottom">
                <i class="fas fa-chevron-down text-lg"></i>
            </button>
        </div>
    `;

    // Insert scroll buttons before closing body tag
    document.body.insertAdjacentHTML('beforeend', scrollButtonsHTML);

    const scrollTopBtn = document.getElementById('scrollTopBtn');
    const scrollBottomBtn = document.getElementById('scrollBottomBtn');
    const scrollButtonsContainer = document.getElementById('scrollButtons');

    // Show/hide buttons based on scroll position
    function updateButtonVisibility() {
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY;
        const windowHeight = window.innerHeight;

        // Show scroll top button if user has scrolled down
        scrollTopBtn.classList.toggle('opacity-0 pointer-events-none', scrollTop < 100);
        scrollTopBtn.classList.toggle('opacity-100', scrollTop >= 100);

        // Show scroll bottom button if not at the bottom
        const isAtBottom = scrollTop + windowHeight >= scrollHeight - 100;
        scrollBottomBtn.classList.toggle('opacity-0 pointer-events-none', isAtBottom);
        scrollBottomBtn.classList.toggle('opacity-100', !isAtBottom);
    }

    // Scroll to top functionality
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Scroll to bottom functionality
    scrollBottomBtn.addEventListener('click', function() {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth'
        });
    });

    // Update button visibility on scroll
    window.addEventListener('scroll', updateButtonVisibility);

    // Initial check
    updateButtonVisibility();

    // Add smooth scroll behavior CSS if not already present
    if (!document.querySelector('style[data-scroll-buttons]')) {
        const style = document.createElement('style');
        style.setAttribute('data-scroll-buttons', 'true');
        style.textContent = `
            #scrollButtons button {
                opacity: 1;
                transition: opacity 0.3s ease, transform 0.3s ease;
            }

            #scrollButtons button.opacity-0 {
                opacity: 0;
            }

            #scrollButtons button.pointer-events-none {
                pointer-events: none;
            }

            html {
                scroll-behavior: smooth;
            }
        `;
        document.head.appendChild(style);
    }
});
