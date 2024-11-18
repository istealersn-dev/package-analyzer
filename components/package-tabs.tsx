"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PackageStats } from "@/components/package-stats";
import { DependenciesOverview } from "@/components/dependencies-overview";
import { OptimizationSuggestions } from "@/components/optimization-suggestions";

interface PackageTabsProps {
  packagesInfo: any;
  issues: any[];
  stats: {
    deps: number;
    devDeps: number;
    total: number;
    totalSize: {
      raw: number;
      gzip: number;
    };
    issuesCount: number;
    criticalIssues: number;
    isLoading: boolean;
  };
  packageData: any;
}

export function PackageTabs({ packagesInfo, issues, stats, packageData }: PackageTabsProps) {
  return (
    <Tabs defaultValue="overview" className="space-y-8">
      <div className="sticky top-14 z-40 bg-background">
        <TabsList className="w-full bg-neutral-900 rounded-none p-0 h-auto border-b border-neutral-800">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="flex justify-between w-full">
              {[
                { value: "overview", label: "Overview" },
                { value: "dependencies", label: "Dependencies" },
                { value: "optimization", label: "Optimization" },
              ].map(({ value, label }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="relative px-4 py-2.5 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none text-neutral-400 data-[state=active]:text-white transition-colors hover:text-white after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-8 after:h-[1px] after:bg-transparent data-[state=active]:after:bg-neutral-400"
                >
                  {label}
                </TabsTrigger>
              ))}
            </div>
          </div>
        </TabsList>
      </div>

      <div className="relative z-0">
        <TabsContent value="overview" className="mt-6">
          <PackageStats {...stats} />
        </TabsContent>

        <TabsContent value="dependencies" className="mt-6">
          <DependenciesOverview packagesInfo={packagesInfo} />
        </TabsContent>

        <TabsContent value="optimization" className="mt-6">
          <OptimizationSuggestions 
            issues={issues.filter(issue => issue.category === 'performance')} 
            packageData={packageData}
            bundleStats={packagesInfo}
          />
        </TabsContent>
      </div>
    </Tabs>
  );
}