import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const NAV_SCROLL_THRESHOLD_PX = 32;

const CONTACT_EMAIL = "hadibaydoun17@gmail.com";

const NAV_LINKS = [
  { label: "About", hash: "about" },
  { label: "Projects", hash: "projects" },
  { label: "Skills", hash: "skills" },
  { label: "Work Experience", hash: "experience" },
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

  const mobilePanelVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: { duration: 0.28, ease: "easeIn" },
    },
  };

  const mobileLinkVariants = {
    hidden: { opacity: 0, x: -12 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: 0.06 + i * 0.05, duration: 0.35, ease: "easeOut" },
    }),
    exit: { opacity: 0, x: -8 },
  };

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-100 flex items-center justify-between px-6 py-4 transition-all duration-300 ${navSolid ? "backdrop-blur-sm bg-black/10" : ""
          }`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <button
            type="button"
            onClick={goHome}
            className="text-[#F15533] font-extrabold cursor-pointer text-xl tracking-tight hover:opacity-80 transition-opacity font-inter text-left"
          >
            Hadi Baydoun.
          </button>
        </motion.div>

        <motion.div
          className="hidden md:flex items-center gap-1 bg-white/60 backdrop-blur-md rounded-full px-4 py-2 shadow-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {NAV_LINKS.map((item) => (
            <button
              type="button"
              key={item.hash}
              onClick={() => goToSection(item.hash)}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap text-black cursor-pointer font-inter hover:bg-black/5"
            >
              {item.label}
            </button>
          ))}
        </motion.div>

        <motion.div
          className="hidden md:flex items-center gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >

          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="w-9 h-9 cursor-pointer rounded-full bg-white/60 backdrop-blur-md border border-white/30 flex items-center justify-center hover:bg-white/80 transition-all duration-200 shadow-sm"
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
          </a>
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
        {mobileMenuOpen ? (
          <motion.div
            className="fixed inset-0 z-90 md:hidden pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
          >
            <button
              type="button"
              aria-label="Close menu"
              tabIndex={-1}
              className="absolute inset-0 bg-black/40 pointer-events-auto cursor-default border-none p-0 m-0"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              className="absolute left-0 right-0 bottom-0 top-17 pointer-events-auto flex flex-col bg-white/90 backdrop-blur-xl border-t border-white/50 shadow-[0_-16px_40px_rgba(0,0,0,0.08)] overflow-hidden"
              variants={mobilePanelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-6 py-6 pb-8">
                <div className="rounded-3xl bg-white/60 backdrop-blur-md border border-white/40 shadow-sm p-2">
                  {NAV_LINKS.map((item, i) => (
                    <motion.div
                      key={item.hash}
                      custom={i}
                      variants={mobileLinkVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <button
                        type="button"
                        onClick={() => goToSection(item.hash)}
                        className="w-full text-left px-4 py-3.5 rounded-2xl text-base font-medium text-black font-inter transition-colors hover:bg-black/4 active:bg-black/7"
                      >
                        {item.label}
                      </button>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 flex flex-col gap-3">

                  <motion.div
                    custom={NAV_LINKS.length + 1}
                    variants={mobileLinkVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="flex justify-center"
                  >
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="w-12 h-12 rounded-full bg-white/60 backdrop-blur-md border border-white/30 flex items-center justify-center hover:bg-white/80 transition-all duration-200 shadow-sm"
                      aria-label="Email"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-[#CA4F4E]"
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
                    </a>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
