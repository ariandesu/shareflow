import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon } from "lucide-react";

export function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLightMode, setIsLightMode] = useState(() => {
    return localStorage.getItem("theme") === "light";
  });
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (isLightMode) {
      document.body.classList.add("light-theme");
      localStorage.setItem("theme", "light");
    } else {
      document.body.classList.remove("light-theme");
      localStorage.setItem("theme", "dark");
    }
  }, [isLightMode]);

  const navigation = [
    { name: "All Tools", href: "/" },
    { name: "Text Share", href: "/text-share" },
    { name: "File Share", href: "/file-share" },
    { name: "QR Generator", href: "/qr-generator" },
    { name: "Gradient Gen", href: "/gradient-generator" },
    { name: "Password Gen", href: "/password-generator" },
    { name: "UUID", href: "/uuid" },
    { name: "Base64", href: "/base64" },
    { name: "JSON Formatter", href: "/json-formatter" },
    { name: "Markdown Preview", href: "/markdown-preview" },
    { name: "Color Picker", href: "/color-picker" },
    { name: "Box Shadow", href: "/box-shadow" },
    { name: "Flexbox", href: "/flexbox" },
    { name: "Grid Gen", href: "/grid" },
    { name: "Unit Converter", href: "/unit-converter" },
    { name: "Hash Gen", href: "/hash-generator" },
    { name: "JWT Decoder", href: "/jwt-decoder" },
    { name: "Regex Tester", href: "/regex-tester" },
    { name: "Image Compressor", href: "/image-compressor" },
    { name: "Image Resizer", href: "/image-resizer" },
    { name: "EXIF Remover", href: "/exif-remover" },
    { name: "Image Converter", href: "/image-converter" },
    { name: "PDF Merger", href: "/pdf-merger" },
    { name: "PDF Splitter", href: "/pdf-splitter" },
    { name: "PDF to Images", href: "/pdf-to-images" },
    { name: "Images to PDF", href: "/images-to-pdf" },
    { name: "Metadata Viewer", href: "/metadata-viewer" },
    { name: "Countdown Timer", href: "/countdown-timer" },
    { name: "Calculator", href: "/calculator" },
    { name: "SVG to CSS", href: "/svg-to-css" },
    { name: "CSS Animation", href: "/css-animation" },
    { name: "Color Blindness", href: "/color-blindness" },
    { name: "Dice Roller", href: "/dice-roller" },
    { name: "Coin Flip", href: "/coin-flip" },
    { name: "CSV Viewer", href: "/csv-viewer" },
    { name: "HTML Beautifier", href: "/html-beautifier" },
    { name: "Z-Index", href: "/z-index" },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] font-sans flex flex-col">
      <header className="h-20 border-b border-white/10 px-4 sm:px-10 flex items-center justify-between sticky top-0 z-40 bg-[#0A0A0A]/90 backdrop-blur-sm">
        <div className="flex items-center gap-8 w-full">
          <div className="flex items-center justify-between w-full md:w-auto">
            <Link to="/" className="text-2xl font-black tracking-tighter uppercase flex items-center">
              <span className="bg-white text-black px-1 mr-1">SHARE</span>FLOW
            </Link>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-white/50 hover:text-white hover:bg-white/5 focus:outline-none transition-colors"
              >
                {isMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
              </button>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 w-full justify-between">
            <nav className="flex gap-6 text-sm font-medium text-white/50">
              {navigation.slice(0, 4).map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`hover:text-white transition-colors ${
                    location.pathname === item.href ? "text-white font-bold" : ""
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="relative group flex items-center">
                <button className="hover:text-white transition-colors">
                  More Tools
                </button>
                <div className="absolute left-0 top-full mt-2 w-56 bg-[#111] border border-white/10 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20 max-h-[70vh] overflow-y-auto">
                  <div className="py-2 flex flex-col">
                    {navigation.slice(4).map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="px-4 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </nav>
            <button
              onClick={() => setIsLightMode(!isLightMode)}
              className="p-2 rounded-md text-white/50 hover:text-white hover:bg-white/5 transition-colors"
              title="Toggle theme"
            >
              {isLightMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu (Sidebar Drawer Overlay with transition in/out) */}
      <>
        {/* Backdrop */}
        <div 
          className={`fixed inset-0 bg-black/60 z-45 md:hidden transition-opacity duration-300 ${
            isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsMenuOpen(false)}
        />
        {/* Sidebar Drawer */}
        <div 
          className={`fixed top-0 left-0 h-full w-[280px] bg-[#0A0A0A] border-r border-white/10 z-50 flex flex-col p-6 overflow-y-auto md:hidden transition-transform duration-300 ease-in-out transform ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
            <Link to="/" className="text-xl font-black tracking-tighter uppercase flex items-center" onClick={() => setIsMenuOpen(false)}>
              <span className="bg-white text-black px-1 mr-1">SHARE</span>FLOW
            </Link>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-1 rounded-md text-white/50 hover:text-white hover:bg-white/5 focus:outline-none transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="px-4 py-2 flex items-center justify-between border-b border-white/10 mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-white/50">Theme</span>
            <button
              onClick={() => setIsLightMode(!isLightMode)}
              className="p-2 rounded-md text-white/50 hover:text-white hover:bg-white/5 transition-colors"
            >
              {isLightMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
          </div>

          <nav className="flex flex-col gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-2.5 border-l-4 text-sm font-medium transition-colors ${
                  location.pathname === item.href
                    ? "bg-white/5 border-white text-white"
                    : "border-transparent text-white/50 hover:bg-white/5 hover:border-white/30 hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </>

      <main className="flex-1 w-full mx-auto p-6 sm:p-12 overflow-hidden flex flex-col">
        <Outlet />
      </main>

      <footer className="h-12 border-t border-white/10 px-4 sm:px-10 flex flex-col sm:flex-row items-center justify-between text-[10px] text-white/20 font-medium uppercase tracking-[0.2em]">
        <div className="mb-2 sm:mb-0">© {new Date().getFullYear()} ShareFlow Ecosystem</div>
        <div className="flex gap-4 sm:gap-8 flex-wrap justify-center">
          <span>Global Traffic: <span className="text-white/60">12.4M Ops/mo</span></span>
          <span>Cloudflare Edge: <span className="text-green-500/60 font-bold underline underline-offset-4 decoration-1">Active</span></span>
        </div>
      </footer>
    </div>
  );
}
