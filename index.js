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
const MONITORING_BANNER = 'https://media.discordapp.net/attachments/1482733365160575128/1495440193396674822/qyranbanner_.png?format=webp';
const SHOP_BANNER = 'https://media.discordapp.net/attachments/1482733365160575128/1495649008058896584/magazin.png?format=webp'; 
const MEDIA_BANNER = 'https://media.discordapp.net/attachments/1482733365160575128/1495645413909463160/mediaplayer.png?format=webp';
const INFO_CENTER_BANNER = 'https://media.discordapp.net/attachments/1482733365160575128/1495478041265045798/content.png?format=webp';

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
            { name: '👥 Всего: **' + totalMembers + '**', value: '\u200B', inline: false },
            { name: '👤 Людей: **' + humanCount + '**', value: '\u200B', inline: false },
            { name: '🤖 Ботов: **' + botCount + '**', value: '\u200B', inline: false },
            { name: '\u200B', value: '---', inline: false },
            { name: '### По статусам:', inline: false },
            { name: '🟢 В сети: **' + online + '**', value: '\u200B', inline: false },
            { name: '🌙 Неактивен: **' + idle + '**', value: '\u200B', inline: false },
            { name: '⛔ Не беспокоить: **' + dnd + '**', value: '\u200B', inline: false },
            { name: '⚪ Не в сети: **' + offline + '**', value: '\u200B', inline: false }
        )
        .setFooter({ 
            text: `Приведенные выше числа являются приблизительными.\nQYRAN © 2026 Барлық құқықтар қорғалған`,
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

  // --- ҚАЗАҚША ЕРЕЖЕЛЕР (ТОЛЫҚ НҰСҚА 1.1 - 1.13) ---
  if (message.content === '!setup-rules') {
    const rulesEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('📜 Блоктау ережелері — QYRAN PROJECT')
        .setDescription(
            `Ережелер мен шарттар жобаның барлық мәтіндік және дауыстық арналарына, соның ішінде профиль аватарына, сипаттамасына, никнейміне және QYRAN PROJECT Discord қауымдастығының рөлдеріне қолданылады.\n\n` +
            `ℹ️ **1.1** Қатысушыға, оның туыстарына немесе жақындарына тіл тигізу, балағаттау.\n🚫 Тайм-аут: 1 сағ > 3 сағ > 6 сағ > 12 сағ.\n\n` +
            `ℹ️ **1.2** Діни және саяси тақырыптардағы дау-дамайлар.\n🚫 Тайм-аут: 6 сағат.\n\n` +
            `ℹ️ **1.3** Спам және флуд, ойыншылар мен рөлдерді негізсіз көп белгілеу.\n🚫 Тайм-аут: 1 сағ > 3 сағ > 6 сағ > 12 сағ.\n\n` +
            `ℹ️ **1.4** Өзін басқа қатысушы немесе әкімшілік ретінде таныстыру.\n🚫 Тайм-аут: 6 сағат.\n\n` +
            `ℹ️ **1.5** Қатысушыларды алдау немесе қате ақпарат беру.\n🚫 Тайм-аут: 1 сағ > 6 сағ > 1 күн.\n\n` +
            `ℹ️ **1.6** Тыйым салынған заттарды жариялау, жарнамалау немесе сату.\n🚫 **Мәңгілік бандау**.\n\n` +
            `ℹ️ **1.7** Әкімшілік рұқсатынсыз жарнама жасау және материалдар тарату.\n🚫 Тайм-аут: 1 күн (Discord-тан бан/кик болуы мүмкін).\n\n` +
            `ℹ️ **1.8** Жазадан жалтару үшін қосымша аккаунттар (твинк) ашу.\n🚫 **Мәңгілік бандау**.\n\n` +
            `ℹ️ **1.9** Зорлық-зомбылық, азаптау немесе кез келген басқа шокирующий материалдарды жариялауға тыйым салынады.\n🚫 Тайм-аут: 3 күн.\n\n` +
            `ℹ️ **1.10** Балағат сөздер, сексуалдық, дөрекі немесе арандатушылық сипаттағы көріністерге тыйым салынады.\n🚫 Тайм-аут: 1 күн.\n\n` +
            `ℹ️ **1.11** Дауыстық эффектілер мен БҚ-ны асыра пайдалану.\n🚫 Тайм-аут: 1 күн.\n\n` +
            `ℹ️ **1.12** Жеке арналардағы ақпараттарды жария арналарда жариялау.\n🚫 Тайм-аут: 3 сағат.\n\n` +
            `ℹ️ **1.13** Никнеймде, профильде немесе статуста басқа жобаларды жарнамалауға тыйым салынады.\n🚫 Кик > Бан.\n\n` +
            `**Ережені білмеу жауапкершіліктен босатпайды. • 08.05.2026**`
        );

    await message.channel.send({ embeds: [rulesEmbed] });
    await message.delete();
  }

  if (message.content === '!setup-info') {
    const infoEmbed = new EmbedBuilder()
        .setColor('#3498db')
        .setTitle('::: ::: ::: Информационный центр')
        .setDescription(
            `📩 **• Поддержка:**\n` +
            `Төмендегі батырманы басып тикет ашыңыз.\n\n` +
            `ℹ️ **• Навигация:**\n` +
            `• 🌍 **Сайт:** [qyran.ru](${WEBSITE_URL})\n` +
            `• 📘 <#1482733569422921859> — ақпарат\n` +
            `• 💸 <#1482752097723093232> — магазин\n` +
            `• ⚡ <#1482752143449653298> — медиа\n` +
            `• 📕 <#1495402176070291496> — ережелер\n\n` +
            `📱 **• Біздің Telegram:**\n` +
            `👉 [QYRAN Telegram](${TELEGRAM_URL})`
        )
        .setImage(INFO_CENTER_BANNER);

    const infoRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('open_ticket').setLabel('Тикет ашу').setEmoji('📩').setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setLabel('Сайтқа өту').setEmoji('🌍').setURL(WEBSITE_URL).setStyle(ButtonStyle.Link),
        new ButtonBuilder().setLabel('Telegram').setEmoji('✈️').setURL(TELEGRAM_URL).setStyle(ButtonStyle.Link)
    );

    await message.channel.send({ embeds: [infoEmbed], components: [infoRow] });
    await message.delete();
  }

  if (message.content === '!setup-all') {
    const shopEmbed = new EmbedBuilder()
        .setColor('#f1c40f')
        .setTitle('🛒 QYRAN Дүкен')
        .setDescription(`Донат сатып алу үшін сайтқа өтіңіз немесе өтініш қалдырыңыз.`)
        .setImage(SHOP_BANNER);

    const shopRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setLabel('Сайт').setStyle(ButtonStyle.Link).setURL(WEBSITE_URL).setEmoji('🌍'),
        new ButtonBuilder().setCustomId('buy_shop').setLabel('Өтініш беру').setStyle(ButtonStyle.Success).setEmoji('💰')
    );

    const mediaEmbed = new EmbedBuilder()
        .setColor('#3498db')
        .setTitle('🎬 Медиа серіктестік')
        .setDescription(`Медиа рөлін алу үшін өтініш қалдырыңыз.`)
        .setImage(MEDIA_BANNER);

    const mediaRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('apply_media').setLabel('Өтініш беру').setStyle(ButtonStyle.Primary).setEmoji('🎥')
    );

    await message.channel.send({ embeds: [shopEmbed], components: [shopRow] });
    await message.channel.send({ embeds: [mediaEmbed], components: [mediaRow] });
    await message.delete();
  }

  if (message.content === '!setup-server') {
    const serverEmbed = new EmbedBuilder()
        .setColor('#2ecc71')
        .setTitle('QYRAN MINECRAFT #1')
        .addFields(
            { name: '🌐 Статус', value: '`Online`', inline: true },
            { name: '🗺️ Карта', value: '`Grief`', inline: true },
            { name: '👥 Ойыншылар', value: '`Жүктелуде...`', inline: true }
        )
        .setImage(MONITORING_BANNER);
    statusMessage = await message.channel.send({ embeds: [serverEmbed] });
    await message.delete();
  }
});

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
                    new ButtonBuilder().setCustomId('close_ticket').setLabel('Закрыть').setStyle(ButtonStyle.Danger)
                );

                await ticketChannel.send({ embeds: [welcome], components: [closeBtn] });
                return interaction.reply({ content: `✅ Тикет ашылды: ${ticketChannel}`, ephemeral: true });
            } catch (err) { console.error(err); }
        }

        if (interaction.customId === 'close_ticket') {
            await interaction.reply('Канал 5 секундтан кейін жойылады...');
            setTimeout(() => interaction.channel.delete().catch(() => {}), 5000);
        }

        if (interaction.customId === 'buy_shop' || interaction.customId === 'apply_media') {
            const isShop = interaction.customId === 'buy_shop';
            const modal = new ModalBuilder()
                .setCustomId(isShop ? 'shop_modal' : 'media_modal')
                .setTitle(isShop ? 'Сатып алу' : 'Медиаға өтініш');
            
            const input = new TextInputBuilder()
                .setCustomId('user_input')
                .setLabel("Мәліметтерді жазыңыз:")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            modal.addComponents(new ActionRowBuilder().addComponents(input));
            await interaction.showModal(modal);
        }
    }

    if (interaction.type === InteractionType.ModalSubmit) {
        const val = interaction.fields.getTextInputValue('user_input');
        const logEmbed = new EmbedBuilder()
            .setColor('#3498db')
            .setTitle('📝 Жаңа өтініш')
            .addFields(
                { name: 'Пайдаланушы:', value: `${interaction.user.tag}` },
                { name: 'Мәлімет:', value: val || 'Бос' }
            ).setTimestamp();
        
        const logChannel = client.channels.cache.get(ADMIN_LOG_CHANNEL_ID);
        if (logChannel) await logChannel.send({ embeds: [logEmbed] });
        await interaction.reply({ content: '✅ Жіберілді!', ephemeral: true });
    }
});

client.login(process.env.TOKEN);
