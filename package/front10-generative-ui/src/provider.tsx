'use client';

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useRef,
} from 'react';
import type {
  GenerativeUIComponent,
  GenerativeUIRegistryType,
  GenerativeUIRendererProps,
  UseGenerativeUI,
  UserAction,
} from './types';

// Contexto para el registro de componentes generativos
const GenerativeUIContext = createContext<UseGenerativeUI | null>(null);

// Hook para usar el contexto de Generative UI
export const useGenerativeUI = (): UseGenerativeUI => {
  const context = useContext(GenerativeUIContext);
  if (!context) {
    throw new Error(
      'useGenerativeUI must be used within a GenerativeUIProvider',
    );
  }
  return context;
};

// Provider principal
export const GenerativeUIProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [, setRegistry] = useState<GenerativeUIRegistryType>({});
  const registryRef = useRef<GenerativeUIRegistryType>({});

  const registerComponent = <TInput = any, TOutput = any>(
    component: GenerativeUIComponent<TInput, TOutput>,
  ) => {
    // Actualizar tanto el estado como la ref
    const newRegistry = {
      ...registryRef.current,
      [component.toolId]: component,
    };

    registryRef.current = newRegistry;
    setRegistry(newRegistry);
  };

  const renderComponent = (
    props: GenerativeUIRendererProps,
  ): React.ReactNode | null => {
    const { toolId, state, input, output, error, toolCallId } = props;
    const component = registryRef.current[toolId];

    if (!component) {
      // En lugar de mostrar un error, mostrar un componente de fallback
      return React.createElement(
        'div',
        {
          key: toolCallId,
          className: 'p-4 border border-gray-200 rounded-lg bg-gray-50',
        },
        `Component not registered for tool: ${toolId}`,
      );
    }

    const key = `${toolCallId}-${state}`;

    // Función helper para pasar onAction a los componentes
    const createActionHandler =
      (componentToolId: string) => (action: Omit<UserAction, 'toolId'>) => {
        const fullAction = {
          toolId: componentToolId,
          ...action,
        };

        // Usar el onUserAction del componente registrado si existe
        component.onUserAction?.(fullAction);
      };

    switch (state) {
      case 'input-streaming':
      case 'input-available':
        if (component.LoadingComponent) {
          return React.createElement(component.LoadingComponent, {
            key,
            input,
            onAction: createActionHandler(toolId),
          });
        }
        return null;

      case 'output-available':
        // Verificar si hay error en el output
        if (output && typeof output === 'object' && 'error' in output) {
          if (component.ErrorComponent) {
            return React.createElement(component.ErrorComponent, {
              key,
              error: String(output.error),
              input,
              onAction: createActionHandler(toolId),
            });
          }
          // Fallback si no hay ErrorComponent
          return React.createElement(
            'div',
            {
              key,
              className: 'text-red-500 p-2 border rounded',
            },
            `Error: ${String(output.error)}`,
          );
        }

        // Éxito - renderizar componente de éxito
        return React.createElement(component.SuccessComponent, {
          key,
          output,
          input,
          onAction: createActionHandler(toolId),
        });

      case 'output-error':
        if (component.ErrorComponent) {
          return React.createElement(component.ErrorComponent, {
            key,
            error: error || 'Unknown error occurred',
            input,
            onAction: createActionHandler(toolId),
          });
        }
        // Fallback si no hay ErrorComponent
        return React.createElement(
          'div',
          {
            key,
            className: 'text-red-500 p-2 border rounded',
          },
          `Error: ${error || 'Unknown error occurred'}`,
        );

      default:
        console.warn(`Unknown state: ${state} for tool: ${toolId}`);
        return null;
    }
  };

  const value = useMemo<UseGenerativeUI>(
    () => ({
      registerComponent,
      renderComponent,
    }),
    [],
  );

  return (
    <GenerativeUIContext.Provider value={value}>
      {children}
    </GenerativeUIContext.Provider>
  );
};
