import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './jani.jsx'
import '@fontsource/inter'; 
import { BrowserRouter } from 'react-router-dom'
import { AppContextProvider } from './Context/AppContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
<AppContextProvider>
     <App />
     </AppContextProvider>
   
    </BrowserRouter>
    
  </StrictMode>,
)
