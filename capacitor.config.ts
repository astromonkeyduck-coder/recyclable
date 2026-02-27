import type { CapacitorConfig } from "@capacitor/cli";

const isProduction = process.env.CAPACITOR_ENV === "production";
const liveUrl = "https://isthisrecyclable.com";
const devUrl = `http://${process.env.CAPACITOR_DEV_IP ?? "localhost"}:3000`;

const config: CapacitorConfig = {
  appId: "com.isthisrecyclable.app",
  appName: "Is This Recyclable?",
  webDir: "out",
  server: {
    url: isProduction ? liveUrl : devUrl,
    cleartext: !isProduction,
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 2000,
      backgroundColor: "#ffffff",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
    },
    StatusBar: {
      style: "LIGHT",
      backgroundColor: "#16a34a",
    },
  },
  ios: {
    scheme: "IsThisRecyclable",
    contentInset: "automatic",
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    },
  },
};

export default config;
