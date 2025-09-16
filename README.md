# Google Calendar Assistant - Front10 Generative UI Demo

<p align="center">
  <img alt="Google Calendar Assistant Demo" src="app/(chat)/opengraph-image.png" width="600">
  <h1 align="center">Google Calendar Assistant</h1>
</p>

<p align="center">
    An intelligent Google Calendar management assistant built with Next.js, AI SDK, and the <strong>@front10/generative-ui</strong> package. This demo showcases how to create dynamic, interactive calendar experiences with automatic UI component rendering based on AI tool execution.
</p>

<p align="center">
  <a href="package/front10-generative-ui/README.md"><strong>Package Documentation</strong></a> ·
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#demo-overview"><strong>Demo Overview</strong></a> ·
  <a href="#setup"><strong>Setup</strong></a> ·
  <a href="#running-locally"><strong>Running locally</strong></a>
</p>
<br/>

## 🎯 What is @front10/generative-ui?

**@front10/generative-ui** is a complete abstraction for creating generative UI components that automatically display when specific tools are executed in chat. It's designed to work with **Vercel AI SDK 5.0** and provides a simple, scalable, and reusable way to create dynamic user experiences with interactive feedback capabilities.

This Google Calendar Assistant demo showcases the package's capabilities through real-world calendar management scenarios.

## 🚀 Features

### Core Technologies

- **[Next.js](https://nextjs.org)** App Router
  - Advanced routing for seamless navigation and performance
  - React Server Components (RSCs) and Server Actions for server-side rendering
- **[AI SDK](https://sdk.vercel.ai/docs)**
  - Unified API for generating text, structured objects, and tool calls with LLMs
  - Hooks for building dynamic chat and generative user interfaces
  - Supports OpenAI (default), Anthropic, Cohere, and other model providers
- **[@front10/generative-ui](package/front10-generative-ui/README.md)**
  - **Automatic UI Rendering**: Components automatically display when tools are executed
  - **Interactive Feedback**: Components can send actions back to the LLM
  - **Multiple Actions**: Single components can trigger multiple different actions
  - **State Management**: Handles loading, success, and error states automatically
  - **Type Safety**: Complete TypeScript support for better developer experience

### Google Calendar Integration

- **Google Calendar API Integration**
  - Full CRUD operations (Create, Read, Update, Delete events)
  - Calendar list management and selection
  - Free/Busy availability checking across multiple calendars
- **Smart Calendar Views**
  - Adaptive calendar views (Month, Week, Day, List)
  - Time range detection for optimal view selection
  - Real-time event filtering and display
- **Advanced Features**
  - Dark mode support across all components
  - Event conflict detection and resolution
  - Meeting time optimization using FreeBusy API
  - Interactive event management with confirmation flows

### UI/UX Features

- **[shadcn/ui](https://ui.shadcn.com)** with [Tailwind CSS](https://tailwindcss.com)
- **Dark Mode Support** - All components adapt to light/dark themes
- **Responsive Design** - Works seamlessly on desktop and mobile
- **Accessibility** - Full keyboard navigation and screen reader support
- **Real-time Updates** - Live calendar synchronization

## 🎨 Demo Overview

This Google Calendar Assistant demonstrates how **@front10/generative-ui** enables the creation of sophisticated, interactive calendar management experiences through AI-driven conversations.

### How It Works

1. **User Input**: Users interact with the assistant through natural language
2. **AI Processing**: The LLM processes requests and determines appropriate tools to execute
3. **Component Rendering**: The package automatically renders the appropriate UI components
4. **User Interaction**: Users can interact with rendered components (buttons, forms, etc.)
5. **Action Feedback**: User actions are sent back to the LLM for further processing

### Google Calendar Tools & Components

#### 📅 Calendar Management Tools

- **`getGoogleCalendarList`** - Retrieve available calendars
- **`getGoogleCalendarEvents`** - Fetch events with filtering and date ranges
- **`createGoogleCalendarEvent`** - Create new events with full details
- **`updateGoogleCalendarEvent`** - Modify existing events
- **`deleteGoogleCalendarEvent`** - Remove events with confirmation
- **`getGoogleCalendarFreeBusy`** - Check availability across multiple calendars

#### 🎨 Interactive Components

**GoogleCalendarComponent**

- **Tool**: `getGoogleCalendarEvents`
- **Features**:
  - Adaptive views (Month/Week/Day/List) based on time range
  - Interactive event management
  - Real-time calendar navigation
  - Event creation and modification
- **Actions**: View events, create events, edit events, delete events, change views

**CalendarListComponent**

- **Tool**: `getGoogleCalendarList`
- **Features**:
  - Calendar selection and management
  - Primary calendar highlighting
  - Access role display
- **Actions**: Select calendar, view events, manage calendar settings

**FreeBusyComponent**

- **Tool**: `getGoogleCalendarFreeBusy`
- **Features**:
  - Availability timeline visualization
  - Best meeting time suggestions
  - Multi-calendar availability checking
  - Interactive time slot selection
- **Actions**: Refresh availability, create events from optimal times

**GoogleConnectButton & GoogleStatusIndicator**

- **Features**:
  - Google OAuth integration
  - Connection status display
  - Authentication flow management
- **Actions**: Connect Google account, disconnect, retry connection

### Component Registration with @front10/generative-ui

The demo showcases how to register components with the generative UI system:

```typescript
// In chat.tsx
const { registerComponent } = useGenerativeUI();

// Register Google Calendar components
registerComponent('getGoogleCalendarEvents', {
  loading: GoogleCalendarLoading,
  component: GoogleCalendarComponent,
  error: GoogleCalendarError
});

registerComponent('getGoogleCalendarList', {
  loading: CalendarListLoading,
  component: CalendarListComponent,
  error: CalendarListError
});

registerComponent('getGoogleCalendarFreeBusy', {
  loading: FreeBusyLoading,
  component: FreeBusyComponent,
  error: FreeBusyError
});
```

### Action Handling

Components communicate back to the LLM through the `useGenerativeActions` hook:

```typescript
// Example: Calendar view change action
const handleViewModeChange = (newViewMode: CalendarViewType) => {
  onAction?.({
    action: 'get_events_for_view',
    data: {
      viewMode: newViewMode,
      timeMin: getTimeRangeFromView(newViewMode, currentDate).start,
      timeMax: getTimeRangeFromView(newViewMode, currentDate).end
    }
  });
};
```

## 🤖 Model Providers

This demo is configured with **OpenAI** as the default chat model. However, with the [AI SDK](https://sdk.vercel.ai/docs), you can easily switch LLM providers to [Anthropic](https://anthropic.com), [Cohere](https://cohere.com/), [xAI](https://x.ai), and [many more](https://sdk.vercel.ai/providers/ai-sdk-providers) with just a few lines of code.

## 💻 Setup

### Prerequisites

- Node.js 18+ and pnpm
- OpenAI API key
- Google Cloud Project with Calendar API enabled
- Google OAuth 2.0 credentials

### Google Calendar API Setup

1. **Create a Google Cloud Project**

   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Enable Google Calendar API**

   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Calendar API" and enable it

3. **Create OAuth 2.0 Credentials**

   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Configure authorized redirect URIs:
     - Development: `http://localhost:3000/api/auth/callback/google`
     - Production: `https://your-domain.com/api/auth/callback/google`

4. **Download Credentials**
   - Download the JSON file and save it as `client_secret.json` in the project root

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/front-10-google-calendar-assistant.git
cd front-10-google-calendar-assistant
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Environment setup**

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your configuration
OPENAI_API_KEY=your_openai_api_key_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
```

4. **Start the development server**

```bash
pnpm dev
```

Your Google Calendar Assistant should now be running on [localhost:3000](http://localhost:3000).

### Development Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint

# Run type checking
pnpm type-check
```

## 🧪 Testing the Assistant

Try these interactions to explore the capabilities:

### Basic Calendar Operations

```
Show me my calendar events for today
What meetings do I have this week?
Create a meeting for tomorrow at 2 PM
```

### Advanced Features

```
Check my availability for next Tuesday
Find the best time for a team meeting this week
Show me events from my work calendar
```

### Interactive Components

- Click on calendar events to view details
- Use view mode toggles (Month/Week/Day)
- Select different calendars from the list
- Create events from optimal time slots in FreeBusy view

### Action Handling Examples

- Change calendar views and observe automatic data refresh
- Create events through interactive forms
- Delete events with confirmation dialogs
- Switch between different Google calendars

## 📚 Package Documentation

For detailed information about the @front10/generative-ui package, including:

- Complete API reference
- Component registration examples
- Action handling patterns
- TypeScript interfaces
- Best practices

Visit the [package documentation](package/front10-generative-ui/README.md).

## 🏗️ Architecture

### Component Structure

```
components/
├── google-calendar/
│   ├── google-calendar-component.tsx    # Main calendar view
│   ├── calendar-list-component.tsx     # Calendar selection
│   ├── freebusy-component.tsx          # Availability checking
│   ├── welcome-message.tsx             # Welcome screen
│   └── active-calendar-indicator.tsx   # Current calendar display
├── google-connect-button.tsx           # Google OAuth button
├── google-status-indicator.tsx         # Connection status
└── google-auth-handler.tsx             # Auth flow management
```

### Tool Integration

```
lib/ai/tools/google-calendar/
├── client.ts              # Google Calendar API client
├── types.ts               # Zod schemas and TypeScript types
├── get-events.ts          # Event retrieval tool
├── create-event.ts        # Event creation tool
├── update-event.ts        # Event modification tool
├── delete-event.ts        # Event deletion tool
├── get-calendar-list.ts   # Calendar list tool
└── get-freebusy.ts        # FreeBusy availability tool
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-new-feature`)
3. Commit your changes (`git commit -m 'Add some amazing new feature'`)
4. Push to the branch (`git push origin feature/amazing-new-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Need help?** Check the [package documentation](package/front10-generative-ui/README.md) or open an issue on GitHub.
