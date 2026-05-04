import { useEffect, useState } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import imgMenuHome from "@/assets/Homepage/menu-home.jpg";
import imgMenuSkills from "@/assets/Explore/portfolio-header-background.svg";
import imgMenuContact from "@/assets/Contact/contact-header-background.svg";
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
    const location = useLocation();
    const navigate = useNavigate();

    const scrollToHero = () => {
        const el = document.getElementById("hero");
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        const onScroll = () => {
            setNavSolid(window.scrollY > NAV_SCROLL_THRESHOLD_PX);
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const navItems = [
        { label: "Welcome", path: "/#hero" },
        { label: "Skills", path: "/explore#hero" },
        { label: "Contact", path: "/contact#hero" },
    ];

    const mobileMenuItems = [
        {
            label: "Welcome",
            path: "/#hero",
            bg: imgMenuHome,
            bgColor: "#b04447",
        },
        {
            label: "Skills",
            path: "/explore#hero",
            bg: imgMenuSkills,
            bgColor: "#1d7d97",
        },
        {
            label: "Contact",
            path: "/contact#hero",
            bg: imgMenuContact,
            bgColor: "#fbc292",
        },
    ];

    // Variants for animations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" },
        },
    };

    const navLinkVariants = {
        idle: { scale: 1 },
        hover: {
            scale: 1.05,
            transition: { duration: 0.2 },
        },
        tap: { scale: 0.95 },
    };

    const underlineVariants = {
        idle: { width: 0 },
        hover: { width: "100%" },
    };

    const mobileMenuVariants = {
        hidden: {
            opacity: 0,
            scale: 0.1,
            borderRadius: "50%",
        },
        visible: {
            opacity: 1,
            scale: 1,
            borderRadius: 0,
            transition: {
                duration: 0.4,
                ease: "easeOut",
            },
        },
        exit: {
            opacity: 0,
            scale: 0.1,
            borderRadius: "50%",
            transition: {
                duration: 0.3,
                ease: "easeIn",
            },
        },
    };

    const mobileItemVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: (i) => ({
            opacity: 1,
            scale: 1,
            transition: {
                delay: 0.1 + i * 0.08,
                duration: 0.4,
                ease: "easeOut",
            },
        }),
        exit: { opacity: 0, scale: 0.8 },
    };

    const burgerVariants = {
        closed: { rotate: 0 },
        open: { rotate: 90 },
    };

    const burgerLineVariants = {
        closed: { rotate: 0, y: 0 },
        open: (custom) => ({
            rotate: custom === "top" ? 45 : custom === "bottom" ? -45 : 0,
            y: custom === "top" ? 8 : custom === "bottom" ? -8 : 0,
        }),
    };

    const goToHashSection = (e, pathname, sectionId = "hero") => {
        const hash = `#${sectionId}`;
        if (location.pathname === pathname && location.hash === hash) {
            e?.preventDefault();
            document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
            return;
        }

        navigate(`${pathname}${hash}`);
        setTimeout(() => {
            document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
        }, 50);
    };

    const goToHero = (e) => goToHashSection(e, "/");
    const goToExplore = (e) => goToHashSection(e, "/explore");
    const goToContact = (e) => goToHashSection(e, "/contact");

    return (
        <>
            {/* Desktop Navbar */}
            <motion.nav
                className={`nav ${navSolid ? "nav--solid" : ""}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <div className="nav-container">
                    <motion.div
                        className="nav-group-left"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <NavLink
                            to="/#hero"
                            className={({ isActive }) =>
                                `nav-item ${isActive ? "active" : ""}`
                            }
                            onClick={goToHero}
                        >
                            <motion.div
                                variants={navLinkVariants}
                                whileHover="hover"
                                whileTap="tap"
                                className="nav-link-wrapper"
                            >
                                <span>Welcome</span>
                                <motion.div
                                    className="nav-underline"
                                    variants={underlineVariants}
                                    initial="idle"
                                    whileHover="hover"
                                />
                            </motion.div>
                        </NavLink>
                    </motion.div>

                    <motion.div
                        className="nav-group-right"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {["Skills", "Contact"].map((item, i) => (
                            <motion.div key={item} variants={itemVariants}>
                                <NavLink
                                    to={item === "Skills" ? "/explore#hero" : "/contact#hero"}
                                    className={({ isActive }) =>
                                        `nav-item ${isActive ? "active" : ""}`
                                    }
                                    onClick={item === "Skills" ? goToExplore : goToContact}
                                >
                                    <motion.div
                                        variants={navLinkVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                        className="nav-link-wrapper"
                                    >
                                        <span>{item}</span>
                                        <motion.div
                                            className="nav-underline"
                                            variants={underlineVariants}
                                            initial="idle"
                                            whileHover="hover"
                                        />
                                    </motion.div>
                                </NavLink>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Animated background glow effect */}
                <motion.div
                    className="nav-glow"
                    animate={{
                        opacity: navSolid ? 1 : 0,
                    }}
                    transition={{ duration: 0.4 }}
                />
            </motion.nav>

            {/* Mobile Menu Burger */}
            <motion.button
                className="burger-button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                variants={burgerVariants}
                animate={mobileMenuOpen ? "open" : "closed"}
                transition={{ duration: 0.2 }}
                aria-label="Toggle menu"
            >
                <motion.span
                    className="burger-line burger-line--top"
                    variants={burgerLineVariants}
                    animate={mobileMenuOpen ? "open" : "closed"}
                    custom="top"
                    transition={{ duration: 0.2 }}
                />
                <motion.span
                    className="burger-line burger-line--middle"
                    variants={burgerLineVariants}
                    animate={mobileMenuOpen ? "open" : "closed"}
                    custom="middle"
                    transition={{ duration: 0.2 }}
                />
                <motion.span
                    className="burger-line burger-line--bottom"
                    variants={burgerLineVariants}
                    animate={mobileMenuOpen ? "open" : "closed"}
                    custom="bottom"
                    transition={{ duration: 0.2 }}
                />
            </motion.button>

            {/* Mobile Menu Header Logo */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        className="mobile-nav-header"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="logo logo--dark" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        className="mobile-menu-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setMobileMenuOpen(false)}
                        transition={{ duration: 0.2 }}
                    />
                )}
            </AnimatePresence>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.nav
                        className="mobile-nav"
                        variants={mobileMenuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <motion.div className="mobile-nav-content">
                            {/* Top Item */}
                            <motion.div className="mobile-nav-group top">
                                <motion.div
                                    className="mobile-nav-item"
                                    custom={0}
                                    variants={mobileItemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                >
                                    <Link
                                        to={mobileMenuItems[0].path}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="mobile-background mobile-item-link"
                                        style={{ backgroundImage: `url(${mobileMenuItems[0].bg})` }}
                                    >
                                        <motion.p
                                            className="mobile-item-text"
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            {mobileMenuItems[0].label}
                                        </motion.p>
                                    </Link>
                                </motion.div>
                            </motion.div>

                            {/* Bottom Items */}
                            <motion.div className="mobile-nav-group bottom">
                                {mobileMenuItems.slice(1).map((item, i) => (
                                    <motion.div
                                        key={item.label}
                                        className="mobile-nav-item"
                                        custom={i + 1}
                                        variants={mobileItemVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                    >
                                        <Link
                                            to={item.path}
                                            onClick={(e) => {
                                                if (item.label === "Skills") goToExplore(e);
                                                else if (item.label === "Contact") goToContact(e);
                                                setMobileMenuOpen(false);
                                            }}
                                            className="mobile-background mobile-item-link"
                                            style={{ backgroundImage: `url(${item.bg})` }}
                                        >
                                            <motion.p
                                                className="mobile-item-text"
                                                whileHover={{ scale: 1.1 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                {item.label}
                                            </motion.p>
                                        </Link>
                                    </motion.div>
                                ))}

                                {/* Social Links */}
                                <motion.div
                                    className="mobile-nav-socials"
                                    custom={3}
                                    variants={mobileItemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                >
                                    <ul className="socials-list">
                                        <motion.li
                                            whileHover={{ scale: 1.2, rotate: 10 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <a
                                                rel="noopener"
                                                target="_blank"
                                                href="https://github.com/Hadi-Baydoun"
                                            >
                                                <img
                                                    src={imgGithub}
                                                    alt="github"
                                                />
                                            </a>
                                        </motion.li>
                                    </ul>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </motion.nav>

                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
