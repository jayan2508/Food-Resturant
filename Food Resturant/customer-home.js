// Function to get query parameters from the URL
function getQueryParameter(name) {
    const urlSearchParams = new URLSearchParams(window.location.search);
    return urlSearchParams.get(name);
}

document.addEventListener("DOMContentLoaded", function () {
    const openModalBtn = document.getElementById("openModalBtn");
    const viewOrderButton = document.getElementById("viewOrderButton");

    // Retrieve user details from the URL
    const firstName = getQueryParameter("firstName");
    const lastName = getQueryParameter("lastName");
    const role = getQueryParameter("role");

    openModalBtn.addEventListener("click", function () {
        window.location.href = `create-your-order.html?firstName=${firstName}&lastName=${lastName}&role=${role}`;
    });

    viewOrderButton.addEventListener("click", function () {
        window.location.href = `view-your-order.html?firstName=${firstName}&lastName=${lastName}&role=${role}`;
    });

});
function logout() {
    window.location.href = "food-login.html";
}
