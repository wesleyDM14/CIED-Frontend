import React from "react";
import ReactDOM from 'react-dom/client';
import { Provider } from "react-redux";
import store from "./store";
import App from "./App";

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Elemento 'root' não encontrado no DOM.");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)