require('dotenv').config();
const { MatrixClient } = require("matrix-bot-sdk");

const client = new MatrixClient(process.env.HOMESERVER, process.env.ACCESS_TOKEN);

async function reset() {
    try {
        console.log("Попытка деавторизации сессии...");
        await client.doHttpRequest("POST", "/_matrix/client/v3/logout");
        console.log("Успех! Сессия закрыта на сервере.");
    } catch (e) {
        console.error("Ошибка при выходе (возможно, токен уже невалиден):", e.body);
    }
}
reset();