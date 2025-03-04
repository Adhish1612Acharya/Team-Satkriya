import {
  Heart,
  Mail,
  Phone,
  MapPin,
  Github,
  Twitter,
  Linkedin,
} from "lucide-react";
import { FC } from "react";

const Footer:FC = () => {
  return (
    <footer
      className="w-full bg-gray-900 text-gray-300 border-t border-gray-700"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {/* About Us */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">About Us</h3>
            <p>
              Connecting healthcare professionals, NGOs, volunteers, and
              researchers to make a difference in healthcare accessibility.
            </p>
            <div className="flex items-center space-x-2 text-indigo-400">
              <Heart className="w-5 h-5" />
              <span className="text-sm">Making healthcare better together</span>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact</h3>
            <div className="space-y-3">
              <a
                href="mailto:contact@example.com"
                className="flex items-center space-x-2 hover:text-indigo-400"
              >
                <Mail className="w-5 h-5" />
                <span>contact@example.com</span>
              </a>
              <div className="flex items-center space-x-2">
                <Phone className="w-5 h-5" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>123 Healthcare Ave, City</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-indigo-400">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-400">
                  Services
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-400">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-400">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-indigo-400">
                <Github className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-indigo-400">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-indigo-400">
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
            <p className="text-sm">
              Stay connected with us on social media for the latest updates.
            </p>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <p className="text-center text-gray-400">
            © {new Date().getFullYear()} Healthcare Platform. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
