"use client";

import { useState, useEffect, useCallback } from "react";
import { PackageHeader } from "@/components/package-header";
import { PackageTabs } from "@/components/package-tabs";
import { getBundleStats, type BundleStats } from "@/lib/bundlephobia";
import { toast } from "sonner";

interface PackageAnalysisProps {
  packageData: {
    name: string;
    version: string;
    description?: string;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };
}

interface PackageInfo {
  name: string;
  version: string;
  bundleStats: BundleStats | null;
}

interface BundleIssue {
  severity: string;
  message: string;
  category: string;
}

export default function PackageAnalysis({ packageData }: PackageAnalysisProps) {
  const [packagesInfo, setPackagesInfo] = useState<Record<string, PackageInfo>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [totalSize, setTotalSize] = useState({ raw: 0, gzip: 0 });

  const fetchPackageStats = useCallback(async (name: string, version: string) => {
    try {
      const cleanVersion = version.replace(/[^0-9.]/g, '');
      const stats = await getBundleStats(name, cleanVersion);
      return { name, version, bundleStats: stats };
    } catch (error) {
      console.error(`Error fetching stats for ${name}:`, error);
      return { name, version, bundleStats: null };
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const deps = { ...packageData.dependencies, ...packageData.devDependencies };
    let totalRawSize = 0;
    let totalGzipSize = 0;
    const results: Record<string, PackageInfo> = {};

    const fetchAllPackageStats = async () => {
      setIsLoading(true);

      try {
        // Process in batches of 5 for better performance
        const entries = Object.entries(deps);
        const batchSize = 5;
        
        for (let i = 0; i < entries.length; i += batchSize) {
          const batch = entries.slice(i, i + batchSize);
          const batchResults = await Promise.all(
            batch.map(async ([name, version]: [string, string]) => {
              const info = await fetchPackageStats(name, version);
              if (info.bundleStats) {
                totalRawSize += info.bundleStats.size;
                totalGzipSize += info.bundleStats.gzip;
              }
              return [name, info] as [string, PackageInfo];
            })
          );

          if (!isMounted) return;

          batchResults.forEach(([name, info]) => {
            results[name] = info;
          });

          // Update state after each batch
          setPackagesInfo(prev => ({ ...prev, ...Object.fromEntries(batchResults) }));
          setTotalSize({ raw: totalRawSize, gzip: totalGzipSize });
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching bundle stats:", error);
        if (isMounted) {
          setIsLoading(false);
          toast.error("Error calculating bundle sizes");
        }
      }
    };

    fetchAllPackageStats();

    return () => {
      isMounted = false;
    };
  }, [packageData, fetchPackageStats]);

  const getDependenciesCount = () => {
    const deps = Object.keys(packageData.dependencies || {}).length;
    const devDeps = Object.keys(packageData.devDependencies || {}).length;
    return { deps, devDeps, total: deps + devDeps };
  };

  const analyzeBundleSize = (): BundleIssue[] => {
    const issues: BundleIssue[] = [];
    const LARGE_PACKAGE_SIZE = 100 * 1024;

    Object.entries(packagesInfo).forEach(([name, info]) => {
      if (!info.bundleStats) return;

      if (info.bundleStats.gzip > LARGE_PACKAGE_SIZE) {
        issues.push({
          severity: "high",
          message: `${name} is quite large (${(info.bundleStats.gzip / 1024).toFixed(1)}KB gzipped)`,
          category: "size"
        });
      }

      if (info.bundleStats.hasSideEffects) {
        issues.push({
          severity: "medium",
          message: `${name} has side effects which may affect tree-shaking`,
          category: "performance"
        });
      }

      // Check for packages without ES modules support
      if (!info.bundleStats.hasJSModule && !info.bundleStats.hasJSNext) {
        issues.push({
          severity: "medium",
          message: `${name} doesn't support ES modules, affecting tree-shaking`,
          category: "performance"
        });
      }
    });

    return issues;
  };

  const { deps, devDeps, total } = getDependenciesCount();
  const issues = !isLoading ? analyzeBundleSize() : [];

  return (
    <div className="space-y-8">
      <PackageHeader 
        name={packageData.name} 
        version={packageData.version}
        description={packageData.description}
      />
      <PackageTabs
        packagesInfo={packagesInfo}
        issues={issues}
        stats={{
          deps,
          devDeps,
          total,
          totalSize,
          issuesCount: issues.length,
          criticalIssues: issues.filter((i) => i.severity === "high").length,
          isLoading,
        }}
        packageData={packageData}
      />
    </div>
  );
}