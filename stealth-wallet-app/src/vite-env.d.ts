/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_ALICE_PK: string;
  readonly VITE_BOB_PK: string;
  readonly VITE_BOB_PK_2: string;
  readonly VITE_SEPOLIA_RPC: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
