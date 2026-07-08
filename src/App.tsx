/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { TextShare } from "./pages/TextShare";
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="text-share" element={<TextShare />} />
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
