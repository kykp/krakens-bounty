import type { AssetsManifest } from "pixi.js";

// Декларативное описание всех ассетов игры для Pixi Assets.
//
// Зачем manifest+bundles вместо прямого Assets.load(url):
// В реальных слотах ассеты разбиты на группы по приоритету загрузки:
// - boot   — без этого нельзя показать первый экран (атлас символов, шрифт HUD)
// - main   — базовая игра (звуки барабанов, фоны)
// - bonus  — сцена бонус-игры, догружается фоном или при триггере
//
// Manifest — единая точка правды: что где лежит, какой alias, какая группа.
// Assets.loadBundle('boot') грузит нужное; Assets.get(alias) достаёт по имени;
// Assets.backgroundLoadBundle('bonus') подтягивает лениво пока игрок крутит.
//
// Сейчас группа одна — boot с одним атласом. Появится следующий ассет —
// решаем, попадает он в boot (нужен на первом экране) или в новую группу.
export const ASSETS_MANIFEST: AssetsManifest = {
  bundles: [
    {
      name: "boot",
      assets: [{ alias: "symbols", src: "/atlas/symbols.json" }],
    },
  ],
};
