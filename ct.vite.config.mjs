import { defineConfig } from "vite"; import react from "@vitejs/plugin-react"; import { viteSingleFile } from "vite-plugin-singlefile";
export default defineConfig({ root:"ct", plugins:[react(),viteSingleFile()], build:{ outDir:"../ctdist", emptyOutDir:true } });
