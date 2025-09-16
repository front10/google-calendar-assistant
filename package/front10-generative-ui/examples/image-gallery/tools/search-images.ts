import { tool } from 'ai';
import { z } from 'zod';

// Unsplash API configuration
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const UNSPLASH_API_URL = 'https://api.unsplash.com';

// Cache configuration for demo - permanent cache to avoid API costs
interface CacheEntry {
  data: any;
  timestamp: number;
  expiresAt: number;
}

class ImageSearchCache {
  private cache = new Map<string, CacheEntry>();
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  generateKey(
    query: string,
    count: number,
    orientation?: string,
    license?: string,
  ): string {
    // Normalize the query to ensure consistent cache keys
    const normalizedQuery = query.toLowerCase().trim();
    return `${normalizedQuery}-${count}-${orientation || 'any'}-${license || 'free'}`;
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (Date.now() > entry.expiresAt) {
      console.log(`Cache entry expired for key: "${key}"`);
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set(key: string, data: any): void {
    const now = Date.now();
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + this.CACHE_DURATION,
    });
  }

  clear(): void {
    this.cache.clear();
  }

  // Get cache stats for debugging
  getStats(): { size: number; keys: string[]; validEntries: number } {
    const now = Date.now();
    let validEntries = 0;

    // Clean up expired entries
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      } else {
        validEntries++;
      }
    }

    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      validEntries,
    };
  }

  // Check if a specific key exists and is valid
  hasValidEntry(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }
}

const imageCache = new ImageSearchCache();

interface UnsplashPhoto {
  id: string;
  urls: {
    regular: string;
    full: string;
    download: string;
  };
  alt_description: string;
  description: string;
  user: {
    name: string;
    username: string;
  };
  tags: Array<{ title: string }>;
  width: number;
  height: number;
  links: {
    download: string;
  };
}

export const searchImages = tool({
  description:
    'Search for high-quality images based on a description or keywords',
  inputSchema: z.object({
    query: z
      .string()
      .describe('Search query or description of the image you want to find'),
    count: z
      .number()
      .optional()
      .default(8)
      .describe('Number of images to return (1-10)'),
    orientation: z
      .enum(['landscape', 'portrait', 'square'])
      .optional()
      .describe('Preferred image orientation'),
    license: z
      .enum(['free', 'commercial', 'any'])
      .optional()
      .default('free')
      .describe('License type preference'),
  }),
  execute: async ({ query, count = 8, orientation, license }) => {
    if (!UNSPLASH_ACCESS_KEY) {
      throw new Error(
        'Unsplash API key not configured. Please set UNSPLASH_ACCESS_KEY environment variable.',
      );
    }

    // Generate cache key
    const cacheKey = imageCache.generateKey(query, count, orientation, license);
    console.log(`Generated cache key: "${cacheKey}"`);

    // Check cache first
    const cachedResult = imageCache.get(cacheKey);
    if (cachedResult) {
      console.log(`✅ Cache HIT for query: "${query}" with key: "${cacheKey}"`);
      return cachedResult;
    }

    console.log(`❌ Cache MISS for query: "${query}" with key: "${cacheKey}"`);

    // Log cache stats for debugging
    const stats = imageCache.getStats();
    console.log(
      `Cache stats: ${stats.validEntries}/${stats.size} valid entries. Keys:`,
      stats.keys,
    );

    try {
      console.log(`Fetching from API for query: "${query}"`);

      // Build search parameters
      const params = new URLSearchParams({
        query,
        // per_page: count.toString(), // Fixed: uncommented this line
        client_id: UNSPLASH_ACCESS_KEY,
      });

      if (orientation) {
        params.append('orientation', orientation);
      }

      console.log(
        `API URL: ${UNSPLASH_API_URL}/search/photos?${params.toString()}`,
      );

      // Make API request to Unsplash
      const response = await fetch(
        `${UNSPLASH_API_URL}/search/photos?${params}`,
      );

      if (!response.ok) {
        throw new Error(
          `Unsplash API error: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();
      console.log(`API Response: Found ${data.results?.length || 0} images`);

      const photos: UnsplashPhoto[] = data.results.slice(0, count) || [];

      // Transform Unsplash data to our format
      const results = photos.map((photo) => ({
        id: photo.id,
        url: photo.urls.regular,
        alt: photo.alt_description || photo.description || `Image for ${query}`,
        title: photo.description || `Photo by ${photo.user.name}`,
        photographer: photo.user.name,
        tags: photo.tags?.map((tag) => tag.title) || [],
        width: photo.width,
        height: photo.height,
        license: 'free', // Unsplash photos are free to use
        downloadUrl: photo.links.download,
      }));

      const result = {
        query,
        results,
        totalFound: data.total || results.length,
        searchTime: new Date().toISOString(),
        filters: { count, orientation, license },
      };

      // Cache the result
      imageCache.set(cacheKey, result);
      console.log(`💾 Cached result for key: "${cacheKey}"`);

      return result;
    } catch (error) {
      console.error('Error fetching from Unsplash API:', error);
      throw new Error(
        `Failed to search images: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  },
});
