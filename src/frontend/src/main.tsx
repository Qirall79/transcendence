import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import Layout from "./pages/Layout.tsx";
import { NotificationProvider } from "./contexts/NotificationContext.tsx";
import { RequestsProvider } from "./contexts/RequestsContext.tsx";
import { FriendsProvider } from "./contexts/FriendsContext.tsx";
import { ConversationsProvider } from "./contexts/ConversationsContext.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter
    future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    }}
  >
    <Layout>
      <AuthProvider>
        <RequestsProvider>
          <FriendsProvider>
            <ConversationsProvider>
              <NotificationProvider>
                <App />
              </NotificationProvider>
            </ConversationsProvider>
          </FriendsProvider>
        </RequestsProvider>
      </AuthProvider>
    </Layout>
  </BrowserRouter>
);
