import { Graphics } from "pixi.js";
import { createApp } from "./core/app";
import { bootstrap } from "./core/bootstrap";
import { createGameRoot } from "./core/game-root";
import { DESIGN_WIDTH, DESIGN_HEIGHT } from "./config/screen";

(async () => {
  const app = await createApp();
  const container = document.getElementById("pixi-container");
  if (!container) return;

  container.appendChild(app.canvas);

  //preloader загрузки Assets
  await bootstrap(app);

  //создается игровая область
  const gameRoot = createGameRoot(app);

  // Временный маркер границ дизайн-области — удалим в 2.1.2 (после resize).
  // Сейчас без масштабирования: gameRoot в позиции (0,0), рамка нарисуется
  // от левого верхнего угла канваса. На большом экране увидим её в углу,
  // на маленьком — она обрежется. Это НАГЛЯДНО показывает проблему,
  // которую решит resize-логика следующим шагом.
  const bounds = new Graphics()
    .rect(0, 0, DESIGN_WIDTH, DESIGN_HEIGHT)
    .stroke({ width: 4, color: 0xff0000 });
  gameRoot.addChild(bounds);
})();
