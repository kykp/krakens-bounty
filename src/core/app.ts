import { Application, type ApplicationOptions } from "pixi.js";

// Фабрика Pixi Application. Ставим разумные дефолты для десктопа и мобилки,
// вызывающая сторона может любой из них переопределить через overrides.
// Возвращаем уже инициализированное приложение — тяжёлая GPU-инициализация
// живёт здесь и наружу отдаём готовое к работе `app.stage`/`app.ticker`.
export const createApp = async (
  overrides: Partial<ApplicationOptions> = {},
): Promise<Application> => {
  const app = new Application();
  await app.init({
    resizeTo: window,
    background: "#1b8fac",
    antialias: true,
    // Retina / hi-DPI: рендерим в физических пикселях экрана, CSS-размер оставляем визуальным.
    // Без этой пары канвас будет мыльным на любом retina-дисплее (iPhone, mac).
    resolution: window.devicePixelRatio,
    autoDensity: true,
    ...overrides,
  });
  return app;
};
