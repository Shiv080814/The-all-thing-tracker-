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
const db = firebase.firestore();

// Fetch products from Firestore and display them
function fetchProducts() {
    db.collection("products").get().then((querySnapshot) => {
        const productList = document.getElementById("product-list");
        querySnapshot.forEach((doc) => {
            const product = doc.data();
            productList.innerHTML += `
                <div class="product">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="product-details">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <p><strong>Price:</strong> $${product.price}</p>
                    </div>
                </div>
            `;
        });
    }).catch((error) => {
        console.error("Error fetching products: ", error);
    });
}

// Initialize fetching products for all users
fetchProducts();
