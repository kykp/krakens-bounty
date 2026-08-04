import { Assets, Sprite } from "pixi.js";
import { createApp } from "./core/app";
import { Preloader } from "./core/preloader";
import { SYMBOLS } from "./assets/generated/symbols";
import { ASSETS_MANIFEST } from "./assets/manifest";

(async () => {
  const app = await createApp();

  document.getElementById("pixi-container")!.appendChild(app.canvas);

  // Прелоадер поверх всего — пока грузится boot-бандл, игрок видит прогресс,
  // а не пустой канвас.
  const preloader = new Preloader(app);
  app.stage.addChild(preloader);

  // Регистрируем manifest — Pixi запоминает, какие бандлы существуют, но ничего не грузит.
  await Assets.init({ manifest: ASSETS_MANIFEST });
  // Грузим boot. Второй аргумент — колбэк progress (0..1), кормит прелоадер.
  await Assets.loadBundle("boot", (progress) =>
    preloader.setProgress(progress),
  );

  // Ассеты в кеше — прелоадер больше не нужен, удаляем со всеми детьми.
  preloader.destroy({ children: true });

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
