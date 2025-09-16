// Exportar tipos
export type {
  ToolState,
  GenerativeUIComponent,
  GenerativeUIRegistryType,
  GenerativeUIRendererProps,
  UseGenerativeUI,
  UserAction,
} from './types';

// Exportar provider y hooks principales
export {
  GenerativeUIProvider,
  useGenerativeUI,
} from './provider';

// Exportar utilidades adicionales
export {
  GenerativeUIRegistry,
  useRegisterGenerativeComponent,
} from './registry';

export {
  GenerativeUIRenderer,
  useRenderGenerativeUI,
} from './renderer';

// Exportar utilidades
export { cn } from './utils';
