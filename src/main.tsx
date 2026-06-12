import { Auth0Provider } from '@auth0/auth0-react'
import { ThemeProvider } from './context/ThemeContext.tsx'
import ReactDOM from "react-dom/client"
import './index.css'
import App from './App.tsx'

import { BrowserRouter } from "react-router-dom"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Auth0Provider
      domain="dev-5o0sme3htg3yb38n.us.auth0.com"
      clientId="RArUiIqDIvke1w5Cdznk3CazFPKa3SIw"
      authorizationParams={{ redirect_uri: window.location.origin }}
    >
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Auth0Provider>  
  </BrowserRouter>
)
