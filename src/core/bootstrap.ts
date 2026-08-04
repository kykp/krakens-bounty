import { Application, Assets } from "pixi.js";
import { Preloader } from "./preloader";
import { ASSETS_MANIFEST } from "../assets/manifest";

// Минимальное время показа прелоадера. Стандартный UX-паттерн: если ассеты
// загрузились быстрее — всё равно досиживаем на таймере, иначе оверлей
// мигает на долю секунды и это выглядит как визуальный баг. Обычно ставят
// 500–800 мс — глаз успевает считать «загрузка».
const MIN_PRELOADER_MS = 600;

// Boot-фаза приложения: показать прелоадер, загрузить критичные ассеты,
// снять прелоадер. Разрешается когда boot-бандл в кеше И минимальное
// время показа прошло.
export async function bootstrap(app: Application): Promise<void> {
  const preloader = new Preloader(app);
  app.stage.addChild(preloader);

  await Assets.init({ manifest: ASSETS_MANIFEST });

  // Promise.all резолвится когда закончатся ОБА промиса.
  // - loadBundle=50мс + таймер=600мс → досидим 600мс (таймер решает)
  // - loadBundle=2000мс + таймер=600мс → снимем сразу как загрузили (загрузка решает)
  // Никаких лишних задержек, никаких вспышек прелоадера.
  await Promise.all([
    Assets.loadBundle("boot", (progress) => preloader.setProgress(progress)),
    new Promise((resolve) => setTimeout(resolve, MIN_PRELOADER_MS)),
  ]);

  preloader.destroy({ children: true });
}
