"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { DependenciesOverview } from "@/components/dependencies-overview";
import { OptimizationSuggestions } from "@/components/optimization-suggestions";

interface PackageDetailsProps {
  packagesInfo: Record<string, {
    name: string;
    version: string;
    bundleStats: {
      size: number;
      gzip: number;
    } | null;
  }>;
  issues: Array<{
    severity: string;
    message: string;
    category: string;
  }>;
}

export function PackageDetails({ packagesInfo, issues }: PackageDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-h3">Detailed Analysis</CardTitle>
        <CardDescription className="text-body">
          Review dependencies and optimization suggestions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="dependencies" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dependencies" className="text-h4">
              Dependencies Overview
            </TabsTrigger>
            <TabsTrigger value="issues" className="text-h4">
              Optimization Suggestions
              {issues.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {issues.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dependencies" className="space-y-8 pt-4">
            <DependenciesOverview packagesInfo={packagesInfo} />
          </TabsContent>

          <TabsContent value="issues">
            <OptimizationSuggestions 
              packageData={null}
              bundleStats={packagesInfo}
              issues={issues}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}