import { Sprite } from "pixi.js";
import { createApp } from "./core/app";
import { bootstrap } from "./core/bootstrap";
import { SYMBOLS } from "./assets/generated/symbols";

(async () => {
  const app = await createApp();
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  // Прелоадер + загрузка boot-бандла. По завершении ассеты в кеше.
  await bootstrap(app);

  const kraken = Sprite.from(SYMBOLS.WILD_KRAKEN);
  kraken.anchor.set(0.5);
  kraken.width = 200;
  kraken.height = 200;
  kraken.position.set(app.screen.width / 2, app.screen.height / 2);
  kraken.tint = 0xffd700;

  app.stage.addChild(kraken);

  app.ticker.add((time) => {
    kraken.rotation += 0.01 * time.deltaTime;
  });
})();
