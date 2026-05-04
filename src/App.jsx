import { useLayoutEffect, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import LazyLoad from "vanilla-lazyload";

import Footer from "@/layout/Footer";
import Navbar from "@/layout/Navbar";

import Homepage from "@/pages/Homepage";
import Explore from "@/pages/Explore";

import Contact from "@/pages/Contact";

function ScrollToHash() {
	const { pathname, hash } = useLocation();
	useLayoutEffect(() => {
		if (!hash) return;
		const id = hash.slice(1);
		if (!id) return;
		requestAnimationFrame(() => {
			document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
		});
	}, [pathname, hash]);
	return null;
}

/** Site-wide lazy backgrounds/images; must stay alive off the homepage (homepage teardown used to destroy the only LazyLoad instance). */
function GlobalLazyLoad() {
	const { pathname, hash } = useLocation();
	const lazyRef = useRef(null);

	useEffect(() => {
		lazyRef.current = new LazyLoad({
			elements_selector: ".lazy",
		});
		return () => {
			lazyRef.current?.destroy?.();
			lazyRef.current = null;
		};
	}, []);

	useLayoutEffect(() => {
		lazyRef.current?.update?.();
	}, [pathname, hash]);

	return null;
}

function ContactPageBodyClass() {
	const { pathname } = useLocation();
	useLayoutEffect(() => {
		document.body.classList.toggle("page-contact", pathname === "/contact");
		return () => document.body.classList.remove("page-contact");
	}, [pathname]);
	return null;
}

const App = () => {
	return (
		<Router>
			<div id="app">
				<ContactPageBodyClass />
				<GlobalLazyLoad />
				<ScrollToHash />

				<Navbar />

				<Routes>
					<Route path="/" element={<Homepage />} />
					<Route path="/explore" element={<Explore />} />
					<Route path="/contact" element={<Contact />} />
				</Routes>

				<Footer />
			</div>
		</Router>
	);
};

export default App;