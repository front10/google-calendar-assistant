# Generative UI Abstraction

A complete abstraction for creating generative UI components that automatically display when specific tools are executed in chat. Designed to work with **Vercel AI SDK 5.0** and provide a simple, scalable, and reusable way to create dynamic user experiences.

## 🎯 What is Generative UI?

Generative UI is the process of connecting tool call results with specific React components. When an AI model decides to use a tool, this abstraction automatically renders the corresponding UI component based on the tool's state.

### Workflow:

1. **User** sends a message
2. **AI** decides to use a tool
3. **Tool** executes and returns data
4. **Generative UI** renders the corresponding component
5. **User** sees a dynamic and contextual interface

## 🏗️ Architecture

### Core Components

#### 1. **GenerativeUIProvider** (`provider.tsx`)

The main provider that handles component registration and rendering. This component should be placed at the highest level of your application (layout, app root, etc.) to provide the necessary context for all components to register and render.

```typescript
// app/layout.tsx or any root component
import { GenerativeUIProvider } from '@/lib/generative-ui';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <GenerativeUIProvider>{children}</GenerativeUIProvider>
      </body>
    </html>
  );
}
```

#### 2. **useGenerativeUI** (Hook)

Hook to access the Generative UI context. Used in any component that needs to register components or render tools, providing access to registration and rendering functions.

```typescript
import { useGenerativeUI } from '@/lib/generative-ui';

function MyComponent() {
  const { registerComponent, renderComponent } = useGenerativeUI();

  // Use registerComponent to register components
  // Use renderComponent to render tools
}
```

#### 3. **GenerativeUIRegistry** (`registry.tsx`)

Component for automatically registering multiple components. Used in components that want to register several components at once, simplifying the registration process.

```typescript
import { GenerativeUIRegistry } from '@/lib/generative-ui';

function App() {
  return (
    <>
      <Chat />
      <GenerativeUIRegistry
        components={[productComponent, weatherComponent, stockComponent]}
      />
    </>
  );
}
```

#### 4. **useRegisterGenerativeComponent** (Hook)

Helper hook for registering a single component. Used in components that want to register just one component, providing a simple way to register components with useEffect.

```typescript
import { useRegisterGenerativeComponent } from '@/lib/generative-ui';

function ProductRegistry() {
  useRegisterGenerativeComponent({
    toolId: 'getProductInfo',
    LoadingComponent: ProductLoading,
    SuccessComponent: ProductCard,
    ErrorComponent: ProductError
  });

  return null;
}
```

#### 5. **GenerativeUIRenderer** (`renderer.tsx`)

Component that renders components based on the tool's state. Used in the message system to render tools, encapsulating the logic for rendering generative components.

```typescript
import { GenerativeUIRenderer } from '@/lib/generative-ui';

function MessageRenderer({ toolPart }) {
  return (
    <GenerativeUIRenderer
      toolId={toolPart.toolId}
      state={toolPart.state}
      input={toolPart.input}
      output={toolPart.output}
      error={toolPart.error}
      toolCallId={toolPart.toolCallId}
    />
  );
}
```

### TypeScript Types

#### **GenerativeUIComponent<TInput, TOutput>**

Configuration for a generative component.

**Structure:**

```typescript
interface GenerativeUIComponent<TInput = any, TOutput = any> {
  toolId: string; // Unique tool ID
  LoadingComponent?: React.ComponentType<{ input?: TInput }>;
  SuccessComponent: React.ComponentType<{ output: TOutput; input?: TInput }>;
  ErrorComponent?: React.ComponentType<{ error: string; input?: TInput }>;
}
```

#### **ToolState**

Possible states of a tool.

**Values:**

- `'input-streaming'` - Tool is receiving input
- `'input-available'` - Tool has input available
- `'output-available'` - Tool has output available
- `'output-error'` - Tool encountered an error

#### **GenerativeUIRendererProps**

Props for the renderer component.

```typescript
interface GenerativeUIRendererProps {
  toolId: string; // Tool ID
  state: ToolState; // Current state
  input?: any; // Tool input
  output?: any; // Tool output
  error?: string; // Error if exists
  toolCallId: string; // Unique call ID
}
```

## 🚀 Implementation Guide

### Step 1: Configure the Provider

**Location:** At the highest level of your application
**Purpose:** Provide context to the entire application

```typescript
// app/layout.tsx, _app.tsx, or any root component
import { GenerativeUIProvider } from '@/lib/generative-ui';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <GenerativeUIProvider>{children}</GenerativeUIProvider>
      </body>
    </html>
  );
}
```

### Step 2: Create the Tool

**Location:** `lib/ai/tools/` or any tools folder
**Purpose:** Define the tool's logic

```typescript
// lib/ai/tools/get-product-info.ts
import { tool } from 'ai';
import { z } from 'zod';

export const getProductInfo = tool({
  description: 'Get detailed product information',
  inputSchema: z.object({
    productId: z.string()
  }),
  execute: async ({ productId }) => {
    // Tool logic
    const product = await fetchProduct(productId);
    return { product, timestamp: new Date().toISOString() };
  }
});
```

### Step 3: Create UI Components

**Location:** `components/` or any components folder
**Purpose:** Define how each tool state looks

```typescript
// components/product-card.tsx
import React from 'react';

// Loading component
export const ProductCardLoading: React.FC<{
  input?: { productId: string };
}> = ({ input }) => (
  <div className='animate-pulse'>
    <div className='h-4 bg-gray-200 rounded w-3/4 mb-2' />
    <div className='h-3 bg-gray-200 rounded w-1/2' />
    <p>Loading product {input?.productId}...</p>
  </div>
);

// Success component
export const ProductCard: React.FC<{
  output: { product: Product; timestamp: string };
  input?: { productId: string };
}> = ({ output, input }) => (
  <div className='product-card'>
    <h3>{output.product.name}</h3>
    <p>${output.product.price}</p>
    {/* More UI... */}
  </div>
);

// Error component
export const ProductCardError: React.FC<{
  error: string;
  input?: { productId: string };
}> = ({ error, input }) => (
  <div className='error'>
    <p>Error loading product: {error}</p>
  </div>
);
```

### Step 4: Register the Component

**Location:** In the main chat component or where messages are handled
**Purpose:** Connect the tool with its UI components

```typescript
// components/chat.tsx or any main component
import { useGenerativeUI } from '@/lib/generative-ui';
import {
  ProductCard,
  ProductCardLoading,
  ProductCardError
} from './product-card';

export function Chat() {
  const { registerComponent } = useGenerativeUI();

  // Register the component
  registerComponent({
    toolId: 'getProductInfo',
    LoadingComponent: ProductCardLoading,
    SuccessComponent: ProductCard,
    ErrorComponent: ProductCardError
  });

  // ... rest of component
}
```

### Step 5: Integrate in Message System

**Location:** In the component that renders messages
**Purpose:** Automatically render components when the tool executes

```typescript
// components/message.tsx or any message component
import { useRenderGenerativeUI } from '@/lib/generative-ui';

export function Message({ message }) {
  const renderGenerativeUI = useRenderGenerativeUI();

  return (
    <div>
      {message.parts?.map((part, index) => {
        // Detect if it's a tool
        if (part.type.startsWith('tool-')) {
          const toolId = part.type.replace('tool-', '');
          const { toolCallId, state } = part;
          const input = 'input' in part ? part.input : undefined;
          const output = 'output' in part ? part.output : undefined;
          const error = 'errorText' in part ? part.errorText : undefined;

          const renderedComponent = renderGenerativeUI({
            toolId,
            state,
            input,
            output,
            error,
            toolCallId
          });

          if (renderedComponent) {
            return <div key={toolCallId}>{renderedComponent}</div>;
          }
        }

        // Render other content types...
        return null;
      })}
    </div>
  );
}
```

### Step 6: Configure Tool in API

**Location:** In the API route that handles chat
**Purpose:** Make the tool available to the model

```typescript
// app/api/chat/route.ts
import { getProductInfo } from '@/lib/ai/tools/get-product-info';

export async function POST(request: Request) {
  const result = streamText({
    model: openai('gpt-4o'),
    messages: convertToModelMessages(messages),
    tools: {
      getProductInfo // Add tool here
      // ... other tools
    }
  });

  return result.toUIMessageStreamResponse();
}
```

## 🎨 Design Patterns

### 1. **Centralized Registration**

Register all components in one place for better maintainability.

```typescript
// components/generative-ui-registry.tsx
import { useGenerativeUI } from '@/lib/generative-ui';

export function GenerativeUIRegistry() {
  const { registerComponent } = useGenerativeUI();

  // Register all components here
  registerComponent(productComponent);
  registerComponent(weatherComponent);
  registerComponent(stockComponent);

  return null;
}
```

### 2. **Reusable Components**

Create components that can be reused in different contexts.

```typescript
// components/ui/skeleton-loader.tsx
export const SkeletonLoader: React.FC<{ input?: any }> = ({ input }) => (
  <div className='animate-pulse'>
    <div className='h-4 bg-gray-200 rounded w-3/4 mb-2' />
    <div className='h-3 bg-gray-200 rounded w-1/2' />
  </div>
);

// Use in multiple tools
registerComponent({
  toolId: 'getProductInfo',
  LoadingComponent: SkeletonLoader
  // ...
});
```

### 3. **Consistent Error Handling**

Create error components that are consistent throughout the application.

```typescript
// components/ui/error-display.tsx
export const ErrorDisplay: React.FC<{
  error: string;
  input?: any;
  toolName: string;
}> = ({ error, input, toolName }) => (
  <div className='error-container'>
    <div className='error-icon'>⚠️</div>
    <div className='error-content'>
      <h4>Error in {toolName}</h4>
      <p>{error}</p>
      {input && <p>Input: {JSON.stringify(input)}</p>}
    </div>
  </div>
);
```

## 🔧 Advanced Configuration

### State Persistence

The abstraction uses `useRef` to maintain persistent registration across re-renders:

```typescript
// Registration persists even if provider reinitializes
const registryRef = useRef<GenerativeUIRegistryType>({});
```

### Strong Typing

All components are fully typed:

```typescript
// Specific typing for each tool
interface ProductInput {
  productId: string;
}

interface ProductOutput {
  product: Product;
  timestamp: string;
}

registerComponent<ProductInput, ProductOutput>({
  toolId: 'getProductInfo',
  // Components will have correct typing
  LoadingComponent: (props: { input?: ProductInput }) => <div />,
  SuccessComponent: (props: {
    output: ProductOutput;
    input?: ProductInput;
  }) => <div />,
  ErrorComponent: (props: { error: string; input?: ProductInput }) => <div />
});
```

## 📚 Complete Examples

See `examples.md` for detailed examples of:

- Weather Widget
- Stock Chart
- Calendar Event
- Product Card (implemented)

## 🎯 Benefits of this Abstraction

1. **Separation of concerns**: UI separated from tool logic
2. **Reusability**: Components reusable in different contexts
3. **Maintainability**: Easy to maintain and extend
4. **User experience**: Immediate visual feedback during execution
5. **Consistency**: Uniform experience across the application
6. **Scalability**: Easy to add new tools and components
7. **Type safety**: Complete TypeScript for better DX
8. **Compatibility**: Works with any Vercel AI SDK implementation

## 🚀 Project Status

✅ **Production ready** - The abstraction is fully functional, documented, and tested.

---

**Need help?** Check the examples in `examples.md` or consult `CHANGELOG.md` for the latest updates.
