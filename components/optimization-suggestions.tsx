"use client";

import { useState, useEffect } from "react";
import { Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface OptimizationSuggestionsProps {
  packageData: {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  } | null;
  bundleStats: Record<string, any>;
  issues?: Array<{
    severity: string;
    message: string;
    category: string;
  }>;
}

export function OptimizationSuggestions({ packageData, bundleStats }: OptimizationSuggestionsProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<Array<{
    title: string;
    description: string;
    recommendations: string[];
    impact: string;
  }>>([]);

  useEffect(() => {
    const generateSuggestions = () => {
      const newSuggestions = [];
      const deps = packageData ? { ...packageData.dependencies, ...packageData.devDependencies } : {};
      const depsEntries = Object.entries(bundleStats);

      // Check for large packages (>100KB gzipped)
      const largePackages = depsEntries
        .filter(([_, info]: [string, any]) => info.bundleStats?.gzip > 100 * 1024)
        .map(([name, info]: [string, any]) => ({
          name,
          size: Math.round(info.bundleStats.gzip / 1024)
        }));

      if (largePackages.length > 0) {
        newSuggestions.push({
          title: "Large Bundle Sizes Detected",
          description: "Several packages in your project exceed recommended size limits, which could impact initial load times.",
          recommendations: largePackages.map(pkg => 
            `Consider alternatives for ${pkg.name} (${pkg.size}KB gzipped) or implement code splitting`
          ),
          impact: "Reducing bundle sizes can significantly improve initial page load times and user experience."
        });
      }

      // Check for non-tree-shakeable packages
      const nonTreeShakeable = depsEntries
        .filter(([_, info]: [string, any]) => info.bundleStats?.hasSideEffects)
        .map(([name]) => name);

      if (nonTreeShakeable.length > 0) {
        newSuggestions.push({
          title: "Tree-shaking Optimization Opportunities",
          description: "Some packages have side effects that prevent effective dead code elimination.",
          recommendations: [
            `Consider updating or replacing: ${nonTreeShakeable.join(", ")}`,
            "Look for alternative packages that support tree-shaking",
            "Import only needed functionality using named imports"
          ],
          impact: "Enabling tree-shaking could reduce your final bundle size by removing unused code."
        });
      }

      // Check for duplicate dependencies
      const depVersions = new Map<string, Set<string>>();
      Object.entries(deps).forEach(([name, version]) => {
        const baseName = name.split('/')[0];
        if (!depVersions.has(baseName)) {
          depVersions.set(baseName, new Set());
        }
        depVersions.get(baseName)?.add(String(version));
      });

      const duplicates = Array.from(depVersions.entries())
        .filter(([_, versions]) => versions.size > 1)
        .map(([name]) => name);

      if (duplicates.length > 0) {
        newSuggestions.push({
          title: "Duplicate Dependencies Found",
          description: "Multiple versions of the same package can bloat your bundle size.",
          recommendations: [
            `Consolidate versions for: ${duplicates.join(", ")}`,
            "Update dependent packages to use compatible versions",
            "Consider using resolutions in package.json"
          ],
          impact: "Removing duplicate dependencies can reduce bundle size and prevent potential conflicts."
        });
      }

      setSuggestions(newSuggestions);
      setIsLoading(false);
    };

    generateSuggestions();
  }, [packageData, bundleStats]);

  if (isLoading) {
    return (
      <Card className="relative overflow-hidden">
        <CardHeader className="space-y-1">
          <div className="flex items-center space-x-3">
            <span className="text-yellow-500">
              <Zap className="h-5 w-5" />
            </span>
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
          <span className="text-yellow-500">
            <Zap className="h-5 w-5" />
          </span>
          <CardTitle className="text-h4">Performance Analysis</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {suggestions.length > 0 ? (
          <div className="space-y-8">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="space-y-3">
                <h3 className="font-medium text-lg">{suggestion.title}</h3>
                <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                <ul className="list-disc list-inside space-y-2">
                  {suggestion.recommendations.map((rec, recIndex) => (
                    <li key={recIndex} className="text-sm">
                      {rec}
                    </li>
                  ))}
                </ul>
                <p className="text-sm font-medium mt-2 text-muted-foreground">
                  Impact: {suggestion.impact}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No significant performance issues found. Your package appears to be well-optimized!
          </p>
        )}
      </CardContent>
    </Card>
  );
}