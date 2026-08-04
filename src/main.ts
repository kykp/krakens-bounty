import { Graphics } from "pixi.js";
import { createApp } from "./core/app";

(async () => {
  const app = await createApp();

  // Пришиваем канвас Pixi в div из index.html.
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  // Плейсхолдер — заменим на настоящую сцену слота в этапе 2.
  // v8-API рисования: сначала описываем форму (rect/circle/roundRect/...),
  // потом накладываем стиль (fill/stroke). Каждый вызов возвращает this — можно чейнить.
  // Координаты формы — от локального (0,0) объекта Graphics. Рисуем от -60 до +60,
  // чтобы центр формы совпал с origin — тогда `rotation` крутит вокруг центра.
  const box = new Graphics()
    .roundRect(-60, -60, 120, 120, 5)
    .fill("crimson")
    .stroke({ width: 1, color: "yellow " });

  // Origin объекта Graphics ставим в центр экрана.
  box.position.set(app.screen.width / 2, app.screen.height / 2);

  // Добавляем в сцену.
  app.stage.addChild(box);

  // Крутим в ticker'е. deltaTime — множитель для FPS-независимой анимации.
  app.ticker.add((time) => {
    box.rotation += 0.02 * time.deltaTime;
  });
})();
