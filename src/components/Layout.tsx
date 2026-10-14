/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Share2,
  FileUp,
  Download,
  FileText,
  ShoppingBag,
  Mail,
  Phone,
  ChevronRight,
  Sun,
  Moon
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { FeedbackModal } from "./FeedbackModal";
import { LiquidEther } from "./LiquidEther";

export function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const navLinks = [
    { name: "P2P File Share", href: "/file-share", icon: FileUp, badge: "P2P" },
    { name: "Receive", href: "/f", icon: Download },
    { name: "Text Share", href: "/text-share", icon: FileText, badge: "Burn" },
    { name: "Developer Kits", href: "/products", icon: ShoppingBag, badge: "New" },
  ];

  const popularTools = [
    { name: "QR Generator", href: "/qr-generator" },
    { name: "JSON Formatter", href: "/json-formatter" },
    { name: "JSON to TS", href: "/json-to-typescript" },
    { name: "PDF Merger", href: "/pdf-merger" },
    { name: "Image Compressor", href: "/image-compressor" },
    { name: "Hash Generator", href: "/hash-generator" },
    { name: "JWT Decoder", href: "/jwt-decoder" },
  ];

  return (
    <div className="relative min-h-screen flex flex-col bg-[#fbfbfd] dark:bg-[#0b0c0e] text-[#1d1d1f] dark:text-[#f5f5f7] font-sans antialiased overflow-x-hidden selection:bg-[#0071e3] selection:text-white">
      {/* Full-Screen LiquidEther WebGL Fluid Simulation Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30 dark:opacity-20 transition-opacity duration-700">
        <LiquidEther
          colors={
            theme === "dark"
              ? ["#0071e3", "#38bdf8", "#34c759", "#6366f1"]
              : ["#0071e3", "#38bdf8", "#34c759", "#818cf8"]
          }
          mouseForce={22}
          cursorSize={110}
          autoDemo={true}
          autoSpeed={0.4}
          resolution={0.45}
          BFECC={true}
        />
      </div>

      {/* Cupertino Frosted Header */}
      <header className="relative z-50 sticky top-0 backdrop-blur-xl bg-white/75 dark:bg-[#0b0c0e]/80 border-b border-[#e5e5ea]/80 dark:border-[#27272a]/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo - Clickable (Instagram Reel Item #17) */}
          <Link
            to="/"
            aria-label="ShareFlow Home"
            className="flex items-center gap-2.5 group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0071e3] to-[#34c759] flex items-center justify-center text-white shadow-sm shadow-[#0071e3]/20 group-hover:scale-105 group-active:scale-90 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
              <Share2 className="w-5 h-5 text-white stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[17px] tracking-tight text-[#1d1d1f] dark:text-white group-hover:text-[#0071e3] transition-colors leading-none">
                ShareFlow
              </span>
              <span className="text-[10px] text-[#86868b] dark:text-[#a1a1aa] tracking-wider uppercase font-semibold mt-0.5">
                P2P DataChannels
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`px-3.5 py-2 rounded-full text-[13px] font-semibold transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-90 hover:scale-105 flex items-center gap-1.5 ${
                    isActive
                      ? "bg-[#0071e3] text-white shadow-sm shadow-[#0071e3]/25"
                      : "text-[#6e6e73] dark:text-[#a1a1aa] hover:text-[#1d1d1f] dark:hover:text-white hover:bg-[#f5f5f7] dark:hover:bg-[#1f222a]"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-[#86868b] dark:text-[#a1a1aa]"}`} />
                  <span>{link.name}</span>
                  {link.badge && !isActive && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 bg-[#f5f5f7] dark:bg-[#1f222a] text-[#0071e3] dark:text-[#38bdf8] border border-[#d2d2d7]/50 dark:border-[#27272a] rounded-full">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2.5">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#6e6e73] dark:text-[#a1a1aa] hover:text-[#1d1d1f] dark:hover:text-white hover:bg-[#f5f5f7] dark:hover:bg-[#1f222a] border border-transparent hover:border-[#e5e5ea] dark:hover:border-[#27272a] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-90 hover:scale-105 focus:outline-none"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-rotate-12" />
              )}
            </button>
          </div>

          {/* Mobile Actions & Menu Button */}
          <div className="flex md:hidden items-center gap-1">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="w-10 h-10 rounded-full flex items-center justify-center text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-[#f5f5f7] dark:hover:bg-[#1f222a] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-90 hover:scale-105 focus:outline-none"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-amber-400 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:rotate-45" />
              ) : (
                <Moon className="w-5 h-5 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-rotate-12" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              className="w-10 h-10 rounded-full flex items-center justify-center text-[#1d1d1f] dark:text-white hover:bg-[#f5f5f7] dark:hover:bg-[#1f222a] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-90 hover:scale-105 focus:outline-none"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (Instagram Reel Item #3) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Cupertino Slide Drawer */}
          <div className="relative w-full max-h-[85vh] bg-white dark:bg-[#12141a] rounded-t-3xl shadow-2xl border-t border-[#e5e5ea] dark:border-[#27272a] overflow-y-auto p-6 flex flex-col gap-6 animate-drawer-spring">
            <div className="flex items-center justify-between pb-4 border-b border-[#e5e5ea] dark:border-[#27272a]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#0071e3] flex items-center justify-center text-white font-bold text-sm">
                  S
                </div>
                <span className="font-bold text-base text-[#1d1d1f] dark:text-white">Navigation Menu</span>
              </div>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f5f5f7] dark:bg-[#1f222a] flex items-center justify-center text-[#6e6e73] dark:text-[#a1a1aa] hover:text-[#1d1d1f] dark:hover:text-white transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-90 hover:scale-105"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Primary Nav Links */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold text-[#86868b] dark:text-[#a1a1aa] uppercase tracking-wider mb-1">
                Core Services
              </span>
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-[1.02] active:scale-[0.96] ${
                      isActive
                        ? "bg-[#0071e3] text-white"
                        : "bg-[#f5f5f7] dark:bg-[#181a20] text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-[#e5e5ea] dark:hover:bg-[#27272a]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span>{link.name}</span>
                    </div>
                    {link.badge && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive ? "bg-white/20 text-white" : "bg-white dark:bg-[#27272a] text-[#0071e3] dark:text-[#38bdf8] border border-[#d2d2d7] dark:border-transparent"
                      }`}>
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Quick Tools */}
            <div className="flex flex-col gap-1.5 pt-2">
              <span className="text-[11px] font-bold text-[#86868b] dark:text-[#a1a1aa] uppercase tracking-wider mb-1">
                Popular Utilities
              </span>
              <div className="grid grid-cols-2 gap-2">
                {popularTools.map((tool) => (
                  <Link
                    key={tool.name}
                    to={tool.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="px-3 py-2.5 rounded-xl bg-[#f5f5f7] dark:bg-[#181a20] hover:bg-[#e5e5ea] dark:hover:bg-[#27272a] text-xs font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] flex items-center justify-between transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-[1.03] active:scale-[0.96]"
                  >
                    <span>{tool.name}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#86868b] dark:text-[#a1a1aa]" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact links inside mobile drawer */}
            <div className="pt-4 border-t border-[#e5e5ea] dark:border-[#27272a] flex flex-col gap-2 text-xs text-[#6e6e73] dark:text-[#a1a1aa]">
              <a
                href="mailto:support@shareflow.me"
                className="flex items-center gap-2 p-2 rounded-xl bg-[#f5f5f7] dark:bg-[#181a20] text-[#0071e3] dark:text-[#38bdf8] font-medium"
              >
                <Mail className="w-4 h-4" />
                <span>support@shareflow.me</span>
              </a>
              <a
                href="tel:+180****0199"
                className="flex items-center gap-2 p-2 rounded-xl bg-[#f5f5f7] dark:bg-[#181a20] text-[#0071e3] dark:text-[#38bdf8] font-medium"
              >
                <Phone className="w-4 h-4" />
                <span>+1 (800) 555-0199</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Main Page Content */}
      <main className="relative z-10 flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl flex flex-col">
        <Outlet />
      </main>

      {/* Cupertino Light Multi-Column Footer (Instagram Reel Items #7, #9, #18, #19) */}
      <footer className="relative z-10 border-t border-[#e5e5ea]/80 dark:border-[#27272a]/80 bg-white/80 dark:bg-[#0b0c0e]/85 backdrop-blur-md pt-14 pb-12 px-4 sm:px-6 lg:px-8 text-xs text-[#6e6e73] dark:text-[#a1a1aa] transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
            {/* Col 1: Brand & Mission */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <Link to="/" className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#0071e3] to-[#34c759] flex items-center justify-center text-white">
                  <Share2 className="w-4 h-4" />
                </div>
                <span className="font-bold text-base text-[#1d1d1f] dark:text-white">ShareFlow</span>
              </Link>
              <p className="text-[#6e6e73] dark:text-[#a1a1aa] text-[13px] leading-relaxed max-w-sm">
                Direct browser-to-browser WebRTC file &amp; secret data sharing with zero server egress. Engineered with client-side AES-GCM-256 encryption.
              </p>
              <div className="flex flex-col gap-2 mt-1">
                {/* Clickable Email (Instagram Reel Item #19) */}
                <a
                  href="mailto:support@shareflow.me"
                  className="inline-flex items-center gap-2 text-[#0071e3] dark:text-[#38bdf8] hover:underline font-medium"
                >
                  <Mail className="w-4 h-4" />
                  <span>support@shareflow.me</span>
                </a>
                {/* Clickable Phone (Instagram Reel Item #18) */}
                <a
                  href="tel:+180****0199"
                  className="inline-flex items-center gap-2 text-[#0071e3] dark:text-[#38bdf8] hover:underline font-medium"
                >
                  <Phone className="w-4 h-4" />
                  <span>+1 (800) 555-0199 (Developer Desk)</span>
                </a>
              </div>
            </div>

            {/* Col 2: Flagship Transfer */}
            <div className="flex flex-col gap-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#1d1d1f] dark:text-white">Transfer Suite</h4>
              <ul className="flex flex-col gap-2">
                <li><Link to="/file-share" className="hover:text-[#0071e3] dark:hover:text-[#38bdf8] transition-colors">P2P File Share</Link></li>
                <li><Link to="/f" className="hover:text-[#0071e3] dark:hover:text-[#38bdf8] transition-colors">Receive File Stream</Link></li>
                <li><Link to="/text-share" className="hover:text-[#0071e3] dark:hover:text-[#38bdf8] transition-colors">Ephemeral Text Share</Link></li>
                <li><Link to="/products" className="hover:text-[#0071e3] dark:hover:text-[#38bdf8] transition-colors">Developer Starter Kits</Link></li>
              </ul>
            </div>

            {/* Col 3: Developer Utilities */}
            <div className="flex flex-col gap-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#1d1d1f] dark:text-white">Popular Utilities</h4>
              <ul className="flex flex-col gap-2">
                <li><Link to="/qr-generator" className="hover:text-[#0071e3] dark:hover:text-[#38bdf8] transition-colors">QR Code Generator</Link></li>
                <li><Link to="/json-formatter" className="hover:text-[#0071e3] dark:hover:text-[#38bdf8] transition-colors">JSON Formatter</Link></li>
                <li><Link to="/json-to-typescript" className="hover:text-[#0071e3] dark:hover:text-[#38bdf8] transition-colors">JSON to TypeScript</Link></li>
                <li><Link to="/jwt-decoder" className="hover:text-[#0071e3] dark:hover:text-[#38bdf8] transition-colors">JWT Token Decoder</Link></li>
                <li><Link to="/hash-generator" className="hover:text-[#0071e3] dark:hover:text-[#38bdf8] transition-colors">Hash Generator</Link></li>
              </ul>
            </div>

            {/* Col 4: Media & Docs */}
            <div className="flex flex-col gap-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#1d1d1f] dark:text-white">Media &amp; Architecture</h4>
              <ul className="flex flex-col gap-2">
                <li><Link to="/image-compressor" className="hover:text-[#0071e3] dark:hover:text-[#38bdf8] transition-colors">Image Compressor</Link></li>
                <li><Link to="/pdf-merger" className="hover:text-[#0071e3] dark:hover:text-[#38bdf8] transition-colors">PDF Merger</Link></li>
                <li><Link to="/base64" className="hover:text-[#0071e3] dark:hover:text-[#38bdf8] transition-colors">Base64 Converter</Link></li>
                <li><Link to="/regex-tester" className="hover:text-[#0071e3] dark:hover:text-[#38bdf8] transition-colors">Regex Playground</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar: Copyright Year 2026 (Instagram Reel Item #9) */}
          <div className="pt-8 border-t border-[#e5e5ea] dark:border-[#27272a] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#86868b] dark:text-[#a1a1aa]">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#1d1d1f] dark:text-white">© 2026 ShareFlow</span>
              <span>•</span>
              <span>Direct WebRTC DataChannels</span>
              <span>•</span>
              <span>Zero Knowledge Architecture</span>
            </div>
            <div className="flex items-center gap-4">
              <span>All operations client-side</span>
              <span>•</span>
              <span>Cloudflare Edge Relay</span>
            </div>
          </div>
        </div>
      </footer>

      <FeedbackModal />
    </div>
  );
}
