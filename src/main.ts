import { Application, Assets, Sprite } from "pixi.js";

(async () => {
  // Создаём приложение. В v8 конструктор синхронный — тяжёлая инициализация (WebGPU/WebGL контекст) вынесена в init().
  const app = new Application();

  // Инициализируем рендерер. resizeTo: window — канвас сам подстраивается под размер окна.
  await app.init({ background: "#1b8fac", resizeTo: window });

  // Пришиваем канвас Pixi в div из index.html.
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  // Загружаем текстуру. Assets — кеширующий загрузчик v8, повторный load вернёт ту же текстуру.
  const texture = await Assets.load("/assets/bunny.png");

  // Спрайт из текстуры.
  const bunny = new Sprite(texture);

  // Ставим точку привязки в центр — иначе поворот будет крутить вокруг левого верхнего угла.
  bunny.anchor.set(0.5);

  // Центрируем спрайт по экрану.
  bunny.position.set(app.screen.width / 2, app.screen.height / 2);

  // Добавляем в сцену.
  app.stage.addChild(bunny);

  // Крутим кролика в ticker'е.
  app.ticker.add((time) => {
    // time.deltaTime — безразмерный множитель: 1.0 при 60 FPS, 2.0 если кадр пропущен.
    // Умножая на него, получаем анимацию, независимую от FPS.
    bunny.rotation += 0.1 * time.deltaTime;
  });
})();
