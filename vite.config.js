import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    root: "client", // Ensures Vite runs from /client
    plugins: [react()],
    // build: { sourcemap: true },
    server: {
        port: 5173,
    },
});
