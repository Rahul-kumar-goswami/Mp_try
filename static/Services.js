const body = document.body;
if (localStorage.getItem("darkMode") === "true") {
  body.classList.add("darkmode");
}

document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.querySelector(".floating-hamburger");
  const mobileNav = document.querySelector(".mobile-nav");

  hamburger.addEventListener("click", function () {
    mobileNav.classList.toggle("active");
  });

  // Optional: close menu when clicking outside
  document.addEventListener("click", function (e) {
    if (
      !mobileNav.contains(e.target) &&
      !hamburger.contains(e.target) &&
      mobileNav.classList.contains("active")
    ) {
      mobileNav.classList.remove("active");
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // Certificate templates data

  // const templatesContainer = document.querySelector(".template-grid");
  const categoryTabs = document.querySelectorAll(".tab-btn");
  const categoryCards = document.querySelectorAll(".category-card");
  const searchInput = document.getElementById("template-search");
  const viewButtons = document.querySelectorAll(".view-btn");

  // Initial render of all templates
  renderTemplates("all");

  // Category tab filtering
  categoryTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      categoryTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      renderTemplates(tab.dataset.category);
    });
  });

  // Category card filtering
  categoryCards.forEach((card) => {
    card.addEventListener("click", () => {
      categoryTabs.forEach((t) => {
        if (t.dataset.category === card.dataset.category) {
          t.click();
        }
      });
      // Scroll to templates section
      document
        .querySelector(".templates-section")
        .scrollIntoView({ behavior: "smooth" });
    });
  });

  // Search functionality
  searchInput.addEventListener("input", () => {
    const searchValue = searchInput.value.toLowerCase();
    if (searchValue) {
      const filteredTemplates = templates.filter(
        (template) =>
          template.name.toLowerCase().includes(searchValue) ||
          template.category.toLowerCase().includes(searchValue)
      );
      renderFilteredTemplates(filteredTemplates);
    } else {
      // If search is cleared, show current category
      const activeCategory =
        document.querySelector(".tab-btn.active").dataset.category;
      renderTemplates(activeCategory);
    }
  });

  // View toggle (grid/list)
  viewButtons.forEach((button) => {
    button.addEventListener("click", () => {
      viewButtons.forEach((b) => b.classList.remove("active"));
      button.classList.add("active");

      if (button.dataset.view === "grid") {
        templatesContainer.classList.remove("templates-list");
        templatesContainer.classList.add("templates-grid");
      } else {
        templatesContainer.classList.remove("templates-grid");
        templatesContainer.classList.add("templates-list");
      }
    });
  });

  // Template clicking - add to recent
  function addTemplateClickHandlers() {
    const templateCards = document.querySelectorAll(".template-card");
    templateCards.forEach((card) => {
      card.addEventListener("click", () => {
        const templateId = card.dataset.id;
        addToRecentTemplates(templateId);

        // Redirect to editor with template ID in URL query param
        window.location.href = `/editor?template=${templateId}`;
      });
    });
  }

  // Store and manage recent templates
  function addToRecentTemplates(templateId) {
    let recentTemplates =
      JSON.parse(localStorage.getItem("recentTemplates")) || [];

    // Remove if already exists
    recentTemplates = recentTemplates.filter((id) => id !== templateId);

    // Add to beginning
    recentTemplates.unshift(templateId);

    // Keep only most recent 6
    if (recentTemplates.length > 6) {
      recentTemplates = recentTemplates.slice(0, 6);
    }

    localStorage.setItem("recentTemplates", JSON.stringify(recentTemplates));
    updateRecentTemplates();
  }

  // Update recent templates display
  function updateRecentTemplates() {
    const recentTemplatesContainer =
      document.querySelector(".recent-templates");
    const recentIds = JSON.parse(localStorage.getItem("recentTemplates")) || [];

    if (recentIds.length === 0) {
      recentTemplatesContainer.innerHTML = `
                <div class="empty-recent">
                    <p>Your recently viewed templates will appear here</p>
                </div>
            `;
      return;
    }

    addTemplateClickHandlers();
  }

  // Render templates by category
  function renderTemplates(category) {
    if (category === "all") {
      renderFilteredTemplates(templates);
    } else {
      const filteredTemplates = templates.filter(
        (template) => template.category === category
      );
      renderFilteredTemplates(filteredTemplates);
    }
  }

  // Render filtered templates
  function renderFilteredTemplates(filteredTemplates) {
    templatesContainer.innerHTML = "";

    if (filteredTemplates.length === 0) {
      templatesContainer.innerHTML = `
                <div class="no-results">
                    <p>No templates found matching your criteria</p>
                </div>
            `;
      return;
    }

    filteredTemplates.forEach((template) => {
      templatesContainer.innerHTML += createTemplateCard(template);
    });

    addTemplateClickHandlers();
  }

  // Create template card HTML
  function createTemplateCard(template) {
    return `
            <div class="template-card" data-id="${
              template.id
            }" data-category="${template.category}">
                <img src="${
                  template.image
                }" alt="${template.name}" class="template-img">
                <div class="template-info">
                    <h3>${template.name}</h3>
                    <div class="template-category">${capitalizeFirstLetter(
                      template.category
                    )}</div>
                </div>
            </div>
        `;
  }

  // Helper function
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
});
// window.location.href = `/editor/${templateId}`;
