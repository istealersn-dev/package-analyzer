import FileUploader from '@/components/FileUploader';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Toaster } from '@/components/ui/sonner';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 bg-gradient-to-b from-blue-50 via-sky-100 to-indigo-200 dark:from-neutral-950 dark:to-neutral-900">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <FileUploader />
          
          {/* SEO Content Section */}
          <section className="mt-16 prose dark:prose-invert max-w-none">
            <h1 className="text-3xl font-bold text-center mb-8">
              AI-Powered Package.json Analyzer: Smart Dependency Optimization
            </h1>
            
            <div className="text-lg space-y-6">
              <p>
                Welcome to Package Analyzer, your intelligent solution for analyzing and optimizing Node.js project dependencies. 
                Powered by Google Gemini AI, our tool provides smart insights and personalized recommendations to help developers 
                make informed decisions about their package dependencies.
              </p>
              
              <p>
                Our analyzer leverages artificial intelligence to provide instant insights into your package.json file, 
                highlighting critical dependencies, identifying potential conflicts, and suggesting optimization opportunities. 
                Whether you&apos;re managing a small project or a large-scale application, our AI-driven analysis helps you maintain 
                a secure and efficient codebase. Simply drag and drop your package.json file to receive intelligent recommendations 
                for both dependencies and devDependencies.
              </p>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
      <Toaster />
    </div>
  );
}