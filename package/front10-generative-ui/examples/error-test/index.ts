// Import tool
import { errorTool } from './tools/error-tool';

// Import components
import {
  ErrorTestLoading,
  ErrorTestSuccess,
  ErrorTestError,
} from './components/error-test';

// Export tool
export { errorTool } from './tools/error-tool';

// Export components
export {
  ErrorTestLoading,
  ErrorTestSuccess,
  ErrorTestError,
} from './components/error-test';

// Export example registration
export const errorTestExample = {
  toolId: 'errorTool',
  tool: errorTool,
  components: {
    LoadingComponent: ErrorTestLoading,
    SuccessComponent: ErrorTestSuccess,
    ErrorComponent: ErrorTestError,
  },
};
