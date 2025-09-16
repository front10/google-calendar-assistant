// Product Card Example
import { getProductInfo } from './product-card/tools/get-product-info';
import {
  ProductCard,
  ProductCardLoading,
  ProductCardError,
} from './product-card/components/product-card';
import type {
  ProductInfo,
  ProductCardProps,
} from './product-card/components/product-card';

// Image Gallery Example
import { searchImages } from './image-gallery/tools/search-images';
import {
  ImageGallery,
  ImageGalleryLoading,
  ImageGalleryError,
} from './image-gallery/components/image-gallery';

// Sentiment Analyzer Example
import { analyzeSentimentTool } from './sentiment-analyzer/tools/analyze-sentiment';
import {
  SentimentAnalyzer,
  SentimentAnalyzerLoading,
  SentimentAnalyzerError,
} from './sentiment-analyzer/components/sentiment-analyzer';

// Calendar Events Example
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  CalendarComponent,
  CalendarLoading,
  CalendarError,
  calendarEventsExample,
  calendarTools,
} from './calendar-events';

// Error Test Example
import {
  errorTool,
  ErrorTestLoading,
  ErrorTestSuccess,
  ErrorTestError,
  errorTestExample,
} from './error-test';

// Re-export everything
export {
  getProductInfo,
  ProductCard,
  ProductCardLoading,
  ProductCardError,
  searchImages,
  ImageGallery,
  ImageGalleryLoading,
  ImageGalleryError,
  analyzeSentimentTool,
  SentimentAnalyzer,
  SentimentAnalyzerLoading,
  SentimentAnalyzerError,
  // Calendar exports
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  CalendarComponent,
  CalendarLoading,
  CalendarError,
  calendarEventsExample,
  calendarTools,
  // Error Test exports
  errorTool,
  ErrorTestLoading,
  ErrorTestSuccess,
  ErrorTestError,
  errorTestExample,
};

// Re-export types
export type { ProductInfo, ProductCardProps };

// Example registrations
export const productCardExample = {
  toolId: 'getProductInfo',
  tool: getProductInfo,
  components: {
    LoadingComponent: ProductCardLoading,
    SuccessComponent: ProductCard,
    ErrorComponent: ProductCardError,
  },
};

export const imageGalleryExample = {
  toolId: 'searchImages',
  tool: searchImages,
  components: {
    LoadingComponent: ImageGalleryLoading,
    SuccessComponent: ImageGallery,
    ErrorComponent: ImageGalleryError,
  },
};

export const sentimentAnalyzerExample = {
  toolId: 'analyzeSentimentTool',
  tool: analyzeSentimentTool,
  components: {
    LoadingComponent: SentimentAnalyzerLoading,
    SuccessComponent: SentimentAnalyzer,
    ErrorComponent: SentimentAnalyzerError,
  },
};

// All examples
export const examples = [
  productCardExample,
  imageGalleryExample,
  sentimentAnalyzerExample,
  calendarEventsExample,
  errorTestExample, // Added error test example
];
