/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import Products from "./pages/Products";
import { TextShare } from "./pages/TextShare";

import { FileShare } from "./pages/FileShare";
import { FileReceive } from "./pages/FileReceive";
import { QRGenerator } from "./pages/QRGenerator";
import { GradientGenerator } from "./pages/GradientGenerator";
import { PasswordGenerator } from "./pages/PasswordGenerator";
import { UUIDGenerator } from "./pages/UUIDGenerator";
import { Base64 } from "./pages/Base64";
import { JSONFormatter } from "./pages/JSONFormatter";
import { MarkdownPreview } from "./pages/MarkdownPreview";
import ColorPicker from "./pages/ColorPicker";
import BoxShadowGenerator from "./pages/BoxShadowGenerator";
import FlexboxPlayground from "./pages/FlexboxPlayground";
import GridGenerator from "./pages/GridGenerator";
import UnitConverter from "./pages/UnitConverter";
import HashGenerator from "./pages/HashGenerator";
import JWTDecoder from "./pages/JWTDecoder";
import RegexTester from "./pages/RegexTester";
import ImageCompressor from "./pages/ImageCompressor";
import ImageResizer from "./pages/ImageResizer";
import EXIFRemover from "./pages/EXIFRemover";
import ImageConverter from "./pages/ImageConverter";
import PDFMerger from "./pages/PDFMerger";
import PDFSplitter from "./pages/PDFSplitter";
import PDFToImages from "./pages/PDFToImages";
import ImagesToPDF from "./pages/ImagesToPDF";
import MetadataViewer from "./pages/MetadataViewer";
import CountdownTimer from "./pages/CountdownTimer";
import ScientificCalculator from "./pages/ScientificCalculator";
import SVGToCSS from "./pages/SVGToCSS";
import CSSAnimationGenerator from "./pages/CSSAnimationGenerator";
import ColorBlindnessSimulator from "./pages/ColorBlindnessSimulator";
import DiceRoller from "./pages/DiceRoller";
import CoinFlip from "./pages/CoinFlip";
import CSVViewer from "./pages/CSVViewer";
import HTMLBeautifier from "./pages/HTMLBeautifier";
import ZIndexVisualizer from "./pages/ZIndexVisualizer";
import PDFTextExtractor from "./pages/PDFTextExtractor";
import PDFPageRemover from "./pages/PDFPageRemover";
import TextDiff from "./pages/TextDiff";
import CSVJsonConverter from "./pages/CSVJsonConverter";
import EpochConverter from "./pages/EpochConverter";
import WordCounter from "./pages/WordCounter";
import CaseConverter from "./pages/CaseConverter";
import TimezoneConverter from "./pages/TimezoneConverter";
import ColorContrastChecker from "./pages/ColorContrastChecker";
import PercentageCalculator from "./pages/PercentageCalculator";
import LoremIpsum from "./pages/LoremIpsum";
import IDGenerator from "./pages/IDGenerator";
import TimeNow from "./pages/TimeNow";
import JSONToTypeScript from "./pages/JSONToTypeScript";
import JSONToZod from "./pages/JSONToZod";
import SQLFormatter from "./pages/SQLFormatter";
import CronGenerator from "./pages/CronGenerator";
import JSONPathExtractor from "./pages/JSONPathExtractor";
import DeveloperGateway from "./pages/DeveloperGateway";
import DeveloperLogin from "./pages/DeveloperLogin";
import DeveloperSignup from "./pages/DeveloperSignup";
import DeveloperDashboard from "./pages/DeveloperDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import { ToolSeoPage } from "./pages/ToolSeoPage";
import { VsWeTransfer } from "./pages/vs/VsWeTransfer";
import { VsILovePDF } from "./pages/vs/VsILovePDF";
import { VsPrivnote } from "./pages/vs/VsPrivnote";

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

            {/* Dedicated Programmatic SEO Routes for 40+ Utilities */}
            <Route path="tools/:toolSlug" element={<ToolSeoPage />} />
            <Route path="p2p-file-transfer" element={<FileShare />} />
            <Route path="secret-note" element={<TextShare />} />

            {/* High-Converting /VS/ Competitor Comparison Pages */}
            <Route path="vs/wetransfer" element={<VsWeTransfer />} />
            <Route path="vs/ilovepdf" element={<VsILovePDF />} />
            <Route path="vs/privnote" element={<VsPrivnote />} />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </ThemeProvider>
  );
}
