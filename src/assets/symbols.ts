import { Sprite } from "pixi.js";
import { type SymbolName } from "./generated/symbols";

// Доменный словарь символов слота. Ключи — игровые роли (WILD, SCATTER, ...),
// значения — имена фреймов в атласе. Фичи (reels, win, ui) должны обращаться
// к символам через SYMBOL.*, а не через строки — тогда рефакторинг rename в IDE
// работает по всему проекту, а компилятор ловит несуществующие роли.
//
// `satisfies Record<string, SymbolName>` — гарант того, что каждое значение
// является реальным именем из атласа. Если после регенерации атласа какой-то
// символ исчезнет — здесь будет TS-ошибка компиляции, а не пустая текстура
// в рантайме.
export const SYMBOL = {
  WILD: "wild-kraken",
  SCATTER: "scatter-treasure-map",
  GALLEON: "high-galleon",
  CHEST: "high-locked-chest",
  HAT: "mid-pirate-hat",
  SKULL: "mid-pirate-skull",
  ANCHOR: "low-anchor",
  COMPASS: "low-compass",
  SPYGLASS: "low-spyglass",
  WHEEL: "low-ship-wheel",
} as const satisfies Record<string, SymbolName>;

// Единая точка создания спрайта символа. Всегда возвращает спрайт с
// anchor'ом в центре — так его хочет и барабан (центр ячейки), и подсветка
// выигрышной линии, и превью в paytable. Если появится общее поведение
// (пул, tint по тиру, дефолтный размер) — дописывается здесь, а не по
// сотне мест в коде.
export function createSymbolSprite(name: SymbolName): Sprite {
  const sprite = Sprite.from(name);
  sprite.anchor.set(0.5);
  return sprite;
}
