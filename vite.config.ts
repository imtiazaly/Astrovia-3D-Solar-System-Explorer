import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/Astrovia-3D-Solar-System-Explorer/",
  plugins: [react(), tailwindcss()],
});