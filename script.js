const menuToggle = document.querySelector("#menuToggle");
const mainNav = document.querySelector("#mainNav");
const productGrid = document.querySelector("#productGrid");
const filterButtons = document.querySelector("#filterButtons");
const productSearch = document.querySelector("#productSearch");
const cartPanel = document.querySelector("#cartPanel");
const cartBackdrop = document.querySelector("#cartBackdrop");
const cartItemsEl = document.querySelector("#cartItems");
const cartCountEl = document.querySelector("#cartCount");
const floatingCart = document.querySelector("#floatingCart");
const floatingCartCount = document.querySelector("#floatingCartCount");
const floatingCartTotal = document.querySelector("#floatingCartTotal");
const cartTitleCount = document.querySelector("#cartTitleCount");
const cartEmpty = document.querySelector("#cartEmpty");
const cartBottom = document.querySelector("#cartBottom");
const cartTotal = document.querySelector("#cartTotal");
const emptyCatalog = document.querySelector("#emptyCatalog");
let activeCategory = "Все";
let cart = {};

const money = (amount) => new Intl.NumberFormat("ru-RU", {
  style: "currency", currency: "RUB", maximumFractionDigits: 0
}).format(amount);

function telegramUrl(message) {
  const username = (typeof TELEGRAM_USERNAME === "string" ? TELEGRAM_USERNAME : "").trim().replace(/^@/, "");
  if (!username || username === "YOUR_TELEGRAM_USERNAME") {
    alert("Сначала укажите свой Telegram username в файле products.js: замените YOUR_TELEGRAM_USERNAME на свой username без @.");
    return null;
  }
  return `https://t.me/${encodeURIComponent(username)}?text=${encodeURIComponent(message)}`;
}

function openTelegram(message) {
  const url = telegramUrl(message);
  if (url) window.open(url, "_blank", "noopener,noreferrer");
}

function renderFilters() {
  const categories = ["Все", ...new Set(PRODUCTS.map(product => product.category))];
  filterButtons.innerHTML = categories.map(category => `
    <button type="button" class="filter-button ${category === activeCategory ? "active" : ""}" data-category="${escapeHtml(category)}">${escapeHtml(category)}</button>
  `).join("");
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[char]));
}

function renderProducts() {
  const query = productSearch.value.trim().toLowerCase();
  const filtered = PRODUCTS.filter(product => {
    const categoryMatch = activeCategory === "Все" || product.category === activeCategory;
    const textMatch = `${product.name} ${product.description} ${product.category} ${(product.specs || []).join(" ")}`.toLowerCase().includes(query);
    return categoryMatch && textMatch;
  });

  productGrid.innerHTML = filtered.map((product, index) => `
    <article class="product-card">
      <div class="product-image">
        ${product.image ? `<img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" loading="lazy" onerror="this.style.display='none'">` : ""}
        <span class="product-number">${String(index + 1).padStart(2, "0")}</span>
      </div>
      <div class="product-info">
        <div class="product-category">${escapeHtml(product.category)}</div>
        <h3>${escapeHtml(product.name)}</h3>
        <p class="product-description">${escapeHtml(product.description || "")}</p>
        ${(product.specs && product.specs.length) ? `<div class="product-specs">${product.specs.map(spec => `<span class="spec-chip">${escapeHtml(spec)}</span>`).join("")}</div>` : ""}
      </div>
      <div class="product-buy-row">
        <div class="product-price">${money(Number(product.price) || 0)}<small>${product.priceUnit ? `за ${escapeHtml(product.priceUnit)}` : "за единицу"}</small></div>
        <button class="add-to-cart" type="button" data-add="${escapeHtml(product.id)}">В корзину +</button>
      </div>
    </article>
  `).join("");

  emptyCatalog.hidden = filtered.length > 0;
}

function renderCart() {
  const entries = Object.entries(cart).filter(([id, quantity]) =>
    PRODUCTS.some(product => product.id === id) && quantity > 0
  );
  const count = entries.reduce((sum, [, quantity]) => sum + quantity, 0);
  const total = entries.reduce((sum, [id, quantity]) => {
    const product = PRODUCTS.find(item => item.id === id);
    return sum + Number(product.price) * quantity;
  }, 0);

  cartCountEl.textContent = count;
  floatingCartCount.textContent = count;
  floatingCartTotal.textContent = money(total);
  floatingCart.classList.toggle("is-empty", count === 0);
  cartTitleCount.textContent = `(${count})`;
  cartEmpty.hidden = count > 0;
  cartBottom.hidden = count === 0;
  cartItemsEl.innerHTML = entries.map(([id, quantity]) => {
    const product = PRODUCTS.find(item => item.id === id);
    return `<article class="cart-line">
      <div>
        <h3>${escapeHtml(product.name)}</h3>
        <div class="cart-line-meta">${money(Number(product.price))} × ${quantity}</div>
        <div class="cart-line-actions">
          <button class="qty-button" data-qty="${escapeHtml(id)}" data-delta="-1" aria-label="Уменьшить количество">−</button>
          <span class="qty-value">${quantity}</span>
          <button class="qty-button" data-qty="${escapeHtml(id)}" data-delta="1" aria-label="Увеличить количество">+</button>
          <button class="remove-item" data-remove="${escapeHtml(id)}">Удалить</button>
        </div>
      </div>
      <div class="cart-line-price">${money(Number(product.price) * quantity)}</div>
    </article>`;
  }).join("");
  cartTotal.textContent = money(total);
}

function addToCart(id) {
  if (!PRODUCTS.some(product => product.id === id)) return;
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
  floatingCart.animate?.([{ transform: "translateY(-50%) scale(1)" }, { transform: "translateY(-50%) scale(1.04)" }, { transform: "translateY(-50%) scale(1)" }], { duration: 220 });
}

function openCart() {
  cartPanel.classList.add("open");
  floatingCart.setAttribute("aria-expanded", "true");
  cartPanel.setAttribute("aria-hidden", "false");
  cartBackdrop.hidden = false;
  document.body.classList.add("cart-open");
}

function closeCart() {
  cartPanel.classList.remove("open");
  floatingCart.setAttribute("aria-expanded", "false");
  cartPanel.setAttribute("aria-hidden", "true");
  cartBackdrop.hidden = true;
  document.body.classList.remove("cart-open");
}

function cartMessage() {
  const entries = Object.entries(cart).filter(([id, quantity]) => quantity > 0);
  const lines = entries.map(([id, quantity]) => {
    const product = PRODUCTS.find(item => item.id === id);
    return `• ${product.name} — ${quantity} шт. × ${money(Number(product.price))} = ${money(Number(product.price) * quantity)}`;
  });
  const total = entries.reduce((sum, [id, quantity]) => {
    const product = PRODUCTS.find(item => item.id === id);
    return sum + Number(product.price) * quantity;
  }, 0);
  return `Здравствуйте! Хочу оформить заказ на сайте SOLVANTA:\n\n${lines.join("\n")}\n\nПредварительная сумма: ${money(total)}\n\nПодтвердите, пожалуйста, наличие и итоговую стоимость.`;
}

menuToggle?.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.textContent = isOpen ? "×" : "☰";
});
mainNav?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle?.setAttribute("aria-expanded", "false");
  if (menuToggle) menuToggle.textContent = "☰";
}));
filterButtons.addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category;
  renderFilters();
  renderProducts();
});
productSearch.addEventListener("input", renderProducts);
productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(button.dataset.add);
});
cartItemsEl.addEventListener("click", event => {
  const qtyButton = event.target.closest("[data-qty]");
  const removeButton = event.target.closest("[data-remove]");
  if (qtyButton) {
    const id = qtyButton.dataset.qty;
    cart[id] = (cart[id] || 0) + Number(qtyButton.dataset.delta);
    if (cart[id] <= 0) delete cart[id];
    renderCart();
  }
  if (removeButton) {
    delete cart[removeButton.dataset.remove];
    renderCart();
  }
});
document.querySelector("#openCart").addEventListener("click", openCart);
floatingCart.addEventListener("click", openCart);
document.querySelector("#closeCart").addEventListener("click", closeCart);
cartBackdrop.addEventListener("click", closeCart);
document.querySelector("#clearCart").addEventListener("click", () => {
  cart = {};
  renderCart();
});
document.querySelector("#checkoutTelegram").addEventListener("click", () => {
  if (Object.keys(cart).length) openTelegram(cartMessage());
});
document.querySelector("#wholesaleRequest").addEventListener("click", () => {
  openTelegram("Здравствуйте! Хочу узнать оптовые цены и условия поставки солнечного оборудования SOLVANTA. Подскажите, пожалуйста, наличие и условия для моей партии.");
});
document.querySelector("#contactTelegram").addEventListener("click", () => {
  openTelegram("Здравствуйте! Пишу с сайта SOLVANTA. Хочу проконсультироваться по солнечному оборудованию.");
});
document.querySelector("#continueShopping").addEventListener("click", closeCart);
document.querySelector("#year").textContent = new Date().getFullYear();

renderFilters();
renderProducts();
renderCart();
