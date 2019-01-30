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
    client.gamesPlayed(config.idleGameId);
});

client.on("vacBans", (numberOfBans, games) => {
    if(numberOfBans > 0){
        console.log("Your account " + config.username + " has been banned on: " + games + ", check the account for more info about your " + numberOfBans + " ban(s).");
        client.logOff();
    } else {
        console.log("No ban(s) found on " + config.username + ", if you get a ban the bot will stop running.");
    }
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