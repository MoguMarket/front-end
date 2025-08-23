import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import mkcert from "vite-plugin-mkcert";

export default defineConfig({

    plugins: [react(), tailwindcss(), mkcert()],
    server: {
        https: true, // mkcert가 알아서 인증서 생성/적용
        host: true, // 네트워크 테스트 필요하면
        port: 5173,
    },

});
