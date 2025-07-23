import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Root from "./Root.tsx";
import { CapacitorUpdater } from '@capgo/capacitor-updater';
CapacitorUpdater.notifyAppReady();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
