import { useEffect, useState } from "react";
import imgMenuHome from "@/assets/Homepage/menu-home.jpg";
import imgGithub from "@/assets/Homepage/github.svg";
import { motion, AnimatePresence } from "framer-motion";

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

const NAV_SCROLL_THRESHOLD_PX = 32;

const Navbar = () => {
    const [navSolid, setNavSolid] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useMobileNavMenu();

    useEffect(() => {
        const onScroll = () => setNavSolid(window.scrollY > NAV_SCROLL_THRESHOLD_PX);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const navLinks = [
        { label: "About" },
        { label: "Projects" },
        { label: "Skills" },
        { label: "Work Experience" },
        { label: "Contact Me" },
    ];

    const mobileMenuItems = [
        { label: "Welcome", bg: imgMenuHome, bgColor: "#b04447" },
    ];

    const mobileMenuVariants = {
        hidden: { opacity: 0, scale: 0.1, borderRadius: "50%" },
        visible: { opacity: 1, scale: 1, borderRadius: 0, transition: { duration: 0.4, ease: "easeOut" } },
        exit: { opacity: 0, scale: 0.1, borderRadius: "50%", transition: { duration: 0.3, ease: "easeIn" } },
    };

    const mobileItemVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: (i) => ({ opacity: 1, scale: 1, transition: { delay: 0.1 + i * 0.08, duration: 0.4, ease: "easeOut" } }),
        exit: { opacity: 0, scale: 0.8 },
    };

    return (
        <>
            {/* Desktop Navbar */}
            <motion.nav
                className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-300 ${navSolid ? "backdrop-blur-sm bg-black/10" : ""
                    }`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                {/* Left: Logo */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <button
                        type="button"
                        className="text-[#ff6563] font-extrabold cursor-pointer text-xl tracking-tight hover:opacity-80 transition-opacity font-inter"
                    >
                        Hadi Baydoun.
                    </button>
                </motion.div>

                {/* Center: Pill Nav Links — hidden on mobile */}
                <motion.div
                    className="hidden md:flex items-center gap-1 bg-white/60 backdrop-blur-md rounded-full px-4 py-2 shadow-sm"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {navLinks.map((item) => (
                        <button
                            type="button"
                            key={item.label}
                            className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap text-black cursor-pointer"
                        >
                            {item.label}
                        </button>
                    ))}
                </motion.div>

                {/* Right: CTA + Mail Icon — hidden on mobile */}
                <motion.div
                    className="hidden md:flex items-center gap-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <button
                        type="button"
                        className="px-5 py-2 cursor-pointer rounded-full bg-white/60 backdrop-blur-md border border-white/30 text-black text-sm font-medium hover:bg-white/80 transition-all duration-200 shadow-sm"
                    >
                        Get in Touch
                    </button>
                    <button
                        type="button"
                        className="w-9 h-9 cursor-pointer rounded-full bg-white/60 backdrop-blur-md border border-white/30 flex items-center justify-center hover:bg-white/80 transition-all duration-200 shadow-sm"
                        aria-label="Email"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#CA4F4E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="20" height="16" x="2" y="4" rx="2" />
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                    </button>
                </motion.div>

                {/* Mobile Burger — visible only on mobile */}
                <motion.button
                    className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 z-60"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
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

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        className="fixed inset-0 bg-black/40 z-40 md:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setMobileMenuOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.nav
                        className="fixed inset-0 z-50 md:hidden"
                        variants={mobileMenuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <div className="flex flex-col h-full">
                            {/* Logo in mobile menu */}
                            <div className="flex items-center justify-between px-6 py-5">
                                <span className="text-[#ff6563] font-bold text-xl" style={{ fontFamily: "'Georgia', serif" }}>
                                    Hadi Baydoun.
                                </span>
                            </div>

                            {/* Top Item */}
                            <motion.div
                                className="flex-1 min-h-0"
                                custom={0}
                                variants={mobileItemVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <button
                                    type="button"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center justify-center h-full w-full bg-cover bg-center relative"
                                    style={{ backgroundImage: `url(${mobileMenuItems[0].bg})` }}
                                >
                                    <div className="absolute inset-0 bg-black/20" />
                                    <span className="relative text-white text-3xl font-bold tracking-wide">
                                        {mobileMenuItems[0].label}
                                    </span>
                                </button>
                            </motion.div>

                            {/* Social Links */}
                            <motion.div
                                className="flex items-center justify-center py-4 bg-white/10"
                                custom={3}
                                variants={mobileItemVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <a
                                    rel="noopener noreferrer"
                                    target="_blank"
                                    href="https://github.com/Hadi-Baydoun"
                                    className="hover:scale-110 transition-transform"
                                >
                                    <img src={imgGithub} alt="github" className="w-7 h-7" />
                                </a>
                            </motion.div>
                        </div>
                    </motion.nav>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;