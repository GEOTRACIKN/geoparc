import React from 'react';
import ReactDOM from 'react-dom/client';
import "bootstrap/dist/css/bootstrap.min.css"
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const nativeFetch = window.fetch.bind(window);
window.fetch = (input, init = {}) => {
  const requestUrl = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
  if (backendUrl && requestUrl.startsWith(backendUrl) && init.credentials === undefined) {
    return nativeFetch(input, { ...init, credentials: "include" });
  }
  return nativeFetch(input, init);
};

 ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
<BrowserRouter basename="/">
     <App />
    </BrowserRouter>
   
  </React.StrictMode>
)


