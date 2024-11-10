import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary} from "react-error-boundary";
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <ErrorBoundary fallback={<div>Something went wrong ):</div>}>
    <App />
  </ErrorBoundary>,
)
