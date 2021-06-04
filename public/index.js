import {
  LocationProvider,
  Router,
  Route,
  ErrorBoundary,
  hydrate,
  prerender as ssr,
} from "preact-iso";
import Home from "./pages/home/index.js";
import NotFound from "./pages/_404.js";

export function App() {
  return (
    <LocationProvider>
      <div class="app">
        <ErrorBoundary>
          <Router>
            <Route path="/" component={Home} />
            <Route default component={NotFound} />
          </Router>
        </ErrorBoundary>
      </div>
    </LocationProvider>
  );
}

hydrate(<App />);

export async function prerender(data) {
  return await ssr(<App {...data} />);
}
