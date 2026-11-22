/**
 * ============================================================================
 * Christian Amare - Portfolio Script
 * ============================================================================
 * This JavaScript file adds simple, essential interactivity to the portfolio:
 * 1. Mobile navigation menu toggle (open/close).
 * 2. Automatic closing of the mobile menu when a navigation link is clicked.
 * 3. Adding a subtle shadow to the navigation bar when the user scrolls down.
 * 4. Highlighting active navigation links based on current scroll position.
 * 5. One-click copy email address to clipboard with animated feedback.
 * 6. Screenshot lightbox modal for project card previews.
 * ============================================================================
 */

// Wait for the HTML document to be fully loaded before running our script
document.addEventListener("DOMContentLoaded", () => {
  // 1. Select the key elements from the DOM (Document Object Model)
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav__link");
  const header = document.getElementById("header");

  // ==========================================================================
  // 1. MOBILE MENU TOGGLE
  // Opens and closes the navigation menu when clicking the hamburger button.
  // ==========================================================================
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      // Toggle the 'open' class on the menu (slides it down or hides it)
      navMenu.classList.toggle("open");

      // Toggle the 'active' class on the button (transforms hamburger to 'X')
      navToggle.classList.toggle("active");

      // Update accessibility attribute 'aria-expanded' (true if open, false if closed)
      const isExpanded = navToggle.classList.contains("active");
      navToggle.setAttribute("aria-expanded", isExpanded);
    });
  }

  // ==========================================================================
  // 2. CLOSE MENU ON LINK CLICK
  // When a user taps a menu link on a phone, close the dropdown menu so they
  // can clearly see the section they just navigated to.
  // ==========================================================================
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navMenu.classList.contains("open")) {
        navMenu.classList.remove("open");
        navToggle.classList.remove("active");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  });

  // ==========================================================================
  // 3. HEADER SCROLL SHADOW
  // Add a slightly stronger background and shadow to the navbar when scrolling
  // down the page to keep it distinct from the underlying page content.
  // ==========================================================================
  window.addEventListener("scroll", () => {
    // If scrolled more than 50 pixels down from the top
    if (window.scrollY > 50) {
      header.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.4)";
      header.style.backgroundColor = "rgba(11, 15, 25, 0.95)";
    } else {
      header.style.boxShadow = "none";
      header.style.backgroundColor = "rgba(11, 15, 25, 0.8)";
    }
  });

  // ==========================================================================
  // 4. ACTIVE LINK HIGHLIGHT ON SCROLL
  // Dynamically highlights which section link (Home, About, Projects, etc.)
  // is currently in view as the user scrolls up and down the page.
  // ==========================================================================
  const sections = document.querySelectorAll("section[id]");

  function scrollActiveLink() {
    const scrollDown = window.scrollY;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120; // 120px offset to account for navbar height
      const sectionId = current.getAttribute("id");
      const sectionLink = document.querySelector(`.nav__link[href*="${sectionId}"]`);

      if (sectionLink) {
        if (scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight) {
          sectionLink.classList.add("active");
        } else {
          sectionLink.classList.remove("active");
        }
      }
    });
  }

  window.addEventListener("scroll", scrollActiveLink);

  // ==========================================================================
  // 5. COPY EMAIL TO CLIPBOARD
  // Copies Christian's email address to the clipboard with one click and
  // gives friendly visual feedback ("✓ Copied to clipboard!").
  // ==========================================================================
  const copyEmailBtn = document.getElementById("copy-email-btn");
  const emailLabel = document.getElementById("email-label");

  if (copyEmailBtn && emailLabel) {
    copyEmailBtn.addEventListener("click", () => {
      const email = "christian.amare16@gmail.com";

      // Function to show friendly visual confirmation
      const showCopiedFeedback = () => {
        const originalLabel = "Direct Email (Click to copy)";
        emailLabel.textContent = "✓ Copied to clipboard!";
        emailLabel.style.color = "var(--accent)";

        setTimeout(() => {
          emailLabel.textContent = originalLabel;
          emailLabel.style.color = "";
        }, 2500);
      };

      // Use modern Clipboard API if available, otherwise use fallback
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email)
          .then(showCopiedFeedback)
          .catch(() => fallbackCopy(email));
      } else {
        fallbackCopy(email);
      }

      // Safe fallback that works everywhere (including local file:// protocol)
      function fallbackCopy(text) {
        const tempInput = document.createElement("input");
        tempInput.value = text;
        document.body.appendChild(tempInput);
        tempInput.select();
        try {
          document.execCommand("copy");
          showCopiedFeedback();
        } catch (err) {
          console.error("Copy failed", err);
        }
        document.body.removeChild(tempInput);
      }
    });
  }

  // ==========================================================================
  // 6. SCREENSHOT LIGHTBOX MODAL
  // Enlarges screenshot preview images on click. Closes with the close button,
  // by clicking outside the image on the overlay, or by pressing the Escape key.
  // ==========================================================================
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxClose = document.getElementById("lightbox-close");
  const lightboxOverlay = document.getElementById("lightbox-overlay");
  const thumbBtns = document.querySelectorAll(".project-card__thumb-btn");

  if (lightbox && lightboxImg) {
    // Open the lightbox with the clicked screenshot
    const openLightbox = (imgSrc, captionText) => {
      lightboxImg.src = imgSrc;
      lightboxImg.alt = captionText || "Enlarged project screenshot preview";
      if (lightboxCaption) {
        lightboxCaption.textContent = captionText || "";
      }
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden"; // Prevent page scrolling while preview is open
    };

    // Close the lightbox modal
    const closeLightbox = () => {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = ""; // Restore page scrolling
      // Clear image source after fade-out transition
      setTimeout(() => {
        if (!lightbox.classList.contains("is-open")) {
          lightboxImg.src = "";
        }
      }, 300);
    };

    // Attach click listener to each screenshot thumbnail button
    thumbBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const fullSrc = btn.getAttribute("data-full");
        const caption = btn.getAttribute("data-caption");
        if (fullSrc) {
          openLightbox(fullSrc, caption);
        }
      });
    });

    // Close on close button click
    if (lightboxClose) {
      lightboxClose.addEventListener("click", closeLightbox);
    }

    // Close on background overlay click
    if (lightboxOverlay) {
      lightboxOverlay.addEventListener("click", closeLightbox);
    }

    // Close on keyboard Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && lightbox.classList.contains("is-open")) {
        closeLightbox();
      }
    });
  }
});
