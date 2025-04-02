import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
    root: "client", // Ensures Vite runs from /client
    plugins: [react()],
    server: {
        port: 5173,
    },
});
