# SWR DevTools

A lightweight, developer-friendly debugging tool for [SWR](https://swr.vercel.app/) in React applications. Inspect cache data, monitor query status, track mutations, and trigger revalidations — all from a floating panel in your app.

View [DEMO](https://use-swr-devtools-community-demo.vercel.app/) here

## Features

- **Cache Inspection** — View all active SWR keys and their cached data in real-time
- **Query Status** — See accurate per-query states: `LOADING`, `REVALIDATING`, `FRESH`, `ERROR`, or `IDLE`
- **Error Display** — Errors are surfaced inline with the full error message
- **Mutation Monitoring** — Track in-flight mutations with status history (requires middleware)
- **Refetch / Invalidate** — Trigger revalidation for any query from the panel
- **Remove from Cache** — Delete individual cache entries on demand
- **Draggable Button** — Move the floating trigger anywhere on screen
- **Resizable Panel** — Drag to resize both the panel height and the sidebar width
- **Dark UI** — Minimal dark-themed interface that stays out of your way

## Installation

```bash
npm install swr-devtools-community
# or
yarn add swr-devtools-community
# or
pnpm add swr-devtools-community
```

## Usage

### Basic

Render `<SWRDevTools />` anywhere in your app — typically at the root level, outside your main content.

```tsx
import { SWRDevTools } from 'swr-devtools-community';

function App() {
  return (
    <>
      <YourAppContent />
      {process.env.NODE_ENV === 'development' && <SWRDevTools />}
    </>
  );
}
```

### With Mutation Tracking

Add `swrDevToolsMiddleware` to your `SWRConfig` to enable the Mutations tab.

```tsx
import { SWRConfig } from 'swr';
import { SWRDevTools, swrDevToolsMiddleware } from 'swr-devtools-community';

function App() {
  return (
    <SWRConfig value={{ use: [swrDevToolsMiddleware] }}>
      <YourAppContent />
      {process.env.NODE_ENV === 'development' && <SWRDevTools />}
    </SWRConfig>
  );
}
```

## Query Status Reference

| Status | Color | Meaning |
|---|---|---|
| `LOADING` | Blue | First fetch in progress, no cached data yet |
| `REVALIDATING` | Purple | Has cached data, re-fetching in background |
| `FRESH` | Green | Data loaded, not currently fetching |
| `ERROR` | Red | Last fetch failed |
| `IDLE` | Gray | No data, not fetching |

## Development

```bash
git clone https://github.com/phamthanhhang208/useSWRdevtool.git
cd useSWRdevtool
npm install
npm run build
```

## License

MIT
