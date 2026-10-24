import { Link } from "react-router-dom";
import { Share2, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-[#e5e5ea]/80 dark:border-[#27272a]/80 bg-white/80 dark:bg-[#0b0c0e]/85 backdrop-blur-md pt-14 pb-12 px-4 sm:px-6 lg:px-8 text-xs text-[#6e6e73] dark:text-[#a1a1aa] transition-colors content-auto">
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
              {/* Clickable Email */}
              <a
                href="mailto:support@shareflow.me"
                className="inline-flex items-center gap-2 text-[#0071e3] dark:text-[#38bdf8] hover:underline font-medium"
              >
                <Mail className="w-4 h-4" />
                <span>support@shareflow.me</span>
              </a>
              {/* Clickable Phone */}
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
              <li><Link to="/pdf-utility" className="hover:text-[#0071e3] dark:hover:text-[#38bdf8] transition-colors font-semibold">⚡ PDF Utility Studio</Link></li>
              <li><Link to="/pdf-compressor" className="hover:text-[#0071e3] dark:hover:text-[#38bdf8] transition-colors">PDF Compressor</Link></li>
              <li><Link to="/pdf-merger" className="hover:text-[#0071e3] dark:hover:text-[#38bdf8] transition-colors">PDF Merger &amp; Splitter</Link></li>
              <li><Link to="/pdf-rotator" className="hover:text-[#0071e3] dark:hover:text-[#38bdf8] transition-colors">PDF Rotator &amp; Reorder</Link></li>
              <li><Link to="/pdf-watermark" className="hover:text-[#0071e3] dark:hover:text-[#38bdf8] transition-colors">PDF Watermark &amp; Numbers</Link></li>
              <li><Link to="/pdf-signer" className="hover:text-[#0071e3] dark:hover:text-[#38bdf8] transition-colors">PDF Digital Signer</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright Year 2026 */}
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
  );
}

export default Footer;
