const botToken = '8970513614:AAGCdMrJTbIH1QmKCFXcIzv5QxPX86e_23U';
const chatId = '-1003940815012';
const topicId = '1209';

const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

const telegramMessage = [
  '🛎️ *NUEVA CITA REGISTRADA* 🛎️',
  '',
  `👤 *Nombre:* Test User`,
  `📞 *Teléfono:* 123456789`,
  `🚗 *Vehículo:* Test Car`,
  `🔧 *Servicio:* Test Service`,
  `🏷️ *Placa:* ABC-123`,
  `📅 *Año:* 2024`,
  `📍 *Ubicación:* Test Location`,
  `⚠️ *Falla:* Test Falla-123`,
  '',
  '*Status:* Pendiente'
].filter(Boolean).join('\n');

const tgBody = {
  chat_id: chatId,
  text: telegramMessage,
  parse_mode: 'Markdown'
};

if (topicId) tgBody.message_thread_id = topicId;

fetch(telegramUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(tgBody)
})
.then(r => r.json())
.then(data => console.log('Response:', data))
.catch(err => console.error('Error:', err));
