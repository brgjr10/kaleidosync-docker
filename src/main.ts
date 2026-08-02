import { createApp } from "@wearesage/vue";
import * as generatedRoutes from "./routes.generated";
import App from "./App.vue";
import "./styles/fonts.scss";

async function initializeApp() {
  try {
    const { app, router, pinia } = await createApp(App, { routes: generatedRoutes });
    console.log("App initialized", { app, router, pinia });
    return { app, router, pinia };
  } catch (error) {
    console.error("Failed to initialize app:", error);
    throw error;
  }
}

initializeApp().catch(console.error);
