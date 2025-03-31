import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  ExtractPagesIcon,
  WordIcon,
  ImageIcon,
  CompressIcon,
  MergeIcon,
  ConvertIcon,
} from "@/lib/icons";

export default function Home() {
  const pdfTools = [
    {
      id: "extract-pages",
      title: "Extract PDF Pages",
      description: "Extract specific pages or page ranges from your PDF documents.",
      icon: <ExtractPagesIcon className="text-blue-600 text-xl" />,
      path: "/pdf-tools/extract-pages",
    },
    {
      id: "pdf-to-word",
      title: "PDF to Word",
      description: "Convert your PDF documents to editable Word files easily.",
      icon: <WordIcon className="text-blue-600 text-xl" />,
      path: "/pdf-tools/pdf-to-word",
    },
    {
      id: "pdf-to-image",
      title: "PDF to Image",
      description: "Convert PDF pages to JPG, PNG, or other image formats.",
      icon: <ImageIcon className="text-blue-600 text-xl" />,
      path: "/pdf-tools/pdf-to-image",
    },
    {
      id: "compress-pdf",
      title: "Compress PDF",
      description: "Reduce the file size of your PDF documents while maintaining quality.",
      icon: <CompressIcon className="text-blue-600 text-xl" />,
      path: "/pdf-tools/compress-pdf",
    },
    {
      id: "merge-pdf",
      title: "Merge PDF",
      description: "Combine multiple PDF files into a single document.",
      icon: <MergeIcon className="text-blue-600 text-xl" />,
      path: "/pdf-tools/merge-pdf",
    },
    {
      id: "unit-converter",
      title: "Unit Converter",
      description: "Convert between various units of measurement including length, weight, and more.",
      icon: <ConvertIcon className="text-blue-600 text-xl" />,
      path: "/unit-converter",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-blue-700 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">
            <span className="block">All-in-One PDF Tools</span>
            <span className="block text-blue-300">Fast, Secure & Free Online</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base sm:text-lg md:mt-5 md:max-w-3xl">
            Powerful PDF and unit conversion tools to help you work more efficiently. No registration required.
          </p>
          <div className="mt-10 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link href="#tools">
                <Button variant="secondary" size="lg" className="w-full bg-white text-blue-700 hover:bg-gray-50">
                  Get Started
                </Button>
              </Link>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <Link href="/about">
                <Button size="lg" className="w-full bg-blue-500 hover:bg-blue-600">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Tools Section */}
      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <section id="tools" className="py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular PDF Tools</h2>
          
          {/* PDF Tools Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pdfTools.map((tool) => (
              <Card key={tool.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                      {tool.icon}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{tool.title}</h3>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">{tool.description}</p>
                  </div>
                  <div className="mt-6">
                    <Link href={tool.path}>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Use Tool
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-12 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How It Works</h2>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full text-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Upload File</h3>
              <p className="text-sm text-gray-500">Drag and drop or browse to upload your PDF file to our secure server.</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full text-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select Options</h3>
              <p className="text-sm text-gray-500">Choose the specific pages, conversion format, or other settings you need.</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full text-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Download Result</h3>
              <p className="text-sm text-gray-500">Process and download your converted or extracted files instantly.</p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 bg-gray-50 rounded-lg">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Why Choose Our Tools</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Secure Processing</h3>
                  <p className="mt-2 text-sm text-gray-500">All processing happens in your browser. Files are never stored on our servers.</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Fast & Efficient</h3>
                  <p className="mt-2 text-sm text-gray-500">Our tools are optimized for speed and performance, even with large files.</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">100% Free</h3>
                  <p className="mt-2 text-sm text-gray-500">No hidden fees, subscriptions, or limitations on basic features.</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Mobile Friendly</h3>
                  <p className="mt-2 text-sm text-gray-500">Works on all devices, so you can convert files on the go.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
