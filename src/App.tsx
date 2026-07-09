/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { TextShare } from "./pages/TextShare";
import { FileShare } from "./pages/FileShare";
import { FileReceive } from "./pages/FileReceive";
import { TextReceive } from "./pages/TextReceive";
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="text-share" element={<TextShare />} />
          {/* File Share Routes */}
          <Route path="file-share" element={<FileShare />} />
          <Route path="f" element={<FileReceive />} />
          <Route path="f/:id" element={<FileReceive />} />

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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
