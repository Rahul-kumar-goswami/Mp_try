// 1. CHECK LOCAL STORAGE FIRST
const body = document.body;
if (localStorage.getItem("darkMode") === "true") {
  body.classList.add("darkmode");
}

// 2. DARK MODE TOGGLE (Now after ensuring correct initial state)
const darkModeToggle = document.querySelector(".dark-mode-toggle");

function toggleDarkMode() {
  body.classList.toggle("darkmode");
  localStorage.setItem("darkMode", body.classList.contains("darkmode"));
}

darkModeToggle.addEventListener("click", toggleDarkMode);
darkModeToggle.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    toggleDarkMode();
  }
});

// 3. SIMULATE LOGIN STATE (Leave this as it is after the localStorage check and toggle)
let isLoggedIn = false;
loginLink = document.getElementById("login-link");
const userContainer = document.getElementById("user-container");
const userIcon = document.getElementById("user-icon");
const userDropdown = document.getElementById("user-dropdown");
const logoutBtn = document.getElementById("logout-btn");
const notifContainer = document.getElementById("notif-container");

function updateNavbarForLogin() {
  if (isLoggedIn) {
    loginLink.style.display = "none";
    userContainer.style.display = "flex";
    notifContainer.style.display = "flex";
  } else {
    loginLink.style.display = "inline";
    userContainer.style.display = "none";
    notifContainer.style.display = "none";
  }
}
updateNavbarForLogin();

// 4. USER ICON FUNCTIONALITY (Keep these event listeners)
userIcon.addEventListener("click", () => {
  const expanded = userIcon.getAttribute("aria-expanded") === "true";
  if (expanded) {
    userDropdown.classList.remove("active");
    userIcon.setAttribute("aria-expanded", "false");
  } else {
    userDropdown.classList.add("active");
    userIcon.setAttribute("aria-expanded", "true");
  }
});

document.addEventListener("click", (e) => {
  if (!userContainer.contains(e.target)) {
    userDropdown.classList.remove("active");
    userIcon.setAttribute("aria-expanded", "false");
  }
});

userIcon.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    userIcon.click();
  }
});

logoutBtn.addEventListener("click", () => {
  isLoggedIn = false;
  updateNavbarForLogin();
  userDropdown.classList.remove("active");
  userIcon.setAttribute("aria-expanded", "false");
});

// // Simulate login after 2 seconds
// setTimeout(() => {
//   isLoggedIn = true;
//   updateNavbarForLogin();
// }, 2000);

// Mobile Menu Elements
const hamburger = document.querySelector(".hamburger");
const floatingHamburger = document.querySelector(".floating-hamburger");
const mobileNav = document.querySelector(".mobile-nav");
const navbar = document.querySelector(".navbar");
let lastScroll = window.pageYOffset;

// Toggle mobile menu
const toggleMenu = () => {
  mobileNav.classList.toggle("active");

  // Hide hamburger icons when menu is open, show when closed
  const menuOpen = mobileNav.classList.contains("active");
  if (menuOpen) {
    hamburger.style.display = "none";
    floatingHamburger.style.display = "none";
  } else {
    // Show hamburger only if screen width <= 768px (mobile)
    if (window.innerWidth <= 768) {
      hamburger.style.display = "block";
    }
    floatingHamburger.style.display = "block";
  }
};

// Hamburger click only if visible
hamburger.addEventListener("click", () => {
  if (window.getComputedStyle(hamburger).display !== "none") {
    toggleMenu();
  }
});
floatingHamburger.addEventListener("click", toggleMenu);

// Scroll detection for hamburger and auto-close mobile menu at top
window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 100 && currentScroll > lastScroll) {
    floatingHamburger.classList.add("visible");
    navbar.classList.add("hidden");
  } else if (currentScroll <= 100) {
    floatingHamburger.classList.remove("visible");
    navbar.classList.remove("hidden");

    // Auto-close mobile menu when scrolled to top
    mobileNav.classList.remove("active");

    // Show hamburger icons when menu closed and at top
    if (window.innerWidth <= 768) {
      hamburger.style.display = "block";
    }
    floatingHamburger.style.display = "block";
  }

  lastScroll = currentScroll;
});

// Close mobile menu when clicking outside
document.addEventListener("click", (e) => {
  if (
    !e.target.closest(".nav-right") &&
    !e.target.closest(".mobile-nav") &&
    !e.target.closest(".floating-hamburger")
  ) {
    mobileNav.classList.remove("active");
    if (window.innerWidth <= 768) {
      hamburger.style.display = "block";
    }
    floatingHamburger.style.display = "block";
  }
});

// Add Close Button (×) to Mobile Menu
const mobileHeader = document.querySelector(".mobile-header");
const closeButton = document.createElement("button");
closeButton.innerHTML = "&times;"; // × sign
closeButton.className = "close-btn";
closeButton.setAttribute("aria-label", "Close mobile menu");
closeButton.addEventListener("click", () => {
  mobileNav.classList.remove("active");
  // Show hamburger icons on close
  if (window.innerWidth <= 768) {
    hamburger.style.display = "block";
  }
  floatingHamburger.style.display = "block";
});
mobileHeader.appendChild(closeButton);

// Add CSS for Close Button dynamically
const style = document.createElement("style");
style.textContent = `
  .close-btn {
    background-color: var(--secondary);
    color: var(--text-color);
    border: none;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
    border-radius: 5px;
    margin-left: auto;
    padding: 5px 12px;
    line-height: 1;
    transition: background-color 0.3s ease, color 0.3s ease;
  }
  .close-btn:hover {
    background-color: var(--hover);
    color: #fff;
  }
`;
document.head.appendChild(style);

// On window resize, ensure hamburger visibility matches menu state and screen size
window.addEventListener("resize", () => {
  if (mobileNav.classList.contains("active")) {
    hamburger.style.display = "none";
    floatingHamburger.style.display = "none";
  } else {
    if (window.innerWidth <= 768) {
      hamburger.style.display = "block";
    } else {
      hamburger.style.display = "none";
    }
    floatingHamburger.style.display = "block";
  }
});