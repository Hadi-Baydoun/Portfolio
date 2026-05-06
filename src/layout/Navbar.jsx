import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const NAV_SCROLL_THRESHOLD_PX = 32;

const CONTACT_EMAIL = "hadibaydoun17@gmail.com";

const NAV_LINKS = [
  { label: "About", hash: "about" },
  { label: "Work Experience", hash: "experience" },
  { label: "Projects", hash: "projects" },
  { label: "Skills", hash: "skills" },
  { label: "Contact Me", hash: "contact" },
];

function useMobileNavMenu() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return [isOpen, setIsOpen];
}

const Navbar = () => {
  const navigate = useNavigate();
  const [navSolid, setNavSolid] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useMobileNavMenu();

  useEffect(() => {
    const onScroll = () => setNavSolid(window.scrollY > NAV_SCROLL_THRESHOLD_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const closeIfDesktop = () => {
      if (mq.matches) setMobileMenuOpen(false);
    };
    closeIfDesktop();
    mq.addEventListener("change", closeIfDesktop);
    return () => mq.removeEventListener("change", closeIfDesktop);
  }, [setMobileMenuOpen]);

  const goToSection = useCallback(
    (hash) => {
      setMobileMenuOpen(false);
      navigate({ pathname: "/", hash: `#${hash}` });
    },
    [navigate, setMobileMenuOpen],
  );

  const goHome = useCallback(() => {
    setMobileMenuOpen(false);
    navigate({ pathname: "/", hash: "#hero" });
  }, [navigate, setMobileMenuOpen]);

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-100 flex items-center justify-between px-6 py-4 transition-colors duration-300 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:justify-normal md:gap-4 ${navSolid ? "backdrop-blur-sm bg-black/10" : ""
          } ${mobileMenuOpen ? "pointer-events-none" : ""}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{
          opacity: mobileMenuOpen ? 0 : 1,
          y: 0,
        }}
        transition={
          mobileMenuOpen
            ? { duration: 0.2, ease: "easeOut" }
            : { duration: 0.6, ease: "easeOut" }
        }
      >
        <motion.div
          className="justify-self-start min-w-0"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <button
            type="button"
            onClick={goHome}
            className="text-[#CD4A26] font-extrabold cursor-pointer text-xl tracking-tight hover:opacity-80 transition-opacity font-inter text-left"
          >
            Hadi Baydoun.
          </button>
        </motion.div>

        <motion.div
          className="hidden md:flex md:justify-self-center items-center gap-1 bg-white/60 backdrop-blur-md rounded-full px-4 py-2 shadow-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {NAV_LINKS.map((item) => (
            <motion.button
              type="button"
              key={item.hash}
              onClick={() => goToSection(item.hash)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 420, damping: 26 }}
              className="group relative px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap text-neutral-900 cursor-pointer font-inter overflow-hidden"
            >
              <span className="pointer-events-none absolute inset-0 rounded-full bg-linear-to-br from-[#CD4A26]/14 via-[#CD4A26]/6 to-transparent opacity-0 scale-95 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:scale-100" aria-hidden />
              <span className="pointer-events-none absolute left-1/2 bottom-1.5 h-0.5 w-[72%] max-w-20 -translate-x-1/2 rounded-full bg-[#CD4A26] shadow-[0_0_10px_rgba(205,74,38,0.4)] origin-center scale-x-0 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" aria-hidden />
              <span className="relative z-10 inline-block transition-all duration-300  group-hover:translate-y-[-0.5px]">
                {item.label}
              </span>
            </motion.button>
          ))}
        </motion.div>

        <motion.div
          className="hidden md:flex md:justify-self-end items-center gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >

          <motion.a
            href={`mailto:${CONTACT_EMAIL}`}
            whileHover={{ scale: 1.08, rotate: -8 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
            className="w-9 h-9 cursor-pointer rounded-full bg-white/60 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-sm transition-[background-color,box-shadow,border-color] duration-300 hover:border-[#CD4A26]/45 hover:bg-white/85 hover:shadow-[0_6px_24px_rgba(205,74,38,0.18)]"
            aria-label="Email"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-[#CA4F4E]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </motion.a>
        </motion.div>

        <motion.button
          type="button"
          className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 relative z-110"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          <motion.span
            className="block h-0.5 w-6 bg-gray-900 rounded-full origin-center"
            animate={mobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="block h-0.5 w-6 bg-gray-900 rounded-full"
            animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="block h-0.5 w-6 bg-gray-900 rounded-full origin-center"
            animate={mobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.2 }}
          />
        </motion.button>
      </motion.nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-120 md:hidden flex flex-col min-h-dvh isolate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            <div
              className="absolute inset-0 bg-linear-to-b from-[#5c3428]/96 via-[#CD4A26]/28 to-[#FFEEE6]"
              aria-hidden
            />
            <div
              className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(205,74,38,0.35),transparent_55%)] pointer-events-none"
              aria-hidden
            />

            <div className="relative flex flex-col flex-1 min-h-0">
              <header className="relative shrink-0 flex items-center justify-between px-6 pt-[max(1.25rem,env(safe-area-inset-top))] pb-5">
                <button
                  type="button"
                  onClick={goHome}
                  className="text-[#CD4A26] font-extrabold cursor-pointer text-xl tracking-tight font-inter text-left hover:opacity-[0.88] transition-opacity"
                >
                  Hadi Baydoun.
                </button>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white/55 text-neutral-900 shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-white/55 active:scale-[0.97] transition-transform"
                  aria-label="Close menu"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </header>

              <div className="relative mx-4 h-px bg-linear-to-r from-transparent via-black/12 to-transparent shrink-0" />

              <nav
                className="relative flex-1 overflow-y-auto px-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3"
                aria-label="Mobile"
              >
                <div
                  className="rounded-3xl border border-white/55 bg-white/45 backdrop-blur-md shadow-[0_10px_40px_rgba(45,25,20,0.08),inset_0_1px_0_rgba(255,255,255,0.65)] px-1.5 py-2"
                >
                  <ul className="flex flex-col gap-0.5 py-2">
                    {NAV_LINKS.map((item, i) => (
                      <li key={item.hash}>
                        <button
                          type="button"
                          onClick={() => goToSection(item.hash)}
                          className="group w-full flex items-baseline gap-4 rounded-2xl px-3.5 py-3.5 text-left font-inter transition-colors hover:bg-white/55 active:bg-white/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CD4A26]"
                        >
                          <span className="w-7 shrink-0 text-xs font-semibold tabular-nums tracking-widest text-[#CD4A26]">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="text-lg font-semibold tracking-tight text-neutral-950 group-hover:text-[#3d231c] transition-colors">
                            {item.label}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>


                </div>

              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
