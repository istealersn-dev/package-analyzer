"use client";

import { Package, AlertTriangle, CheckCircle, HelpCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatBytes } from "@/lib/utils";

interface PackageStatsProps {
  deps: number;
  devDeps: number;
  total: number;
  issuesCount: number;
  criticalIssues: number;
  totalSize: {
    raw: number;
    gzip: number;
  };
  isLoading: boolean;
}

export function PackageStats({
  deps,
  devDeps,
  total,
  totalSize,
  issuesCount,
  criticalIssues,
  isLoading,
}: PackageStatsProps) {
  const getHealthScore = () => {
    if (issuesCount === 0) return { score: "A+", color: "text-green-500" };
    if (issuesCount < 3) return { score: "B", color: "text-blue-500" };
    if (issuesCount < 5) return { score: "C", color: "text-yellow-500" };
    return { score: "D", color: "text-red-500" };
  };

  const healthScore = getHealthScore();

  const StatCard = ({ title, icon, content, subcontent, tooltip, className = "", description }: any) => (
    <Card className={`relative ${!description && "transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20"} ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-h4">{title}</CardTitle>
        {icon && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="cursor-help">
                {icon}
              </button>
            </TooltipTrigger>
            <TooltipContent 
              side="right" 
              align="center" 
              className="max-w-[280px] p-4"
            >
              {typeof tooltip === 'string' ? (
                <p className="text-sm">{tooltip}</p>
              ) : (
                <div className="space-y-3">
                  <p className="font-medium">Overall health score based on:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Bundle size optimization</li>
                    <li>Development dependencies in production</li>
                    <li>Tree-shaking support</li>
                    <li>Duplicate dependencies</li>
                  </ul>
                  <p className="text-sm pt-2 border-t border-border">
                    Score range: A+ (Excellent) → D (Needs Improvement)
                  </p>
                </div>
              )}
            </TooltipContent>
          </Tooltip>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        {isLoading && title === "Bundle Size" ? (
          <>
            <div className="h-8 bg-muted animate-pulse rounded"></div>
            <div className="h-4 bg-muted animate-pulse rounded w-3/4"></div>
          </>
        ) : (
          <>
            <div className="text-2xl font-bold">{content}</div>
            <p className="text-small text-muted-foreground">
              {subcontent}
            </p>
            {description && (
              <p className="text-sm text-muted-foreground mt-4 pt-4 border-t">
                {description}
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          title="Dependencies"
          icon={<Package className="h-4 w-4 text-muted-foreground" />}
          content={total}
          subcontent={`${deps} prod, ${devDeps} dev`}
          tooltip="Total number of dependencies in your project, split between production and development dependencies."
        />
        <StatCard
          title="Issues"
          icon={<AlertTriangle className="h-4 w-4 text-muted-foreground" />}
          content={issuesCount}
          subcontent={`${criticalIssues} critical`}
          tooltip="Number of potential optimization opportunities identified, including bundle size issues, duplicate dependencies, and performance concerns."
        />
        <StatCard
          title="Health Score"
          icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
          content={<span className={healthScore.color}>{healthScore.score}</span>}
          subcontent={`Based on ${issuesCount} issues found`}
          tooltip={{}}
        />
      </div>
      <StatCard
        title="Bundle Size"
        className="w-full"
        content={isLoading ? "Calculating..." : formatBytes(totalSize.gzip)}
        subcontent={isLoading ? "" : `${formatBytes(totalSize.raw)} uncompressed`}
        description="Total bundle size of all dependencies. Gzipped size represents the actual transfer size over the network."
      />
    </div>
  );
}