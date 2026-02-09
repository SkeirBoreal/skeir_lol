document.addEventListener("DOMContentLoaded", function() {
    async function loadHTMLComponent(selector, file) {
        try {
            const response = await fetch(file);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.text();
            
            const target = document.querySelector(selector);
            if (target) {
                target.outerHTML = data;
            }
        } catch (error) {
            console.error('Error loading HTML component:', error);
        }
    }

    loadHTMLComponent("header", "includes/header.html");
    loadHTMLComponent("footer", "includes/footer.html");
});