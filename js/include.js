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
