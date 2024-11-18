"use client";

import { ExternalLink } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatBytes } from "@/lib/utils";

interface DependencyRow {
  name: string;
  version: string;
  size: string;
  gzip: string;
  actions: string;
}

interface DependenciesOverviewProps {
  packagesInfo: Record<string, {
    name: string;
    version: string;
    bundleStats: {
      size: number;
      gzip: number;
    } | null;
  }>;
}

export function DependenciesOverview({ packagesInfo }: DependenciesOverviewProps) {
  const formatDependencyRow = (name: string, info: any): DependencyRow => ({
    name,
    version: info.version,
    size: info.bundleStats ? formatBytes(info.bundleStats.size) : 'N/A',
    gzip: info.bundleStats ? formatBytes(info.bundleStats.gzip) : 'N/A',
    actions: '',
  });

  const categorizedDependencies = Object.entries(packagesInfo).reduce(
    (acc, [name, info]) => {
      const row = formatDependencyRow(name, info);
      if (name.startsWith('@types/') || name.includes('eslint')) {
        acc.types.push(row);
      } else if (name.includes('typescript') || name.includes('webpack') || name.includes('babel')) {
        acc.build.push(row);
      } else if (name.includes('test') || name.includes('jest') || name.includes('cypress')) {
        acc.test.push(row);
      } else {
        acc.runtime.push(row);
      }
      return acc;
    },
    { 
      runtime: [] as DependencyRow[], 
      types: [] as DependencyRow[],
      build: [] as DependencyRow[],
      test: [] as DependencyRow[],
    }
  );

  const DependencyTable = ({ dependencies }: { dependencies: DependencyRow[] }) => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Package</TableHead>
            <TableHead>Version</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Gzip</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dependencies.map((dep) => (
            <TableRow key={dep.name}>
              <TableCell className="font-medium">{dep.name}</TableCell>
              <TableCell>
                <Badge variant="secondary">{dep.version}</Badge>
              </TableCell>
              <TableCell>{dep.size}</TableCell>
              <TableCell>{dep.gzip}</TableCell>
              <TableCell>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() =>
                        window.open(
                          `https://bundlephobia.com/package/${dep.name}`,
                          "_blank"
                        )
                      }
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>View on Bundlephobia</TooltipContent>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <Tabs defaultValue="runtime" className="space-y-4">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="runtime" className="text-body">
          Runtime
          <Badge variant="secondary" className="ml-2">
            {categorizedDependencies.runtime.length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="types" className="text-body">
          Types
          <Badge variant="secondary" className="ml-2">
            {categorizedDependencies.types.length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="build" className="text-body">
          Build Tools
          <Badge variant="secondary" className="ml-2">
            {categorizedDependencies.build.length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="test" className="text-body">
          Testing
          <Badge variant="secondary" className="ml-2">
            {categorizedDependencies.test.length}
          </Badge>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="runtime">
        <DependencyTable dependencies={categorizedDependencies.runtime} />
      </TabsContent>

      <TabsContent value="types">
        <DependencyTable dependencies={categorizedDependencies.types} />
      </TabsContent>

      <TabsContent value="build">
        <DependencyTable dependencies={categorizedDependencies.build} />
      </TabsContent>

      <TabsContent value="test">
        <DependencyTable dependencies={categorizedDependencies.test} />
      </TabsContent>
    </Tabs>
  );
}