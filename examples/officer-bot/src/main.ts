import path from "path";

/** Подгружаем конфиг с помощью dotenv */
import { config } from "dotenv";
config({ path: path.resolve(__dirname, "../.env") });
const appConfig = process.env as IConfig;

import knex from "knex";
import { RootModule } from "../../../src";
import { session, Telegraf } from "telegraf";
import { IConfig, IContext, SceneContract } from "./shared.types";

export const knexClient = knex({
  client: "pg",
  connection: appConfig.DATABASE_URL,
});

import "./scenes";
import { Stage } from "telegraf/typings/scenes";

export async function bootstrapBot(): Promise<void> {
  const bot = new Telegraf<IContext>(appConfig.BOT_TOKEN);

  /** Используем middleware для работы с сессиями */
  bot.use(session());

  const stage = new Stage<IContext>();
  const rootModule = new RootModule(bot, stage);
  // rootModule.registerUpdates([...RootModule.updatesRegistry]);
  rootModule.registerScenes([...RootModule.scenesRegistry], {
    onSceneRegistered(sceneId) {
      console.log(`Scene registered: ${sceneId}`);
    },
  });

  bot.start(async (ctx) => {
    console.log(999);
    console.log(ctx);
    // await ctx.scene.enter(SceneContract.Home);
  });

  /**
   * Запуск бота.
   * Нельзя запускать асинхронно, потому что под капотом бесконечный асинхронный итератор
   */
  bot.launch();
  console.log("Bot is running...");
}
bootstrapBot();
