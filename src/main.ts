import { Assets, Sprite } from "pixi.js";
import { createApp } from "./core/app";
import { SYMBOLS } from "./assets/generated/symbols";

(async () => {
  const app = await createApp();

  document.getElementById("pixi-container")!.appendChild(app.canvas);

  // Загружаем атлас. После этого все символы доступны в кеше по имени.
  await Assets.load("/atlas/symbols.json");

  const kraken = Sprite.from(SYMBOLS.WILD_KRAKEN);
  // anchor в центр — иначе rotation крутит вокруг левого верхнего угла.
  kraken.anchor.set(0.5);
  kraken.width = 200;
  kraken.height = 200;
  kraken.position.set(app.screen.width / 2, app.screen.height / 2);
  // tint — множитель пикселей на GPU. Белый × золото = золото.
  kraken.tint = 0xffd700;

  app.stage.addChild(kraken);

  app.ticker.add((time) => {
    kraken.rotation += 0.01 * time.deltaTime;
  });
})();
