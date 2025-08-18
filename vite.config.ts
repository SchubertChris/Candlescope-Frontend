import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/Components'),
      '@pages': path.resolve(__dirname, './src/Pages'),
      '@styles': path.resolve(__dirname, './src/Styles'),
      '@services': path.resolve(__dirname, './src/Services'),
      '@router': path.resolve(__dirname, './src/Router'),
      '@types': path.resolve(__dirname, './src/Types'),
      '@utils': path.resolve(__dirname, './src/Components/Utils'),
      '@assets': path.resolve(__dirname, './src/assets'),
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Moderne Sass API verwenden
        api: 'modern-compiler',
        silenceDeprecations: ['import', 'mixed-decls']
      }
    }
  },
  // 🟡 HINZUGEFÜGT: Server-Option für LAN-Zugriff
  server: {
    host: true,            // ⬅️ Erlaubt Zugriffe von anderen Geräten im Netzwerk
    port: 5173,            // ⬅️ Standardport von Vite (anpassbar)
    strictPort: true       // ⬅️ Verhindert automatisches Wechseln des Ports
  }
})
