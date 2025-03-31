import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import Home from "@/pages/home";
import ExtractPages from "@/pages/pdf-tools/extract-pages";
import PdfToWord from "@/pages/pdf-tools/pdf-to-word";
import PdfToImage from "@/pages/pdf-tools/pdf-to-image";
import CompressPdf from "@/pages/pdf-tools/compress-pdf";
import MergePdf from "@/pages/pdf-tools/merge-pdf";
import UnitConverter from "@/pages/unit-converter";
import OcrTextExtractor from "@/pages/ocr-text-extractor"; 
import About from "@/pages/about";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/pdf-tools/extract-pages" component={ExtractPages} />
          <Route path="/pdf-tools/pdf-to-word" component={PdfToWord} />
          <Route path="/pdf-tools/pdf-to-image" component={PdfToImage} />
          <Route path="/pdf-tools/compress-pdf" component={CompressPdf} />
          <Route path="/pdf-tools/merge-pdf" component={MergePdf} />
          <Route path="/unit-converter" component={UnitConverter} />
          <Route path="/ocr-text-extractor" component={OcrTextExtractor} />
          <Route path="/about" component={About} />
          <Route component={NotFound} />
        </Switch>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
