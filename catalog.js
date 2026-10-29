/* Поведение плиток категорий для отдельной страницы каталога SOLVANTA. */
(() => {
  const categoryGrid = document.querySelector("#categoryGrid");
  const productsArea = document.querySelector("#productsArea");
  const productsTitle = document.querySelector("#productsTitle");
  const backButton = document.querySelector("#backToCategories");
  const filterButtons = document.querySelector("#filterButtons");
  if (!categoryGrid || !productsArea || !filterButtons) return;

  function chooseCategory(category) {
    const target = [...filterButtons.querySelectorAll("[data-category]")]
      .find(button => button.dataset.category === category);
    if (target) target.click();
    productsTitle.textContent = category === "Все" ? "Все товары." : `${category}.`;
    productsArea.classList.add("products-area-active");
    productsArea.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  categoryGrid.addEventListener("click", event => {
    const card = event.target.closest("[data-pick-category]");
    if (!card) return;
    chooseCategory(card.dataset.pickCategory);
  });

  backButton?.addEventListener("click", () => {
    categoryGrid.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  const params = new URLSearchParams(window.location.search);
  const category = params.get("category");
  if (category) {
    chooseCategory(category);
  }
})();
