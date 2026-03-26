import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiGithub, FiTwitter, FiInstagram, FiLinkedin } from "react-icons/fi";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const supportLinks = [
    { label: "Help Center", to: "/products" },
    { label: "Track Order", to: "/dashboard" },
    { label: "Returns & Refunds", to: "/dashboard" },
    { label: "Shipping Info", to: "/products" },
    { label: "Contact Us", to: "/auth" },
  ];

  return (
    <footer className="relative bg-black/80 border-t border-white/5 pt-16 pb-8 overflow-hidden z-10">
      {/* Glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-600/10 mix-blend-screen blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                <span className="text-white font-black text-sm">N</span>
              </div>
              <span className="text-xl font-black text-white">NeoCart</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Experience the future of shopping with our curated selection of
              next-generation technology, wearables, and AI-powered devices.
            </p>
            <div className="flex items-center gap-4">
              {[FiTwitter, FiGithub, FiInstagram, FiLinkedin].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -3, color: "#fff" }}
                  className="w-10 h-10 rounded-full glass flex items-center justify-center text-gray-400 hover:bg-white/5 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links 1 */}
          <div>
            <h3 className="text-white font-semibold mb-6">Shop</h3>
            <ul className="space-y-4">
              {[
                "All Products",
                "Electronics",
                "Wearables",
                "Gaming",
                "Smart Home",
              ].map((item) => (
                <li key={item}>
                  <Link
                    to="/products"
                    className="text-gray-400 hover:text-purple-400 text-sm transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h3 className="text-white font-semibold mb-6">Support</h3>
            <ul className="space-y-4">
              {supportLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-gray-400 hover:text-cyan-400 text-sm transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold mb-6">Stay Updated</h3>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to get latest product drops and futuristic news.
            </p>
            <form className="relative" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 px-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
          <p>© {currentYear} NeoCart. All rights reserved.</p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <Link to="#" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="#" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link to="#" className="hover:text-white transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
