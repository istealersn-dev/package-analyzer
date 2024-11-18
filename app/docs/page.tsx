"use client";

import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { PackageSearch, Upload, BarChart3, Zap, GitBranch, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

export default function DocsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="space-y-8">
            <Link 
              href="/" 
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Back to application
            </Link>

            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight">Documentation</h1>
              <p className="text-xl text-muted-foreground">
                Learn how to use Package Analyzer to optimize your Node.js projects
              </p>
            </div>

            <Tabs defaultValue="getting-started" className="space-y-8">
              <TabsList className="w-full">
                <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="analysis">Analysis Details</TabsTrigger>
                <TabsTrigger value="contributing">Contributing</TabsTrigger>
              </TabsList>

              <TabsContent value="getting-started" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="h-5 w-5" />
                      Getting Started
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <h3 className="text-lg font-semibold">Quick Start</h3>
                    <ol className="list-decimal list-inside space-y-2">
                      <li>Visit the Package Analyzer homepage</li>
                      <li>Drag and drop your package.json file or click to browse</li>
                      <li>Wait for the analysis to complete</li>
                      <li>Review the detailed analysis and recommendations</li>
                    </ol>

                    <h3 className="text-lg font-semibold mt-6">Requirements</h3>
                    <ul className="list-disc list-inside space-y-2">
                      <li>A valid package.json file from a Node.js project</li>
                      <li>The file must contain valid JSON syntax</li>
                      <li>Dependencies should be properly defined in the file</li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="features" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PackageSearch className="h-5 w-5" />
                      Key Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Package Analysis</h3>
                      <ul className="list-disc list-inside space-y-2">
                        <li>Detailed breakdown of dependencies</li>
                        <li>Bundle size analysis for each package</li>
                        <li>Identification of production vs development dependencies</li>
                        <li>Tree-shaking support detection</li>
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Performance Insights</h3>
                      <ul className="list-disc list-inside space-y-2">
                        <li>Bundle size optimization recommendations</li>
                        <li>Detection of non-tree-shakeable packages</li>
                        <li>ES Modules support analysis</li>
                        <li>Development dependencies in production warnings</li>
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Visualization</h3>
                      <ul className="list-disc list-inside space-y-2">
                        <li>Interactive dependency charts</li>
                        <li>Size comparison visualizations</li>
                        <li>Categorized dependency views</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analysis" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Analysis Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Health Score</h3>
                      <p>The health score is calculated based on several factors:</p>
                      <ul className="list-disc list-inside space-y-2">
                        <li>Bundle size optimization (30%)</li>
                        <li>Development dependencies in production (25%)</li>
                        <li>Tree-shaking support (25%)</li>
                        <li>Duplicate dependencies (20%)</li>
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Optimization Suggestions</h3>
                      <p>Suggestions are categorized by severity:</p>
                      <ul className="list-disc list-inside space-y-2">
                        <li>High: Critical issues that significantly impact performance</li>
                        <li>Medium: Issues that should be addressed but aren&apos;t critical</li>
                        <li>Low: Recommendations for minor improvements</li>
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Bundle Size Analysis</h3>
                      <p>Bundle sizes are analyzed in two ways:</p>
                      <ul className="list-disc list-inside space-y-2">
                        <li>Raw size: Uncompressed package size</li>
                        <li>Gzip size: Compressed size (actual transfer size)</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="contributing" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GitBranch className="h-5 w-5" />
                      Contributing
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">How to Contribute</h3>
                      <ol className="list-decimal list-inside space-y-2">
                        <li>Fork the repository on GitHub</li>
                        <li>Create a new branch for your feature</li>
                        <li>Make your changes and commit them</li>
                        <li>Submit a pull request</li>
                      </ol>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Development Setup</h3>
                      <ol className="list-decimal list-inside space-y-2">
                        <li>Clone the repository</li>
                        <li>Install dependencies with npm install</li>
                        <li>Run npm run dev to start the development server</li>
                        <li>Make your changes and test thoroughly</li>
                      </ol>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Guidelines</h3>
                      <ul className="list-disc list-inside space-y-2">
                        <li>Follow the existing code style</li>
                        <li>Write clear commit messages</li>
                        <li>Add tests for new features</li>
                        <li>Update documentation as needed</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}