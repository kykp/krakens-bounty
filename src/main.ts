import { createApp } from "./core/app";
import { bootstrap } from "./core/bootstrap";

(async () => {
  const app = await createApp();
  const container = document.getElementById("pixi-container");

  if (!container) return;

  container.appendChild(app.canvas);

  await bootstrap(app);
})();
