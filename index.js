const { 
    Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, 
    ButtonStyle, ChannelType, PermissionsBitField, EmbedBuilder,
    ModalBuilder, TextInputBuilder, TextInputStyle, InteractionType 
} = require('discord.js');
const util = require('minecraft-server-util'); 
const express = require('express'); 
require('dotenv').config();

// --- ВЕБ-СЕРВЕР ---
const app = express();
const port = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('QYRAN PROJECT Bot is Alive!'));
app.listen(port, () => console.log(`Web-сервер запущен на порту ${port}`));

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences
  ],
});

// --- БОТ ПАРАМЕТРЛЕРІ ---
const ADMIN_LOG_CHANNEL_ID = '1482733365160575128'; 
const TICKET_CATEGORY_ID = '1482733463898427443'; 
const SERVER_IP = 'qyran.ru';
const TELEGRAM_URL = 'https://t.me/qrunproject';
const WEBSITE_URL = 'https://www.qyran.ru';

const STAFF_ROLES = [
    '1482733365160575128', 
    '1495446676901728548',
    '1479769459748241520',
    '1482731347863670824'
];

// --- БАННЕРЛЕР ---
const MONITORING_BANNER = 'https://media.discordapp.net/attachments/1482733365160575128/1495440193396674822/qyranbanner_.png?format=webp&width=1814&height=1092';
const SHOP_BANNER = 'https://media.discordapp.net/attachments/1482733365160575128/1495649008058896584/magazin.png?format=webp&width=1956&height=1092'; 
const MEDIA_BANNER = 'https://media.discordapp.net/attachments/1482733365160575128/1495645413909463160/mediaplayer.png?format=webp&width=2572&height=1092';
const INFO_CENTER_BANNER = 'https://media.discordapp.net/attachments/1482733365160575128/1495478041265045798/content.png?format=webp&width=2784&height=1050';

let statusMessage = null;

client.once('ready', () => {
  console.log(`✅ QYRAN PROJECT іске қосылды!`);
  setInterval(async () => {
    if (statusMessage) {
        try {
            const data = await util.status(SERVER_IP, 25565, { queryPort: 25934 });
            const updatedEmbed = EmbedBuilder.from(statusMessage.embeds[0])
                .setFields(
                    { name: '🌐 Статус', value: '`Online`', inline: true },
                    { name: '🗺️ Карта', value: '`Grief`', inline: true },
                    { name: '👥 Ойыншылар', value: `\`${data.players.online}/${data.players.max}\``, inline: true }
                );
            await statusMessage.edit({ embeds: [updatedEmbed] });
        } catch (e) {}
    }
  }, 30000); 
});

client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;

  // --- ОБНОВЛЕННАЯ КОМАНДА !сервер (ПО СКРИНШОТУ) ---
  if (message.content === '!сервер') {
    const guild = message.guild;
    const totalMembers = guild.memberCount;
    const botCount = guild.members.cache.filter(m => m.user.bot).size;
    const humanCount = totalMembers - botCount;

    const online = guild.presences.cache.filter(p => p.status === 'online').size;
    const idle = guild.presences.cache.filter(p => p.status === 'idle').size;
    const dnd = guild.presences.cache.filter(p => p.status === 'dnd').size;
    const offline = totalMembers - (online + idle + dnd);

    const serverInfoEmbed = new EmbedBuilder()
        .setColor('#5865F2')
        .setTitle(`Информация о сервере ${guild.name}`)
        .setDescription(`**ID сервера:** \`${guild.id}\`\n**Звено:** #162 (Qyran)`)
        .addFields(
            { name: '\u200B', value: '### Участники:', inline: false },
            { name: '👥 Всего:', value: `**${totalMembers}**`, inline: false },
            { name: '👤 Людей:', value: `**${humanCount}**`, inline: false },
            { name: '🤖 Ботов:', value: `**${botCount}**`, inline: false },
            { name: '\u200B', value: '---', inline: false },
            { name: '### По статусам:', inline: false },
            { name: '🟢 В сети:', value: `**${online}**`, inline: false },
            { name: '🌙 Неактивен:', value: `**${idle}**`, inline: false },
            { name: '⛔ Не беспокоить:', value: `**${dnd}**`, inline: false },
            { name: '⚪ Не в сети:', value: `**${offline}**`, inline: false }
        )
        .setFooter({ 
            text: `Приведенные выше числа являются приблизительными и отображают состояние кэша бота.\nQYRAN © 2026 Все права защищены`,
            iconURL: client.user.displayAvatarURL()
        });

    const serverRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('s1').setLabel('Сервер').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('s2').setLabel('Участники').setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId('s3').setLabel('Каналы').setStyle(ButtonStyle.Secondary)
    );

    await message.channel.send({ embeds: [serverInfoEmbed], components: [serverRow] });
    await message.delete();
  }

  // --- ИНФОРМАЦИЯ ОРТАЛЫҒЫ ---
  if (message.content === '!setup-info') {
    const infoEmbed = new EmbedBuilder()
        .setColor('#3498db')
        .setTitle('::: ::: ::: Информационный центр')
        .setDescription(
            `📩 **• Поддержка:**\n` +
            `Төмендегі батырманы басып тикет ашыңыз.\n\n` +
            `ℹ️ **• Навигация:**\n` +
            `• 🌍 **Сайт:** [qyran.ru](${WEBSITE_URL})\n` +
            `• 📘 <#1482733569422921859> — ақпараттар\n` +
            `• 💸 <#1482752097723093232> — магазин\n` +
            `• ⚡ <#1482752143449653298> — медиа\n` +
            `• 📕 <#1495402176070291496> — ережелер\n` +
            `• 📍 <#1495441498202837154> — серверы\n\n` +
            `📱 **• Біздің Telegram:**\n` +
            `👉 [QYRAN Telegram-ға өту](${TELEGRAM_URL})`
        )
        .setImage(INFO_CENTER_BANNER);

    const infoRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('open_ticket').setLabel('Открыть тикет').setEmoji('📩').setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setLabel('Сайтқа өту').setEmoji('🌍').setURL(WEBSITE_URL).setStyle(ButtonStyle.Link),
        new ButtonBuilder().setLabel('Telegram').setEmoji('✈️').setURL(TELEGRAM_URL).setStyle(ButtonStyle.Link)
    );

    await message.channel.send({ embeds: [infoEmbed], components: [infoRow] });
    await message.delete();
  }

  // --- ҚАЗАҚША ЕРЕЖЕЛЕР (ЖАҢАРТЫЛҒАН 08.05.2026) ---
  if (message.content === '!setup-rules') {
    const rulesEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('📜 Ережелер мен шарттар — QYRAN PROJECT')
        .setAuthor({ name: 'Discord Қауымдастығының Ережелері', iconURL: client.user.displayAvatarURL() })
        .setDescription(
            `Ережелер мен шарттар жобаның барлық мәтіндік және дауыстық арналарына, соның ішінде профиль аватарына, сипаттамасына, никнеймге және **QYRAN PROJECT** Discord қауымдастығының рөлдеріне қолданылады.\n\n` +
            `### 🚫 Бұзушылықтар мен жазалар:\n\n` +
            `**1.1 Орынсыз сөздер:** Қатысушыға, оның туыстарына немесе жақындарына тіл тигізу.\n┕ *Жаза: 1сағ > 3сағ > 6сағ > 12сағ тайм-аут*\n\n` +
            `**1.2 Дау-дамай:** Діни және саяси тақырыптардағы даулар.\n┕ *Жаза: 6 сағат тайм-аут*\n\n` +
            `**1.3 Спам/Флуд:** Хабарламаларды қайталау, рөлдерді негізсіз белгілеу.\n┕ *Жаза: 1сағ > 3сағ > 6сағ > 12сағ тайм-аут*\n\n` +
            `**1.4 Өзін басқаша таныстыру:** Өзін басқа қатысушы немесе әкімшілік ретінде көрсету.\n┕ *Жаза: 6 сағат тайм-аут*\n\n` +
            `**1.5 Алдау:** Қатысушыларды шатастыру немесе алдап соғу.\n┕ *Жаза: 1сағ > 6сағ > 1 күн тайм-аут*\n\n` +
            `**1.6 Тыйым салынған заттар:** Тыйым салынған заттарды жариялау немесе сату.\n┕ **Жаза: Мәңгілік бандау (Ban)**\n\n` +
            `**1.7 Жарнама:** Рұқсатсыз материалдар тарату.\n┕ *Жаза: 1 күн тайм-аут (Бан/Кик болуы мүмкін)*\n\n` +
            `**1.8 Айналып өту:** Жазадан жалтару үшін қосымша аккаунттар ашу.\n┕ **Жаза: Мәңгілік бандау**\n\n` +
            `**1.9 Қатыгездік:** Зорлық-зомбылық, адам шошырлық материалдар жариялау.\n┕ *Жаза: 3 күн тайм-аут*\n\n` +
            `**1.10 Әдепсіздік:** Сексуалдық, вульгарлық мазмұндағы балағаттар.\n┕ *Жаза: 1 күн тайм-аут*\n\n` +
            `**1.11 Техникалық бұзушылық:** Дауыс эффектілерін теріс пайдалану.\n┕ *Жаза: 1 күн тайм-аут*\n\n` +
            `**1.12 Құпиялылық:** Приват арналардағы ақпаратты жариялау.\n┕ *Жаза: 3 сағат тайм-аут*\n\n` +
            `**1.13 Сыртқы жарнама:** Профильде басқа жобаларды жарнамалау.\n┕ *Жаза: Кик > Бан*\n\n` +
            `--- \n` +
            `⚠️ *Ережені білмеу жауапкершіліктен босатпайды.*`
        )
        .setFooter({ text: 'Соңғы жаңарту: 08.05.2026 • QYRAN PROJECT' })
        .setTimestamp();

    await message.channel.send({ embeds: [rulesEmbed] });
    await message.delete();
  }

  // --- ДҮКЕН ЖӘНЕ МЕДИА ---
  if (message.content === '!setup-all') {
    const shopEmbed = new EmbedBuilder()
        .setColor('#f1c40f')
        .setTitle('🛒 QYRAN Дүкен')
        .setDescription(
            `**Тауарлар туралы толығырақ:**\n` +
            `Minecraft серверіне арналған донат жүйесі: привилегиялар, арнайы киттер және қосымша мүмкіндіктер.\n\n` +
            `**Жобаны қолдап, бірегей ойын мүмкіндіктерін алыңыз:**\n` +
            `• Привилегиялар (VIP, IMRT...)\n` +
            `• Арнайы киттер мен ресурстар\n` +
            `• Қосымша командалар\n\n` +
            `Сатып алу үшін төмендегі батырманы басыңыз немесе сайтқа өтіңіз.`
        )
        .setImage(SHOP_BANNER);

    const shopRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setLabel('Сайт арқылы сатып алу').setStyle(ButtonStyle.Link).setURL(WEBSITE_URL).setEmoji('🌍'),
        new ButtonBuilder().setCustomId('buy_shop').setLabel('Өтініш қалдыру').setStyle(ButtonStyle.Success).setEmoji('💰')
    );

    const mediaEmbed = new EmbedBuilder()
        .setColor('#3498db')
        .setTitle('🎬 Медиа серіктестік')
        .setDescription(
            `Біз сіздермен **медиа ойыншы (TikTok / YouTube / Minecraft)** ретінде ынтымақтастыққа дайынбыз.\n\n` +
            `**Біз ұсынамыз:**\n` +
            `✅ Бірлесіп дамыту и ілгерілету\n` +
            `🎥 Сапалы контент жасауға көмек\n` +
            `🚀 Серверді танымал ету мүмкіндігі\n` +
            `📢 Платформаларда жарнама жасау\n\n` +
            `Өтініш беру үшін төмендегі батырманы басыңыз.`
        )
        .setImage(MEDIA_BANNER);

    const mediaRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('apply_media').setLabel('Өтініш беру').setStyle(ButtonStyle.Primary).setEmoji('🎥')
    );

    await message.channel.send({ embeds: [shopEmbed], components: [shopRow] });
    await message.channel.send({ embeds: [mediaEmbed], components: [mediaRow] });
    await message.delete();
  }

  // --- МОНИТОРИНГ ---
  if (message.content === '!setup-server') {
    const serverEmbed = new EmbedBuilder()
        .setColor('#2ecc71')
        .setTitle('QYRAN MINECRAFT #1')
        .addFields(
            { name: '🌐 Статус', value: '`Online`', inline: true },
            { name: '🗺️ Карта', value: '`Grief`', inline: true },
            { name: '👥 Ойыншылар', value: '`Жүктелуде...`', inline: true }
        )
        .setDescription(`**Java IP:** \`qyran.ru\`\n**Bedrock IP:** \`\``)
        .setImage(MONITORING_BANNER);
    statusMessage = await message.channel.send({ embeds: [serverEmbed] });
    await message.delete();
  }
});

// --- ИНТЕРАКЦИЯЛАР (Buttons, Modals) ---
client.on('interactionCreate', async (interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId === 'open_ticket') {
            try {
                const permissions = [
                    { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
                    { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory] }
                ];
                STAFF_ROLES.forEach(roleId => {
                    if (interaction.guild.roles.cache.has(roleId)) {
                        permissions.push({ id: roleId, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory] });
                    }
                });
                const ticketChannel = await interaction.guild.channels.create({
                    name: `ticket-${interaction.user.username}`,
                    type: ChannelType.GuildText,
                    parent: TICKET_CATEGORY_ID,
                    permissionOverwrites: permissions,
                });
                const welcome = new EmbedBuilder()
                    .setColor('#3498db')
                    .setTitle('📩 Поддержка')
                    .setDescription(`Сәлем ${interaction.user}! Мәселеңізді жазыңыз.`)
                    .setTimestamp();
                const closeBtn = new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId('close_ticket').setLabel('Закрыть тикет').setStyle(ButtonStyle.Danger).setEmoji('🔒')
                );
                await ticketChannel.send({ embeds: [welcome], components: [closeBtn] });
                return interaction.reply({ content: `✅ Тикет ашылды: ${ticketChannel}`, ephemeral: true });
            } catch (err) { console.error(err); }
        }

        if (interaction.customId === 'close_ticket') {
            await interaction.reply('Канал 5 секундтан кейін жойылады...');
            setTimeout(() => interaction.channel.delete().catch(() => {}), 5000);
            return;
        }

        if (interaction.customId === 'buy_shop' || interaction.customId === 'apply_media') {
            const isShop = interaction.customId === 'buy_shop';
            const modal = new ModalBuilder()
                .setCustomId(isShop ? 'shop_modal' : 'media_modal')
                .setTitle(isShop ? 'Сатып алу' : 'Медиаға өтініш');
            const input = new TextInputBuilder()
                .setCustomId('user_input')
                .setLabel(isShop ? "Не сатып алғыңыз келеді?" : "Әлеуметтік желі (TikTok/YouTube)")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);
            modal.addComponents(new ActionRowBuilder().addComponents(input));
            await interaction.showModal(modal);
        }
    }

    if (interaction.type === InteractionType.ModalSubmit) {
        const val = interaction.fields.getTextInputValue('user_input');
        const isShop = interaction.customId === 'shop_modal';
        const logEmbed = new EmbedBuilder()
            .setColor(isShop ? '#f1c40f' : '#3498db')
            .setTitle(isShop ? '💰 ЖАҢА САТЫП АЛУ ӨТІНІШІ' : '🎥 ЖАҢА МЕДИА ӨТІНІШ')
            .addFields({ name: 'Пайдаланушы:', value: `${interaction.user.tag}` }, { name: 'Мәлімет:', value: val })
            .setTimestamp();
        const logChannel = client.channels.cache.get(ADMIN_LOG_CHANNEL_ID);
        if (logChannel) await logChannel.send({ embeds: [logEmbed] });
        await interaction.reply({ content: '✅ Өтінішіңіз сәтті жіберілді!', ephemeral: true });
    }
});

client.login(process.env.TOKEN);
