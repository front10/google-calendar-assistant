'use client';

import Link from 'next/link';
import { ExternalLinkIcon } from 'lucide-react';

export function AppFooter() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex justify-center items-center">
          <div className="flex items-center space-x-4">
            <Link
              href="/privacy"
              className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              Terms
            </Link>
            <Link
              href="https://front10.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              <span>Front10.com</span>
              <ExternalLinkIcon className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
