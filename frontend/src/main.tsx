import { Auth0Provider } from '@auth0/auth0-react'
import { ThemeProvider } from './context/themeContext.tsx'
import { NotificationProvider } from './context/NotificationContext.tsx'
import { ModalProvider } from './context/ModalContext.tsx'
import ReactDOM from "react-dom/client"
import './index.css'
import App from './App.tsx'
import { Toaster } from 'react-hot-toast'

import { BrowserRouter } from "react-router-dom"
import { Provider } from 'react-redux'
import { store } from './redux/store/store.ts'

const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN || "dev-5o0sme3htg3yb38n.us.auth0.com";
const auth0ClientId = import.meta.env.VITE_AUTH0_CLIENT_ID || "RArUiIqDIvke1w5Cdznk3CazFPKa3SIw";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <BrowserRouter>
      <Auth0Provider
        domain={auth0Domain}
        clientId={auth0ClientId}
        authorizationParams={{ redirect_uri: window.location.origin }}
      >
        <ThemeProvider>
          <NotificationProvider>
            <ModalProvider>
              <Toaster position="top-right" />
              <App />
            </ModalProvider>
          </NotificationProvider>
        </ThemeProvider>
      </Auth0Provider>
    </BrowserRouter>
  </Provider>
)
