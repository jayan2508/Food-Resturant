// document.addEventListener("DOMContentLoaded", function () {
//     const orderList = document.getElementById("orderList");
//     const dataNotFound = document.getElementById("dataNotFound");
//     const logoutButton = document.getElementById("logoutButton");
//     const shoppingCartIcon = document.getElementById("shoppingCartIcon");
//     const orderModal = document.getElementById("orderModal");
//     const modalContent = document.getElementById("modalContent");
//     const close = document.getElementById("close");
//     const closeButton = document.getElementById("closeButton");
//     const messageModal = document.getElementById("messageModal");
//     const messageContent = document.getElementById("messageContent");
//     const closeMessageButton = document.getElementById("closeMessageButton");
//     const priceFilter = document.getElementById("priceFilter");
//     const restaurantNameFilter = document.getElementById("restaurantNameFilter");
//     const foodTypeFilter = document.getElementById("foodTypeFilter");
//     // const applyFiltersButton = document.getElementById("applyFiltersButton");

//     closeMessageButton.addEventListener("click", function () {
//         // Hide the message modal
//         messageModal.style.display = "none";
//     });

//     // Add a click event listener to the "Logout" button
//     logoutButton.addEventListener("click", function () {
//         // Redirect to the admin home page when the button is clicked
//         window.location.href = "food-login.html"; // Replace with the actual page URL
//     });

//     shoppingCartIcon.addEventListener("click", function () {
//         // Display the modal
//         orderModal.style.display = "block";

//         // Populate the modal with the purchased items
//         displayPurchasedItems();
//     });

//     close.addEventListener("click", function () {
//         // Close the modal when the close button is clicked
//         orderModal.style.display = "none";
//     });

//     closeButton.addEventListener("click", function () {
//         // Close the modal when the close button is clicked
//         orderModal.style.display = "none";
//     });

//     closeMessageButton.addEventListener("click", function () {
//         // Hide the message modal
//         messageModal.style.display = "none";
//     });

//     // Function to populate restaurant names in the dropdown
//     function populateRestaurantNameFilter() {
//         restaurantNameFilter.innerHTML = "<option value='all'>All Restaurants</option>";

//         // Retrieve the restaurant data from local storage
//         const restaurants = JSON.parse(localStorage.getItem("restaurants")) || [];

//         // Extract unique restaurant names
//         const uniqueRestaurantNames = [...new Set(restaurants.map(restaurant => restaurant.restaurantName))];

//         // Populate the dropdown with unique restaurant names
//         uniqueRestaurantNames.forEach(name => {
//             const option = document.createElement("option");
//             option.value = name;
//             option.textContent = name;
//             restaurantNameFilter.appendChild(option);
//         });
//     }

//     // Function to update the cart item count
//     function updateCartItemCount() {
//         const orderListData = JSON.parse(localStorage.getItem("orderList")) || [];
//         const cartItemCount = document.getElementById("cartItemCount");
//         cartItemCount.textContent = orderListData.length;
//     }

//     // Function to check if a food item has already been purchased
//     function isFoodItemAlreadyPurchased(restaurant) {
//         const orderListData = JSON.parse(localStorage.getItem("orderList")) || [];
//         return orderListData.some(item => item.foodItem === restaurant.foodItem && item.restaurantName === restaurant.restaurantName && item.price === restaurant.price);
//     }

//     // Function to save a purchased food item to local storage  
//     function saveToLocalStorage(restaurant) {
//         const orderListData = JSON.parse(localStorage.getItem("orderList")) || [];
//         orderListData.push(restaurant);
//         localStorage.setItem("orderList", JSON.stringify(orderListData));
//     }

//     // Function to display purchased items in the modal
//     function displayPurchasedItems() {
//         modalContent.innerHTML = "";
//         const orderListData = JSON.parse(localStorage.getItem("orderList")) || [];      
//         if (orderListData.length === 0) {
//             modalContent.innerHTML = "No items purchased.";
//         } else {
//             const template = document.getElementById("purchasedItemTemplate");
//             orderListData.sort((a, b) => a.price - b.price);
//             orderListData.forEach((restaurant) => {
//                 const card = template.cloneNode(true);
//                 card.style.display = "block";
//                 card.querySelector(".purchased-item-image").src = restaurant.imageURL;
//                 card.querySelector(".purchased-item-image").alt = restaurant.restaurantName;
//                 card.querySelector(".purchased-item-food-item").textContent = restaurant.foodItem;
//                 card.querySelector(".purchased-item-food-type").textContent = `(${restaurant.foodType})`;
//                 card.querySelector(".purchased-item-price").textContent = "Price: $" + restaurant.price;
//                 card.querySelector(".purchased-item-name").textContent = restaurant.restaurantName;
//                 modalContent.appendChild(card);
//             });
//         }
//     }

//     // Function to create a card for a restaurant
//     function createRestaurantCard(restaurant, index) {
//         const card = document.createElement("div");
//         card.classList.add("restaurant-card");

//         const image = document.createElement("img");
//         image.src = restaurant.imageURL;
//         image.alt = restaurant.restaurantName;

//         image.style.width = "200px";
//         image.style.height = "200px";
//         image.style.borderRadius = "5px";
//         image.style.objectFit = "cover";

//         const foodItem = document.createElement("p");
//         foodItem.textContent = restaurant.foodItem;

//         const foodType = document.createElement("p");
//         foodType.textContent = `(${restaurant.foodType})`;

//         const price = document.createElement("p");
//         price.textContent = "Price: $" + restaurant.price;

//         const restaurantName = document.createElement("p");
//         restaurantName.textContent = restaurant.restaurantName;
//         restaurantName.classList.add("restaurant-name");

//         const buyButton = document.createElement("button");
//         buyButton.textContent = "Buy";
//         buyButton.addEventListener("click", function () {
//             if (!isFoodItemAlreadyPurchased(restaurant)) {
//                 // Handle the purchase action
//                 saveToLocalStorage(restaurant);
//                 updateCartItemCount();
//                 // Open the message modal and show a success message
//                 messageContent.innerHTML = "Food purchased successfully!";
//                 messageModal.style.display = "block";
//             } else {
//                 // Open the message modal and show a message
//                 messageContent.innerHTML = "This food item has already been purchased.";
//                 messageModal.style.display = "block";
//             }
//         });

//         card.appendChild(image);
//         card.appendChild(foodItem);
//         card.appendChild(foodType);
//         card.appendChild(price);
//         card.appendChild(restaurantName);
//         card.appendChild(buyButton);

//         return card;
//     }

//     // Function to display the filtered cards
//     function displayFilteredRestaurants(filteredRestaurants) {  
//         orderList.innerHTML = ""; // Clear the existing content

//         if (filteredRestaurants.length === 0) {
//             dataNotFound.style.display = "block"; // Show the "Data not found" message
//         } else {
//             dataNotFound.style.display = "none"; // Hide the message if there are items
//             // Create and display cards for each filtered item
//             filteredRestaurants.forEach((restaurant, index) => {
//                 const card = createRestaurantCard(restaurant, index);
//                 orderList.appendChild(card);
//             });
//         }
//     }

//     // Function to apply filters
//     function applyFilters() {
//         const priceFilterValue = priceFilter.value;
//         const restaurantNameFilterValue = restaurantNameFilter.value;
//         const foodTypeFilterValue = foodTypeFilter.value;

//         // Retrieve the restaurant data from local storage
//         const restaurants = JSON.parse(localStorage.getItem("restaurants")) || [];

//         // Apply filters
//         let filteredRestaurants = restaurants;

//         // Price filter
//         if (priceFilterValue === "lowToHigh") {
//             filteredRestaurants = filteredRestaurants.sort((a, b) => a.price - b.price);
//         } else if (priceFilterValue === "highToLow") {
//             filteredRestaurants = filteredRestaurants.sort((a, b) => b.price - a.price);
//         }

//         // Restaurant name filter
//         if (restaurantNameFilterValue !== "all") {
//             filteredRestaurants = filteredRestaurants.filter(restaurant => restaurant.restaurantName === restaurantNameFilterValue);    
//         }

//         // Food type filter
//         if (foodTypeFilterValue !== "all") {
//             filteredRestaurants = filteredRestaurants.filter(restaurant => restaurant.foodType === foodTypeFilterValue);
//         }

//         // Display the filtered cards
//         displayFilteredRestaurants(filteredRestaurants);
//     }

//     // Populate the restaurant names in the dropdown

//     // Add a click event listener for the "Apply Filters" button
//     // applyFiltersButton.addEventListener("click", applyFilters);
//     priceFilter.addEventListener("change", applyFilters);
//     restaurantNameFilter.addEventListener("change", applyFilters);
//     foodTypeFilter.addEventListener("change", applyFilters);

//     // Initialize cart item count and order list on page load
//     updateCartItemCount();
//     populateRestaurantNameFilter();
//     // displayFilteredRestaurants(JSON.parse(localStorage.getItem("restaurants")) || []);
//     priceFilter.value = "lowToHigh";
//     applyFilters();
// });