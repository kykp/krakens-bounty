import { Assets, Sprite } from "pixi.js";
import { createApp } from "./core/app";
import { SYMBOLS } from "./assets/generated/symbols";
import { ASSETS_MANIFEST } from "./assets/manifest";

(async () => {
  const app = await createApp();

  document.getElementById("pixi-container")!.appendChild(app.canvas);

  // Регистрируем весь manifest — Pixi запоминает, какие бандлы и алиасы существуют,
  // но ничего ещё не грузит.
  await Assets.init({ manifest: ASSETS_MANIFEST });
  // Грузим bundle "boot" — фактическая загрузка атласа + регистрация фреймов в кеше.
  await Assets.loadBundle("boot");

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
