declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_URL: string;
      DATABASE_URL: string;
      JWT_SECRET: string;
    }
  }
}

export {};
