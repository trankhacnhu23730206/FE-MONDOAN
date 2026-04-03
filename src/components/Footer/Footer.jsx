import React from "react";
import "./Footer.css";

const footerData = [
  {
    title: "Shop and Explore",
    links: [
      "Store",
      "Laptops",
      "Gaming PCs",
      "Keyboards",
      "Mice",
      "Headsets",
      "Speakers",
      "Accessories",
      "Deals",
    ],
  },
  {
    title: "Account",
    links: [
      "My Account",
      "Order History",
      "Wishlist",
      "Keyboard",
      "Track Your Order",
      "Saved Items",
      "Payment Methods",
    ],
  },
  {
    title: "Services",
    links: [
      "Build Your PC",
      "Trade-in Program",
      "Gaming PC",
      "Installment Plans",
      "Student Offers",
      "Gift Cards",
      "Warranty Services",
      "VTech Care",
    ],
  },
  {
    title: "Support",
    links: [
      "Help Center",
      "Help Shipping Information",
      "Shipping Information",
      "Returns and Refunds",
      "Product Support",
      "FAQ",
      "Contact Us",
      "Live Chat",
    ],
  },
  {
    title: "About VTech",
    links: [
      "About Us",
      "Newsroom",
      "Careers",
      "For Business",
      "For Education",
      "Privacy Policy",
      "Terms of Use",
    ],
  },
];

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {footerData.map((section, index) => (
            <div className="footer-column" key={index}>
              <h4>{section.title}</h4>
              <ul>
                {section.links.map((link, i) => (
                  <li key={i}>
                    <a href="/">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <p>© 2026 VTech. Student project for educational purposes only.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;