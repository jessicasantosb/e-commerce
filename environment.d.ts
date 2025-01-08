declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string;
      CLERK_SECRET_KEY: string;
      NEXT_PUBLIC_CLERK_SIGN_IN_URL: string;
      NEXT_PUBLIC_CLERK_SIGN_UP_URL: string;
      DATABASE_URL: string;
      DIRECT_URL: string;
      NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: string;
    }
  }
}

export {};
