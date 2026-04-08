import { Telegraf } from "telegraf";

export type TMode = 'preprod' | 'prod' | 'local' | 'adminBot' | 'adminBot_toLocal' | undefined;
export interface WebhookConfig {
    mode: TMode;
    ngrokUrl: string;
    apiUrl: string;
    prod: { BOT_TOKEN: string; API_URL: string; };
    adminBot: { BOT_TOKEN: string; API_URL: string; };
    adminBot_toLocal: { BOT_TOKEN: string; API_URL: string; };   
    
}

export async function setWebhook(config: WebhookConfig) {
    const mode = config.mode;
    const apiUrl = config.apiUrl;
    let url: string = '';
    let bot_token: string = '';
    let resultStr = '';

    if (!mode || !['preprod', 'prod', 'local'].includes(mode)) {
        console.error('❌ Укажите режим: preprod | prod | local');
        process.exit(1);
    }

    switch (mode) {
        case 'preprod':
            bot_token = config.preprod.BOT_TOKEN;
            url = config.preprod.API_URL;
            resultStr = `✅ Установил вебхук для ДЕВ бота\n   ${url}`;
            break;
        case 'prod':
            bot_token = config.prod.BOT_TOKEN;
            url = config.prod.API_URL;
            resultStr = `✅ Установил вебхук для ОСНОВНОГО бота\n   ${url}`;
            break;
        case 'local':
            bot_token = config.preprod.BOT_TOKEN;
            url = `https://${config.ngrokUrl}.ngrok-free.app`;
            resultStr = `✅ Установил вебхук для ЛОКАЛЬНОГО бота\n   ${url}`;
            break;
    }

    try {
        const bot = new Telegraf(bot_token);
        const result = await bot.telegram.setWebhook(url + apiUrl);
        console.log('Webhook успешно установлен:', result);
        console.log(resultStr);
    } catch (e) {
        console.error('Ошибка при настройке бота:', e);
    }
}