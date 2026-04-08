import { Telegraf } from "telegraf";


export type TMode = 'ppBot_toLocal'|'preprod' | 'prod' | 'local' | 'adminBot' | 'adminBot_toLocal' | undefined;
export interface D {
    BOT_TOKEN: string; 
    SERVER_URL: string;
    apiURL: string;
    title: string;
}
export interface WebhookConfig {
    mode: TMode;
    data: Record<string, D>  
}

export async function setWebhook(config: WebhookConfig) {
    const mode = config.mode;
    if (!mode) return;

    
    const data = config.data[mode];
    const bot_token = data.BOT_TOKEN;
    const url = data.SERVER_URL;
    const apiUrl = data.apiURL;
    const resultStr = `✅ Установил вебхук для ${data.title}`;


    try {        
        const bot = new Telegraf(bot_token);
        const result = await bot.telegram.setWebhook(url + apiUrl);
        console.log(resultStr);
        console.log(url + apiUrl);
        console.log(result);

    } catch (e) {
        console.error('Ошибка при настройке бота:', e);
    }
}