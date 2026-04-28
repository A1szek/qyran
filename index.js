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
const SERVER_IP = 'qyran.ru';
const TELEGRAM_URL = 'https://t.me/qyranproject';
const WEBSITE_URL = 'https://www.qyran.ru';

// --- БАННЕРЛЕР ---
const MONITORING_BANNER = 'https://media.discordapp.net/attachments/1482733365160575128/1495440193396674822/qyranbanner_.png?ex=69e6e976&is=69e597f6&hm=15ead6e70822447153dbc87368fcce6b7c1eb37d846ab77808e2ec2f550ad607&=&format=webp&quality=lossless&width=1814&height=1092';
const SHOP_BANNER = 'https://media.discordapp.net/attachments/1482733365160575128/1495649008058896584/magazin.png?ex=69e7032f&is=69e5b1af&hm=1e5814b07e6a4e62a3912c8d12d647bd3626767ea4bc8a1dc7ef1e07800d4f1c&=&format=webp&quality=lossless&width=1956&height=1092'; 
const MEDIA_BANNER = 'https://media.discordapp.net/attachments/1482733365160575128/1495645413909463160/mediaplayer.png?ex=69e6ffd6&is=69e5ae56&hm=e80a1fc1c09e9fbb54d126710a0fc7505ec3c0b1a6c7e6ef729010f6eb357268&=&format=webp&quality=lossless&width=2572&height=1092';
const INFO_CENTER_BANNER = 'https://media.discordapp.net/attachments/1482733365160575128/1495478041265045798/content.png?ex=69e663f5&is=69e51275&hm=3c1a9025193b82e7c44cbf7d67a7f818784c3fc6e224f2854713ac68995ef4a9&=&format=webp&quality=lossless&width=2784&height=1050';

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

  // 2. ЕРЕЖЕЛЕР
  if (message.content === '!setup-rules') {
    const rulesEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('📜 Негізгі ережелер — QYRAN PROJECT')
        .setDescription(
            `**📜 Негізгі ережелер**\n` +
            `1.1 Ережелерді білмеу сізді жауапкершіліктен босатпайды;\n` +
            `1.2 Біздің серверде ойнай бастағаннан кейін, сіз осы ережелермен автоматты түрде келісесіз;\n` +
            `1.3 Әкімшілік ойыншыны ережеде көрсетілмеген себеп бойынша да жазалай алады;\n` +
            `1.4 Әкімшілік серверде ойнай алмау (уақытша немесе тұрақты) үшін жауап бермейді;\n` +
            `1.5 Сервер немесе плагиндердің жұмысындағы ақаулар салдарынан жоғалған ойын ресурстарына әкімшілік жауап бермейді;\n` +
            `1.6 Әкімшілік сервердің тұрақты жұмысын, ақпараттың сақталуын және жобаның жалғасуын кепілдендірмейді;\n` +
            `1.7 Әкімшілік қызметтер мен сервистердің тұрақты жұмыс істеуіне кепілдік бермейді және байланыс ақаулары, бағдарламалық қателер немесе қызметті дұрыс пайдаланбау салдарынан келген зиян үшін жауап бермейді;\n` +
            `1.8 Ойыншылар барлық ережелерді сақтауға міндетті;\n` +
            `1.9 Әкімшілік барлық әрекеттер мен чат хабарламаларын логқа сақтайды;\n` +
            `1.10 Әкімшілік ережелерді ойыншыларды ескертпей өзгерте алады;\n` +
            `1.11 Әкімшілікке тіл тигізу немесе арандату — тыйым салынады.\n\n` +
            `**💬 Чат ережелері**\n` +
            `2.1 КАПС / спам / флуд — тыйым салынады\n→ Жаза: мут 10–30 минут (қайталанса 2 сағатқа дейін)\n` +
            `2.2 Ойыншыларды қорлау, кемсіту — тыйым салынады\n→ Жаза: мут 30 минут – 2 сағат (қайталанса 1 күн бан)\n` +
            `2.3 Балағат сөздер (жасырын түрде де) — тыйым салынады\n→ Жаза: мут 20–60 минут (қайталанса 3 сағатқа дейін)\n` +
            `2.4 Бөгде ресурстарды жарнамалау — тыйым салынады\n→ Жаза: мут 3–6 сағат немесе 1 күн бан\n` +
            `2.5 Сауда чаттарын тек өз мақсатында пайдалану керек\n→ Жаза: мут 15–30 минут\n` +
            `2.6 Ойыншылардың туыстарын қорлау — тыйым салынады\n→ Жаза: 1–3 күн бан\n` +
            `2.7 Ұлтаралық араздық, нәсілшілдік — тыйым салынады\n→ Жаза: 3–7 күн бан (ауыр жағдайда PERM BAN)\n` +
            `2.8 Чат жазасын айналып өту — тыйым салынады\n→ Жаза: 1 күн бан\n` +
            `2.9 Ойыншыларды тексеріске шақыру — тыйым салынады\n→ Жаза: мут 30–60 минут\n` +
            `2.10 Байланыс мәліметтерін (Discord, VK т.б.) жалпы чатқа жіберу — тыйым салынады\n→ Жаза: мут 30–60 минут (жеке хабарламада рұқсат)\n` +
            `2.11 Сауданы серверден тыс жүргізу — тыйым салынады\n→ Жаза: 1–3 күн бан\n` +
            `2.12 Ережені бұзғанын мойындау\n→ Жаза: 1–7 күн бан\n\n` +
            `**👤 Аккаунт ережелері**\n` +
            `3.1 Ник келесі талаптарға сай болмауы керек: 3.1.1 Балағат; 3.1.2 Басқа жобаларға/читтерге ұқсас; 3.1.3 Әкімшілікке ұқсас; 3.1.4 Қара тізімдегілерге ұқсас;\n` +
            `3.2 Аккаунтты басқа адамдарға беру — тыйым салынады;\n` +
            `3.3 Аккаунттағы барлық әрекет үшін иесі жауап береді;\n` +
            `3.4 Аккаунт немесе донатты сату/беру — тыйым салынады;\n` +
            `3.5 Донатты басқа аккаунтқа көшіру мүмкін емес.\n\n` +
            `**🎮 Ойын ережелері**\n` +
            `4.1 Алаяқтық және әкімшілікті алдау — тыйым салынады;\n` +
            `4.2 Ойын заттарын нақты ақшаға сату/сатып алу — тыйым салынады;\n` +
            `4.3 Ойынды жеңілдететін кез келген нәрсені қолдану — тыйым салынады;\n` +
            `4.4 Ереже бұзушыға көмектесу — тыйым салынады;\n` +
            `4.5 Бірнеше рет бан алған аккаунттармен ойнау — тыйым салынады;\n` +
            `4.6 Серверге лаг тудыру немесе құлату әрекеті — тыйым салынады;\n` +
            `4.6.1 Көп поршеньді механизмдер жасау — тыйым салынады;\n` +
            `4.7 Өзін әкімшілік ретінде көрсету — тыйым салынады;\n` +
            `4.8 Багтарды пайдалану немесе жасыру — тыйым салынады;\n` +
            `4.9 Режимдегі лимиттен көп ойыншымен ойнау — тыйым салынады;\n` +
            `4.10 Әдепсіз немесе нацистік құрылыстар — тыйым салынады;\n` +
            `4.11 Басқаларды ереже бұзуға итермелеу — тыйым салынады;\n` +
            `4.12 Медиа тұлғаларға кедергі жасау — тыйым салынады;\n` +
            `*📌 Ескерту: 4.3 және 4.4 тармақтарын бұзса — аккаунт тазалануы мүмкін*\n\n` +
            `**🛠 Тексеру ережелері**\n` +
            `5.1 Тексерушінің талаптарын орындау міндетті;\n` +
            `5.2 Ережелер тексерушіге байланысты өзгеруі мүмкін;\n` +
            `5.3 Тексеру кезінде чатқа назар аударыңыз;\n` +
            `5.5 Тексеруге кедергі жасау — тыйым салынады;\n` +
            `5.6 Файлдарды жою — тыйым салынады;\n` +
            `5.7 Тексеру кезінде ойыннан шығу — тыйым салынады;\n` +
            `5.8 Тексеруді жазу — тек рұқсатпен;\n` +
            `5.9 Бағдарламалар орнату сұралуы мүмкін.`
        )
        .setFooter({ text: 'QYRAN PROJECT • Тәртіпті сақтағаныңыз үшін рахмет!' });
    await message.channel.send({ embeds: [rulesEmbed] });
    await message.delete();
  }

  // 3. ДҮКЕН ЖӘНЕ МЕДИА
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
            `✅ Бірлесіп дамыту және ілгерілету\n` +
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
        .setDescription(`**Java IP:** \`qyran.ru\`\n**Bedrock IP:** \`\``)
        .setImage(MONITORING_BANNER);
    statusMessage = await message.channel.send({ embeds: [serverEmbed] });
    await message.delete();
  }
});

client.on('interactionCreate', async (interaction) => {
    if (interaction.isButton()) {
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
                .setDescription(`Сәлем ${interaction.user}! Мәселеңізді жазыңыз, әкімшілік жауап береді.`)
                .setTimestamp();

            const closeBtn = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('close_ticket').setLabel('Закрыть тикет').setStyle(ButtonStyle.Danger).setEmoji('🔒')
            );

            await ticketChannel.send({ embeds: [welcome], components: [closeBtn] });
            return interaction.reply({ content: `✅ Тикет ашылды: ${ticketChannel}`, ephemeral: true });
        }

        if (interaction.customId === 'close_ticket') {
            await interaction.reply('Канал 5 секундтан кейін жойылады...');
            setTimeout(() => interaction.channel.delete(), 5000);
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
            .addFields(
                { name: 'Пайдаланушы:', value: `${interaction.user.tag}` },
                { name: 'Мәлімет:', value: val }
            ).setTimestamp();
        
        const logChannel = client.channels.cache.get(ADMIN_LOG_CHANNEL_ID);
        if (logChannel) await logChannel.send({ embeds: [logEmbed] });
        await interaction.reply({ content: '✅ Өтінішіңіз сәтті жіберілді!', ephemeral: true });
    }
});

client.login(process.env.TOKEN);
