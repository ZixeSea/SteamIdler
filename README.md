# SteamIdler, for idling game time on steam.
[![Discord Badge](https://discordapp.com/api/guilds/98834803738054656/embed.png)](https://discordapp.com/invite/bZt8WkS)
[![Discord.js Badge](https://img.shields.io/badge/steam-user-blue.svg)](https://github.com/DoctorMcKay/node-steam-user)
[![Version Badge](https://img.shields.io/badge/Version-1.0.0-green.svg)](https://github.com/ZixeSea/SteamIdler)
[![In progress Badge](https://img.shields.io/badge/In%20progress-no-red.svg)](https://zixesea.com)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/3eb8a2ad06bf4208ac94ca4ad4efe0f5)](https://www.codacy.com/app/ZixeSea/SteamIdler?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=ZixeSea/SteamIdler&amp;utm_campaign=Badge_Grade)

**This bot can be used to idle any steam game you own up to 25 game(steam limit) at a time without realy running them.**

## License
This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/ZixeSea/SteamIdler/blob/master/LICENSE.md) file for details

## Requirements
- `git` Command line ([Windows](https://git-scm.com/download/win)|[Linux](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)|[MacOS](https://git-scm.com/download/mac)) installed
- `node` [Version 8.0.0 or higher](https://nodejs.org)
- `steam login` Required your steam username and password

## Downloading
In a command prompt in your project's folder (wherever that may be) run the following:

`git clone https://github.com/ZixeSea/SteamIdler.git`

Once finished:

- In the folder from where you ran the git command, run `cd SteamIdler` and then run `npm i`, this will install all required packages.

- Now go to `SteamIdler/config.json` and open it, and edit the following:
  * Place your username here `username: "Username here"`
  * Place your password here `password: "Password here"`
  * Place the ID's of the game to idle here `idle_game_id: [730,570,440]`
>***NOTE:*** Only replace the text `Username here or Password here`, so the `""` needs to stay and the game list must look like this `[GameID,OtherGameId]

- Now run the program by running `npm .` in a command prompt.
