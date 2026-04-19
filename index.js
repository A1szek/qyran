const {
    Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder,
    ButtonStyle, ChannelType, PermissionsBitField, EmbedBuilder
} = require('discord.js');
const util = require('minecraft-server-util');
const express = require('express');
require('dotenv').config();

// Настройка веб-сервера для Render (Anti-sleep)
const app = express();
const port = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('QYRAN PROJECT Bot is Alive!'));
app.listen(port, () => console.log(`Web-сервер запущен на порту ${port}`));

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
});

// --- НАСТРОЙКИ QYRAN PROJECT ---
const TICKET_CATEGORY_ID = '1482733463898427443';
const SERVER_IP = 'grief.play.ski';
const SERVER_BANNER = 'https://media.discordapp.net/attachments/1482733365160575128/1495440193396674822/qyranbanner_.png?ex=69e640b6&is=69e4ef36&hm=71012598548f02348f5ee2e88e327bf914e50ddeda0fe6852f9d9ecceeb4036c&=&format=webp&quality=lossless&width=1814&height=1092';
const TELEGRAM_URL = 'https://t.me/+3BJyMTH6O9s1ZWRi';

let statusMessage = null;

client.once('ready', () => {
  console.log(`✅ QYRAN PROJECT успешно запущен!`);

  // Авто-обновление онлайна каждые 30 секунд
  setInterval(async () => {
    if (statusMessage) {
        try {
            const data = await util.status(SERVER_IP, 25565);
            const updatedEmbed = EmbedBuilder.from(statusMessage.embeds[0])
                .setFields(
                    { name: '🌐 Статус', value: '`Online`', inline: true },
                    { name: '🗺️ Карта', value: '`Grief`', inline: true },
                    { name: '👥 Игроки', value: `\`${data.players.online}/${data.players.max}\``, inline: true }
                );
            await statusMessage.edit({ embeds: [updatedEmbed] });
        } catch (e) {
            console.log('Ошибка обновления мониторинга (сервер недоступен)');
        }
    }
  }, 30000);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;

  // 1. КОМАНДА: ПРАВИЛА (ПОЛНЫЙ СПИСОК)
  if (message.content === '!setup-rules') {
    const rulesEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('📜 Негізгі ережелер — QYRAN PROJECT')
        .setDescription(
            `🔹 **1. Жалпы ережелер**\n` +
            `**1.1.** Біздің серверде ойнай отырып, сіз барлық ережелермен келісесіз және олармен танысуға міндеттісіз.\n` +
            `**1.2.** Ережелерді білмеу жауапкершіліктен босатпайды.\n` +
            `**1.3.** Ережелер болашақта өзгертілуі немесе толықтырылуы мүмкін.\n` +
            `**1.4.** Әкімшілік әрбір бұзушылыққа байланысты жазаны өзі анықтайды. Сіз ескерту, уақытша бан немесе мәңгілік бан ала аласыз.\n` +
            `**1.5.** Сервер қызметтеріне жұмсалған қаражат ешқандай жағдайда қайтарылмайды.\n` +
            `**1.6.** Әкімшілікті алдау (жалған дәлелдер ұсыну немесе жаңылыстыру) тыйым салынады.\n` +
            `**1.7.** Ережелер бойынша түсіндірме алу үшін техникалық қолдауға жүгінуіңізге болады.\n\n` +
            `🎮 **2. Ойын ережелері**\n` +
            `**2.1.** Барлық ойыншыларды құрметтеңіз (жасына, ұлтына қарамастан).\n` +
            `**2.2.** Балағат сөздер, қорлау және токсик әрекеттерге тыйым салынады.\n` +
            `**2.3.** Әкімшіліктің рұқсатынсыз жарнама жасауға болмайды.\n` +
            `**2.4.** Ник (атыңыз) әдепті болуы керек (балағатсыз).\n\n` +
            `⚡ **3. Ойын процесі және читтер**\n` +
            `**3.1.** Үшінші тарап бағдарламаларын, модтарды, скрипттерді немесе читтерді қолдануға тыйым салынады.\n` +
            `**3.2.** Серверге зиян келтіру (дюп, баг, лаг-машина және т.б.) — банмен жазаланады. Егер ақау байқасаңыз, міндетті түрде техникалық қолдауға хабарласыңыз — сіз сыйақы аласыз.\n` +
            `**3.3.** Қорлайтын, саяси немесе өзін әкімшілік ретінде көрсететін титул (/titul) немесе префикс (/prefix) қою — бан.\n` +
            `**3.4.** /mute және /unmute командаларын дұрыс пайдаланбау — бан.\n` +
            `**3.5.** Ережелерді қайта-қайта бұзу — сервердің қара тізіміне енгізіліп, мәңгілік бан және ресурстарды толық жоюмен аяқталуы мүмкін (шағымдану мүмкін емес).\n\n` +
            `💬 **4. Чат және қарым-қатынас**\n` +
            `**4.1.** Шектен тыс балағат сөздерге тыйым салынады. (20 мин мут)\n` +
            `**4.2.** Ата-анаға қатысты қорлау қатаң жазаланады. (1 күн бан)\n` +
            `**4.3.** Саясат, дін және жанжал тудыратын тақырыптарға тыйым салынады. (1 күн бан)\n` +
            `**4.4.** Спам, флуд және CAPS қолдануға болмайды. (10 мин мут)\n\n` +
            `🏗️ **5. Құрылыс (постройка)**\n` +
            `**5.1.** 18+ немесе қорлайтын құрылыстарға тыйым салынады.\n` +
            `**5.2.** Қажетсіз үлкен территорияны басып алуға болмайды.\n` +
            `**5.3.** Серверге лаг тудыратын фермалар жойылуы мүмкін.`
        )
        .setFooter({ text: 'QYRAN PROJECT • Ережелерді сақтағаныңыз үшін рахмет!' });
    await message.channel.send({ embeds: [rulesEmbed] });
  }

  // 2. КОМАНДА: ИНФО-ЦЕНТР С ТЕЛЕГРАМОМ
  if (message.content === '!setup-all') {
    const infoEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('::: ::: ::: Информационный центр')
        .setDescription(
            `📩 **• Поддержка:**\n` +
            `Төмендегі батырманы басып тикет ашыңыз.\n\n` +
            `ℹ️ **• Навигация:**\n` +
            `• 📘 <#1482733569422921859> — ақпараттар\n` +
            `• 💸 <#1482752097723093232> — магазин\n` +
            `• ⚡ <#1482752143449653298> — медиа\n` +
            `• 📕 <#1495402176070291496> — ережелер\n` +
            `• 📍 <#1495441498202837154> — серверы\n\n` +
            `📱 **• Біздің Telegram:**\n` +
            `👉 [QYRAN Telegram-ға өту](${TELEGRAM_URL})`
        )
        .setImage(SERVER_BANNER);

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('open_ticket').setLabel('Открыть тикет').setEmoji('📩').setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setLabel('Telegram').setURL(TELEGRAM_URL).setStyle(ButtonStyle.Link)
    );
    await message.channel.send({ embeds: [infoEmbed], components: [row] });
  }

  // 3. КОМАНДА: МОНИТОРИНГ (С МГНОВЕННЫМ ОБНОВЛЕНИЕМ)
  if (message.content === '!setup-server') {
    let onlineDisplay = 'Загрузка...';
    try {
        const data = await util.status(SERVER_IP, 25565);
        onlineDisplay = `${data.players.online}/${data.players.max}`;
    } catch (e) { onlineDisplay = '0/100'; }

    const serverEmbed = new EmbedBuilder()
        .setColor('#2ecc71')
        .setTitle('QYRAN MINECRAFT #1')
        .addFields(
            { name: '🌐 Статус', value: '`Online`', inline: true },
            { name: '🗺️ Карта', value: '`Grief`', inline: true },
            { name: '👥 Игроки', value: `\`${onlineDisplay}\``, inline: true }
        )
        .setDescription(`**Java IP:** \`grief.play.ski\`\n**Bedrock IP:** \`213.152.43.25:25777\``)
        .setImage(SERVER_BANNER);

    statusMessage = await message.channel.send({ embeds: [serverEmbed] });
    await message.delete();
  }
});

// ЛОГИКА ТИКЕТОВ
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;
    if (interaction.customId === 'open_ticket') {
        const ticketChannel = await interaction.guild.channels.create({
            name: `ticket-${interaction.user.username}`,
            type: ChannelType.GuildText,
            parent: TICKET_CATEGORY_ID,
            permissionOverwrites: [
                { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
                { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] },
                { id: client.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }
            ],
        });
        const closeRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('close_ticket').setLabel('Закрыть').setStyle(ButtonStyle.Danger)
        );
        await ticketChannel.send({ content: `👋 Қош келдіңіз ${interaction.user}! Сұрағыңызды жазыңыз.`, components: [closeRow] });
        await interaction.reply({ content: `Тикет ашылды!`, ephemeral: true });
    }
    if (interaction.customId === 'close_ticket') {
        await interaction.channel.delete();
    }
});

client.login(process.env.TOKEN);
