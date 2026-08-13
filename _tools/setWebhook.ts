import { Telegraf } from "telegraf";

export type Links = Record<string, WebhookConfig>;
// export type TMode =
//   | "ppBot_toLocal"
//   | "preprod"
//   | "prod"
//   | "local"
//   | "adminBot"
//   | "adminBot_toLocal"
//   | "adminBot_toProd"
//   | undefined;

// export const MODE = {
//   clientDev: "clientDev",
//   clientProd: "clientProd",
//   clientPreprod: "clientPreprod",
//   clientPP: "clientPP",
//   adminBot: "adminBot",
//   adminBotDev: "adminBotDev",
//   adminBotProd: "adminBotProd",
//   adminBotPreprod: "adminBotPreprod",
//   adminBotPP: "adminBotPP",
// } as const;
export interface WebhookConfig {
  BOT_TOKEN: string;
  SERVER_URL: string;
  apiURL: string;
  name?: string;
}
// export interface WebhookConfig {
//   mode: TMode;
//   data: Record<string, D>;
// }
export async function setWebhook2(name: string = "", links: Links) {
  const config = links[name];
  if (!config) return;
  const bot_token = config.BOT_TOKEN;
  const url = config.SERVER_URL;
  const apiUrl = config.apiURL;
  const resultStr = `✅ ${name}`;

  try {
    const bot = new Telegraf(bot_token);
    const result = await bot.telegram.setWebhook(url + apiUrl);
    console.log(resultStr);
    console.log(url + apiUrl);
    console.log(result);
  } catch (e) {
    console.error("Ошибка при настройке бота:", e);
  }
}
export async function setWebhook3(config: WebhookConfig) {
  const bot_token = config.BOT_TOKEN;
  const url = config.SERVER_URL;
  const apiUrl = config.apiURL;
  const resultStr = `✅ ${config.name || ""}`;

  try {
    const bot = new Telegraf(bot_token);
    const result = await bot.telegram.setWebhook(url + apiUrl);
    console.log(resultStr);
    console.log(url + apiUrl);
    console.log(result);
  } catch (e) {
    console.error("Ошибка при настройке бота:", e);
  }
}
