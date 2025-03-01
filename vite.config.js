import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"
import basicSsl from "@vitejs/plugin-basic-ssl"

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [react()],
    // You can access the environment variables using `env`
    define: {
      "process.env": env,
    },
  }
})
