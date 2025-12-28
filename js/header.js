function initHeaderMenu() {
  const mobileBtn = document.getElementById('mobileBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  const searchBtn = document.getElementById('searchBtn');
  const searchDropdown = document.getElementById('searchDropdown');

  const languageBtn = document.getElementById('languageBtn');
  const languageDropdown = document.getElementById('languageDropdown');

  if (!mobileBtn || !searchBtn || !languageBtn) {
    console.warn("Header elements not ready");
    return;
  }

  mobileBtn.onclick = (e) => {
    e.stopPropagation();
    mobileMenu.classList.toggle('open');
    searchDropdown.classList.remove('open');
    languageDropdown.classList.remove('open');
  };

  searchBtn.onclick = (e) => {
    e.stopPropagation();
    searchDropdown.classList.toggle('open');
    languageDropdown.classList.remove('open');
    mobileMenu.classList.remove('open');
  };

  languageBtn.onclick = (e) => {
    e.stopPropagation();
    languageDropdown.classList.toggle('open');
    searchDropdown.classList.remove('open');
    mobileMenu.classList.remove('open');
  };

  document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target)) mobileMenu.classList.remove('open');
    if (!searchDropdown.contains(e.target)) searchDropdown.classList.remove('open');
    if (!languageDropdown.contains(e.target)) languageDropdown.classList.remove('open');
  });

  // Close mobile menu when scrolling
  let lastScrollTop = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    
    // Close menu if user scrolls
    if (currentScroll !== lastScrollTop && mobileMenu.classList.contains('open')) {
      mobileMenu.classList.remove('open');
    }
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  }, false);

  // Populate desktop language list
  populateDesktopLanguageList();
  
  // Populate mobile language list
  populateMobileLanguageList();
  
  // Initialize search functionality
  if (typeof initSearch === 'function') {
    initSearch();
  }
}
function googleTranslate(lang) {
  if (!lang) return;

  const normalize = (s) => (s || '').toString();

  const tryApply = () => {
    const select = document.querySelector('.goog-te-combo');
    if (!select) return false;

    // Try exact, underscore and language-only matches
    const candidates = [lang, lang.replace('-', '_'), lang.split('-')[0]];

    let matchedIndex = -1;
    for (let i = 0; i < select.options.length; i++) {
      const optVal = normalize(select.options[i].value).toLowerCase();
      if (candidates.some(c => c && optVal === normalize(c).toLowerCase())) {
        matchedIndex = i;
        break;
      }
    }

    try {
      if (matchedIndex >= 0) {
        select.selectedIndex = matchedIndex;
      } else {
        // fallback: set value directly
        select.value = lang;
      }

      // Dispatch change with bubbles so any listeners pick it up
      const ev = new Event('change', { bubbles: true });
      select.dispatchEvent(ev);

      // Some implementations attach onchange directly
      if (typeof select.onchange === 'function') select.onchange(ev);
      return true;
    } catch (e) {
      return false;
    }
  };

  const interval = setInterval(() => {
    const ok = tryApply();
    if (ok) clearInterval(interval);
  }, 300);

  // Stop trying after 8 seconds
  setTimeout(() => clearInterval(interval), 8000);
}

function showAllLanguages() {
  const container = document.getElementById('allLangContainer');
  if (!container) return;

  // Toggle if already visible
  if (!container.classList.contains('hidden')) {
    container.classList.add('hidden');
    return;
  }

  // Wait for Google Translate select to appear, then clone it into our container
  const waitInterval = setInterval(() => {
    const select = document.querySelector('.goog-te-combo');
    if (select) {
      clearInterval(waitInterval);

      // If we've already injected a clone, just show it
      if (document.getElementById('allLangSelect')) {
        container.classList.remove('hidden');
        return;
      }

      const clone = select.cloneNode(true);
      clone.id = 'allLangSelect';
      clone.classList.add('w-full', 'border', 'rounded', 'px-2', 'py-2', 'mt-2');

      // When user selects from cloned list, trigger translate
      clone.addEventListener('change', function () {
        const val = this.value;
        googleTranslate(val);
      });

      container.appendChild(clone);
      container.classList.remove('hidden');
    }
  }, 300);
}

function populateDesktopLanguageList() {
  const select = document.getElementById('desktopLanguageSelect');
  const listContainer = document.getElementById('desktopLanguageList');
  
  if (!select || !listContainer) return;
  
  // Populate list from select options
  Array.from(select.options).forEach(option => {
    if (option.value) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm border-b dark:border-gray-700 transition-colors';
      btn.textContent = option.text;
      btn.onclick = (e) => {
        e.preventDefault();
        googleTranslate(option.value);
        document.getElementById('languageDropdown').classList.remove('open');
      };
      listContainer.appendChild(btn);
    }
  });
}

function populateMobileLanguageList() {
  const select = document.getElementById('mobileLanguageSelect');
  const listContainer = document.getElementById('mobileLanguageList');
  const toggleBtn = document.getElementById('mobileLanguageToggle');
  
  if (!select || !listContainer || !toggleBtn) return;
  
  // Populate list from select options
  Array.from(select.options).forEach(option => {
    if (option.value) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm border-b border-gray-900 dark:border-gray-700 transition-colors text-blue-900 dark:text-gray-300';
      btn.textContent = option.text;
      btn.onclick = (e) => {
        e.preventDefault();
        googleTranslate(option.value);
        listContainer.classList.add('hidden');
      };
      listContainer.appendChild(btn);
    }
  });
  
  // Toggle list visibility
  toggleBtn.addEventListener('click', (e) => {
    e.preventDefault();
    listContainer.classList.toggle('hidden');
  });
  
  // Close list when clicking outside
  document.addEventListener('click', (e) => {
    if (!toggleBtn.contains(e.target) && !listContainer.contains(e.target)) {
      listContainer.classList.add('hidden');
    }
  });
}

