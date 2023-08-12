<p align="center">
    <strong style="text-align:center; font-size:180px">STEAMIDLER V2</strong>
</p>
<p align="center">
  Light weight multi account steam idler
</p>
<p align="center">
  <a href="https://discord.com/invite/vE8qKNV">
    <img src="https://discord.com/api/guilds/98834803738054656/embed.png" alt="Discord sercver"/>
  </a>
<a href="https://github.com/DoctorMcKay/node-steam-user">
  <img src="https://img.shields.io/badge/Steam-user-blue.svg" alt="Steam user badge"/>
</a>
<a href="https://github.com/ZixeSea/SteamIdler">
  <img src="https://img.shields.io/badge/Version-2.0.0-green.svg" alt="Version Badge"/>
</a>
<a href="https://github.com/ZixeSea/SteamIdler/blob/master/LICENSE.md">
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="Version Badge"/>
</a>
</p>

## Authors

- **ZixeSea** - _Lead developer_ - github: [ZixeSea](https://github.com/ZixeSea)

## The project

This project has been created in _2019_ for me to easily run a **steam idler 24/7** in the background while using **almost no resources**. this project has been reworked in _2022_ adding a lot of new options like the "**staticIdler**" and "**dynamicIdler**" idlers. The only thing that was missing was **multi account support**. This has been added in the rewrite from _2023_ and now known as SteamIdler V2.

## Requirements

- `git` command line ([Windows](https://git-scm.com/download/win)|[Linux](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)|[MacOS](https://git-scm.com/download/mac)) installed
- `node` version 8.0.0 or higher ([get here](https://nodejs.org))

> If you have 2AF on for you steam account, you need to provide it while the program is starting. A message will appear about it.

## Download code

Run the following command in a CMD/terminal at the location where you want to download it:

```
git clone https://github.com/ZixeSea/SteamIdler.git
```

> Remember to go in to the config folder and chnage/add a config file (for example: **`src/config/account1.js`**). The name of the config file doesn't matter but every account should have it's own config file.

## Dependencies

- [steam-user](https://www.npmjs.com/package/steam-user) - Allows interaction with the Steam network via the Steam client protocol
- [asciiart-logo](https://www.npmjs.com/package/asciiart-logo) - renders a splash screen in text console with logo from ASCII characters.
- [colors](https://www.npmjs.com/package/colors) - get color and style in your node.js console
- [console-table-printer](https://www.npmjs.com/package/console-table-printer) - Printing Simple Table with Coloring rows on your console. Its useful when you want to present some tables on console using js.
- [time-stamp](https://www.npmjs.com/package/time-stamp) - Get a formatted timestamp.

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/ZixeSea/SteamIdler/blob/master/LICENSE.md) file for details (deleting and/or modifying the license file after forking isn't allowed).

---

# Table of contents

1. **[Prepare linux](#prepare-linux)**  
   1.1 [Update server](#update-server)
   1.2 [Install node.js](#install-nodejs)
2. **[Prepare windows](#prepare-windows)**  
   2.1 [Get node.js](#get-nodejs)
3. **[Account config](#account-config)**  
   3.1 [Information](#information)
   3.2 [Add config](#add-config)
4. **[Run idler](#run-idler)**  
   4.1 [Install dependencies](#install-dependencies)
   4.2 [Start program](#start-program)

---

# Prepare linux

> Everything in this section is based on a host system running **Ubuntu 18.04/20.04/22.04**. Most if not all information can be used for other versions of Ubuntu (or dabian based distro's) as well, but it may require slight changes.

## Update server

```
sudo apt update && sudo apt upgrade -y
```

## Install node.js

```
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

sudo npm i npm@9.6.1 -g
```

> The versions mentioned above can be outdated, always check [(this page)](https://nodejs.org/en/) for the most recent LTS version of node.js and check [(this page)](https://github.com/npm/cli/tags) for the most recent version of NPM. Installing outdated versions can create problems or security risks.

---

# Prepare windows

> Everything in this section is based on a host system running **Windows 10/11**. Most if not all information can be used for other versions of Windows as well, but it may require slight changes.

## Get node.js

Installing **Node.js** on windows is really easy, they have an installer for it and you can download it on their website (so it's simply clicking "next" and "ok").\

**Download link:** https://nodejs.org/en

---

# Account config

## Information

You can find the config file(s) in the config folder (`src/config`), every account that should idle also needs it's own config file. The name of the config file doesn't matter.

**- account (REQUIRED)**
`username` | String | The username from the steam account
`username` | String | The username from the steam account
`statusInvisible` | Boolean | If "true" friends will see notification
**- idlerSettings**
`parallelGameIdle` | Number | Number of games to play at ones (32 is max)
`staticIdleTime` | Number | Time to idle until switching to other games (0 is random number)
**- staticIdler**
`enabled` | Boolean | If "true" it will idle the games in "listToIdle" (if "staticIdler" is also "true", it will use that one)
`listToIdle` | Array | List of games to idle for "staticIdler" (example: [730, 570, 440])
**- dynamicIdler**
`enabled` | Boolean | If "true" it will idle the games in "dynamicIdler"
`skipBannedGames` | Boolean | If "true" the idler "dynamicIdler" won't include game you're banned in"
`skipFreeGames` | Boolean | If "true" the idler "dynamicIdler" won't include free games
`blacklistGames` | Array | List of games not to idle in "dynamicIdler" (example: [730, 570, 440])

## Add config

If you want to add another account, created a new **.js** file in the config folder (`src/config`) and copy this in the file. Don't forget the add the necessary account information and settings.

```
module.exports = {
  account: {
    username: 'username',
    password: 'password',
    statusInvisible: false
  },
  idlerSettings: {
    parallelGameIdle: 32,
    staticIdleTime: 0
  },
  staticIdler: {
    enabled: false,
    listToIdle: []
  },
  dynamicIdler: {
    enabled: false,
    skipBannedGames: false,
    skipFreeGames: false,
    blacklistGames: []
  }
};
```

---

# Run idler

## Install dependencies

The program needs to get the required dependencies to work (see [dependencies](#dependencies)), you do this with the command below. Keep in mind that you need to run this in the folder `SteamIdler` in a CMD/terminal.

```
npm i
```

## Start program

Starting/running the program is the same for linux and windows, you can use the default node.js start command listed here. Keep in mind that you need to run this in the folder `SteamIdler` in a CMD/terminal.

```
node .
```

---
