import { StrictMode } from "react";
import { createRoot } from 'react-dom/client';
import { Provider } from "react-redux";
import store from "./store";
import App from "./App";

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Elemento 'root' não encontrado no DOM.");
}

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
)