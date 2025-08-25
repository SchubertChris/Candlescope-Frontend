import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc' // ✅ FUNKTIONIERT: Nach Installation des Plugins
import path from 'path' // ✅ FUNKTIONIERT: Nach Installation von @types/node

// https://vite.dev/config/
export default defineConfig({
 plugins: [react()], // ✅ KORRIGIERT: Plugin funktioniert nach Installation

 resolve: {
   alias: {
     '@': path.resolve(__dirname, './src'),
     '@components': path.resolve(__dirname, './src/Components'), // ✅ Großes C
     '@pages': path.resolve(__dirname, './src/Pages'),           // ✅ Großes P
     '@styles': path.resolve(__dirname, './src/Styles'),         // ✅ Großes S
     '@services': path.resolve(__dirname, './src/Services'),     // ✅ Großes S
     '@router': path.resolve(__dirname, './src/Router'),         // ✅ Großes R
     '@types': path.resolve(__dirname, './src/Types'),           // ✅ Großes T
     '@utils': path.resolve(__dirname, './src/Components/Utils'),// ✅ Großes C & U
     '@assets': path.resolve(__dirname, './src/assets'),
   }
 },

 css: {
   preprocessorOptions: {
     scss: {
       // ✅ MODERNE: Sass API verwenden
       api: 'modern-compiler',
       silenceDeprecations: ['import', 'mixed-decls']
     }
   }
 },

 // ✅ SERVER: Entwicklungsserver-Konfiguration
 server: {
   host: true,        // ⬅️ LAN-Zugriff erlauben
   port: 5173,        // ⬅️ Vite Standardport
   strictPort: true   // ⬅️ Port nicht automatisch wechseln
 },

 // ✅ HINZUGEFÜGT: Build-Optimierungen für Vercel
 build: {
   outDir: 'dist',
   sourcemap: false, // ⬅️ Kleinere Build-Größe
   rollupOptions: {
     output: {
       manualChunks: {
         // ⬅️ Code-Splitting für bessere Performance
         vendor: ['react', 'react-dom'],
         router: ['react-router-dom'],
         animations: ['framer-motion', 'gsap'],
         icons: ['react-icons']
       }
     }
   }
 }
})