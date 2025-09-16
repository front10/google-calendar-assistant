# @front10/generative-ui

A complete abstraction for creating generative UI components that automatically display when specific tools are executed in chat. Designed to work with **Vercel AI SDK 5.0** and provide a simple, scalable, and reusable way to create dynamic user experiences with interactive feedback capabilities.

## 🚀 Installation

```bash
npm install @front10/generative-ui
# or
yarn add @front10/generative-ui
# or
pnpm add @front10/generative-ui
```

## 📦 What's Included

### Core Package

```typescript
import {
  GenerativeUIProvider,
  useGenerativeUI,
  GenerativeUIRegistry,
  useRegisterGenerativeComponent,
  GenerativeUIRenderer,
  useRenderGenerativeUI,
  UserAction
} from '@front10/generative-ui';
```

### Examples

```typescript
import {
  productCardExample,
  imageGalleryExample,
  sentimentAnalyzerExample,
  examples
} from '@front10/generative-ui/examples';
```

## 🎯 Quick Start

### 1. Setup Provider

```tsx
// app/layout.tsx
import { GenerativeUIProvider } from '@front10/generative-ui';

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

### 2. Register Components with Action Handlers

```tsx
// components/chat.tsx
import { useGenerativeUI } from '@front10/generative-ui';
import { useGenerativeActions } from '@/hooks/use-generative-actions';
import { productCardExample } from '@front10/generative-ui/examples';

export function Chat() {
  const { registerComponent } = useGenerativeUI();
  const { handleUserAction } = useGenerativeActions();

  // Register components with individual action handlers
  React.useLayoutEffect(() => {
    registerComponent({
      toolId: 'getProductInfo',
      LoadingComponent: ProductCardLoading,
      SuccessComponent: ProductCard,
      ErrorComponent: ProductCardError,
      onUserAction: action => {
        console.log('Product Card action:', action);
        handleUserAction(action);
      }
    });

    registerComponent({
      toolId: 'searchImages',
      LoadingComponent: ImageGalleryLoading,
      SuccessComponent: ImageGallery,
      ErrorComponent: ImageGalleryError,
      onUserAction: action => {
        console.log('Image Gallery action:', action);
        handleUserAction(action);
      }
    });
  }, [registerComponent, handleUserAction]);

  return <div>Chat Component</div>;
}
```

### 3. Render in Messages

```tsx
// components/message.tsx
import { useRenderGenerativeUI } from '@front10/generative-ui';

export function Message({ message }) {
  const renderGenerativeUI = useRenderGenerativeUI();

  return (
    <div>
      {message.parts?.map((part, index) => {
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
        return null;
      })}
    </div>
  );
}
```

## 🎨 Interactive Examples

### Product Card with Multiple Actions

```tsx
import { useGenerativeActions } from '@/hooks/use-generative-actions';

export function Chat() {
  const { handleUserAction } = useGenerativeActions();

  registerComponent({
    toolId: 'getProductInfo',
    LoadingComponent: ProductCardLoading,
    SuccessComponent: ProductCard,
    ErrorComponent: ProductCardError,
    onUserAction: action => {
      console.log('Product action:', action);
      handleUserAction(action);
    }
  });

  // The component automatically receives onAction prop
  // and can trigger multiple actions:
  // - add_to_cart
  // - view_details
  // - add_to_wishlist
  // - share_product
}
```

### Calendar Events with Complex Interactions

```tsx
import { useGenerativeActions } from '@/hooks/use-generative-actions';

export function Chat() {
  const { handleUserAction } = useGenerativeActions();

  registerComponent({
    toolId: 'getEvents',
    LoadingComponent: CalendarLoading,
    SuccessComponent: CalendarComponent,
    ErrorComponent: CalendarError,
    onUserAction: action => {
      console.log('Calendar action:', action);
      handleUserAction(action);
    }
  });

  // The calendar component supports multiple actions:
  // - create_event
  // - edit_event
  // - delete_event
  // - confirm_event
  // - cancel_event
  // - view_event_details
  // - share_event
}
```

## 🔧 API Reference

### Core Components

#### `GenerativeUIProvider`

The main provider that handles component registration and rendering with interactive feedback.

```tsx
<GenerativeUIProvider onUserAction={handleUserAction}>
  {children}
</GenerativeUIProvider>
```

#### `useGenerativeUI`

Hook to access the Generative UI context.

```tsx
const { registerComponent, renderComponent, onUserAction } = useGenerativeUI();
```

#### `GenerativeUIRegistry`

Component for automatically registering multiple components.

```tsx
<GenerativeUIRegistry components={[component1, component2]} />
```

#### `useRegisterGenerativeComponent`

Helper hook for registering a single component.

```tsx
useRegisterGenerativeComponent({
  toolId: 'myTool',
  LoadingComponent: MyLoading,
  SuccessComponent: MySuccess,
  ErrorComponent: MyError
});
```

#### `GenerativeUIRenderer`

Component that renders components based on the tool's state.

```tsx
<GenerativeUIRenderer
  toolId='myTool'
  state='output-available'
  input={input}
  output={output}
  error={error}
  toolCallId='call-123'
/>
```

#### `useRenderGenerativeUI`

Hook helper for rendering components from the message system.

```tsx
const renderGenerativeUI = useRenderGenerativeUI();
```

### Types

#### `UserAction`

```tsx
interface UserAction {
  toolId: string; // Identificador del tool/componente
  toolCallId?: string; // ID específico de la llamada al tool
  action: string; // Identificador de la acción (ej: "accept", "cancel", "select")
  data?: any; // Datos adicionales de la acción
  context?: any; // Contexto adicional
}
```

#### `GenerativeUIComponent<TInput, TOutput>`

```tsx
interface GenerativeUIComponent<TInput = any, TOutput = any> {
  toolId: string;
  LoadingComponent?: React.ComponentType<{
    input?: TInput;
    onAction?: (action: Omit<UserAction, 'toolId'>) => void;
  }>;
  SuccessComponent: React.ComponentType<{
    output: TOutput;
    input?: TInput;
    onAction?: (action: Omit<UserAction, 'toolId'>) => void;
  }>;
  ErrorComponent?: React.ComponentType<{
    error: string;
    input?: TInput;
    onAction?: (action: Omit<UserAction, 'toolId'>) => void;
  }>;
}
```

#### `ToolState`

```tsx
type ToolState =
  | 'input-streaming'
  | 'input-available'
  | 'output-available'
  | 'output-error';
```

#### `GenerativeUIRendererProps`

```tsx
interface GenerativeUIRendererProps {
  toolId: string;
  state: ToolState;
  input?: any;
  output?: any;
  error?: string;
  toolCallId: string;
}
```

## 🎯 Interactive Feedback Examples

### Using the Built-in Hook

Create a custom hook to handle user actions:

```tsx
// hooks/use-generative-actions.ts
'use client';

import { useChat } from '@ai-sdk/react';

export interface UserAction {
  toolId: string;
  toolCallId?: string;
  action: string;
  data?: any;
  context?: any;
}

export function useGenerativeActions() {
  const { sendMessage } = useChat();

  const handleUserAction = (action: UserAction) => {
    // Create descriptive messages based on actions
    let content = '';

    switch (action.action) {
      case 'add_to_cart':
        content = `I want to add ${
          action.data?.productName || 'this product'
        } to my cart`;
        break;
      case 'view_details':
        content = `Show me more details about ${
          action.data?.productName || 'this product'
        }`;
        break;
      default:
        content = `I performed the action: ${action.action}`;
    }

    // Send to LLM using sendMessage (Vercel AI SDK v5)
    sendMessage({
      role: 'user',
      parts: [
        {
          type: 'text',
          text: content
        }
      ]
    });
  };

  return { handleUserAction };
}
```

### Creating Interactive Components

```tsx
// Example: Product Card with multiple actions
export const ProductCard: React.FC<ProductCardProps> = ({
  output,
  onAction
}) => {
  const { product } = output;

  const handleAddToCart = () => {
    onAction?.({
      action: 'add_to_cart',
      data: {
        productId: product.id,
        productName: product.name,
        price: product.price
      },
      context: { timestamp: Date.now() }
    });
  };

  const handleViewDetails = () => {
    onAction?.({
      action: 'view_details',
      data: { productId: product.id }
    });
  };

  return (
    <div className='product-card'>
      <h3>{product.name}</h3>
      <p>{product.price}</p>
      <div className='actions'>
        <button onClick={handleAddToCart}>Add to Cart</button>
        <button onClick={handleViewDetails}>View Details</button>
      </div>
    </div>
  );
};
```

### Handling Actions in Your App (Vercel AI SDK v5)

```tsx
// In your main chat component
const { sendMessage } = useChat();

const handleUserAction = (action: UserAction) => {
  // Create descriptive messages based on actions
  let content = '';

  switch (action.action) {
    case 'add_to_cart':
      content = `I want to add ${
        action.data?.productName || 'this product'
      } to my cart`;
      break;
    case 'view_details':
      content = `Show me more details about ${
        action.data?.productName || 'this product'
      }`;
      break;
    default:
      content = `I performed the action: ${action.action}`;
  }

  // Send to LLM using sendMessage (Vercel AI SDK v5)
  sendMessage({
    role: 'user',
    parts: [
      {
        type: 'text',
        text: content
      }
    ]
  });
};
```

### Handling Actions in Your App (Vercel AI SDK v4 and earlier)

```tsx
// For older versions of Vercel AI SDK
const { append } = useChat();

const handleUserAction = (action: UserAction) => {
  let content = '';

  switch (action.action) {
    case 'add_to_cart':
      content = `I want to add ${
        action.data?.productName || 'this product'
      } to my cart`;
      break;
    default:
      content = `I performed the action: ${action.action}`;
  }

  // Send to LLM using append (Vercel AI SDK v4 and earlier)
  append({
    role: 'user',
    content
  });
};
```

## 🎯 Benefits

1. **Separation of concerns**: UI separated from tool logic
2. **Reusability**: Components reusable in different contexts
3. **Maintainability**: Easy to maintain and extend
4. **User experience**: Immediate visual feedback during execution
5. **Consistency**: Uniform experience across the application
6. **Scalability**: Easy to add new tools and components
7. **Type safety**: Complete TypeScript for better DX
8. **Compatibility**: Works with any Vercel AI SDK implementation
9. **Interactive feedback**: Components can send actions back to the LLM
10. **Multiple actions**: Single components can trigger multiple different actions
11. **Per-component handlers**: Each component can have its own action handler

## 🚀 Project Status

✅ **Production ready** - The abstraction is fully functional, documented, and tested with interactive feedback capabilities.

## 📚 Examples

See the `examples/` directory for complete working examples:

- **Product Card**: Product information display with cart, wishlist, and sharing actions
- **Image Gallery**: Image search with interactive gallery and selection actions
- **Sentiment Analyzer**: Text sentiment analysis with visualizations and feedback actions
- **Calendar Events**: Event management with create, edit, delete, and confirmation actions

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Need help?** Check the examples in the `examples/` directory or open an issue on GitHub.
