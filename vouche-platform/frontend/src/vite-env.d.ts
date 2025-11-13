/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  // เพิ่ม environment variables อื่นๆ ที่ใช้ในโปรเจค
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
