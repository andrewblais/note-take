import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite config for React project rooted in /client:
export default defineConfig({
    root: "client",
    plugins: [react()],
    server: {
        port: 5173,
    },
});
