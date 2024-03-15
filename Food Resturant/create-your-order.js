document.addEventListener("DOMContentLoaded", function () {
    const orderList = document.getElementById("orderList");
    const dataNotFound = document.getElementById("dataNotFound");
    const logoutButton = document.getElementById("logoutButton");
    const shoppingCartIcon = document.getElementById("shoppingCartIcon");
    const orderModal = document.getElementById("orderModal");
    const modalContent = document.getElementById("modalContent");
    const close = document.getElementById("close");
    const closeButton = document.getElementById("closeButton");
    const messageModal = document.getElementById("messageModal");
    const messageContent = document.getElementById("messageContent");
    const closeMessageButton = document.getElementById("closeMessageButton");
    const confirmButton = document.getElementById("confirmButton");

    // Add a variable to track the food item currently being purchased
    let currentPurchaseItem = null;

    // Function to get query parameters from the URL
    function getQueryParameter(name) {
        const urlSearchParams = new URLSearchParams(window.location.search);
        return urlSearchParams.get(name);
    }

    // Retrieve first name and last name from the URL
    const firstName = getQueryParameter("firstName");
    const lastName = getQueryParameter("lastName");

    closeMessageButton.addEventListener("click", function () {
        messageModal.style.display = "none";
    });

    // Add a click event listener to the "Logout" button
    logoutButton.addEventListener("click", function () {
        window.location.href = "food-login.html";
    });

    shoppingCartIcon.addEventListener("click", function () {
        orderModal.style.display = "block";

        // Populate the modal with the purchased items
        displayPurchasedItems();
    });

    close.addEventListener("click", function () {
        orderModal.style.display = "none";
    });

    closeButton.addEventListener("click", function () {
        orderModal.style.display = "none";
    });

    closeMessageButton.addEventListener("click", function () {
        messageModal.style.display = "none";
    });

    // Function to populate restaurant names in the dropdown
    function populateRestaurantNameFilter() {
        restaurantNameFilter.innerHTML = "<option value='all'>All Restaurants</option>";

        // Retrieve the restaurant data from local storage
        const restaurants = JSON.parse(localStorage.getItem("restaurants")) || [];

        // Extract unique restaurant names
        const uniqueRestaurantNames = [...new Set(restaurants.map(restaurant => restaurant.restaurantName))];

        // Populate the dropdown with unique restaurant names
        uniqueRestaurantNames.forEach(name => {
            const option = document.createElement("option");
            option.value = name;
            option.textContent = name;
            restaurantNameFilter.appendChild(option);
        });
    }

    function updateCartItemCount() {
        const firstName = getQueryParameter("firstName");
        const lastName = getQueryParameter("lastName");
        const orderListData = JSON.parse(localStorage.getItem("orderList")) || [];

        // Filter the order list items for the current user
        const userCartItems = orderListData.filter(item => item.firstName === firstName && item.lastName === lastName);

        const cartItemCount = document.getElementById("cartItemCount");
        cartItemCount.textContent = userCartItems.length;
    }

    function isFoodItemAlreadyPurchased(restaurant) {
        const orderListData = JSON.parse(localStorage.getItem("orderList")) || [];
        return orderListData.some(item =>
            item.foodItem === restaurant.foodItem &&
            item.restaurantName === restaurant.restaurantName &&
            item.price === restaurant.price &&
            item.firstName === firstName &&
            item.lastName === lastName
        );
    }

    function saveToLocalStorage(restaurant) {
        const orderListData = JSON.parse(localStorage.getItem("orderList")) || [];

        // Check if the food item has not already been purchased by the current user
        if (!isFoodItemAlreadyPurchased(restaurant)) {
            // Add the first name and last name to the restaurant object
            restaurant.firstName = firstName;
            restaurant.lastName = lastName;
            orderListData.push(restaurant);
            localStorage.setItem("orderList", JSON.stringify(orderListData));
        }
    }

    // Function to display purchased items in the modal
    function displayPurchasedItems() {
        modalContent.innerHTML = "";

        // Retrieve the current user's first name and last name from URL parameters
        const firstName = getQueryParameter("firstName");
        const lastName = getQueryParameter("lastName");

        const orderListData = JSON.parse(localStorage.getItem("orderList")) || [];
        const userPurchasedItems = orderListData.filter(item => item.firstName === firstName && item.lastName === lastName);

        if (userPurchasedItems.length === 0) {
            modalContent.innerHTML = "No items purchased.";
        } else {
            const template = document.getElementById("purchasedItemTemplate");
            userPurchasedItems.sort((a, b) => a.price - b.price);
            userPurchasedItems.forEach(restaurant => {
                const card = template.cloneNode(true);
                card.style.display = "block";
                card.querySelector(".purchased-item-image").src = restaurant.imageURL;
                card.querySelector(".purchased-item-image").alt = restaurant.restaurantName;
                card.querySelector(".purchased-item-food-item").textContent = restaurant.foodItem;
                card.querySelector(".purchased-item-food-type").textContent = `(${restaurant.foodType})`;
                card.querySelector(".purchased-item-price").textContent = "Price: $" + restaurant.price;
                card.querySelector(".purchased-item-name").textContent = restaurant.restaurantName;
                modalContent.appendChild(card);
            });
        }
    }

    function handleFoodPurchase(restaurant) {
        if (!isFoodItemAlreadyPurchased(restaurant)) {
            currentPurchaseItem = restaurant;
    
            // Open the message modal for confirmation
            messageContent.innerHTML = `Do you want to purchase ${restaurant.foodItem} from ${restaurant.restaurantName} for $${restaurant.price}?`;
            messageModal.style.display = "block";
            confirmButton.style.display = 'block';
    
            confirmButton.addEventListener("click", function () {
                saveToLocalStorage(currentPurchaseItem);
                updateCartItemCount();
                messageModal.style.display = "none";
                currentPurchaseItem = null;
            });
        } else {
            messageContent.innerHTML = "This food item has already been purchased.";
            messageModal.style.display = "block";
            confirmButton.style.display = 'none';
    
            confirmButton.addEventListener("click", function () {
                messageModal.style.display = "none";
            });
        }
    }

    // Function to create a card for a restaurant
    function createRestaurantCard(restaurant, index) {
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

        const buyButton = document.createElement("button");
        buyButton.textContent = "Buy";
        buyButton.addEventListener("click", function () {
            handleFoodPurchase(restaurant);
        });

        card.appendChild(image);
        card.appendChild(foodItem);
        card.appendChild(foodType);
        card.appendChild(price);
        card.appendChild(restaurantName);
        card.appendChild(buyButton);

        return card;
    }

    // Function to display the filtered cards
    function displayFilteredRestaurants(filteredRestaurants) {
        orderList.innerHTML = ""; // Clear the existing content

        if (filteredRestaurants.length === 0) {
            dataNotFound.style.display = "block"; 
        } else {
            dataNotFound.style.display = "none"; 
            filteredRestaurants.forEach((restaurant, index) => {
                const card = createRestaurantCard(restaurant, index);
                orderList.appendChild(card);
            });
        }
    }

    // Function to apply filters
    function applyFilters() {
        const priceFilterValue = priceFilter.value;
        const restaurantNameFilterValue = restaurantNameFilter.value;
        const foodTypeFilterValue = foodTypeFilter.value;

        // Retrieve the restaurant data from local storage
        const restaurants = JSON.parse(localStorage.getItem("restaurants")) || [];

        // Apply filters
        let filteredRestaurants = restaurants;

        // Price filter
        if (priceFilterValue === "lowToHigh") {
            filteredRestaurants = filteredRestaurants.sort((a, b) => a.price - b.price);
        } else if (priceFilterValue === "highToLow") {
            filteredRestaurants = filteredRestaurants.sort((a, b) => b.price - a.price);
        }

        // Restaurant name filter
        if (restaurantNameFilterValue !== "all") {
            filteredRestaurants = filteredRestaurants.filter(restaurant => restaurant.restaurantName === restaurantNameFilterValue);
        }

        // Food type filter
        if (foodTypeFilterValue !== "all") {
            filteredRestaurants = filteredRestaurants.filter(restaurant => restaurant.foodType === foodTypeFilterValue);
        }

        // Display the filtered cards
        displayFilteredRestaurants(filteredRestaurants);
    }

    const resetFiltersButton = document.getElementById("resetFiltersButton");

    // Event listener for the "Reset Filters" button
    resetFiltersButton.addEventListener("click", function () {
        // Reset all filter elements to their default values
        priceFilter.value = "lowToHigh";
        restaurantNameFilter.value = "all";
        foodTypeFilter.value = "all";

        // Apply filters to reset the displayed data
        applyFilters();
    });

    priceFilter.addEventListener("change", applyFilters);
    restaurantNameFilter.addEventListener("change", applyFilters);
    foodTypeFilter.addEventListener("change", applyFilters);

    // Initialize cart item count and order list on page load
    updateCartItemCount();
    populateRestaurantNameFilter();
    priceFilter.value = "lowToHigh";
    applyFilters();
});
