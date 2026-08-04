import { Assets } from "pixi.js";
import { createApp } from "./core/app";
import { SYMBOL, createSymbolSprite } from "./assets/symbols";

(async () => {
  const app = await createApp();

  document.getElementById("pixi-container")!.appendChild(app.canvas);

  // Загружаем атлас. После этого все символы доступны в кеше по имени.
  await Assets.load("/atlas/symbols.json");

  // Создаём символ через доменную фабрику. main.ts не знает про имя фрейма
  // и про то, что символы вообще упакованы в атлас — только про игровые роли.
  const kraken = createSymbolSprite(SYMBOL.WILD);
  kraken.width = 200;
  kraken.height = 200;
  kraken.position.set(app.screen.width / 2, app.screen.height / 2);
  // tint — визуальный мультипликатор пикселей на GPU. Белый × золото = золото.
  kraken.tint = 0xffd700;

  app.stage.addChild(kraken);

  app.ticker.add((time) => {
    kraken.rotation += 0.01 * time.deltaTime;
  });
})();
