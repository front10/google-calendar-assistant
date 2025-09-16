'use client';

import { useEffect } from 'react';
import { useGenerativeUI } from './provider';
import type { GenerativeUIComponent } from './types';

// Componente para registrar componentes generativos automáticamente
export const GenerativeUIRegistry: React.FC<{
  components: GenerativeUIComponent[];
}> = ({ components }) => {
  const { registerComponent } = useGenerativeUI();

  useEffect(() => {
    components.forEach((component) => {
      registerComponent(component);
    });
  }, [components, registerComponent]);

  return null;
};

// Hook helper para registrar un componente
export const useRegisterGenerativeComponent = <TInput = any, TOutput = any>(
  component: GenerativeUIComponent<TInput, TOutput>,
) => {
  const { registerComponent } = useGenerativeUI();

  useEffect(() => {
    registerComponent(component);
  }, [component, registerComponent]);
};
