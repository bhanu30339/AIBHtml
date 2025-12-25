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
