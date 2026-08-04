import { Container, type Application } from "pixi.js";
import { DESIGN_WIDTH, DESIGN_HEIGHT } from "../config/screen";

// Единый корневой контейнер игры. Всё игровое — его дети.
// resize подстраивает scale и position так, чтобы дизайн-область 1280×720
// вписалась в реальный размер канваса и оставалась по центру.
export function createGameRoot(app: Application): Container {
  const root = new Container();
  root.label = "gameRoot";
  app.stage.addChild(root);

  const resize = () => {
    // Берём меньший из двух коэффициентов — тогда дизайн-область целиком
    // влезает в канвас, по одной стороне может остаться пустое поле.
    const scale = Math.min(
      app.renderer.width / DESIGN_WIDTH,
      app.renderer.height / DESIGN_HEIGHT,
    );
    root.scale.set(scale);

    // Центрируем: делим пустое пространство пополам с двух сторон.
    root.position.set(
      (app.renderer.width - DESIGN_WIDTH * scale) / 2,
      (app.renderer.height - DESIGN_HEIGHT * scale) / 2,
    );
  };

  resize(); // первый расчёт сразу
  app.renderer.on("resize", resize); // и при каждом изменении окна

  return root;
}
