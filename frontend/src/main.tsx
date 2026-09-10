import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LanguageProvider } from './LanguageContext.tsx'
import { DiceRendererProvider } from "@lambersond/3d-dice-react";
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
     <DiceRendererProvider>
      <App />
    </DiceRendererProvider>
    </LanguageProvider>
  </StrictMode>,
)
