import { lazy, Suspense } from "react";
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
const Products = lazy(() => import("./pages/Products"));
const TextShare = lazy(() => import("./pages/TextShare").then(m => ({ default: m.TextShare })));

const FileShare = lazy(() => import("./pages/FileShare").then(m => ({ default: m.FileShare })));
const FileReceive = lazy(() => import("./pages/FileReceive").then(m => ({ default: m.FileReceive })));
const QRGenerator = lazy(() => import("./pages/QRGenerator").then(m => ({ default: m.QRGenerator })));
const GradientGenerator = lazy(() => import("./pages/GradientGenerator").then(m => ({ default: m.GradientGenerator })));
const PasswordGenerator = lazy(() => import("./pages/PasswordGenerator").then(m => ({ default: m.PasswordGenerator })));
const UUIDGenerator = lazy(() => import("./pages/UUIDGenerator").then(m => ({ default: m.UUIDGenerator })));
const Base64 = lazy(() => import("./pages/Base64").then(m => ({ default: m.Base64 })));
const JSONFormatter = lazy(() => import("./pages/JSONFormatter").then(m => ({ default: m.JSONFormatter })));
const MarkdownPreview = lazy(() => import("./pages/MarkdownPreview").then(m => ({ default: m.MarkdownPreview })));
const ColorPicker = lazy(() => import("./pages/ColorPicker"));
const BoxShadowGenerator = lazy(() => import("./pages/BoxShadowGenerator"));
const FlexboxPlayground = lazy(() => import("./pages/FlexboxPlayground"));
const GridGenerator = lazy(() => import("./pages/GridGenerator"));
const UnitConverter = lazy(() => import("./pages/UnitConverter"));
const HashGenerator = lazy(() => import("./pages/HashGenerator"));
const JWTDecoder = lazy(() => import("./pages/JWTDecoder"));
const RegexTester = lazy(() => import("./pages/RegexTester"));
const ImageCompressor = lazy(() => import("./pages/ImageCompressor"));
const ImageResizer = lazy(() => import("./pages/ImageResizer"));
const EXIFRemover = lazy(() => import("./pages/EXIFRemover"));
const ImageConverter = lazy(() => import("./pages/ImageConverter"));
const PDFMerger = lazy(() => import("./pages/PDFMerger"));
const PDFSplitter = lazy(() => import("./pages/PDFSplitter"));
const PDFToImages = lazy(() => import("./pages/PDFToImages"));
const ImagesToPDF = lazy(() => import("./pages/ImagesToPDF"));
const MetadataViewer = lazy(() => import("./pages/MetadataViewer"));
const CountdownTimer = lazy(() => import("./pages/CountdownTimer"));
const ScientificCalculator = lazy(() => import("./pages/ScientificCalculator"));
const SVGToCSS = lazy(() => import("./pages/SVGToCSS"));
const CSSAnimationGenerator = lazy(() => import("./pages/CSSAnimationGenerator"));
const ColorBlindnessSimulator = lazy(() => import("./pages/ColorBlindnessSimulator"));
const DiceRoller = lazy(() => import("./pages/DiceRoller"));
const CoinFlip = lazy(() => import("./pages/CoinFlip"));
const CSVViewer = lazy(() => import("./pages/CSVViewer"));
const HTMLBeautifier = lazy(() => import("./pages/HTMLBeautifier"));
const ZIndexVisualizer = lazy(() => import("./pages/ZIndexVisualizer"));
const PDFTextExtractor = lazy(() => import("./pages/PDFTextExtractor"));
const PDFPageRemover = lazy(() => import("./pages/PDFPageRemover"));
const PDFRotator = lazy(() => import("./pages/PDFRotator"));
const PDFWatermark = lazy(() => import("./pages/PDFWatermark"));
const PDFSigner = lazy(() => import("./pages/PDFSigner"));
const PDFCompressor = lazy(() => import("./pages/PDFCompressor"));
const PDFUtility = lazy(() => import("./pages/PDFUtility").then(m => ({ default: m.PDFUtility })));
const TextDiff = lazy(() => import("./pages/TextDiff"));
const CSVJsonConverter = lazy(() => import("./pages/CSVJsonConverter"));
const EpochConverter = lazy(() => import("./pages/EpochConverter"));
const WordCounter = lazy(() => import("./pages/WordCounter"));
const CaseConverter = lazy(() => import("./pages/CaseConverter"));
const TimezoneConverter = lazy(() => import("./pages/TimezoneConverter"));
const ColorContrastChecker = lazy(() => import("./pages/ColorContrastChecker"));
const PercentageCalculator = lazy(() => import("./pages/PercentageCalculator"));
const LoremIpsum = lazy(() => import("./pages/LoremIpsum"));
const IDGenerator = lazy(() => import("./pages/IDGenerator"));
const TimeNow = lazy(() => import("./pages/TimeNow"));
const JSONToTypeScript = lazy(() => import("./pages/JSONToTypeScript"));
const JSONToZod = lazy(() => import("./pages/JSONToZod"));
const SQLFormatter = lazy(() => import("./pages/SQLFormatter"));
const CronGenerator = lazy(() => import("./pages/CronGenerator"));
const JSONPathExtractor = lazy(() => import("./pages/JSONPathExtractor"));
const DeveloperGateway = lazy(() => import("./pages/DeveloperGateway"));
const DeveloperLogin = lazy(() => import("./pages/DeveloperLogin"));
const DeveloperSignup = lazy(() => import("./pages/DeveloperSignup"));
const DeveloperDashboard = lazy(() => import("./pages/DeveloperDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[65vh] py-16 px-4 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#f5f5f7] text-[#6e6e73] border border-[#d2d2d7]/60 mb-6">
        <span className="w-2 h-2 rounded-full bg-[#ff9500]"></span>
        404 • Page Not Found
      </div>
      <h1 className="text-6xl sm:text-7xl font-extrabold tracking-tight text-[#1d1d1f] mb-4">
        Lost in Transmission
      </h1>
      <p className="text-base sm:text-lg text-[#6e6e73] max-w-md mx-auto mb-8 font-normal leading-relaxed">
        The link you followed doesn't exist, has expired, or was moved. Return home or pick a quick tool below.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
        <Link
          to="/"
          className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-sm font-semibold shadow-sm transition-all duration-150"
        >
          Return to Home
        </Link>
        <Link
          to="/file-share"
          className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 rounded-full bg-[#f5f5f7] hover:bg-[#e5e5ea] text-[#1d1d1f] text-sm font-semibold border border-[#d2d2d7] transition-all duration-150"
        >
          Start File Share
        </Link>
      </div>

      <div className="pt-8 border-t border-[#e5e5ea] max-w-lg w-full">
        <p className="text-xs text-[#86868b] uppercase tracking-wider font-semibold mb-3">Popular Transfer Tools</p>
        <div className="flex flex-wrap justify-center items-center gap-3 text-xs font-medium text-[#6e6e73]">
          <Link to="/file-share" className="hover:text-[#0071e3] transition-colors py-1">File Share</Link>
          <span className="text-[#d2d2d7]">•</span>
          <Link to="/f" className="hover:text-[#0071e3] transition-colors py-1">Receive Files</Link>
          <span className="text-[#d2d2d7]">•</span>
          <Link to="/text-share" className="hover:text-[#0071e3] transition-colors py-1">Text Share</Link>
          <span className="text-[#d2d2d7]">•</span>
          <Link to="/products" className="hover:text-[#0071e3] transition-colors py-1">Developer Starter Kits</Link>
          <span className="text-[#d2d2d7]">•</span>
          <Link to="/qr-generator" className="hover:text-[#0071e3] transition-colors py-1">QR Generator</Link>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="developer-starter-kits" element={<Products />} />
            <Route path="text-share" element={<TextShare />} />
            <Route path="text-share/:id" element={<TextShare />} />

            {/* File Share Routes */}
            <Route path="file-share" element={<FileShare />} />
            <Route path="f" element={<FileReceive />} />
            <Route path="f/:id" element={<FileReceive />} />
            <Route path="t/:id" element={<TextShare />} />

            <Route path="qr-generator" element={<QRGenerator />} />
            <Route path="gradient-generator" element={<GradientGenerator />} />
            <Route path="password-generator" element={<PasswordGenerator />} />
            <Route path="uuid" element={<UUIDGenerator />} />
            <Route path="base64" element={<Base64 />} />
            <Route path="json-formatter" element={<JSONFormatter />} />
          <Route path="json-to-typescript" element={<JSONToTypeScript />} />
          <Route path="json-to-zod" element={<JSONToZod />} />
          <Route path="sql-formatter" element={<SQLFormatter />} />
          <Route path="cron-generator" element={<CronGenerator />} />
          <Route path="json-path-extractor" element={<JSONPathExtractor />} />
            <Route path="markdown-preview" element={<MarkdownPreview />} />
            <Route path="color-picker" element={<ColorPicker />} />
            <Route path="box-shadow" element={<BoxShadowGenerator />} />
            <Route path="flexbox" element={<FlexboxPlayground />} />
            <Route path="grid" element={<GridGenerator />} />
            <Route path="unit-converter" element={<UnitConverter />} />
            <Route path="hash-generator" element={<HashGenerator />} />
            <Route path="jwt-decoder" element={<JWTDecoder />} />
            <Route path="regex-tester" element={<RegexTester />} />
            <Route path="image-compressor" element={<ImageCompressor />} />
            <Route path="image-resizer" element={<ImageResizer />} />
            <Route path="exif-remover" element={<EXIFRemover />} />
            <Route path="image-converter" element={<ImageConverter />} />
            <Route path="pdf-merger" element={<PDFMerger />} />
            <Route path="pdf-splitter" element={<PDFSplitter />} />
            <Route path="pdf-rotator" element={<PDFRotator />} />
            <Route path="pdf-watermark" element={<PDFWatermark />} />
            <Route path="pdf-signer" element={<PDFSigner />} />
            <Route path="pdf-compressor" element={<PDFCompressor />} />
            <Route path="pdf-utility" element={<PDFUtility />} />
            <Route path="pdf-tools" element={<PDFUtility />} />
            <Route path="pdf-to-images" element={<PDFToImages />} />
            <Route path="images-to-pdf" element={<ImagesToPDF />} />
            <Route path="metadata-viewer" element={<MetadataViewer />} />
            <Route path="countdown-timer" element={<CountdownTimer />} />
            <Route path="calculator" element={<ScientificCalculator />} />
            <Route path="scientific-calculator" element={<ScientificCalculator />} />
            <Route path="svg-to-css" element={<SVGToCSS />} />
            <Route path="css-animation" element={<CSSAnimationGenerator />} />
            <Route path="color-blindness" element={<ColorBlindnessSimulator />} />
            <Route path="dice-roller" element={<DiceRoller />} />
            <Route path="coin-flip" element={<CoinFlip />} />
            <Route path="csv-viewer" element={<CSVViewer />} />
            <Route path="html-beautifier" element={<HTMLBeautifier />} />
            <Route path="z-index" element={<ZIndexVisualizer />} />
            <Route path="pdf-text-extractor" element={<PDFTextExtractor />} />
            <Route path="pdf-page-remover" element={<PDFPageRemover />} />
            <Route path="text-diff" element={<TextDiff />} />
            <Route path="csv-json" element={<CSVJsonConverter />} />
            <Route path="epoch-converter" element={<EpochConverter />} />
            <Route path="word-counter" element={<WordCounter />} />
            <Route path="case-converter" element={<CaseConverter />} />
            <Route path="timezone-converter" element={<TimezoneConverter />} />
            <Route path="color-contrast" element={<ColorContrastChecker />} />
            <Route path="percentage-calculator" element={<PercentageCalculator />} />
            <Route path="lorem-ipsum" element={<LoremIpsum />} />
            <Route path="id-generator" element={<IDGenerator />} />
            <Route path="time" element={<TimeNow />} />

            {/* Developer & Admin Portal */}
            <Route path="dev" element={<DeveloperGateway />} />
            <Route path="dev/dashboard" element={<DeveloperDashboard />} />
            <Route path="dev/admin" element={<AdminDashboard />} />
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/dashboard" element={<AdminDashboard />} />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </ThemeProvider>
  );
}
