/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { TextShare } from "./pages/TextShare";
import { CodeHelper } from "./pages/CodeHelper";
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
import DeveloperGateway from "./pages/DeveloperGateway";
import DeveloperLogin from "./pages/DeveloperLogin";
import DeveloperSignup from "./pages/DeveloperSignup";
import DeveloperDashboard from "./pages/DeveloperDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-140px)] text-center px-4">
      <h1 className="text-8xl font-black tracking-tighter text-white/10">404</h1>
      <p className="text-xl font-bold text-white/50 mt-4 uppercase tracking-wider">Page not found</p>
      <a href="/" className="mt-8 px-6 py-3 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-white/80 transition-colors">
        Go Home
      </a>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="text-share" element={<TextShare />} />
            <Route path="code-helper" element={<CodeHelper />} />
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
            <Route path="svg-to-css" element={<SVGToCSS />} />
            <Route path="css-animation" element={<CSSAnimationGenerator />} />
            <Route path="color-blindness" element={<ColorBlindnessSimulator />} />
            <Route path="dice-roller" element={<DiceRoller />} />
            <Route path="coin-flip" element={<CoinFlip />} />
            <Route path="csv-viewer" element={<CSVViewer />} />
            <Route path="html-beautifier" element={<HTMLBeautifier />} />
            <Route path="z-index" element={<ZIndexVisualizer />} />

            {/* Developer Gateway */}
            <Route path="dev" element={<DeveloperGateway />} />
            <Route path="dev/login" element={<DeveloperLogin />} />
            <Route path="dev/signup" element={<DeveloperSignup />} />
            <Route path="dev/dashboard" element={<DeveloperDashboard />} />
            <Route path="dev/admin" element={<AdminDashboard />} />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
