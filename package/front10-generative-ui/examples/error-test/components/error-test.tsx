'use client';

import React from 'react';
import { AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';

// Loading component
export const ErrorTestLoading: React.FC<{
  input?: { errorType?: string; message?: string };
}> = ({ input }) => (
  <div className="animate-pulse bg-white rounded-lg shadow-md p-4 border-l-4 border-yellow-400">
    <div className="flex items-center space-x-3">
      <Loader2 className="size-5 text-yellow-500 animate-spin" />
      <div>
        <h3 className="font-medium text-gray-900">Testing Error Handling</h3>
        <p className="text-sm text-gray-500">
          {input?.errorType === 'throw' && 'Preparing to throw an error...'}
          {input?.errorType === 'return-error' &&
            'Preparing to return an error...'}
          {input?.errorType === 'success' && 'Preparing for success...'}
          {!input?.errorType && 'Loading...'}
        </p>
      </div>
    </div>
  </div>
);

// Success component
export const ErrorTestSuccess: React.FC<{
  output: { success: boolean; message: string; timestamp: string };
  input?: { errorType?: string; message?: string };
}> = ({ output, input }) => (
  <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-400">
    <div className="flex items-center space-x-3">
      <CheckCircle className="size-5 text-green-500" />
      <div>
        <h3 className="font-medium text-gray-900">
          Test Completed Successfully
        </h3>
        <p className="text-sm text-gray-600">{output.message}</p>
        <p className="text-xs text-gray-400 mt-1">
          Test type: {input?.errorType || 'unknown'} •{' '}
          {new Date(output.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </div>
  </div>
);

// Error component
export const ErrorTestError: React.FC<{
  error: string;
  input?: { errorType?: string; message?: string };
}> = ({ error, input }) => (
  <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-400">
    <div className="flex items-center space-x-3">
      <AlertTriangle className="size-5 text-red-500" />
      <div>
        <h3 className="font-medium text-gray-900">Test Error Generated</h3>
        <p className="text-sm text-red-600">{error}</p>
        <p className="text-xs text-gray-400 mt-1">
          Test type: {input?.errorType || 'unknown'} •{' '}
          {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  </div>
);
