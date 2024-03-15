document.addEventListener("DOMContentLoaded", function () {
    const orderList = document.getElementById("orderList");
    const dataNotFound = document.getElementById("dataNotFound");
    const logoutButton = document.getElementById("logoutButton");

    // Function to get query parameters from the URL
    function getQueryParameter(name) {
        const urlSearchParams = new URLSearchParams(window.location.search);
        return urlSearchParams.get(name);
    }

    const firstName = getQueryParameter("firstName");
    const lastName = getQueryParameter("lastName");

    logoutButton.addEventListener("click", function () {
        window.location.href = "food-login.html";
    });

    function createRestaurantCard(restaurant) {
        const card = document.createElement("div");
        card.classList.add("restaurant-card");

        const image = document.createElement("img");
        image.src = restaurant.imageURL;
        image.alt = restaurant.restaurantName;

        image.style.width = "200px";
        image.style.height = "200px";
        image.style.borderRadius = "5px";
        image.style.objectFit = "cover";

        const foodItem = document.createElement("p");
        foodItem.textContent = restaurant.foodItem;

        const foodType = document.createElement("p");
        foodType.textContent = `(${restaurant.foodType})`;

        const price = document.createElement("p");
        price.textContent = "Price: $" + restaurant.price;

        const restaurantName = document.createElement("p");
        restaurantName.textContent = restaurant.restaurantName;
        restaurantName.classList.add("restaurant-name");

        card.appendChild(image);
        card.appendChild(foodItem);
        card.appendChild(foodType);
        card.appendChild(price);
        card.appendChild(restaurantName);

        return card;
    }

    function displayOrderList() {
        orderList.innerHTML = ""; // Clear the existing content

        const orderListData = JSON.parse(localStorage.getItem("orderList")) || [];

        if (orderListData.length === 0) {
            dataNotFound.style.display = "block"; // Show the "Data not found" message
        } else {
            dataNotFound.style.display = "none"; // Hide the message if there are items

            // Filter order list items by first name and last name
            const userOrderList = orderListData.filter(item => item.firstName === firstName && item.lastName === lastName);

            if (userOrderList.length === 0) {
                dataNotFound.style.display = "block"; // Show the "Data not found" message
            } else {
                dataNotFound.style.display = "none"; // Hide the message if there are items

                userOrderList.forEach((restaurant) => {
                    const card = createRestaurantCard(restaurant);
                    orderList.appendChild(card);
                });
            }
        }
    }

    displayOrderList(); // Initial display of the order list
});
