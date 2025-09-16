import { tool } from 'ai';
import { z } from 'zod';

export const errorTool = tool({
  description: 'A test tool that generates errors for testing error handling',
  inputSchema: z.object({
    errorType: z
      .enum(['throw', 'return-error', 'success'])
      .describe('Type of error to generate'),
    message: z.string().optional().describe('Custom error message'),
  }),
  execute: async ({ errorType, message }) => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    switch (errorType) {
      case 'throw':
        throw new Error(message || 'This is a thrown error');

      case 'return-error':
        return {
          error: message || 'This is a returned error',
          timestamp: new Date().toISOString(),
        };

      case 'success':
        return {
          success: true,
          message: message || 'Operation completed successfully',
          timestamp: new Date().toISOString(),
        };

      default:
        throw new Error('Unknown error type');
    }
  },
});
