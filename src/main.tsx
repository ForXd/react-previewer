import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ensureCrossOriginIsolation } from './demo/ensureCrossOriginIsolation.ts'

void ensureCrossOriginIsolation();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
