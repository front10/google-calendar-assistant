# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

- **Interactive Feedback System**: Components can now send user actions back to the LLM
- **UserAction Interface**: Standardized structure for user interactions with `toolId`, `toolCallId`, `action`, `data`, and `context`
- **Per-Component Action Handlers**: Each registered component can have its own `onUserAction` handler
- **Multiple Actions Support**: Single components can trigger multiple different actions (e.g., "accept" and "cancel" buttons)
- **Type-Safe Action System**: Complete TypeScript support for action handling

### Changed

- **Architecture Update**: Moved `onUserAction` from provider level to component registration level
- **Component Registration**: `registerComponent` now accepts an optional `onUserAction` handler
- **Provider Simplification**: `GenerativeUIProvider` no longer requires `onUserAction` prop
- **Action Injection**: `onAction` prop is automatically injected into all component states (Loading, Success, Error)

### Technical Details

- Updated `GenerativeUIComponent` interface to include optional `onUserAction` handler
- Modified `GenerativeUIProvider` to use component-specific action handlers
- Enhanced `createActionHandler` to route actions to the correct component handler
- Updated all examples to demonstrate per-component action handling

### Examples Enhanced

- **Product Card**: Now supports add to cart, view details, add to wishlist, and share actions
- **Calendar Events**: Enhanced with create, edit, delete, confirm, cancel, view details, and share actions
- **Error Handling**: Components can now handle retry and error reporting actions

## [1.0.0] - 2024-01-15

### Added

- Initial release of the Generative UI library
- Core abstraction for AI tool UI components
- Support for Vercel AI SDK 5.0
- TypeScript definitions and examples
- Product Card, Image Gallery, Sentiment Analyzer, and Calendar Events examples
