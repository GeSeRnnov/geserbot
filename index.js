require('dotenv').config();
const path = require('path')
const {
    MatrixClient,
    SimpleFsStorageProvider,
    AutojoinRoomsMixin,
    RustSdkCryptoStorageProvider,
} = require("matrix-bot-sdk");
const { 
} = require("matrix-bot-sdk");

// const cryptoStorage = new RustSdkCryptoStorageProvider("./crypto-storage");

// const client = new MatrixClient(homeserverUrl, accessToken, storage, cryptoStorage);
// Инициализация перед запуском
// await client.crypto.prepare(await client.getJoinedRooms());
// await client.start();
// Данные бота
const homeserverUrl = process.env.HOMESERVER
const accessToken = 'syt_Z2VzZXJubm92LWJvdA_hbUnEadIwTtRMRxNvpQD_2JYvZU'//process.env.ACCESS_TOKEN

const storage = new SimpleFsStorageProvider("bot.json");
const cryptoStorage = new RustSdkCryptoStorageProvider(path.join(__dirname, "crypto"));

const client = new MatrixClient(homeserverUrl, accessToken, storage, cryptoStorage);
client.deviceId = process.env.DEVICE_ID
// Автоматически принимать приглашения в комнаты
AutojoinRoomsMixin.setupOnClient(client);

(async () => {
    // Инициализация криптографии перед запуском
    // await client.crypto.prepare(await client.getJoinedRooms());
    await client.crypto.prepare([]); 

    client.on("room.message", async (roomId, event) => {
        const isEncrypted = await client.isRoomEncrypted(roomId);
        if (isEncrypted) {
            // Если зашифрована - подгружаем ключи только для этой комнаты
            await client.crypto.prepare([roomId]);
        }
        const myUserId = await client.getUserId();
        if (event["sender"] === myUserId) return;

        // Теперь бот будет автоматически расшифровывать сообщения!
        const content = event["content"];
        if (content["msgtype"] === "m.text") {
            const body = content["body"];
            
            // Отправляем ответ (он автоматически зашифруется, если комната защищена)
            await client.sendMessage(roomId, {
                "msgtype": "m.text",
                "body": `Зашифрованное эхо: ${body}`
            });
        }
    });

    await client.start();
    console.log("Бот запущен с поддержкой шифрования!");
})();

// client.on("room.message", async (roomId, event) => {
//     await client.crypto.prepare(await client.getJoinedRooms());
//     // Не отвечаем на собственные сообщения
//     const myUserId = await client.getUserId();

//     if (event["sender"] === myUserId) return;
//     const content = event["content"];
//     const msgType = content["msgtype"];
    
//     // Проверяем, что это текстовое сообщение
//     if (msgType === "m.text") {
//         // Ответ на текстовое сообщение
//         // await client.sendMessage(roomId, {
//         //     "msgtype": "m.text",
//         //     "body": `Вы сказали: ${content["body"]}`
//         // });
//     } 
//     else if (["m.image", "m.video", "m.audio", "m.file"].includes(msgType)) {
//         // Ответ на мультимедиа (просто дублируем файл по его ссылке mxc://)
        
//         // await client.sendMessage(roomId, {
//         //     "msgtype": msgType,
//         //     "body": `Эхо файла: ${content["body"]}`,
//         //     "url": content["url"],
//         //     "info": content["info"] || {} 
//         // });
//     }
// });



// client.start().then(() => console.log("Бот запущен!"));
