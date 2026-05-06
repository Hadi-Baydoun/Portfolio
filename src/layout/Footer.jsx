import imgTopShape from "@/assets/Homepage/top-shape.svg";
import imgFooterDecoration1 from "@/assets/home-footer-decoration-1.svg";
import imgFooterDecoration2 from "@/assets/home-footer-decoration-2.svg";

const Footer = () => {
	return (
		<footer className="footer-home">
			<img className="footer-top-shape" src={imgTopShape} alt="footer top shape" />

			<div className="container">
				<div className="footer-primary">
					<div className="footer-contact">
						<h5>
							Frontend
							Developer
						</h5>

						<p>
							Building modern, interactive web experiences.
						</p>
					</div>
				</div>

				<div className="footer-secondary">
					<div className="footer-logo-container">
						<div className="logo">
							<h6 className="text-[#ff6464]">Hadi Baydoun.</h6>
						</div>


					</div>



					{/* <div className="footer-socials-container">
						<ul className="socials-list">
							<li className="social-item">
								<Link
									className="footer-contact-link"
									to="/contact#hero"
									onClick={goToContact}
								>
									Contact
								</Link>
							</li>
						</ul>
					</div> */}

				</div>
			</div>

			{/* Decorations */}
			<img
				src={imgFooterDecoration1}
				alt="footer decoration"
				className="footer-home-decoration-1"
			/>
			<img
				src={imgFooterDecoration2}
				alt="footer decoration"
				className="footer-home-decoration-2"
			/>
		</footer>
	);
};

export default Footer;