import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <span className="text-purple-800 font-bold text-xl cursor-pointer">PDF Tools</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/">
                <a className={`${isActive('/') ? 'border-purple-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                  Home
                </a>
              </Link>
              <div className="relative group">
                <a className={`${location.startsWith('/pdf-tools') ? 'border-purple-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer`}>
                  PDF Tools
                </a>
                <div className="absolute z-10 left-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 hidden group-hover:block">
                  <Link href="/pdf-tools/extract-pages">
                    <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Extract Pages</a>
                  </Link>
                  <Link href="/pdf-tools/pdf-to-word">
                    <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">PDF to Word</a>
                  </Link>
                  <Link href="/pdf-tools/pdf-to-image">
                    <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">PDF to Image</a>
                  </Link>
                  <Link href="/pdf-tools/compress-pdf">
                    <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Compress PDF</a>
                  </Link>
                  <Link href="/pdf-tools/merge-pdf">
                    <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Merge PDF</a>
                  </Link>
                </div>
              </div>
              <Link href="/unit-converter">
                <a className={`${isActive('/unit-converter') ? 'border-purple-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                  Unit Converter
                </a>
              </Link>
              <Link href="/ocr-text-extractor">
                <a className={`${isActive('/ocr-text-extractor') ? 'border-purple-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                  OCR Text Extractor
                </a>
              </Link>
              <Link href="/about">
                <a className={`${isActive('/about') ? 'border-purple-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                  About
                </a>
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Button className="bg-purple-600 hover:bg-purple-700">
              Sign In
            </Button>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleMenu}
              aria-label="Open main menu"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link href="/">
              <a className={`${isActive('/') ? 'bg-purple-50 border-purple-500 text-purple-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>
                Home
              </a>
            </Link>
            <Link href="/pdf-tools/extract-pages">
              <a className={`${isActive('/pdf-tools/extract-pages') ? 'bg-purple-50 border-purple-500 text-purple-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>
                Extract PDF Pages
              </a>
            </Link>
            <Link href="/pdf-tools/pdf-to-word">
              <a className={`${isActive('/pdf-tools/pdf-to-word') ? 'bg-purple-50 border-purple-500 text-purple-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>
                PDF to Word
              </a>
            </Link>
            <Link href="/pdf-tools/pdf-to-image">
              <a className={`${isActive('/pdf-tools/pdf-to-image') ? 'bg-purple-50 border-purple-500 text-purple-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>
                PDF to Image
              </a>
            </Link>
            <Link href="/pdf-tools/compress-pdf">
              <a className={`${isActive('/pdf-tools/compress-pdf') ? 'bg-purple-50 border-purple-500 text-purple-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>
                Compress PDF
              </a>
            </Link>
            <Link href="/pdf-tools/merge-pdf">
              <a className={`${isActive('/pdf-tools/merge-pdf') ? 'bg-purple-50 border-purple-500 text-purple-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>
                Merge PDF
              </a>
            </Link>
            <Link href="/unit-converter">
              <a className={`${isActive('/unit-converter') ? 'bg-purple-50 border-purple-500 text-purple-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>
                Unit Converter
              </a>
            </Link>
            <Link href="/ocr-text-extractor">
              <a className={`${isActive('/ocr-text-extractor') ? 'bg-purple-50 border-purple-500 text-purple-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>
                OCR Text Extractor
              </a>
            </Link>
            <Link href="/about">
              <a className={`${isActive('/about') ? 'bg-purple-50 border-purple-500 text-purple-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>
                About
              </a>
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                Sign In
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
