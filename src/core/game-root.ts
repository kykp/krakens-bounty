import { Container, type Application } from "pixi.js";

// Единый корневой контейнер игры. Всё игровое (барабаны, HUD, эффекты) — его дети.
// Смысл: resize-логика (шаг B) масштабирует ОДИН этот Container, а все дети
// получают финальную трансформацию через scene graph (родитель × ребёнок).
//
// Почему нельзя масштабировать сам app.stage — он корень всей сцены Pixi и
// системно занят рендерером. Наш gameRoot — это "корень игрового мира" ВНУТРИ
// сцены; поверх него в будущем можно положить прелоадер / модалку / debug-overlay,
// которые НЕ должны скалиться вместе с игрой.
export function createGameRoot(app: Application): Container {
  const root = new Container();
  root.label = "gameRoot";
  app.stage.addChild(root);
  return root;
}
