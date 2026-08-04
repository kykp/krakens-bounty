import { Application, Container, Graphics, Text } from "pixi.js";

const BAR_WIDTH = 400;
const BAR_HEIGHT = 12;
const BAR_RADIUS = 6;
const BG_COLOR = 0x0a1a2f;
const ACCENT = 0xffd700;

// Полноэкранный оверлей, скрывающий пустой канвас во время загрузки boot-ассетов.
// Внешний код кормит его прогрессом через setProgress(0..1) и вручную удаляет
// после `loadBundle`. Никакой самоуправляемой fade-логики — она добавляется
// когда появится реальный визуальный сценарий (spinner, transition к сцене).
export class Preloader extends Container {
  private readonly barFill: Graphics;
  private readonly percentText: Text;

  constructor(app: Application) {
    super();

    // Плотный фон — прячет всё, что может уже быть на stage.
    const bg = new Graphics()
      .rect(0, 0, app.screen.width, app.screen.height)
      .fill(BG_COLOR);
    this.addChild(bg);

    // Заголовок игры.
    const title = new Text({
      text: "KRAKEN'S BOUNTY",
      style: {
        fill: ACCENT,
        fontSize: 42,
        fontWeight: "bold",
        fontFamily: "monospace",
        letterSpacing: 4,
      },
    });
    title.anchor.set(0.5);
    title.position.set(app.screen.width / 2, app.screen.height / 2 - 60);
    this.addChild(title);

    // Рамка прогресс-бара — статичная, рисуется один раз.
    const cx = (app.screen.width - BAR_WIDTH) / 2;
    const cy = app.screen.height / 2;
    const barBg = new Graphics()
      .roundRect(cx, cy, BAR_WIDTH, BAR_HEIGHT, BAR_RADIUS)
      .stroke({ width: 2, color: ACCENT });
    this.addChild(barBg);

    // Заливка бара — рисуется на полную ширину один раз, дальше только scale.x
    // от 0 до 1. Так geometry не пересобирается на каждом апдейте прогресса
    // (см. Pixi Graphics guidelines: clear+redraw каждый кадр — антипаттерн).
    this.barFill = new Graphics()
      .rect(cx, cy, BAR_WIDTH, BAR_HEIGHT)
      .fill(ACCENT);
    // pivot вокруг левого края бара — тогда scale.x растёт "слева направо",
    // а не от центра.
    this.barFill.pivot.set(cx, 0);
    this.barFill.position.set(cx, 0);
    this.barFill.scale.x = 0;
    this.addChild(this.barFill);

    // Процент под баром.
    this.percentText = new Text({
      text: "0%",
      style: { fill: 0xffffff, fontSize: 16, fontFamily: "monospace" },
    });
    this.percentText.anchor.set(0.5);
    this.percentText.position.set(app.screen.width / 2, cy + 30);
    this.addChild(this.percentText);
  }

  setProgress(progress: number): void {
    const p = Math.max(0, Math.min(1, progress));
    this.barFill.scale.x = p;
    this.percentText.text = `${Math.round(p * 100)}%`;
  }
}
