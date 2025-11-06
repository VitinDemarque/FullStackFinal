import React from "react"
import ReactDOM from "react-dom/client"
import { ThemeProvider } from "styled-components"
import App from "./App.tsx"
import { GlobalStyles } from "./styles/global"
import { theme } from "./styles/theme"
import "./index.css"
import "./styles/theme-variables.css"
import { GoogleOAuthProvider } from "@react-oauth/google"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <App />
      </ThemeProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);