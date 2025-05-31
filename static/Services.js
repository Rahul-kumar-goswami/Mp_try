document.addEventListener("DOMContentLoaded", function () {
  // Certificate templates data
  const templates = [
    {
      id: 1,
      name: "Academic Excellence",
      category: "academic",
      image: "/Templates/template-1/thumbnail.png",
    },
    {
      id: 2,
      name: "Professional Achievement",
      category: "professional",
      image: "/Media/templates/prof-1.jpg",
    },
    {
      id: 3,
      name: "Workshop Completion",
      category: "event",
      image: "/Media/templates/event-1.jpg",
    },
    {
      id: 4,
      name: "Employee of the Month",
      category: "appreciation",
      image: "/Media/templates/appreciation-1.jpg",
    },
    {
      id: 5,
      name: "Sports Tournament",
      category: "achievement",
      image: "/Media/templates/achievement-1.jpg",
    },
    {
      id: 6,
      name: "School Diploma",
      category: "academic",
      image: "/Media/templates/academic-2.jpg",
    },
    {
      id: 7,
      name: "Leadership Award",
      category: "professional",
      image: "/Media/templates/prof-2.jpg",
    },
    {
      id: 8,
      name: "Seminar Attendance",
      category: "event",
      image: "/Media/templates/event-2.jpg",
    },
    {
      id: 9,
      name: "Thank You Certificate",
      category: "appreciation",
      image: "/Media/templates/appreciation-2.jpg",
    },
    {
      id: 10,
      name: "Fitness Challenge",
      category: "achievement",
      image: "/Media/templates/achievement-2.jpg",
    },
    {
      id: 11,
      name: "Honor Roll",
      category: "academic",
      image: "/Media/templates/academic-3.jpg",
    },
    {
      id: 12,
      name: "Training Completion",
      category: "professional",
      image: "/Media/templates/prof-3.jpg",
    },
    {
      id: 13,
      name: "Conference Speaker",
      category: "event",
      image: "/Media/templates/event-3.jpg",
    },
    {
      id: 14,
      name: "Service Recognition",
      category: "appreciation",
      image: "/Media/templates/appreciation-3.jpg",
    },
    {
      id: 15,
      name: "Music Competition",
      category: "achievement",
      image: "/Media/templates/achievement-3.jpg",
    },
    {
      id: 16,
      name: "Perfect Attendance",
      category: "academic",
      image: "/Media/templates/academic-4.jpg",
    },
    {
      id: 17,
      name: "Project Milestone",
      category: "professional",
      image: "/Media/templates/prof-4.jpg",
    },
    {
      id: 18,
      name: "Charity Event",
      category: "event",
      image: "/Media/templates/event-4.jpg",
    },
    {
      id: 19,
      name: "Volunteer Recognition",
      category: "appreciation",
      image: "/Media/templates/appreciation-4.jpg",
    },
    {
      id: 20,
      name: "Art Competition",
      category: "achievement",
      image: "/Media/templates/achievement-4.jpg",
    },
    {
      id: 21,
      name: "Science Fair Winner",
      category: "academic",
      image: "/Media/templates/academic-5.jpg",
    },
    {
      id: 22,
      name: "Sales Achievement",
      category: "professional",
      image: "/Media/templates/prof-5.jpg",
    },
    {
      id: 23,
      name: "Wedding Ceremony",
      category: "event",
      image: "/Media/templates/event-5.jpg",
    },
    {
      id: 24,
      name: "Community Service",
      category: "appreciation",
      image: "/Media/templates/appreciation-5.jpg",
    },
    {
      id: 25,
      name: "Marathon Finisher",
      category: "achievement",
      image: "/Media/templates/achievement-5.jpg",
    },
    {
      id: 26,
      name: "Math Olympiad",
      category: "academic",
      image: "/Media/templates/academic-6.jpg",
    },
    {
      id: 27,
      name: "Innovation Award",
      category: "professional",
      image: "/Media/templates/prof-6.jpg",
    },
    {
      id: 28,
      name: "Graduation Ceremony",
      category: "event",
      image: "/Media/templates/event-6.jpg",
    },
    {
      id: 29,
      name: "Customer Appreciation",
      category: "appreciation",
      image: "/Media/templates/appreciation-6.jpg",
    },
    {
      id: 30,
      name: "Chess Tournament",
      category: "achievement",
      image: "/Media/templates/achievement-6.jpg",
    },
    {
      id: 31,
      name: "Spelling Bee",
      category: "academic",
      image: "/Media/templates/academic-7.jpg",
    },
    {
      id: 32,
      name: "Safety Award",
      category: "professional",
      image: "/Media/templates/prof-7.jpg",
    },
    {
      id: 33,
      name: "Birthday Party",
      category: "event",
      image: "/Media/templates/event-7.jpg",
    },
    {
      id: 34,
      name: "Donor Recognition",
      category: "appreciation",
      image: "/Media/templates/appreciation-7.jpg",
    },
    {
      id: 35,
      name: "Swimming Competition",
      category: "achievement",
      image: "/Media/templates/achievement-7.jpg",
    },
    {
      id: 36,
      name: "Reading Challenge",
      category: "academic",
      image: "/Media/templates/academic-8.jpg",
    },
    {
      id: 37,
      name: "Quality Assurance",
      category: "professional",
      image: "/Media/templates/prof-8.jpg",
    },
    {
      id: 38,
      name: "Anniversary Party",
      category: "event",
      image: "/Media/templates/event-8.jpg",
    },
    {
      id: 39,
      name: "Mentorship Program",
      category: "appreciation",
      image: "/Media/templates/appreciation-8.jpg",
    },
    {
      id: 40,
      name: "Robotics Competition",
      category: "achievement",
      image: "/Media/templates/achievement-8.jpg",
    },
    {
      id: 41,
      name: "Scholarship Award",
      category: "academic",
      image: "/Media/templates/academic-9.jpg",
    },
    {
      id: 42,
      name: "Customer Service",
      category: "professional",
      image: "/Media/templates/prof-9.jpg",
    },
    {
      id: 43,
      name: "Product Launch",
      category: "event",
      image: "/Media/templates/event-9.jpg",
    },
    {
      id: 44,
      name: "Team Recognition",
      category: "appreciation",
      image: "/Media/templates/appreciation-9.jpg",
    },
    {
      id: 45,
      name: "Hackathon Winner",
      category: "achievement",
      image: "/Media/templates/achievement-9.jpg",
    },
    {
      id: 46,
      name: "Language Proficiency",
      category: "academic",
      image: "/Media/templates/academic-10.jpg",
    },
    {
      id: 47,
      name: "Digital Skills",
      category: "professional",
      image: "/Media/templates/prof-10.jpg",
    },
    {
      id: 48,
      name: "Virtual Conference",
      category: "event",
      image: "/Media/templates/event-10.jpg",
    },
    {
      id: 49,
      name: "Partner Recognition",
      category: "appreciation",
      image: "/Media/templates/appreciation-10.jpg",
    },
    {
      id: 50,
      name: "Coding Challenge",
      category: "achievement",
      image: "/Media/templates/achievement-10.jpg",
    },
  ];

  const templatesContainer = document.getElementById("templates-container");
  const categoryTabs = document.querySelectorAll(".tab-btn");
  const categoryCards = document.querySelectorAll(".category-card");
  const searchInput = document.getElementById("template-search");
  // const viewButtons = document.querySelectorAll(".view-btn");

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

    recentTemplatesContainer.innerHTML = "";

    recentIds.forEach((id) => {
      const template = templates.find((t) => t.id == id);
      if (template) {
        recentTemplatesContainer.innerHTML += createTemplateCard(template);
      }
    });

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

  // Initialize recent templates section
  // updateRecentTemplates();

  // Initialize start design button
  // document.querySelector(".start-btn").addEventListener("click", () => {
  //   alert("Starting a new design! Redirecting to editor...");
  //   // window.location.href = '/HTML/Editor.html';
  // });

  // document.querySelector(".create-btn").addEventListener("click", () => {
  //   alert("Creating a new design! Redirecting to editor...");
  //   // window.location.href = '/HTML/Editor.html';
  // });
});
