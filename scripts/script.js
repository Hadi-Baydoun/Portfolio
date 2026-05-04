import Rellax from "rellax";
import lottie from "lottie-web";

const jsonUrl = (name) => `${import.meta.env.BASE_URL}json/${name}`;

/**
 * Mirrors in-view's offset(300) using IntersectionObserver rootMargin (px expanded “viewport”).
 */
function observeVisibility(selector, { onEnter, onExit }) {
  const margin = "300px";
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) onEnter?.(entry.target);
        else onExit?.(entry.target);
      }
    },
    { root: null, rootMargin: margin, threshold: 0 },
  );
  document.querySelectorAll(selector).forEach((el) => io.observe(el));
  return () => io.disconnect();
}

async function fetchLottieJson(name) {
  const res = await fetch(jsonUrl(name));
  if (!res.ok) throw new Error(`Failed to load ${jsonUrl(name)}`);
  return res.json();
}

/**
 * Legacy homepage behaviors: Rellax, lazy images, Lottie, nav.
 * Loads Lottie JSON via fetch + animationData (avoids lottie-web XHR + responseText bug when responseType is json).
 * @returns {Promise<() => void>} Resolves to a teardown function for React.
 */
export async function initHomepage() {
  const rellax =
    document.querySelector(".rellax") != null
      ? new Rellax(".rellax", {
          speed: 4,
          wrapper: null,
          vertical: true,
          horizontal: false,
          breakpoints: [480, 1024, 1248],
        })
      : null;

  const loader = document.querySelector(".loader");
  if (loader) {
    loader.style.opacity = "0";
    setTimeout(() => {
      loader.style.display = "none";
    }, 250);
  }

  const nav = document.querySelector(".nav");
  const logoDark = document.querySelector(".logo--dark");

  const disposers = [];
  const lottieInstances = [];

  let logoAnimation = null;
  let logoScrollAttached = false;

  async function bindSectionLottie(containerSelector, jsonFile) {
    const container = document.querySelector(
      `${containerSelector} .linear-block-animation`,
    );
    if (!container) return;
    let animationData;
    try {
      animationData = await fetchLottieJson(jsonFile);
    } catch {
      return;
    }
    const anim = lottie.loadAnimation({
      container,
      renderer: "svg",
      loop: false,
      autoplay: false,
      animationData,
    });
    lottieInstances.push(anim);
    disposers.push(
      observeVisibility(containerSelector, {
        onEnter: () => {
          anim.setDirection(1);
          anim.play();
        },
        onExit: () => {
          anim.setDirection(-1);
          anim.play();
        },
      }),
    );
  }

  if (logoDark) {
    try {
      const animationData = await fetchLottieJson("hero-logo-dark-sm.json");
      logoAnimation = lottie.loadAnimation({
        container: logoDark,
        renderer: "svg",
        loop: false,
        autoplay: false,
        animationData,
      });
    } catch {
      logoAnimation = null;
    }
  }

  const onScrollNav = () => {
    const top = document.documentElement.scrollTop;
    if (!nav || !logoAnimation) return;
    if (top > 400) {
      nav.classList.add("sticky");
      logoAnimation.play();
    } else if (top < 20) {
      nav.classList.remove("sticky");
      logoAnimation.stop();
    }
  };
  if (nav && logoAnimation) {
    window.addEventListener("scroll", onScrollNav, { passive: true });
    logoScrollAttached = true;
  }

  await bindSectionLottie(".idea", "idea.json");
  await bindSectionLottie(".design", "design.json");
  await bindSectionLottie(".development", "development.json");

  const heroLogoLottieEl = document.querySelector(".hero-logo-lottie");
  let formScrollTimeout = null;

  if (heroLogoLottieEl) {
    try {
      const animationData = await fetchLottieJson("hero-logo.json");
      const g = lottie.loadAnimation({
        container: heroLogoLottieEl,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData,
      });
      lottieInstances.push(g);

      let lastY = 0;
      let direction = 0;
      let prevDirection = 0;
      let scrollDebounceId = null;

      const onScrollDir = () => {
        const t = window.pageYOffset || document.documentElement.scrollTop;
        direction = t > lastY ? -1 : 1;
        lastY = t <= 0 ? 0 : t;
        window.clearTimeout(scrollDebounceId);
        scrollDebounceId = window.setTimeout(() => {
          direction = 0;
        }, 66);
      };
      window.addEventListener("scroll", onScrollDir, { passive: true });

      const playSegmentForDirection = () => {
        if (direction === 0) g.playSegments([0, 20], true);
        else if (direction === -1) g.playSegments([22, 50], true);
        else g.playSegments([52, 80], true);
      };

      const intervalId = window.setInterval(() => {
        if (direction !== prevDirection) {
          playSegmentForDirection();
          prevDirection = direction;
        }
      }, 10);

      disposers.push(() => {
        window.removeEventListener("scroll", onScrollDir);
        window.clearInterval(intervalId);
        window.clearTimeout(scrollDebounceId);
      });
    } catch {
      /* skip broken animation */
    }
  }

  disposers.push(
    observeVisibility(".tech-item", {
      onEnter: (el) => {
        el.querySelector(".item-image")?.classList.add("animation--background-pop-in");
        el.querySelectorAll(".image-tech").forEach((node) =>
          node.classList.add("animation--preview-pop-in"),
        );
      },
    }),
  );

  disposers.push(
    observeVisibility(".portfolio-item", {
      onEnter: (el) => {
        el.querySelector(".item-image")?.classList.add("animation--background-pop-in");
        el.querySelector(".image-portfolio")?.classList.add("animation--preview-pop-in");
      },
    }),
  );

  disposers.push(
    observeVisibility(".bushes-content", {
      onEnter: (el) => {
        el.querySelector(".image--left")?.classList.add("animation--slide-left");
        el.querySelector(".image--right")?.classList.add("animation--slide-right");
      },
    }),
  );

  if (document.querySelector(".is-invalid")) {
    formScrollTimeout = window.setTimeout(() => {
      document.querySelector("form")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 250);
  }

  return () => {
    if (logoScrollAttached) window.removeEventListener("scroll", onScrollNav);
    rellax?.destroy?.();
    for (const d of disposers) d();
    for (const inst of lottieInstances) inst.destroy?.();
    if (logoAnimation) logoAnimation.destroy();
    window.clearTimeout(formScrollTimeout);
  };
}
