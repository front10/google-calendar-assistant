import { tool } from 'ai';
import { z } from 'zod';

// Simulación de datos de productos
const PRODUCTS_DB = {
  'laptop-001': {
    id: 'laptop-001',
    name: 'MacBook Pro 14 M3',
    price: 1999,
    currency: 'USD',
    category: 'Electronics',
    brand: 'Apple',
    rating: 4.8,
    reviews: 1247,
    inStock: true,
    description:
      'Powerful laptop with M3 chip, 14-inch Liquid Retina XDR display, and up to 22 hours of battery life.',
    features: [
      'M3 Chip',
      '14" Liquid Retina XDR',
      'Up to 22h battery',
      '8-core GPU',
    ],
    images: [
      'https://example.com/macbook-pro-1.jpg',
      'https://example.com/macbook-pro-2.jpg',
    ],
  },
  'phone-001': {
    id: 'phone-001',
    name: 'iPhone 15 Pro',
    price: 999,
    currency: 'USD',
    category: 'Electronics',
    brand: 'Apple',
    rating: 4.7,
    reviews: 2156,
    inStock: true,
    description:
      'Latest iPhone with A17 Pro chip, titanium design, and advanced camera system.',
    features: ['A17 Pro Chip', 'Titanium Design', '48MP Camera', 'USB-C'],
    images: [
      'https://example.com/iphone-15-pro-1.jpg',
      'https://example.com/iphone-15-pro-2.jpg',
    ],
  },
  'headphones-001': {
    id: 'headphones-001',
    name: 'Sony WH-1000XM5',
    price: 399,
    currency: 'USD',
    category: 'Electronics',
    brand: 'Sony',
    rating: 4.6,
    reviews: 892,
    inStock: false,
    description:
      'Industry-leading noise canceling headphones with exceptional sound quality.',
    features: [
      'Noise Canceling',
      '30h Battery',
      'Touch Controls',
      'Quick Charge',
    ],
    images: ['https://example.com/sony-wh1000xm5-1.jpg'],
  },
};

export const getProductInfo = tool({
  description:
    'Get detailed information about a product including price, reviews, features, and availability',
  inputSchema: z.object({
    // productId: z.string().describe('The unique identifier of the product'),
    name: z.string().describe('The commercial name of the product'),
  }),
  execute: async ({ name }) => {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const product = Object.values(PRODUCTS_DB).find((product) =>
      product.name.toLowerCase().includes(name.toLowerCase()),
    );

    if (!product) {
      throw new Error(`Product with name ${name} not found`);
    }

    return {
      product,
      timestamp: new Date().toISOString(),
      source: 'product-database',
    };
  },
});
