const { 
    Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, 
    ButtonStyle, ChannelType, PermissionsBitField, EmbedBuilder,
    ModalBuilder, TextInputBuilder, TextInputStyle, InteractionType 
} = require('discord.js');
const util = require('minecraft-server-util'); 
const express = require('express'); 
require('dotenv').config();

// --- ВЕБ-СЕРВЕР (Render үшін) ---
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
const TICKET_CATEGORY_ID = '1482733463898427443'; 
const ADMIN_LOG_CHANNEL_ID = '1482733365160575128'; 
const SERVER_IP = 'grief.play.ski';
const TELEGRAM_URL = 'https://t.me/+3BJyMTH6O9s1ZWRi';

// Баннерлер сілтемелері
const MAIN_BANNER = 'https://media.discordapp.net/attachments/1482733365160575128/1495478041265045798/content.png';
const SHOP_BANNER = 'https://media.discordapp.net/attachments/1482733365160575128/1495649008058896584/magazin.png'; 
const MEDIA_BANNER = 'https://media.discordapp.net/attachments/1482733365160575128/1495645413909463160/mediaplayer.png';

let statusMessage = null;

client.once('ready', () => {
  console.log(`✅ QYRAN PROJECT сәтті іске қосылды!`);

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
        } catch (e) {
            console.log('Сервер қолжетімсіз');
        }
    }
  }, 30000); 
});

client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;

  // 1. ЕРЕЖЕЛЕР (ТОЛЫҚ НҰСҚА - ӨЗГЕРІССІЗ)
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

  // 2. ДҮКЕН ЖӘНЕ МЕДИА
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
            `• Қосымша мүмкіндіктер\n\n` +
            `Сатып алу үшін төмендегі батырманы басыңыз.`
        )
        .setImage(SHOP_BANNER);

    const shopRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('buy_shop').setLabel('Сатып алу').setStyle(ButtonStyle.Success).setEmoji('💰')
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
  }

  // 3. МОНИТОРИНГ
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
        .setImage(MAIN_BANNER);

    statusMessage = await message.channel.send({ embeds: [serverEmbed] });
    await message.delete();
  }
});

// ИНТЕРАКЦИЯЛАР (Modal Submit)
client.on('interactionCreate', async (interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId === 'buy_shop') {
            const modal = new ModalBuilder().setCustomId('shop_modal').setTitle('Сатып алу');
            const input = new TextInputBuilder()
                .setCustomId('shop_item').setLabel("Не сатып алғыңыз келеді?").setPlaceholder("Мысалы: VIP").setStyle(TextInputStyle.Short).setRequired(true);
            modal.addComponents(new ActionRowBuilder().addComponents(input));
            await interaction.showModal(modal);
        }
        if (interaction.customId === 'apply_media') {
            const modal = new ModalBuilder().setCustomId('media_modal').setTitle('Медиаға өтініш');
            const input = new TextInputBuilder()
                .setCustomId('media_link').setLabel("Әлеуметтік желі").setPlaceholder("Сілтемеңіз").setStyle(TextInputStyle.Short).setRequired(true);
            modal.addComponents(new ActionRowBuilder().addComponents(input));
            await interaction.showModal(modal);
        }
    }

    if (interaction.type === InteractionType.ModalSubmit) {
        const logChannel = client.channels.cache.get(ADMIN_LOG_CHANNEL_ID);
        if (interaction.customId === 'shop_modal') {
            const val = interaction.fields.getTextInputValue('shop_item');
            const logEmbed = new EmbedBuilder()
                .setColor('#f1c40f').setTitle('💰 ЖАҢА САТЫП АЛУ ӨТІНІШІ')
                .addFields({ name: 'Кімнен:', value: `${interaction.user.tag}` }, { name: 'Тауар:', value: val }).setTimestamp();
            if (logChannel) await logChannel.send({ embeds: [logEmbed] });
            await interaction.reply({ content: '✅ Өтінішіңіз жіберілді!', ephemeral: true });
        }
        if (interaction.customId === 'media_modal') {
            const val = interaction.fields.getTextInputValue('media_link');
            const logEmbed = new EmbedBuilder()
                .setColor('#3498db').setTitle('🎥 ЖАҢА МЕДИА ӨТІНІШ')
                .addFields({ name: 'Кімнен:', value: `${interaction.user.tag}` }, { name: 'Сілтеме:', value: val }).setTimestamp();
            if (logChannel) await logChannel.send({ embeds: [logEmbed] });
            await interaction.reply({ content: '✅ Өтінішіңіз қабылданды!', ephemeral: true });
        }
    }
});

client.login(process.env.TOKEN);
