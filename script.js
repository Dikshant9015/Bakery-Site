const products = [
  {
    id: "berry-cake",
    name: "Berry Cream Cake",
    category: "cakes",
    price: 28,
    image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=800&q=80",
    description: "Vanilla sponge, whipped cream, and fresh berries."
  },
  {
    id: "chocolate-cupcakes",
    name: "Chocolate Cupcakes",
    category: "cakes",
    price: 14,
    image: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?auto=format&fit=crop&w=800&q=80",
    description: "Rich cocoa cakes with silky buttercream."
  },
  {
    id: "butter-croissant",
    name: "Butter Croissant",
    category: "pastries",
    price: 4.5,
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80",
    description: "Layered, golden, and baked until crisp."
  },
  {
    id: "fruit-tart",
    name: "Fresh Fruit Tart",
    category: "pastries",
    price: 8,
    image: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=800&q=80",
    description: "Vanilla custard, seasonal fruit, and shortcrust."
  },
  {
    id: "sourdough",
    name: "Country Sourdough",
    category: "bread",
    price: 9,
    image: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=800&q=80",
    description: "Slow-fermented loaf with a crackly crust."
  },
  {
    id: "baguette",
    name: "Classic Baguette",
    category: "bread",
    price: 5,
    image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=800&q=80",
    description: "Crisp outside, tender inside, perfect for dinner."
  },
  {
    id: "almond-cookies",
    name: "Almond Cookies",
    category: "cookies",
    price: 7.5,
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80",
    description: "Buttery cookies with toasted almond crunch."
  },
  {
    id: "cinnamon-rolls",
    name: "Cinnamon Rolls",
    category: "pastries",
    price: 11,
    image: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=800&q=80",
    description: "Soft rolls swirled with cinnamon sugar glaze."
  },
  {
    id: "macarons",
    name: "Macaron Box",
    category: "cookies",
    price: 16,
    image: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=800&q=80",
    description: "Assorted almond shells with creamy fillings."
  }
];

const state = {
  cart: JSON.parse(localStorage.getItem("gc-cart") || "{}"),
  favorites: JSON.parse(localStorage.getItem("gc-favorites") || "[]")
};

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

function saveState() {
  localStorage.setItem("gc-cart", JSON.stringify(state.cart));
  localStorage.setItem("gc-favorites", JSON.stringify(state.favorites));
}

function getProduct(id) {
  return products.find((product) => product.id === id);
}

function showToast(message) {
  const toast = document.querySelector("[data-toast]");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 1800);
}

function addToCart(id) {
  state.cart[id] = (state.cart[id] || 0) + 1;
  saveState();
  renderStatefulUi();
  showToast(`${getProduct(id).name} added to cart`);
}

function removeFromCart(id) {
  if (!state.cart[id]) return;
  state.cart[id] -= 1;
  if (state.cart[id] <= 0) delete state.cart[id];
  saveState();
  renderStatefulUi();
}

function toggleFavorite(id) {
  if (state.favorites.includes(id)) {
    state.favorites = state.favorites.filter((favId) => favId !== id);
    showToast(`${getProduct(id).name} removed from favorites`);
  } else {
    state.favorites.push(id);
    showToast(`${getProduct(id).name} saved to favorites`);
  }
  saveState();
  renderStatefulUi();
}

function productCard(product) {
  const isFavorite = state.favorites.includes(product.id);
  return `
    <article class="product-card">
      <img src="${product.image}" alt="${product.name}">
      <div class="product-body">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-meta">
          <span>${product.category}</span>
          <strong class="product-price">${money.format(product.price)}</strong>
        </div>
        <div class="product-actions">
          <button class="fav-btn" data-favorite="${product.id}" aria-label="Toggle favorite for ${product.name}">${isFavorite ? "♥" : "♡"}</button>
          <button class="add-btn" data-add-cart="${product.id}">Add to Cart</button>
        </div>
      </div>
    </article>
  `;
}

function renderProducts(filter = "all") {
  const list = document.querySelector("[data-product-list]");
  if (!list) return;
  const visibleProducts = filter === "all" ? products : products.filter((product) => product.category === filter);
  list.innerHTML = visibleProducts.map(productCard).join("");
}

function renderFeaturedProducts() {
  const featured = document.querySelector("[data-featured-products]");
  if (!featured) return;
  featured.innerHTML = products.slice(0, 3).map(productCard).join("");
}

function renderCart() {
  const list = document.querySelector("[data-cart-items]");
  const total = document.querySelector("[data-cart-total]");
  const cartEntries = Object.entries(state.cart);
  if (list) {
    list.innerHTML = cartEntries.length
      ? cartEntries.map(([id, quantity]) => {
        const product = getProduct(id);
        return `
          <div class="mini-item">
            <div>
              <strong>${product.name}</strong>
              <span>${quantity} x ${money.format(product.price)}</span>
            </div>
            <button data-remove-cart="${id}" aria-label="Remove one ${product.name}">-</button>
          </div>
        `;
      }).join("")
      : `<p class="empty-state">Your cart is empty.</p>`;
  }
  if (total) {
    const sum = cartEntries.reduce((amount, [id, quantity]) => amount + getProduct(id).price * quantity, 0);
    total.textContent = money.format(sum);
  }
}

function renderFavorites() {
  const list = document.querySelector("[data-fav-items]");
  if (!list) return;
  list.innerHTML = state.favorites.length
    ? state.favorites.map((id) => {
      const product = getProduct(id);
      return `
        <div class="mini-item">
          <div>
            <strong>${product.name}</strong>
            <span>${money.format(product.price)}</span>
          </div>
          <button data-favorite="${id}" aria-label="Remove ${product.name} from favorites">x</button>
        </div>
      `;
    }).join("")
    : `<p class="empty-state">No favorites yet.</p>`;
}

function renderCounts() {
  const itemCount = Object.values(state.cart).reduce((sum, quantity) => sum + quantity, 0);
  document.querySelectorAll("[data-cart-count]").forEach((item) => {
    item.textContent = itemCount;
  });
  document.querySelectorAll("[data-fav-count]").forEach((item) => {
    item.textContent = state.favorites.length;
  });
}

function renderStatefulUi() {
  renderCounts();
  renderCart();
  renderFavorites();
  renderFeaturedProducts();
  const activeFilter = document.querySelector(".filter-btn.active");
  renderProducts(activeFilter?.dataset.filter || "all");
}

document.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add-cart]");
  const favoriteButton = event.target.closest("[data-favorite]");
  const removeButton = event.target.closest("[data-remove-cart]");
  const filterButton = event.target.closest("[data-filter]");

  if (addButton) addToCart(addButton.dataset.addCart);
  if (favoriteButton) toggleFavorite(favoriteButton.dataset.favorite);
  if (removeButton) removeFromCart(removeButton.dataset.removeCart);
  if (filterButton) {
    document.querySelectorAll("[data-filter]").forEach((button) => button.classList.remove("active"));
    filterButton.classList.add("active");
    renderProducts(filterButton.dataset.filter);
  }

  if (event.target.closest("[data-clear-cart]")) {
    state.cart = {};
    saveState();
    renderStatefulUi();
    showToast("Cart cleared");
  }

  if (event.target.closest("[data-clear-favs]")) {
    state.favorites = [];
    saveState();
    renderStatefulUi();
    showToast("Favorites cleared");
  }

  if (event.target.closest("[data-checkout]")) {
    const hasItems = Object.keys(state.cart).length > 0;
    showToast(hasItems ? "Checkout demo: your order is ready for pickup." : "Add something sweet first.");
  }
});

document.addEventListener("submit", (event) => {
  if (!event.target.matches("[data-contact-form]")) return;
  event.preventDefault();
  event.target.reset();
  showToast("Request sent. We will get back to you soon.");
});

renderStatefulUi();
