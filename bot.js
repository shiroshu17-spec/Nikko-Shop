const TelegramBot = require('node-telegram-bot-api');

// ၁။ Bot Token
const token = '8909688900:AAGf34S-5d0Gt-8Aj6zvzi6OO2xdoqv2k2M';

// ၂။ Admin Chat ID
const ADMIN_CHAT_ID = '1936127314';

const bot = new TelegramBot(token, { polling: true });

// ၃။ GitHub Pages လင့်ခ်
const WEB_APP_URL = 'https://shiroshu17-spec.github.io/Nikko-Shop/';

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const firstName = msg.from.first_name || 'မိတ်ဆွေ';

    const welcomeMessage = `✨ မင်္ဂလာပါ ${firstName}၊ Vaseline Official Cosmetics Shop မှ ကြိုဆိုပါတယ်။\n\n` +
        `အောက်ပါ Shop ခလုတ်ကို နှိပ်ပြီး ဈေးဝယ်ယူနိုင်ပါပြီ။`;

    const keyboard = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🛍️ ဈေးဝယ်ရန် (Shop Open)', web_app: { url: WEB_APP_URL } }],
                [{ text: '📞 ဆက်သွယ်ရန်', callback_data: 'contact_us' }]
            ]
        }
    };

    bot.sendMessage(chatId, welcomeMessage, keyboard);
});

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    if (query.data === 'contact_us') {
        bot.sendMessage(chatId, `📱 ဆက်သွယ်ရန်: @Felixarcridill သို့ တိုက်ရိုက်ဆက်သွယ်နိုင်ပါသည်။`);
    }
    bot.answerCallbackQuery(query.id);
});

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;

    if (msg.web_app_data) {
        const orderData = msg.web_app_data.data;
        
        await bot.sendMessage(chatId, `✅ ကျေးဇူးတင်ပါတယ်! မိတ်ဆွေ၏ အော်ဒါကို လက်ခံရရှိပါပြီ။\n\n${orderData}`);

        if (ADMIN_CHAT_ID) {
            const customerName = `${msg.from.first_name || ''} ${msg.from.last_name || ''} (@${msg.from.username || 'No Username'})`;
            const adminMessage = `🔔 *New Order Received!*\n\n👤 *ဝယ်ယူသူ:* ${customerName}\n🆔 *Chat ID:* \`${chatId}\`\n\n${orderData}`;
            
            await bot.sendMessage(ADMIN_CHAT_ID, adminMessage, { parse_mode: 'Markdown' });
        }
    }
});

console.log('Vaseline Shop Bot is running successfully...');
