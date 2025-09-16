'use client';

import {
  StarIcon,
  ClockIcon,
  ShoppingCartIcon,
  EyeIcon,
  HeartIcon,
} from 'lucide-react';
import { cn } from '../../../src/utils';

// Tipos para el componente
export interface ProductInfo {
  id: string;
  name: string;
  price: number;
  currency: string;
  category: string;
  brand: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  description: string;
  features: string[];
  images: string[];
}

export interface ProductCardProps {
  output: {
    product: ProductInfo;
    timestamp: string;
    source: string;
  };
  input?: {
    productId: string;
  };
  onAction?: (action: { action: string; data?: any; context?: any }) => void;
}

// Componente de carga
export const ProductCardLoading: React.FC<{
  input?: { productId: string };
  onAction?: (action: { action: string; data?: any; context?: any }) => void;
}> = ({ input: _input, onAction: _onAction }) => {
  return (
    <div className="animate-pulse bg-white rounded-lg shadow-md p-6 max-w-sm">
      <div className="flex items-center space-x-4 mb-4">
        <div className="bg-gray-200 rounded-lg size-16" />
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-3 bg-gray-200 rounded" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
        <div className="h-3 bg-gray-200 rounded w-4/6" />
      </div>
      <div className="mt-4 flex items-center space-x-2">
        <ClockIcon className="size-4 text-gray-400" />
        <span className="text-sm text-gray-500">Loading product info...</span>
      </div>
    </div>
  );
};

// Componente principal
export const ProductCard: React.FC<ProductCardProps> = ({
  output,
  input: _input,
  onAction,
}) => {
  const { product } = output;

  const handleAddToCart = () => {
    onAction?.({
      action: 'add_to_cart',
      data: {
        productId: product.id,
        productName: product.name,
        price: product.price,
        currency: product.currency,
      },
      context: { timestamp: Date.now() },
    });
  };

  const handleViewDetails = () => {
    onAction?.({
      action: 'view_details',
      data: {
        productId: product.id,
        productName: product.name,
      },
    });
  };

  const handleAddToWishlist = () => {
    onAction?.({
      action: 'add_to_wishlist',
      data: {
        productId: product.id,
        productName: product.name,
      },
    });
  };

  const handleShare = () => {
    onAction?.({
      action: 'share_product',
      data: {
        productId: product.id,
        productName: product.name,
        url: window.location.href,
      },
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-sm border border-gray-200 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500">{product.brand}</p>
        </div>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
          {product.category}
        </span>
      </div>

      {/* Price */}
      <div className="mb-4">
        <span className="text-2xl font-bold text-gray-900">
          {product.currency} {product.price.toLocaleString()}
        </span>
      </div>

      {/* Rating */}
      <div className="flex items-center space-x-2 mb-4">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <StarIcon
              key={`star-${crypto.randomUUID()}`}
              className={cn(
                'w-4 h-4',
                i < Math.floor(product.rating)
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300',
              )}
            />
          ))}
        </div>
        <span className="text-sm text-gray-600">
          {product.rating} ({product.reviews} reviews)
        </span>
      </div>

      {/* Stock Status */}
      <div className="mb-4">
        <span
          className={cn(
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
            product.inStock
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800',
          )}
        >
          {product.inStock ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4">{product.description}</p>

      {/* Features */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Features</h4>
        <div className="flex flex-wrap gap-1">
          {product.features.map((feature, _index) => (
            <span
              key={`feature-${crypto.randomUUID()}`}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>

      {/* Interactive Actions */}
      <div className="mb-4 space-y-2">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={cn(
            'w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors',
            product.inStock
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed',
          )}
        >
          <ShoppingCartIcon className="w-4 h-4" />
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={handleViewDetails}
            className="flex items-center justify-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <EyeIcon className="w-4 h-4" />
            Details
          </button>

          <button
            type="button"
            onClick={handleAddToWishlist}
            className="flex items-center justify-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <HeartIcon className="w-4 h-4" />
            Wishlist
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="flex items-center justify-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm">📤</span>
            Share
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-4">
        <span>Source: {output.source}</span>
        <span>{new Date(output.timestamp).toLocaleString()}</span>
      </div>
    </div>
  );
};

// Componente de error
export const ProductCardError: React.FC<{
  error: string;
  input?: { productId: string };
  onAction?: (action: { action: string; data?: any; context?: any }) => void;
}> = ({ error, input, onAction }) => {
  const handleRetry = () => {
    onAction?.({
      action: 'retry_load',
      data: { productId: input?.productId },
    });
  };

  const handleReportError = () => {
    onAction?.({
      action: 'report_error',
      data: {
        productId: input?.productId,
        error: error,
      },
    });
  };

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-sm">
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-red-100 rounded-lg size-12 flex items-center justify-center">
          <span className="text-red-600 text-xl">⚠️</span>
        </div>
        <div>
          <h3 className="font-semibold text-red-800">Error Loading Product</h3>
          <p className="text-red-600 text-sm">{error}</p>
          {input && (
            <p className="text-red-500 text-xs mt-1">
              Product ID: {input.productId}
            </p>
          )}
        </div>
      </div>

      {/* Error Actions */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleRetry}
          className="flex-1 px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
        <button
          type="button"
          onClick={handleReportError}
          className="flex-1 px-3 py-2 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
        >
          Report Error
        </button>
      </div>
    </div>
  );
};
