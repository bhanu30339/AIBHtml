// js/dark-mode.js

document.addEventListener("DOMContentLoaded", function () {

    const html = document.documentElement;

    // Apply saved theme on load
    const saved = localStorage.getItem("theme") || "light";
    if (saved === "dark") {
        html.classList.add("dark");
    }

    // Fade animation class setup
    function animateTheme() {
        html.classList.add("theme-transition");
        setTimeout(() => html.classList.remove("theme-transition"), 300);
    }

    // Theme switch function
    function toggleTheme() {
        const isDark = html.classList.contains("dark");

        animateTheme();

        if (isDark) {
            html.classList.remove("dark");
            localStorage.setItem("theme", "light");
        } else {
            html.classList.add("dark");
            localStorage.setItem("theme", "dark");
        }
    }

    // Attach toggle button listeners (desktop + mobile)
    function attachToggle(id) {
        const btn = document.getElementById(id);
        if (btn) btn.addEventListener("click", toggleTheme);
    }

    attachToggle("themeToggle");
    attachToggle("themeToggleMobile");
});
