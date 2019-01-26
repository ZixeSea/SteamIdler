const SteamUser = require("steam-user");
const config = require("./config.js");
const client = new SteamUser();
const logInOptions = {
    accountName: config.username,
    password: config.password
};

client.on("loggedOn", () => {
    console.log("\nLogged on with " + config.username + ", and i'm now IDLING.");
    client.setPersona(SteamUser.Steam.EPersonaState.Online);
    client.gamesPlayed(config.idle_game_id);
});

client.on("disconnected", (result, msg) => {
    console.log("The bot has been disconnected, with the reason: " + msg);
});

client.on("error", (reason) => {
    console.log("Steam" + reason);
});

process.on("unhandledRejection", (reason) => {
    console.log("Unhandled Rejection: " + reason);
});

client.logOn(logInOptions);