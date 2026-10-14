import { useParams, Navigate } from "react-router-dom";
import { getToolSeoData } from "../data/toolsSeoRegistry";
import { ToolSeoSection } from "../components/ToolSeoSection";

// Import tool components
import { JSONFormatter } from "./JSONFormatter";
import JSONToTypeScript from "./JSONToTypeScript";
import JSONToZod from "./JSONToZod";
import SQLFormatter from "./SQLFormatter";
import CronGenerator from "./CronGenerator";
import JSONPathExtractor from "./JSONPathExtractor";
import RegexTester from "./RegexTester";
import { Base64 } from "./Base64";
import { MarkdownPreview } from "./MarkdownPreview";
import ColorPicker from "./ColorPicker";
import BoxShadowGenerator from "./BoxShadowGenerator";
import FlexboxPlayground from "./FlexboxPlayground";
import GridGenerator from "./GridGenerator";
import UnitConverter from "./UnitConverter";
import HashGenerator from "./HashGenerator";
import JWTDecoder from "./JWTDecoder";
import { PasswordGenerator } from "./PasswordGenerator";
import { UUIDGenerator } from "./UUIDGenerator";
import { QRGenerator } from "./QRGenerator";
import ImageCompressor from "./ImageCompressor";
import ImageResizer from "./ImageResizer";
import EXIFRemover from "./EXIFRemover";
import ImageConverter from "./ImageConverter";
import PDFMerger from "./PDFMerger";
import PDFSplitter from "./PDFSplitter";
import PDFToImages from "./PDFToImages";
import ImagesToPDF from "./ImagesToPDF";
import PDFTextExtractor from "./PDFTextExtractor";
import PDFPageRemover from "./PDFPageRemover";
import MetadataViewer from "./MetadataViewer";
import TextDiff from "./TextDiff";
import CSVJsonConverter from "./CSVJsonConverter";
import CSVViewer from "./CSVViewer";
import EpochConverter from "./EpochConverter";
import WordCounter from "./WordCounter";
import CaseConverter from "./CaseConverter";
import TimezoneConverter from "./TimezoneConverter";
import ColorContrastChecker from "./ColorContrastChecker";
import ColorBlindnessSimulator from "./ColorBlindnessSimulator";
import HTMLBeautifier from "./HTMLBeautifier";
import ZIndexVisualizer from "./ZIndexVisualizer";
import PercentageCalculator from "./PercentageCalculator";
import ScientificCalculator from "./ScientificCalculator";
import SVGToCSS from "./SVGToCSS";
import CSSAnimationGenerator from "./CSSAnimationGenerator";
import TimeNow from "./TimeNow";
import LoremIpsum from "./LoremIpsum";
import IDGenerator from "./IDGenerator";
import DiceRoller from "./DiceRoller";
import CoinFlip from "./CoinFlip";
import CountdownTimer from "./CountdownTimer";

const TOOL_COMPONENTS_MAP: Record<string, React.ComponentType<any>> = {
  "json-formatter": JSONFormatter,
  "json-to-typescript": JSONToTypeScript,
  "json-to-zod": JSONToZod,
  "sql-formatter": SQLFormatter,
  "cron-generator": CronGenerator,
  "json-path-extractor": JSONPathExtractor,
  "regex-tester": RegexTester,
  "base64": Base64,
  "markdown-preview": MarkdownPreview,
  "color-picker": ColorPicker,
  "box-shadow": BoxShadowGenerator,
  "flexbox": FlexboxPlayground,
  "grid": GridGenerator,
  "unit-converter": UnitConverter,
  "hash-generator": HashGenerator,
  "jwt-decoder": JWTDecoder,
  "password-generator": PasswordGenerator,
  "uuid": UUIDGenerator,
  "qr-generator": QRGenerator,
  "image-compressor": ImageCompressor,
  "image-resizer": ImageResizer,
  "exif-remover": EXIFRemover,
  "image-converter": ImageConverter,
  "pdf-merger": PDFMerger,
  "pdf-splitter": PDFSplitter,
  "pdf-to-images": PDFToImages,
  "images-to-pdf": ImagesToPDF,
  "pdf-text-extractor": PDFTextExtractor,
  "pdf-page-remover": PDFPageRemover,
  "metadata-viewer": MetadataViewer,
  "text-diff": TextDiff,
  "csv-json": CSVJsonConverter,
  "csv-viewer": CSVViewer,
  "epoch-converter": EpochConverter,
  "word-counter": WordCounter,
  "case-converter": CaseConverter,
  "timezone-converter": TimezoneConverter,
  "color-contrast": ColorContrastChecker,
  "color-blindness": ColorBlindnessSimulator,
  "html-beautifier": HTMLBeautifier,
  "z-index": ZIndexVisualizer,
  "percentage-calculator": PercentageCalculator,
  "scientific-calculator": ScientificCalculator,
  "calculator": ScientificCalculator,
  "svg-to-css": SVGToCSS,
  "css-animation": CSSAnimationGenerator,
  "time": TimeNow,
  "lorem-ipsum": LoremIpsum,
  "id-generator": IDGenerator,
  "dice-roller": DiceRoller,
  "coin-flip": CoinFlip,
  "countdown-timer": CountdownTimer,
};

export function ToolSeoPage() {
  const { toolSlug } = useParams<{ toolSlug: string }>();

  if (!toolSlug) {
    return <Navigate to="/" replace />;
  }

  const cleanSlug = toolSlug.toLowerCase().trim();
  const ToolComponent = TOOL_COMPONENTS_MAP[cleanSlug];

  if (!ToolComponent) {
    return <Navigate to="/" replace />;
  }

  const seoData = getToolSeoData(cleanSlug);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Interactive Tool Component */}
      <div className="w-full">
        <ToolComponent />
      </div>

      {/* Programmatic Technical SEO & Guide below the fold */}
      {seoData && <ToolSeoSection data={seoData} />}
    </div>
  );
}
