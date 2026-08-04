import { Assets, Sprite } from "pixi.js";
import { createApp } from "./core/app";
import { type SymbolName } from "./assets/generated/symbols";

(async () => {
  const app = await createApp();

  document.getElementById("pixi-container")!.appendChild(app.canvas);

  // Загружаем атлас. Assets.load парсит symbols.json, догружает symbols.png,
  // регистрирует все фреймы в глобальном кеше текстур под их именами
  // ("wild-kraken", "high-galleon", ...). Дальше можно доставать по имени
  // из любого места приложения без повторной загрузки.
  await Assets.load("/atlas/symbols.json");

  // Sprite.from(name) ищет текстуру по имени в кеше — синхронно, потому что
  // атлас уже загружен. `satisfies SymbolName` — компилятор проверит, что
  // литерал есть в сгенерированном списке имён; опечатка ловится на этапе tsc.
  const kraken = Sprite.from("wild-kraken" satisfies SymbolName);

  // Иконка на исходнике 256×256 — масштабируем до отображаемого размера.
  kraken.width = 100;
  kraken.height = 100;

  // Anchor в центр — position.set() ставит центр спрайта в точку, rotation крутит вокруг центра.
  kraken.anchor.set(0.5);
  kraken.position.set(app.screen.width / 2, app.screen.height / 2);

  // tint мультиплицирует пиксели текстуры на цвет. Исходник — белый на прозрачном,
  // умножение на золото даёт золотой символ. Это ключ к переиспользованию атласа:
  // одна текстура + разные tint = разные визуальные состояния.
  kraken.tint = "black";

  app.stage.addChild(kraken);

  app.ticker.add((time) => {
    kraken.rotation += 0.01 * time.deltaTime;
  });
})();
