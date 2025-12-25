function initSearch() {
  const input = document.getElementById("searchInput");
  const resultsBox = document.getElementById("searchResults");

  if (!input || !resultsBox) return;

  input.addEventListener("input", () => {
    const query = input.value.trim().toLowerCase();
    resultsBox.innerHTML = "";

    if (!query) {
      resultsBox.classList.add("hidden");
      return;
    }

    const results = SEARCH_DATA.filter(item =>
  item.title.toLowerCase().includes(query) ||
  item.content.toLowerCase().includes(query)
);


    if (results.length === 0) {
      resultsBox.innerHTML = `<div class="px-4 py-3 text-sm text-gray-500">No results found</div>`;
      resultsBox.classList.remove("hidden");
      return;
    }

    results.forEach(item => {
      const a = document.createElement("a");
      a.href = item.url;
      a.className =
        "block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm";
      a.textContent = item.title;
      resultsBox.appendChild(a);
    });

    resultsBox.classList.remove("hidden");
  });

  document.addEventListener("click", (e) => {
    if (!resultsBox.contains(e.target) && e.target !== input) {
      resultsBox.classList.add("hidden");
    }
  });
}
