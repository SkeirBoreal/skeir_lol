document.addEventListener("DOMContentLoaded", function() {
    function loadHTMLComponent(selector, file) {
        fetch(file)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                document.querySelector(selector).innerHTML = data;
            })
            .catch(error => console.error('Error loading HTML component:', error));
    }

    loadHTMLComponent("header", "includes/header.html");
    loadHTMLComponent("footer", "includes/footer.html");
});
