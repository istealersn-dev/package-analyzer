import FileUploader from '@/components/FileUploader';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Toaster } from '@/components/ui/sonner';
import { Button } from "@/components/ui/button"
import { GitHubIcon } from "@/components/icons/github"
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 bg-gradient-to-b from-blue-50 via-sky-100 to-indigo-200 dark:from-neutral-950 dark:to-neutral-900">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          
          {/* SEO Content Section */}
          <section className="prose dark:prose-invert max-w-none">
            <h1 className="text-3xl font-bold text-center mb-8">
              AI-powered CodeSizeChecker
            </h1>
            
            <div className="text-lg space-y-6">
              <p>
              Welcome to CodeSizeChecker.com, your go-to platform for intelligent package analysis and dependency optimization. Harnessing the power of Google Gemini AI, our tool delivers actionable insights to improve your package.json analyze workflow and reduce bundle size for enhanced performance.
              </p>
              
              <p>
              Whether you&apos;re managing a small app or an sass application, CodeSizeChecker identifies critical dependencies, flags potential conflicts, and offers smart, AI-powered recommendations. Easily drag and drop your package.json file to optimize both dependencies and devDependencies, ensuring a secure and efficient codebase tailored to your needs.
              </p>
            </div>
          <div className="flex justify-start items-center gap-4 mt-8">
            <Button asChild>
              <Link href='/docs'>Documentation</Link>
            </Button>
            
            <Button variant="outline" asChild>
              <Link 
                href="https://github.com/istealersn-dev/package-analyzer" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <GitHubIcon className="h-5 w-5" />
                <span>Star</span>
              </Link>
            </Button>
          </div>
          </section>
          <section className='mt-16'><FileUploader /></section>
        </div>
      </main>
      <SiteFooter />
      <Toaster />
    </div>
  );
}