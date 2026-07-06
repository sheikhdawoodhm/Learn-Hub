import { Auth0Provider } from '@auth0/auth0-react'
import { ThemeProvider } from './context/themeContext.tsx'
import ReactDOM from "react-dom/client"
import './index.css'
import App from './App.tsx'

import { BrowserRouter } from "react-router-dom"
import { Provider } from 'react-redux'
import { store } from './redux/store/store.ts'

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
  <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
  </BrowserRouter>
  </Provider>
)
