# Generative UI Examples

This document provides practical examples of how to use the Generative UI abstraction with different tools and use cases.

## 📦 Product Card Example

A complete example showing how to create a product information tool with dynamic UI components.

### Tool Definition

```typescript
// lib/ai/tools/get-product-info.ts
import { tool } from 'ai';
import { z } from 'zod';

export const getProductInfo = tool({
  description:
    'Get detailed product information including price, reviews, and features',
  inputSchema: z.object({
    productId: z.string().describe('The unique identifier of the product')
  }),
  execute: async ({ productId }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const product = await fetchProductFromDatabase(productId);
    return {
      product,
      timestamp: new Date().toISOString(),
      source: 'product-database'
    };
  }
});
```

### UI Components

```typescript
// components/product-card.tsx
import React from 'react';
import { Clock, Star, ShoppingCart } from 'lucide-react';

// Loading state
export const ProductCardLoading: React.FC<{
  input?: { productId: string };
}> = ({ input }) => (
  <div className='animate-pulse bg-white rounded-lg shadow-md p-6 max-w-sm'>
    <div className='flex items-center space-x-4 mb-4'>
      <div className='bg-gray-200 rounded-lg size-16' />
      <div className='flex-1'>
        <div className='h-4 bg-gray-200 rounded w-3/4 mb-2' />
        <div className='h-3 bg-gray-200 rounded w-1/2' />
      </div>
    </div>
    <div className='space-y-3'>
      <div className='h-3 bg-gray-200 rounded' />
      <div className='h-3 bg-gray-200 rounded w-5/6' />
      <div className='h-3 bg-gray-200 rounded w-4/6' />
    </div>
    <div className='mt-4 flex items-center space-x-2'>
      <Clock className='size-4 text-gray-400' />
      <span className='text-sm text-gray-500'>Loading product info...</span>
    </div>
  </div>
);

// Success state
export const ProductCard: React.FC<{
  output: { product: Product; timestamp: string; source: string };
  input?: { productId: string };
}> = ({ output, input }) => (
  <div className='bg-white rounded-lg shadow-md p-6 max-w-sm'>
    <div className='flex items-center space-x-4 mb-4'>
      <div className='bg-blue-100 rounded-lg size-16 flex items-center justify-center'>
        <ShoppingCart className='size-8 text-blue-600' />
      </div>
      <div className='flex-1'>
        <h3 className='font-semibold text-lg'>{output.product.name}</h3>
        <p className='text-gray-600'>{output.product.brand}</p>
      </div>
    </div>

    <div className='space-y-3 mb-4'>
      <div className='flex justify-between items-center'>
        <span className='text-2xl font-bold text-green-600'>
          ${output.product.price}
        </span>
        <div className='flex items-center space-x-1'>
          <Star className='size-4 text-yellow-400 fill-current' />
          <span className='text-sm'>{output.product.rating}</span>
          <span className='text-sm text-gray-500'>
            ({output.product.reviews})
          </span>
        </div>
      </div>

      <div className='flex items-center space-x-2'>
        <span
          className={`px-2 py-1 rounded text-xs ${
            output.product.inStock
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {output.product.inStock ? 'In Stock' : 'Out of Stock'}
        </span>
        <span className='text-xs text-gray-500'>{output.product.category}</span>
      </div>

      <p className='text-sm text-gray-600'>{output.product.description}</p>

      <div className='flex flex-wrap gap-1'>
        {output.product.features.map((feature, index) => (
          <span key={index} className='px-2 py-1 bg-gray-100 rounded text-xs'>
            {feature}
          </span>
        ))}
      </div>
    </div>

    <div className='text-xs text-gray-500'>
      Source: {output.source} • {new Date(output.timestamp).toLocaleString()}
    </div>
  </div>
);

// Error state
export const ProductCardError: React.FC<{
  error: string;
  input?: { productId: string };
}> = ({ error, input }) => (
  <div className='bg-red-50 border border-red-200 rounded-lg p-6 max-w-sm'>
    <div className='flex items-center space-x-3'>
      <div className='bg-red-100 rounded-lg size-12 flex items-center justify-center'>
        <span className='text-red-600 text-xl'>⚠️</span>
      </div>
      <div>
        <h3 className='font-semibold text-red-800'>Error Loading Product</h3>
        <p className='text-red-600 text-sm'>{error}</p>
        {input && (
          <p className='text-red-500 text-xs mt-1'>
            Product ID: {input.productId}
          </p>
        )}
      </div>
    </div>
  </div>
);
```

### Registration

```typescript
// components/chat.tsx
import { useGenerativeUI } from '@/lib/generative-ui';
import {
  ProductCard,
  ProductCardLoading,
  ProductCardError
} from './product-card';

export function Chat() {
  const { registerComponent } = useGenerativeUI();

  // Register the component
  registerComponent({
    toolId: 'getProductInfo',
    LoadingComponent: ProductCardLoading,
    SuccessComponent: ProductCard,
    ErrorComponent: ProductCardError
  });

  // ... rest of chat component
}
```

## 🖼️ Image Gallery Example

A powerful image search tool with interactive gallery display.

### Tool Definition

```typescript
// lib/ai/tools/search-images.ts
import { tool } from 'ai';
import { z } from 'zod';

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
      .default(4)
      .describe('Number of images to return (1-10)'),
    orientation: z
      .enum(['landscape', 'portrait', 'square'])
      .optional()
      .describe('Preferred image orientation'),
    license: z
      .enum(['free', 'commercial', 'any'])
      .optional()
      .default('free')
      .describe('License type preference')
  }),
  execute: async ({ query, count = 4, orientation, license }) => {
    // Simulate search delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate image search results
    const results = await fetchImagesFromAPI(
      query,
      count,
      orientation,
      license
    );

    return {
      query,
      results,
      totalFound: results.length,
      searchTime: new Date().toISOString(),
      filters: { count, orientation, license }
    };
  }
});
```

### UI Components

```typescript
// components/image-gallery.tsx
import React from 'react';
import { Search, Image, Download, Heart } from 'lucide-react';

// Loading state
export const ImageGalleryLoading: React.FC<{ input?: { query: string } }> = ({
  input
}) => (
  <div className='animate-pulse bg-white rounded-lg shadow-md p-6'>
    <div className='flex items-center space-x-3 mb-4'>
      <div className='bg-blue-100 rounded-lg size-12 flex items-center justify-center'>
        <Image className='size-6 text-blue-600' />
      </div>
      <div className='flex-1'>
        <div className='h-4 bg-gray-200 rounded w-3/4 mb-2' />
        <div className='h-3 bg-gray-200 rounded w-1/2' />
      </div>
    </div>

    <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
      {[...Array(4)].map((_, i) => (
        <div key={`skeleton-${i}`} className='space-y-2'>
          <div className='bg-gray-200 rounded-lg aspect-square' />
          <div className='h-3 bg-gray-200 rounded w-3/4' />
          <div className='h-2 bg-gray-200 rounded w-1/2' />
        </div>
      ))}
    </div>

    <div className='mt-4 flex items-center space-x-2'>
      <Search className='size-4 text-gray-400' />
      <span className='text-sm text-gray-500'>
        Searching for &ldquo;{input?.query}&rdquo;...
      </span>
    </div>
  </div>
);

// Success state
export const ImageGallery: React.FC<{
  output: {
    query: string;
    results: Array<{
      id: string;
      url: string;
      alt: string;
      title: string;
      photographer: string;
      tags: string[];
      width: number;
      height: number;
      license: string;
      downloadUrl: string;
    }>;
    totalFound: number;
    searchTime: string;
    filters: { count: number; orientation?: string; license: string };
  };
  input?: { query: string };
}> = ({ output, input }) => (
  <div className='bg-white rounded-lg shadow-md p-6'>
    <div className='flex items-center space-x-3 mb-4'>
      <div className='bg-blue-100 rounded-lg size-12 flex items-center justify-center'>
        <Image className='size-6 text-blue-600' />
      </div>
      <div className='flex-1'>
        <h3 className='font-semibold text-lg'>Image Search Results</h3>
        <p className='text-gray-600 text-sm'>
          Found {output.totalFound} images for &ldquo;{output.query}&rdquo;
        </p>
      </div>
    </div>

    <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-4'>
      {output.results.map(image => (
        <div key={image.id} className='group relative'>
          <div className='relative overflow-hidden rounded-lg bg-gray-100'>
            <img
              src={image.url}
              alt={image.alt}
              className='w-full h-32 object-cover transition-transform duration-200 group-hover:scale-105'
            />
            <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200' />

            {/* Overlay actions */}
            <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
              <div className='flex space-x-2'>
                <button
                  type='button'
                  className='bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors'
                >
                  <Heart className='size-4 text-gray-600' />
                </button>
                <a
                  href={image.downloadUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors'
                >
                  <Download className='size-4 text-gray-600' />
                </a>
              </div>
            </div>
          </div>

          <div className='mt-2 space-y-1'>
            <h4 className='font-medium text-sm truncate'>{image.title}</h4>
            <p className='text-xs text-gray-500'>by {image.photographer}</p>
            <div className='flex flex-wrap gap-1'>
              {image.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={`${image.id}-tag-${index}`}
                  className='px-1.5 py-0.5 bg-gray-100 rounded text-xs text-gray-600'
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>

    <div className='flex items-center justify-between text-xs text-gray-500 border-t pt-4'>
      <div className='flex items-center space-x-4'>
        <span>
          Resolution: {output.results[0]?.width}x{output.results[0]?.height}
        </span>
        <span>License: {output.filters.license}</span>
        {output.filters.orientation && (
          <span>Orientation: {output.filters.orientation}</span>
        )}
      </div>
      <span>
        Search time: {new Date(output.searchTime).toLocaleTimeString()}
      </span>
    </div>
  </div>
);

// Error state
export const ImageGalleryError: React.FC<{
  error: string;
  input?: { query: string };
}> = ({ error, input }) => (
  <div className='bg-red-50 border border-red-200 rounded-lg p-6'>
    <div className='flex items-center space-x-3'>
      <div className='bg-red-100 rounded-lg size-12 flex items-center justify-center'>
        <Image className='size-6 text-red-600' />
      </div>
      <div>
        <h3 className='font-semibold text-red-800'>Image Search Failed</h3>
        <p className='text-red-600 text-sm'>{error}</p>
        {input && (
          <p className='text-red-500 text-xs mt-1'>
            Query: &ldquo;{input.query}&rdquo;
          </p>
        )}
      </div>
    </div>
  </div>
);
```

### Registration

```typescript
// components/chat.tsx
import { useGenerativeUI } from '@/lib/generative-ui';
import {
  ImageGallery,
  ImageGalleryLoading,
  ImageGalleryError
} from './image-gallery';

export function Chat() {
  const { registerComponent } = useGenerativeUI();

  registerComponent({
    toolId: 'searchImages',
    LoadingComponent: ImageGalleryLoading,
    SuccessComponent: ImageGallery,
    ErrorComponent: ImageGalleryError
  });

  // ... rest of component
}
```

## 📊 Sentiment Analyzer Example

An advanced text sentiment analysis tool with detailed insights.

### Tool Definition

```typescript
// lib/ai/tools/analyze-sentiment.ts
import { tool } from 'ai';
import { z } from 'zod';

export const analyzeSentimentTool = tool({
  description:
    'Analyze the sentiment of text to determine if it is positive, negative, or neutral',
  inputSchema: z.object({
    text: z.string().describe('The text to analyze for sentiment'),
    language: z
      .string()
      .optional()
      .default('en')
      .describe('Language of the text (ISO code)'),
    detailed: z
      .boolean()
      .optional()
      .default(true)
      .describe('Whether to return detailed analysis')
  }),
  execute: async ({ text, language = 'en', detailed = true }) => {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (!text || text.trim().length === 0) {
      throw new Error('Text cannot be empty');
    }

    const analysis = await performSentimentAnalysis(text, language);

    const result = {
      text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
      language,
      sentiment: analysis.sentiment,
      confidence: analysis.confidence,
      score: analysis.score,
      wordCount: text.split(/\s+/).length,
      characterCount: text.length,
      analysisTime: new Date().toISOString()
    };

    if (detailed) {
      return {
        ...result,
        breakdown: analysis.breakdown,
        emotions: analysis.emotions.slice(0, 3),
        suggestions: analysis.suggestions
      };
    }

    return result;
  }
});
```

### UI Components

```typescript
// components/sentiment-analyzer.tsx
import React from 'react';
import { BarChart3, Smile, Frown, Meh, Lightbulb, Clock } from 'lucide-react';

// Loading state
export const SentimentAnalyzerLoading: React.FC<{
  input?: { text: string };
}> = ({ input }) => (
  <div className='animate-pulse bg-white rounded-lg shadow-md p-6'>
    <div className='flex items-center space-x-3 mb-4'>
      <div className='bg-purple-100 rounded-lg size-12 flex items-center justify-center'>
        <BarChart3 className='size-6 text-purple-600' />
      </div>
      <div className='flex-1'>
        <div className='h-4 bg-gray-200 rounded w-3/4 mb-2' />
        <div className='h-3 bg-gray-200 rounded w-1/2' />
      </div>
    </div>

    <div className='space-y-4'>
      <div className='h-20 bg-gray-200 rounded' />
      <div className='flex space-x-4'>
        <div className='flex-1 h-8 bg-gray-200 rounded' />
        <div className='flex-1 h-8 bg-gray-200 rounded' />
        <div className='flex-1 h-8 bg-gray-200 rounded' />
      </div>
      <div className='space-y-2'>
        <div className='h-3 bg-gray-200 rounded w-5/6' />
        <div className='h-3 bg-gray-200 rounded w-4/6' />
      </div>
    </div>

    <div className='mt-4 flex items-center space-x-2'>
      <Clock className='size-4 text-gray-400' />
      <span className='text-sm text-gray-500'>Analyzing sentiment...</span>
    </div>
  </div>
);

// Success state
export const SentimentAnalyzer: React.FC<{
  output: {
    text: string;
    language: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    confidence: number;
    score: number;
    wordCount: number;
    characterCount: number;
    analysisTime: string;
    breakdown: { positive: number; negative: number; neutral: number };
    emotions: Array<{ emotion: string; intensity: number }>;
    suggestions: string[];
  };
  input?: { text: string };
}> = ({ output, input }) => {
  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <Smile className='size-6 text-green-600' />;
      case 'negative':
        return <Frown className='size-6 text-red-600' />;
      default:
        return <Meh className='size-6 text-gray-600' />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600 bg-green-100';
      case 'negative':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence > 0.8) return 'text-green-600';
    if (confidence > 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className='bg-white rounded-lg shadow-md p-6'>
      <div className='flex items-center space-x-3 mb-4'>
        <div className='bg-purple-100 rounded-lg size-12 flex items-center justify-center'>
          <BarChart3 className='size-6 text-purple-600' />
        </div>
        <div className='flex-1'>
          <h3 className='font-semibold text-lg'>Sentiment Analysis</h3>
          <p className='text-gray-600 text-sm'>
            {output.wordCount} words • {output.characterCount} characters
          </p>
        </div>
      </div>

      {/* Text preview */}
      <div className='mb-4 p-3 bg-gray-50 rounded-lg'>
        <p className='text-sm text-gray-700 italic'>
          &ldquo;{output.text}&rdquo;
        </p>
      </div>

      {/* Sentiment result */}
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center space-x-3'>
          {getSentimentIcon(output.sentiment)}
          <div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getSentimentColor(
                output.sentiment
              )}`}
            >
              {output.sentiment.charAt(0).toUpperCase() +
                output.sentiment.slice(1)}
            </span>
          </div>
        </div>
        <div className='text-right'>
          <div
            className={`text-lg font-bold ${getConfidenceColor(
              output.confidence
            )}`}
          >
            {(output.confidence * 100).toFixed(0)}%
          </div>
          <div className='text-xs text-gray-500'>Confidence</div>
        </div>
      </div>

      {/* Sentiment score bar */}
      <div className='mb-4'>
        <div className='flex justify-between text-xs text-gray-500 mb-1'>
          <span>Negative</span>
          <span>Neutral</span>
          <span>Positive</span>
        </div>
        <div className='w-full bg-gray-200 rounded-full h-2'>
          <div
            className='bg-gradient-to-r from-red-500 via-gray-400 to-green-500 h-2 rounded-full'
            style={{
              background: `linear-gradient(to right, 
                #ef4444 0%, #ef4444 ${Math.max(0, -output.score) * 50}%, 
                #9ca3af ${Math.max(0, -output.score) * 50}%, #9ca3af ${
                Math.max(0, -output.score) * 50 + 20
              }%, 
                #22c55e ${Math.max(0, -output.score) * 50 + 20}%, #22c55e 100%)`
            }}
          />
        </div>
        <div className='text-center text-xs text-gray-500 mt-1'>
          Score: {output.score.toFixed(2)}
        </div>
      </div>

      {/* Breakdown */}
      <div className='grid grid-cols-3 gap-4 mb-4'>
        <div className='text-center'>
          <div className='text-lg font-bold text-green-600'>
            {(output.breakdown.positive * 100).toFixed(0)}%
          </div>
          <div className='text-xs text-gray-500'>Positive</div>
        </div>
        <div className='text-center'>
          <div className='text-lg font-bold text-gray-600'>
            {(output.breakdown.neutral * 100).toFixed(0)}%
          </div>
          <div className='text-xs text-gray-500'>Neutral</div>
        </div>
        <div className='text-center'>
          <div className='text-lg font-bold text-red-600'>
            {(output.breakdown.negative * 100).toFixed(0)}%
          </div>
          <div className='text-xs text-gray-500'>Negative</div>
        </div>
      </div>

      {/* Emotions */}
      {output.emotions.length > 0 && (
        <div className='mb-4'>
          <h4 className='font-medium text-sm mb-2'>Detected Emotions</h4>
          <div className='flex flex-wrap gap-2'>
            {output.emotions.map((emotion, index) => (
              <span
                key={`${emotion.emotion}-${index}`}
                className='px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs'
              >
                {emotion.emotion} ({(emotion.intensity * 100).toFixed(0)}%)
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {output.suggestions.length > 0 && (
        <div className='border-t pt-4'>
          <div className='flex items-center space-x-2 mb-2'>
            <Lightbulb className='size-4 text-yellow-500' />
            <h4 className='font-medium text-sm'>Suggestions</h4>
          </div>
          <ul className='space-y-1'>
            {output.suggestions.map((suggestion, index) => (
              <li
                key={`suggestion-${index}`}
                className='text-sm text-gray-600 flex items-start space-x-2'
              >
                <span className='text-yellow-500 mt-1'>•</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className='text-xs text-gray-500 mt-4'>
        Language: {output.language.toUpperCase()} •{' '}
        {new Date(output.analysisTime).toLocaleTimeString()}
      </div>
    </div>
  );
};

// Error state
export const SentimentAnalyzerError: React.FC<{
  error: string;
  input?: { text: string };
}> = ({ error, input }) => (
  <div className='bg-red-50 border border-red-200 rounded-lg p-6'>
    <div className='flex items-center space-x-3'>
      <div className='bg-red-100 rounded-lg size-12 flex items-center justify-center'>
        <BarChart3 className='size-6 text-red-600' />
      </div>
      <div>
        <h3 className='font-semibold text-red-800'>
          Sentiment Analysis Failed
        </h3>
        <p className='text-red-600 text-sm'>{error}</p>
        {input && (
          <p className='text-red-500 text-xs mt-1'>
            Text: &ldquo;{input.text.substring(0, 50)}...&rdquo;
          </p>
        )}
      </div>
    </div>
  </div>
);
```

### Registration

```typescript
// components/chat.tsx
import { useGenerativeUI } from '@/lib/generative-ui';
import {
  SentimentAnalyzer,
  SentimentAnalyzerLoading,
  SentimentAnalyzerError
} from './sentiment-analyzer';

export function Chat() {
  const { registerComponent } = useGenerativeUI();

  registerComponent({
    toolId: 'analyzeSentimentTool',
    LoadingComponent: SentimentAnalyzerLoading,
    SuccessComponent: SentimentAnalyzer,
    ErrorComponent: SentimentAnalyzerError
  });

  // ... rest of component
}
```

## 🎯 Usage Patterns

### Centralized Registration

For better maintainability, register all components in one place:

```typescript
// components/generative-ui-registry.tsx
import { useGenerativeUI } from '@/lib/generative-ui';

export function GenerativeUIRegistry() {
  const { registerComponent } = useGenerativeUI();

  // Register all components here
  registerComponent(productComponent);
  registerComponent(imageGalleryComponent);
  registerComponent(sentimentAnalyzerComponent);

  return null;
}
```

### Reusable Loading Components

Create reusable loading components for consistent UX:

```typescript
// components/ui/skeleton-loader.tsx
export const SkeletonLoader: React.FC<{ input?: any }> = ({ input }) => (
  <div className='animate-pulse bg-white rounded-lg shadow-md p-6'>
    <div className='flex items-center space-x-4 mb-4'>
      <div className='bg-gray-200 rounded-lg size-12' />
      <div className='flex-1'>
        <div className='h-4 bg-gray-200 rounded w-3/4 mb-2' />
        <div className='h-3 bg-gray-200 rounded w-1/2' />
      </div>
    </div>
    <div className='space-y-3'>
      <div className='h-3 bg-gray-200 rounded' />
      <div className='h-3 bg-gray-200 rounded w-5/6' />
      <div className='h-3 bg-gray-200 rounded w-4/6' />
    </div>
  </div>
);

// Use in multiple tools
registerComponent({
  toolId: 'getProductInfo',
  LoadingComponent: SkeletonLoader
  // ...
});
```

### Consistent Error Handling

Create error components that are consistent across the application:

```typescript
// components/ui/error-display.tsx
export const ErrorDisplay: React.FC<{
  error: string;
  input?: any;
  toolName: string;
}> = ({ error, input, toolName }) => (
  <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
    <div className='flex items-center space-x-2'>
      <span className='text-red-500'>⚠️</span>
      <div>
        <h4 className='text-red-800 font-medium'>Error in {toolName}</h4>
        <p className='text-red-600 text-sm'>{error}</p>
        {input && (
          <p className='text-red-500 text-xs mt-1'>
            Input: {JSON.stringify(input)}
          </p>
        )}
      </div>
    </div>
  </div>
);
```

## 🚀 Next Steps

1. **Customize components** to match your application's design system
2. **Add animations** for better user experience
3. **Implement real API calls** in your tools
4. **Add more interactive features** like buttons and forms
5. **Create shared UI components** for consistency

---

These examples demonstrate the flexibility and power of the Generative UI abstraction. Each example shows different patterns and approaches that you can adapt to your specific use cases.
