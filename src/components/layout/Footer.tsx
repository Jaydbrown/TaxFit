import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'About', path: '/about' },
    { name: 'Find Attorney', path: '/find-attorney' },
  ];

  const resources = [
    { name: 'Tax Calculator', path: '/calculator' },
    { name: 'Tax Guides', path: '/guides' },
    { name: 'FAQs', path: '/faq' },
    { name: 'Support', path: '/support' },
  ];

  const legal = [
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
    { name: 'Cookie Policy', path: '/cookies' },
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-secondary-950 text-white">
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        {/* Main Footer Content */}
        <div className="py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-4 space-y-8">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-2xl">T</span>
              </div>
              <div className="text-2xl font-light text-white tracking-tight">
                Tax<span className="font-normal">-FIT</span>
              </div>
            </Link>
            
            <p className="text-gray-400 leading-relaxed font-light max-w-sm">
              Empowering enterprises with world-class tax advisory services. 
              Your trusted partner in tax excellence since 2015.
            </p>

            <div className="flex items-center gap-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-primary-500 hover:bg-primary-500/10 transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-6 font-light">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-primary-400 transition-colors font-light"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-6 font-light">
              Resources
            </h3>
            <ul className="space-y-3">
              {resources.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-primary-400 transition-colors font-light"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h3 className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-6 font-light">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary-500 flex-shrink-0 mt-1" />
                <span className="text-gray-300 font-light">
                  123 Tax Street, Victoria Island<br />Lagos, Nigeria
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary-500 flex-shrink-0" />
                <a href="tel:+2341234567890" className="text-gray-300 hover:text-primary-400 transition-colors font-light">
                  +234 123 456 7890
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary-500 flex-shrink-0" />
                <a href="mailto:info@taxfit.ng" className="text-gray-300 hover:text-primary-400 transition-colors font-light">
                  info@taxfit.ng
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="py-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400 font-light">
              © {currentYear} Tax-FIT. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {legal.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm text-gray-400 hover:text-primary-400 transition-colors font-light"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}