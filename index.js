const {
    MatrixClient,
    SimpleFsStorageProvider,
    AutojoinRoomsMixin
} = require("matrix-bot-sdk");
// const { RustSdkCryptoStorageProvider } = require("matrix-bot-sdk");

// const cryptoStorage = new RustSdkCryptoStorageProvider("./crypto-storage");

// const client = new MatrixClient(homeserverUrl, accessToken, storage, cryptoStorage);
// Инициализация перед запуском
// await client.crypto.prepare(await client.getJoinedRooms());
// await client.start();
// Данные бота
const homeserverUrl = process.env.HOMESERVER
const accessToken = process.env.ACCESS_TOKEN

const storage = new SimpleFsStorageProvider("bot.json");
const client = new MatrixClient(homeserverUrl, accessToken, storage);

// Автоматически принимать приглашения в комнаты
AutojoinRoomsMixin.setupOnClient(client);

client.on("room.message", async (roomId, event) => {
    // Не отвечаем на собственные сообщения
    const myUserId = await client.getUserId();

    if (event["sender"] === myUserId) return;
    const content = event["content"];
    const msgType = content["msgtype"];
    
    // Проверяем, что это текстовое сообщение
    if (msgType === "m.text") {
        // Ответ на текстовое сообщение
        // await client.sendMessage(roomId, {
        //     "msgtype": "m.text",
        //     "body": `Вы сказали: ${content["body"]}`
        // });
    } 
    else if (["m.image", "m.video", "m.audio", "m.file"].includes(msgType)) {
        // Ответ на мультимедиа (просто дублируем файл по его ссылке mxc://)
        
        // await client.sendMessage(roomId, {
        //     "msgtype": msgType,
        //     "body": `Эхо файла: ${content["body"]}`,
        //     "url": content["url"],
        //     "info": content["info"] || {} 
        // });
    }
});



client.start().then(() => console.log("Бот запущен!"));
