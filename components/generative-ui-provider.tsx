'use client';

import { GenerativeUIProvider } from '@/package/front10-generative-ui/src';

export function GenerativeUIProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <GenerativeUIProvider>{children}</GenerativeUIProvider>;
}
