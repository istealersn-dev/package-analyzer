"use client";

import { RateLimiter } from './rate-limiter';

export interface BundleStats {
  size: number;
  gzip: number;
  dependencyCount?: number;
  hasJSModule?: boolean;
  hasJSNext?: boolean;
  hasSideEffects?: boolean;
}

interface NpmPackageInfo {
  versions: Record<string, {
    dist: {
      unpackedSize?: number;
      fileCount?: number;
    };
  }>;
}

// Increased concurrency and cache duration
const rateLimiter = new RateLimiter(10); // Increased from 5 to 10
const CACHE_DURATION = 1000 * 60 * 60 * 24; // 24 hours

// Memory cache for both npm and bundlephobia data
const statsCache = new Map<string, { data: BundleStats; timestamp: number }>();
const npmRegistryCache = new Map<string, { data: NpmPackageInfo; timestamp: number }>();

async function fetchWithTimeout(url: string, timeout = 2000) { // Reduced timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' },
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

async function getNpmPackageSize(packageName: string, version: string): Promise<BundleStats | null> {
  const cacheKey = `npm:${packageName}`;
  const cached = npmRegistryCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    const packageVersion = cached.data.versions[version];
    if (packageVersion?.dist?.unpackedSize) {
      return {
        size: packageVersion.dist.unpackedSize,
        gzip: Math.round(packageVersion.dist.unpackedSize * 0.3),
      };
    }
  }

  try {
    const response = await fetchWithTimeout(
      `https://registry.npmjs.org/${packageName}`,
      2000
    );
    
    if (!response.ok) return null;
    
    const data: NpmPackageInfo = await response.json();
    npmRegistryCache.set(cacheKey, { data, timestamp: Date.now() });
    
    const packageVersion = data.versions[version];
    if (!packageVersion?.dist?.unpackedSize) return null;
    
    return {
      size: packageVersion.dist.unpackedSize,
      gzip: Math.round(packageVersion.dist.unpackedSize * 0.3),
    };
  } catch {
    return null;
  }
}

export async function getBundleStats(packageName: string, version: string): Promise<BundleStats | null> {
  const cacheKey = `${packageName}@${version}`;
  const cached = statsCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  return rateLimiter.add(async () => {
    try {
      // Try npm registry first (faster)
      const npmStats = await getNpmPackageSize(packageName, version);
      if (npmStats) {
        statsCache.set(cacheKey, { data: npmStats, timestamp: Date.now() });
        return npmStats;
      }

      // Fallback to Bundlephobia
      const response = await fetchWithTimeout(
        `https://bundlephobia.com/api/size?package=${encodeURIComponent(packageName)}@${encodeURIComponent(version)}`,
        2000
      );
      
      if (response.ok) {
        const data = await response.json();
        const stats: BundleStats = {
          size: data.size,
          gzip: data.gzip,
          dependencyCount: data.dependencyCount,
          hasJSModule: data.hasJSModule,
          hasJSNext: data.hasJSNext,
          hasSideEffects: data.hasSideEffects,
        };
        
        statsCache.set(cacheKey, { data: stats, timestamp: Date.now() });
        return stats;
      }
      
      return null;
    } catch (error) {
      console.warn(`Failed to fetch stats for ${packageName}:`, error);
      return null;
    }
  });
}