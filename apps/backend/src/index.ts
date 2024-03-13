import gracefulShutdown from "http-graceful-shutdown";
import { createApp } from "./app";
import { getConfig } from "./config";

const config = getConfig();

const app = createApp(config);

app.run().then(() => {
  gracefulShutdown(app.server, {
    signals: "SIGINT SIGTERM SIGUSR2",
    finally: function () {
      console.log("Server graceful shut down completed.");
    },
  });
});
