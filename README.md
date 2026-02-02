# SWR DevTools

A lightweight, developer-friendly debugging tool for [SWR](https://swr.vercel.app/) (stale-while-revalidate) data fetching in React applications. It provides a visual interface to inspect cache data, monitor mutations, and trigger revalidations.

![SWR DevTools](https://github.com/phamthanhhang208/useSWRdevtool/assets/placeholder.png)

## Features

-   🔍 **Cache Inspection**: View all cached SWR keys and their current data in real-time.
-   🛠 **Mutation Monitoring**: Track in-flight mutations and see their status (requires middleware).
-   🖱 **Draggable Interface**: A floating button that can be moved anywhere on the screen to avoid obstructing your UI.
-   ⚡ **Lightweight**: Optimized and minified for minimal impact on your bundle size.
-   🎨 **Dark Mode**: sleek, dark-themed UI that fits into modern development environments.

## Installation

```bash
npm install swr-devtools
# or
yarn add swr-devtools
# or
pnpm add swr-devtools
```

## Usage

### Basic Usage

Simply render the `SWRDevTools` component anywhere in your app (usually at the root level).

```tsx
import { SWRDevTools } from 'swr-devtools';

function App() {
  return (
    <>
      <YourAppContent />
      <SWRDevTools />
    </>
  );
}
```

### Advanced Usage (With Mutation Tracking)

To enable mutation tracking, you need to use the `swrDevToolsMiddleware` in your global SWR configuration.

```tsx
import { SWRConfig } from 'swr';
import { SWRDevTools, swrDevToolsMiddleware } from 'swr-devtools';

function App() {
  return (
    <SWRConfig value={{ use: [swrDevToolsMiddleware] }}>
      <YourAppContent />
      <SWRDevTools />
    </SWRConfig>
  );
}
```

## Development

1.  Clone the repository:
    ```bash
    git clone https://github.com/phamthanhhang208/useSWRdevtool.git
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the example app:
    ```bash
    cd example
    npm install
    npm run dev
    ```

## License

MIT
