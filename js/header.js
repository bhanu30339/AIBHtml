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
}
function googleTranslate(lang) {
  const interval = setInterval(() => {
    const select = document.querySelector(".goog-te-combo");
    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event("change"));
      clearInterval(interval);
    }
  }, 300);
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
