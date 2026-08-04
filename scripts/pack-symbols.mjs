// Сборка спрайт-атласа символов.
// Читаем 10 PNG из src/assets/raw/game-icons/, ресайзим до SIZE×SIZE,
// раскладываем в сетку COLS×ROWS, пишем один PNG и Pixi Spritesheet JSON.
//
// Запуск: npm run pack-symbols

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const SRC_DIR = path.join(ROOT, "src/assets/raw/game-icons");
const OUT_DIR = path.join(ROOT, "public/atlas");
const OUT_PNG = "symbols.png";
const OUT_JSON = "symbols.json";

// Целевой размер одного символа в атласе. 256px даёт хороший запас под retina
// (реальный отображаемый — обычно 100–160px).
const SIZE = 256;
// Сетка. 5×2 = 10 слотов, ровно под наши иконки.
const COLS = 5;
const ROWS = 2;

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });

  // Сортированный список даёт детерминированный порядок: одинаковый вход → одинаковый выход.
  const files = (await fs.readdir(SRC_DIR))
    .filter((f) => f.endsWith(".png"))
    .sort();

  if (files.length !== COLS * ROWS) {
    throw new Error(
      `Ожидал ${COLS * ROWS} иконок, нашёл ${files.length}. Обнови COLS/ROWS.`,
    );
  }

  // Ресайзим каждую иконку в буфер SIZE×SIZE.
  const tiles = await Promise.all(
    files.map(async (file) => {
      const buffer = await sharp(path.join(SRC_DIR, file))
        .resize(SIZE, SIZE, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer();
      return { name: path.basename(file, ".png"), buffer };
    }),
  );

  // Композим на прозрачный холст.
  const atlasW = COLS * SIZE;
  const atlasH = ROWS * SIZE;

  const composite = tiles.map((tile, i) => ({
    input: tile.buffer,
    left: (i % COLS) * SIZE,
    top: Math.floor(i / COLS) * SIZE,
  }));

  await sharp({
    create: {
      width: atlasW,
      height: atlasH,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite(composite)
    .png()
    .toFile(path.join(OUT_DIR, OUT_PNG));

  // Pixi Spritesheet JSON — формат v3. Имя фрейма — basename без расширения,
  // ссылаться в коде: new Sprite(Texture.from('wild-kraken')).
  const frames = {};
  tiles.forEach((tile, i) => {
    const x = (i % COLS) * SIZE;
    const y = Math.floor(i / COLS) * SIZE;
    frames[tile.name] = {
      frame: { x, y, w: SIZE, h: SIZE },
      sourceSize: { w: SIZE, h: SIZE },
      spriteSourceSize: { x: 0, y: 0, w: SIZE, h: SIZE },
    };
  });

  const manifest = {
    frames,
    meta: {
      image: OUT_PNG,
      format: "RGBA8888",
      size: { w: atlasW, h: atlasH },
      scale: "1",
    },
  };

  await fs.writeFile(
    path.join(OUT_DIR, OUT_JSON),
    JSON.stringify(manifest, null, 2) + "\n",
  );

  console.log(
    `✓ Атлас: ${atlasW}×${atlasH}, ${tiles.length} символов → ${path.relative(ROOT, path.join(OUT_DIR, OUT_PNG))}`,
  );
  console.log(`✓ Манифест: ${path.relative(ROOT, path.join(OUT_DIR, OUT_JSON))}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
