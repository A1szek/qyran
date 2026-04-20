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
    GatewayIntentBits.MessageContent
  ],
});

// --- БОТ ПАРАМЕТРЛЕРІ ---
const ADMIN_LOG_CHANNEL_ID = '1482733365160575128'; 
const TICKET_CATEGORY_ID = '1482733463898427443'; 
const SERVER_IP = 'grief.play.ski';
const TELEGRAM_URL = 'https://t.me/qyranproject';

// --- СЕН БЕРГЕН БАННЕРЛЕРДІҢ СЫЛТЕМЕЛЕРІ (ӨЗГЕРІССІЗ) ---
const MONITORING_BANNER = 'https://media.discordapp.net/attachments/1482733365160575128/1495440193396674822/qyranbanner_.png?ex=69e6e976&is=69e597f6&hm=15ead6e70822447153dbc87368fcce6b7c1eb37d846ab77808e2ec2f550ad607&=&format=webp&quality=lossless&width=1814&height=1092';
const RULES_BANNER = 'https://media.discordapp.net/attachments/1482733365160575128/1495478041265045798/content.png?ex=69e663f5&is=69e51275&hm=3c1a9025193b82e7c44cbf7d67a7f818784c3fc6e224f2854713ac68995ef4a9&=&format=webp&quality=lossless&width=2784&height=1050';
const SHOP_BANNER = 'https://media.discordapp.net/attachments/1482733365160575128/1495649008058896584/magazin.png?ex=69e7032f&is=69e5b1af&hm=1e5814b07e6a4e62a3912c8d12d647bd3626767ea4bc8a1dc7ef1e07800d4f1c&=&format=webp&quality=lossless&width=1956&height=1092'; 
const MEDIA_BANNER = 'https://media.discordapp.net/attachments/1482733365160575128/1495645413909463160/mediaplayer.png?ex=69e6ffd6&is=69e5ae56&hm=e80a1fc1c09e9fbb54d126710a0fc7505ec3c0b1a6c7e6ef729010f6eb357268&=&format=webp&quality=lossless&width=2572&height=1092';

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

  // 1. ИНФОРМАЦИОННЫЙ ЦЕНТР
  if (message.content === '!setup-info') {
    const infoEmbed = new EmbedBuilder()
        .setColor('#3498db')
        .setTitle('::: ::: ::: Информационный центр')
        .setDescription(
            `📩 **• Поддержка:**\n` +
            `Төмендегі батырманы басып тикет ашыңыз. Біздің әкімшілік сізге міндетті түрде көмектеседі.\n\n` +
            `ℹ️ **• Навигация:**\n` +
            `• 📘 <#1482733569422921859> — ақпараттар\n` +
            `• 💸 <#1482752097723093232> — магазин\n` +
            `• ⚡ <#1482752143449653298> — медиа\n` +
            `• 📕 <#1495402176070291496> — ережелер\n` +
            `• 📍 <#1495441498202837154> — серверы\n\n` +
            `📱 **• Біздің Telegram:**\n` +
            `👉 [QYRAN Telegram-ға өту](${TELEGRAM_URL})`
        )
        .setImage(RULES_BANNER); // Инфо центр үшін бүркіт баннері

    const infoRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('open_ticket').setLabel('Открыть тикет').setEmoji('📩').setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setLabel('Telegram').setEmoji('✈️').setURL(TELEGRAM_URL).setStyle(ButtonStyle.Link)
    );

    await message.channel.send({ embeds: [infoEmbed], components: [infoRow] });
    await message.delete();
  }

  // 2. ЕРЕЖЕЛЕР (ТОЛЫҚ)
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
        .setImage(RULES_BANNER)
        .setFooter({ text: 'QYRAN PROJECT • Тәртіпті сақтағаныңыз үшін рахмет!' });
    await message.channel.send({ embeds: [rulesEmbed] });
    await message.delete();
  }

  // 3. ДҮКЕН ЖӘНЕ МЕДИА
  if (message.content === '!setup-all') {
    const shopEmbed = new EmbedBuilder()
        .setColor('#f1c40f')
        .setTitle('🛒 QYRAN Дүкен')
        .setDescription(`Minecraft серверіне арналған донат жүйесі: привилегиялар, арнайы киттер және қосымша мүмкіндіктер.`)
        .setImage(SHOP_BANNER);

    const shopRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('buy_shop').setLabel('Сатып алу').setStyle(ButtonStyle.Success).setEmoji('💰')
    );

    const mediaEmbed = new EmbedBuilder()
        .setColor('#3498db')
        .setTitle('🎬 Медиа серіктестік')
        .setDescription(`Біз сіздермен медиа ойыншы (TikTok / YouTube / Minecraft / CS) ретінде ынтымақтастыққа дайынбыз.`)
        .setImage(MEDIA_BANNER);

    const mediaRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('apply_media').setLabel('Өтініш беру').setStyle(ButtonStyle.Primary).setEmoji('🎥')
    );

    await message.channel.send({ embeds: [shopEmbed], components: [shopRow] });
    await message.channel.send({ embeds: [mediaEmbed], components: [mediaRow] });
    await message.delete();
  }

  // 4. МОНИТОРИНГ
  if (message.content === '!setup-server') {
    const serverEmbed = new EmbedBuilder()
        .setColor('#2ecc71')
        .setTitle('QYRAN MINECRAFT #1')
        .addFields(
            { name: '🌐 Статус', value: '`Online`', inline: true },
            { name: '🗺️ Карта', value: '`Grief`', inline: true },
            { name: '👥 Ойыншылар', value: '`Жүктелуде...`', inline: true }
        )
        .setDescription(`**Java IP:** \`grief.play.ski\`\n**Bedrock IP:** \`213.152.43.25:25777\``)
        .setImage(MONITORING_BANNER);
    statusMessage = await message.channel.send({ embeds: [serverEmbed] });
    await message.delete();
  }
});

// --- ИНТЕРАКЦИЯЛАР (ТИКЕТ ЖӘНЕ МОДАЛДАР) ---
client.on('interactionCreate', async (interaction) => {
    if (interaction.isButton()) {
        
        // ТИКЕТ АШУ (КАТЕГОРИЯ ІШІНДЕ)
        if (interaction.customId === 'open_ticket') {
            const ticketChannel = await interaction.guild.channels.create({
                name: `ticket-${interaction.user.username}`,
                type: ChannelType.GuildText,
                parent: TICKET_CATEGORY_ID,
                permissionOverwrites: [
                    { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
                    { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory] },
                ],
            });

            const welcome = new EmbedBuilder()
                .setColor('#3498db')
                .setTitle('📩 Поддержка')
                .setDescription(`Сәлем ${interaction.user}! Мәселеңізді жазыңыз. Жабу үшін 🔒 басыңыз.`)
                .setTimestamp();

            const closeBtn = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('close_ticket').setLabel('Закрыть').setStyle(ButtonStyle.Danger).setEmoji('🔒')
            );

            await ticketChannel.send({ embeds: [welcome], components: [closeBtn] });
            return interaction.reply({ content: `✅ Тикет ашылды: ${ticketChannel}`, ephemeral: true });
        }

        if (interaction.customId === 'close_ticket') {
            await interaction.reply('Канал 5 секундта жойылады...');
            setTimeout(() => interaction.channel.delete(), 5000);
            return;
        }

        // SHOP & MEDIA
        if (interaction.customId === 'buy_shop' || interaction.customId === 'apply_media') {
            const isShop = interaction.customId === 'buy_shop';
            const modal = new ModalBuilder()
                .setCustomId(isShop ? 'shop_modal' : 'media_modal')
                .setTitle(isShop ? 'Сатып алу' : 'Медиаға өтініш');
            
            const input = new TextInputBuilder()
                .setCustomId('user_input')
                .setLabel(isShop ? "Не сатып алғыңыз келеді?" : "Сілтеме (TikTok/YouTube)")
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
            .setTitle(isShop ? '💰 ЖАҢА САТЫП АЛУ' : '🎥 ЖАҢА МЕДИА')
            .addFields(
                { name: 'Пайдаланушы:', value: `${interaction.user.tag}` },
                { name: 'Мәлімет:', value: val }
            ).setTimestamp();
        
        const logChannel = client.channels.cache.get(ADMIN_LOG_CHANNEL_ID);
        if (logChannel) await logChannel.send({ embeds: [logEmbed] });
        await interaction.reply({ content: '✅ Сәтті жіберілді!', ephemeral: true });
    }
});

client.login(process.env.TOKEN);
