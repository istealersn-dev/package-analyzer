"use client";

import { useState, useEffect } from "react";
import { Zap, AlertTriangle, CheckCircle2, PackageSearch } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface OptimizationSuggestionsProps {
  packageData: any | null;
  bundleStats: any;
  issues?: Array<{
    severity: string;
    message: string;
    category: string;
  }>;
}

interface Suggestion {
  title: string;
  description: string;
  impact: string;
  solution: string;
  severity: "high" | "medium" | "low";
  icon: JSX.Element;
}

export function OptimizationSuggestions({ packageData, bundleStats, issues: providedIssues }: OptimizationSuggestionsProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  useEffect(() => {
    const generateSuggestions = () => {
      // If issues are provided directly, transform them into suggestions
      if (providedIssues) {
        const transformedSuggestions = providedIssues.map(issue => ({
          title: issue.message,
          description: `Issue detected in category: ${issue.category}`,
          impact: "This issue may affect your application's performance and optimization.",
          solution: "Review the issue details and implement the suggested fixes.",
          severity: issue.severity as "high" | "medium" | "low",
          icon: <AlertTriangle className="h-5 w-5" />
        }));
        setSuggestions(transformedSuggestions);
        setIsLoading(false);
        return;
      }

      // Otherwise, generate suggestions from package analysis
      const newSuggestions: Suggestion[] = [];
      if (!packageData) {
        setIsLoading(false);
        return;
      }

      const deps = { ...packageData.dependencies, ...packageData.devDependencies };
      const depsEntries = Object.entries(bundleStats);

      // Check for non-tree-shakeable packages
      const nonTreeShakeable = depsEntries
        .filter(([_, info]: [string, any]) => info.bundleStats?.hasSideEffects)
        .map(([name]) => name);

      if (nonTreeShakeable.length > 0) {
        newSuggestions.push({
          title: "Tree-shaking Optimization Required",
          description: `${nonTreeShakeable.join(", ")} ${nonTreeShakeable.length > 1 ? 'have' : 'has'} side effects that prevent effective tree-shaking. Side effects are code that executes when importing a module, regardless of what is imported.`,
          impact: "Side effects prevent dead code elimination, leading to larger bundle sizes and slower page loads. This directly affects your application's performance and user experience.",
          solution: "Consider using the modern ESM versions of these packages or look for alternative packages that support tree-shaking. If possible, import specific functions instead of entire modules.",
          severity: "high",
          icon: <AlertTriangle className="h-5 w-5" />
        });
      }

      // Check for ES Modules support
      const nonESMPackages = depsEntries
        .filter(([_, info]: [string, any]) => 
          info.bundleStats && !info.bundleStats.hasJSModule && !info.bundleStats.hasJSNext
        )
        .map(([name]) => name);

      if (nonESMPackages.length > 0) {
        newSuggestions.push({
          title: "Legacy Module Format Detected",
          description: `${nonESMPackages.join(", ")} ${nonESMPackages.length > 1 ? 'don\'t' : 'doesn\'t'} support ES Modules. ES Modules are the modern standard for JavaScript, enabling better optimization and tree-shaking.`,
          impact: "CommonJS modules can't be tree-shaken effectively, potentially including unused code in your bundle. This affects load times and modern bundler optimizations.",
          solution: "Update these packages to their latest versions that support ES Modules, or find alternative packages with ESM support. Many popular packages now offer dual CommonJS/ESM distributions.",
          severity: "medium",
          icon: <PackageSearch className="h-5 w-5" />
        });
      }

      // Development dependencies in production check
      const devDepsInProd = Object.entries(packageData.dependencies || {})
        .filter(([name]) => 
          name.includes('dev') || 
          name.includes('test') || 
          name.includes('prettier') ||
          name.includes('eslint')
        )
        .map(([name]) => name);

      if (devDepsInProd.length > 0) {
        newSuggestions.push({
          title: "Development Dependencies in Production",
          description: `Found development tools (${devDepsInProd.join(", ")}) in production dependencies. These packages are typically only needed during development.`,
          impact: "Including development dependencies in production increases your bundle size unnecessarily, leading to longer download times and higher bandwidth usage.",
          solution: "Move these packages to devDependencies in your package.json. Use 'npm install --save-dev' or manually move them to the devDependencies section.",
          severity: "high",
          icon: <AlertTriangle className="h-5 w-5" />
        });
      }

      setSuggestions(newSuggestions);
      setIsLoading(false);
    };

    generateSuggestions();
  }, [packageData, bundleStats, providedIssues]);

  if (isLoading) {
    return (
      <Card className="relative overflow-hidden">
        <CardHeader className="space-y-1">
          <div className="flex items-center space-x-3">
            <Zap className="h-5 w-5 text-yellow-500" />
            <CardTitle className="text-h4">Performance Analysis</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="space-y-1">
        <div className="flex items-center space-x-3">
          <Zap className="h-5 w-5 text-yellow-500" />
          <CardTitle className="text-h4">Performance Analysis</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {suggestions.length > 0 ? (
          <div className="space-y-8">
            {suggestions.map((suggestion, index) => (
              <Alert key={index} className={`
                border-l-4
                ${suggestion.severity === 'high' ? 'border-l-red-500' : 
                  suggestion.severity === 'medium' ? 'border-l-yellow-500' : 
                  'border-l-blue-500'}
              `}>
                <div className="flex items-center space-x-2 mb-3">
                  <span className={`
                    ${suggestion.severity === 'high' ? 'text-red-500' : 
                      suggestion.severity === 'medium' ? 'text-yellow-500' : 
                      'text-blue-500'}
                  `}>
                    {suggestion.icon}
                  </span>
                  <h3 className="font-semibold">{suggestion.title}</h3>
                  <Badge variant={
                    suggestion.severity === 'high' ? 'destructive' : 
                    suggestion.severity === 'medium' ? 'secondary' : 
                    'outline'
                  }>
                    {suggestion.severity}
                  </Badge>
                </div>
                <AlertDescription>
                  <div className="space-y-3 text-sm">
                    <p>{suggestion.description}</p>
                    <div className="space-y-1">
                      <p className="font-medium">Impact:</p>
                      <p className="text-muted-foreground">{suggestion.impact}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium">Recommended Solution:</p>
                      <p className="text-muted-foreground">{suggestion.solution}</p>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        ) : (
          <Alert>
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <AlertDescription className="ml-2">
              Great job! Your package appears to be well-optimized with no significant performance issues detected.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}