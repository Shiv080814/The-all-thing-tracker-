// Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Allowed Gmail accounts for editing
const allowedAdmins = ["admin1@gmail.com", "admin2@gmail.com"];

// DOM Elements
const productList = document.getElementById("product-list");
const loginBtn = document.getElementById("login-btn");
const adminSection = document.getElementById("admin-section");
const adminProducts = document.getElementById("admin-products");

// Fetch products from Firestore
function fetchProducts() {
    db.collection("products").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const product = doc.data();
            productList.innerHTML += `
                <div>
                    <h3>${product.name}</h3>
                    <p>Price: $${product.price}</p>
                </div>
            `;
        });
    });
}

// Admin login with Gmail
loginBtn.addEventListener("click", () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).then((result) => {
        const userEmail = result.user.email;
        if (allowedAdmins.includes(userEmail)) {
            adminSection.style.display = "block";
            fetchAdminProducts();
        } else {
            alert("You do not have admin privileges.");
        }
    }).catch((error) => {
        console.error(error);
    });
});

// Fetch products for editing (admin section)
function fetchAdminProducts() {
    db.collection("products").get().then((querySnapshot) => {
        adminProducts.innerHTML = "";
        querySnapshot.forEach((doc) => {
            const product = doc.data();
            adminProducts.innerHTML += `
                <div>
                    <h3>${product.name}</h3>
                    <input type="number" value="${product.price}" id="price-${doc.id}" />
                    <button onclick="updatePrice('${doc.id}')">Update Price</button>
                </div>
            `;
        });
    });
}

// Update product price in Firestore
function updatePrice(productId) {
    const newPrice = document.getElementById(`price-${productId}`).value;
    db.collection("products").doc(productId).update({
        price: Number(newPrice)
    }).then(() => {
        alert("Price updated successfully!");
        fetchProducts(); // Update product list
    }).catch((error) => {
        console.error("Error updating price: ", error);
    });
}

// Initialize fetching products
fetchProducts();
