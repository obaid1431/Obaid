import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function About() {
  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">About PDF Tools</h2>
      
      {/* Overview Section */}
      <div className="mb-12">
        <p className="text-lg text-gray-600 mb-6">
          Welcome to PDF Tools, a comprehensive online platform for all your PDF and unit conversion needs. Our mission is to provide fast, secure, and free tools that help you work more efficiently with digital documents.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">What We Offer</h3>
            <p className="text-gray-600 mb-4">
              Our platform provides a suite of powerful tools designed to help you manage and manipulate PDF documents without the need for expensive software or technical expertise.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>Extract specific pages from PDF documents</li>
              <li>Convert PDFs to editable Word documents</li>
              <li>Transform PDF pages into high-quality images</li>
              <li>Compress PDFs to reduce file size</li>
              <li>Merge multiple PDFs into a single document</li>
              <li>Convert between various units of measurement</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">Our Commitment</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <svg className="h-6 w-6 text-blue-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <div>
                  <h4 className="font-medium text-blue-700">Security & Privacy</h4>
                  <p className="text-gray-600 text-sm">All document processing happens in your browser. Your files are never stored on our servers or shared with third parties.</p>
                </div>
              </div>
              <div className="flex items-start">
                <svg className="h-6 w-6 text-blue-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="font-medium text-blue-700">Free to Use</h4>
                  <p className="text-gray-600 text-sm">Our core tools are completely free to use, with no hidden fees or subscriptions required. We believe in providing accessible tools for everyone.</p>
                </div>
              </div>
              <div className="flex items-start">
                <svg className="h-6 w-6 text-blue-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <div>
                  <h4 className="font-medium text-blue-700">High Performance</h4>
                  <p className="text-gray-600 text-sm">Our tools are optimized for speed and efficiency, allowing you to work with even large documents quickly and reliably.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* How It Works Section */}
      <div className="mb-12">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">How Our Tools Work</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full text-blue-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h4 className="text-lg font-medium text-gray-900">1. Upload Your Files</h4>
              </div>
              <p className="text-gray-600 text-sm">
                Simply drag and drop your PDF files onto our upload area, or use the file browser to select them from your device. Your files are processed locally in your browser for maximum security.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full text-blue-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h4 className="text-lg font-medium text-gray-900">2. Choose Your Options</h4>
              </div>
              <p className="text-gray-600 text-sm">
                Select the specific operation you want to perform and configure the options to match your needs. Our intuitive interface makes it easy to customize each tool to your exact requirements.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full text-blue-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
                <h4 className="text-lg font-medium text-gray-900">3. Download Results</h4>
              </div>
              <p className="text-gray-600 text-sm">
                Once the processing is complete, download your converted or modified files directly to your device. There's no need to create an account or provide any personal information.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Technologies Section */}
      <div className="mb-12">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Technologies We Use</h3>
        
        <div className="bg-gray-50 p-6 rounded-lg">
          <p className="text-gray-600 mb-6">
            Our platform leverages cutting-edge web technologies to provide a secure, fast, and reliable experience:
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-white p-2 rounded-md shadow-sm mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Client-Side Processing</h4>
                <p className="text-sm text-gray-600">
                  All document processing happens in your browser, ensuring your files never leave your device.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-white p-2 rounded-md shadow-sm mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Modern Web Standards</h4>
                <p className="text-sm text-gray-600">
                  We use the latest web technologies to provide a seamless experience across devices.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-white p-2 rounded-md shadow-sm mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Optimized Performance</h4>
                <p className="text-sm text-gray-600">
                  Our tools are built for speed, allowing you to process even large documents quickly.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-white p-2 rounded-md shadow-sm mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Responsive Design</h4>
                <p className="text-sm text-gray-600">
                  Our platform works seamlessly on desktops, tablets, and mobile devices.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-white p-2 rounded-md shadow-sm mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">No Installation Needed</h4>
                <p className="text-sm text-gray-600">
                  Everything runs in your web browser, no need to download or install any software.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-white p-2 rounded-md shadow-sm mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Regular Updates</h4>
                <p className="text-sm text-gray-600">
                  We continuously improve our tools with new features and optimizations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="bg-blue-700 text-white rounded-lg p-8 text-center">
        <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
          Try our PDF tools today and experience the convenience of fast, secure document processing right in your browser.
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/">
            <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
              Explore PDF Tools
            </Button>
          </Link>
          <Link href="/unit-converter">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-600">
              Try Unit Converter
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
