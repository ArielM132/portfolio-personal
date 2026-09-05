"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const body = document.body;
  const themeButton = document.querySelector("[data-theme-toggle]");
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

  const getTheme = () => {
    if (root.dataset.theme === "light" || root.dataset.theme === "dark") {
      return root.dataset.theme;
    }

    return systemTheme.matches ? "dark" : "light";
  };

  const updateThemeInterface = () => {
    const currentTheme = getTheme();
    const nextTheme = currentTheme === "dark" ? "claro" : "oscuro";

    if (themeButton) {
      themeButton.setAttribute("aria-label", `Activar tema ${nextTheme}`);
      themeButton.setAttribute("aria-pressed", String(currentTheme === "dark"));
    }

    if (themeColor) {
      themeColor.setAttribute("content", currentTheme === "dark" ? "#111216" : "#f3f0e8");
    }
  };

  updateThemeInterface();

  themeButton?.addEventListener("click", () => {
    const newTheme = getTheme() === "dark" ? "light" : "dark";
    root.dataset.theme = newTheme;

    try {
      localStorage.setItem("portfolio-theme", newTheme);
    } catch (error) {
      // El cambio funciona durante la visita aunque el navegador bloquee el almacenamiento.
    }

    updateThemeInterface();
  });

  systemTheme.addEventListener?.("change", () => {
    if (!root.dataset.theme) {
      updateThemeInterface();
    }
  });

  const menuButton = document.querySelector("[data-menu-toggle]");
  const navigation = document.querySelector("[data-navigation]");

  const closeMenu = () => {
    if (!menuButton || !navigation) return;

    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Abrir menú");
    navigation.classList.remove("is-open");
    body.classList.remove("menu-open");
  };

  menuButton?.addEventListener("click", () => {
    if (!navigation) return;

    const willOpen = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(willOpen));
    menuButton.setAttribute("aria-label", willOpen ? "Cerrar menú" : "Abrir menú");
    navigation.classList.toggle("is-open", willOpen);
    body.classList.toggle("menu-open", willOpen);
  });

  navigation?.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 980) closeMenu();
  });

  const header = document.querySelector("[data-header]");
  const updateHeader = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const revealElements = document.querySelectorAll("[data-reveal]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -9%", threshold: 0.08 }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
  }

  const sections = document.querySelectorAll("[data-section]");
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (!visibleSections.length) return;

        const activeId = visibleSections[0].target.id;
        navLinks.forEach((link) => {
          const isActive = link.getAttribute("href") === `#${activeId}`;
          link.classList.toggle("is-active", isActive);
          if (isActive) {
            link.setAttribute("aria-current", "location");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      },
      { rootMargin: "-24% 0px -58%", threshold: [0.05, 0.25, 0.5] }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  const copyButton = document.querySelector("[data-copy-email]");
  const copyStatus = document.querySelector("[data-copy-status]");
  const email = "videoariel132@gmail.com";

  copyButton?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(email);
      copyButton.textContent = "Correo copiado";
      if (copyStatus) copyStatus.textContent = "La dirección de correo fue copiada.";

      window.setTimeout(() => {
        copyButton.textContent = "Copiar correo";
      }, 2200);
    } catch (error) {
      window.location.href = `mailto:${email}`;
    }
  });

  const year = document.querySelector("[data-current-year]");
  if (year) year.textContent = String(new Date().getFullYear());
});
