'use client';

import { useGenerativeUI } from './provider';
import type { GenerativeUIRendererProps } from './types';

// Componente renderizador que se integra con el sistema de mensajes
export const GenerativeUIRenderer: React.FC<GenerativeUIRendererProps> = (
  props,
) => {
  const { renderComponent } = useGenerativeUI();

  return <>{renderComponent(props)}</>;
};

// Hook helper para renderizar componentes generativos desde el sistema de mensajes
export const useRenderGenerativeUI = () => {
  const { renderComponent } = useGenerativeUI();

  return renderComponent;
};
