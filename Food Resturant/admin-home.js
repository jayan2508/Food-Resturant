document.addEventListener("DOMContentLoaded", function () {
    const openModalBtn = document.getElementById("openModalBtn");
    const createRestaurantModal = document.getElementById("createRestaurantModal");
    const foodTypeSelect = document.getElementById("foodType");
    const foodItemsSelect = document.getElementById("foodItems");
    const restaurantForm = document.getElementById("restaurantForm");
    const priceInput = document.getElementById("price");
    const priceErrorElement = document.getElementById("priceError");
    const restaurantNameInput = document.getElementById("restaurantName");
    const nameErrorElement = document.getElementById("nameError");
    const logout = document.getElementById("logout");
    const list = document.getElementById("list");

    // Food items data based on food types
    const foodData = {
        Punjabi: ["Panner Butter Masala", "Chese Butter Masala", "Paneer Tikka", "Naan", "Paratha", "Dal Makhani"],
        Chinese: ["Manchurian", "Noodles", "Spring Rolls", "Chow Mein", "Wonton Soup"],
        SouthIndian: ["Dosa", "Idli Sambhar", "Medu Vada", "Tomato Rasam", "Veg Kurma "]
    };

    // Object to store food item images
    const foodItemImages = {
        "Panner Butter Masala": "http://127.0.0.1:5501/panner-butter-masala.jpg",
        "Chese Butter Masala": "http://127.0.0.1:5501/chese-masala.jpg",
        "Paneer Tikka": "http://127.0.0.1:5501/paneer-tikka.jpg",
        "Naan": "http://127.0.0.1:5501/naan.jpg",
        "Paratha": "http://127.0.0.1:5501/paratha.jpg",
        "Dal Makhani": "http://127.0.0.1:5501/dal-makhani.jpg",
        "Manchurian": "http://127.0.0.1:5501/manchurian.jpg",
        "Noodles": "http://127.0.0.1:5501/noodles.jpg",
        "Spring Rolls": "http://127.0.0.1:5501/spring-rolls.jpg",
        "Chow Mein": "http://127.0.0.1:5501/chow-mein.jpg",
        "Wonton Soup": "http://127.0.0.1:5501/wonton-soup.jpg",
        "Dosa": "http://127.0.0.1:5501/dosa.jpg",
        "Idli Sambhar": "http://127.0.0.1:5501/idli-sambhar.jpg",
        "Medu Vada": "http://127.0.0.1:5501/medu-vada.jpg",
        "Tomato Rasam": "http://127.0.0.1:5501/tomato-rasam.jpg",
        "Veg Kurma": "http://127.0.0.1:5501/veg-kurma.jpg"
    };

    logout.addEventListener("click", function () {
        window.location.href = "food-login.html";
    });

    list.addEventListener("click", function () {
        window.location.href = 'view-order-list.html';
    });

    // Function to populate food items dropdown and set the image path based on food type
    function populateFoodItems() {
        const selectedFoodType = foodTypeSelect.value;
        const foodItems = foodData[selectedFoodType];

        foodItemsSelect.innerHTML = "";
        foodItems.forEach((item) => {
            const option = document.createElement("option");
            option.text = item;
            foodItemsSelect.appendChild(option);
        });
    }

    openModalBtn.addEventListener("click", function () {
        createRestaurantModal.style.display = "block";
        populateFoodItems();
    });

    foodTypeSelect.addEventListener("change", populateFoodItems);

    const saveRestaurantBtn = document.getElementById("saveRestaurantBtn");
    saveRestaurantBtn.addEventListener("click", function () {
        const restaurantName = restaurantNameInput.value.trim();
        const selectedFoodType = foodTypeSelect.value;
        const selectedFoodItem = foodItemsSelect.value;
        const selectedPrice = priceInput.value.trim();
        const imageURL = foodItemImages[selectedFoodItem]; // Get the image URL

        // Reset previous error messages
        priceErrorElement.textContent = "";
        nameErrorElement.textContent = "";

        if (!restaurantName) {
            nameErrorElement.textContent = "Please enter a name.";
        }

        if (!selectedPrice) {
            priceErrorElement.textContent = "Please enter a price.";
        } else {
            const parsedPrice = parseFloat(selectedPrice);

            if (isNaN(parsedPrice) || parsedPrice < 0) {
                priceErrorElement.textContent = "Please enter a valid positive price.";
            }
        }

        if (!nameErrorElement.textContent && !priceErrorElement.textContent) {
            const restaurant = {
                restaurantName: restaurantName,
                foodType: selectedFoodType,
                foodItem: selectedFoodItem,
                price: selectedPrice,
                imageURL: imageURL
            };

            // Get the existing restaurants data from local storage or initialize an empty array
            let restaurants = JSON.parse(localStorage.getItem("restaurants")) || [];

            // Add the new restaurant to the array
            restaurants.push(restaurant);

            // Store the updated array in local storage
            localStorage.setItem("restaurants", JSON.stringify(restaurants));
            restaurantForm.reset();

            // Close the modal
            createRestaurantModal.style.display = "none";

            // Initial display of the order list
            displayOrderList();
        }
    });

    const closeModalBtn = document.querySelector(".close");
    closeModalBtn.addEventListener("click", function () {
        restaurantForm.reset();
        nameErrorElement.textContent = "";
        priceErrorElement.textContent = "";
        createRestaurantModal.style.display = "none";
    });

    restaurantNameInput.addEventListener('input', () => {
        nameErrorElement.textContent = "";
    });

    // Event listener to clear the price error message when the price input changes
    priceInput.addEventListener('input', () => {
        priceErrorElement.textContent = "";
    });

    // Display order list
    const orderList = document.getElementById("orderList");
    const dataNotFound = document.getElementById("dataNotFound");

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

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", function () {
            // Display a confirmation message before deleting
            const confirmationMessage = `Are you sure you want to delete ${restaurant.foodItem}(${restaurant.foodType})?`;

            openConfirmationModal(confirmationMessage, () => {
                // Handle the delete action
                deleteOrderItem(index, restaurant.foodItem, restaurant.restaurantName, restaurant.price);
            });
        });

        card.appendChild(image);
        card.appendChild(foodItem);
        card.appendChild(foodType);
        card.appendChild(price);
        card.appendChild(restaurantName);
        card.appendChild(deleteButton);

        return card;
    }

    function openConfirmationModal(message, onConfirm) {
        const messageContent = document.getElementById("messageContent");
        const confirmButton = document.getElementById("confirmButton");
        const closeMessageButton = document.getElementById("closeMessageButton");

        messageContent.textContent = message;
        document.getElementById("messageModal").style.display = "block";

        closeMessageButton.addEventListener("click", function () {
            document.getElementById("messageModal").style.display = "none";
        });

        confirmButton.addEventListener("click", function () {
            onConfirm();
            document.getElementById("messageModal").style.display = "none"; // Close the modal
        });
    }
    function deleteOrderItem(index, foodItem, restaurantName, price) {
        let orderListData = JSON.parse(localStorage.getItem("restaurants")) || [];

        // Remove the item at the specified index
        const deletedItem = orderListData.splice(index, 1)[0];

        localStorage.setItem("restaurants", JSON.stringify(orderListData));

        displayOrderList();

        // If the deleted item exists, remove it from the order list
        if (deletedItem) {
            const orderList = JSON.parse(localStorage.getItem("orderList")) || [];

            // Filter out the deleted item from the order list based on foodItem and restaurantName
            const updatedOrderList = orderList.filter(item =>
                item.foodItem !== foodItem || item.restaurantName !== restaurantName || item.price !== price);

            // Update the order list in local storage
            localStorage.setItem("orderList", JSON.stringify(updatedOrderList));
        }
    }

    function displayOrderList() {
        orderList.innerHTML = ""; // Clear the existing content

        const orderListData = JSON.parse(localStorage.getItem("restaurants")) || [];

        if (orderListData.length === 0) {
            dataNotFound.style.display = "block"; // Show the "Data not found" message
        } else {
            dataNotFound.style.display = "none"; // Hide the message if there are items

            orderListData.sort((a, b) => a.price - b.price);

            orderListData.forEach((restaurant, index) => {
                const card = createRestaurantCard(restaurant, index);
                orderList.appendChild(card);
            });
        }
    }

    displayOrderList(); // Initial display of the order list
});