<h1>SteamIdler</h1>
<strong>Extremely light idler for steam that can easily run 24/7.</strong><br>
<a href="https://discord.com/invite/bZt8WkS">
  <img src="https://discord.com/api/guilds/98834803738054656/embed.png" alt="discord server"/>
</a>
<a href="https://github.com/DoctorMcKay/node-steam-user">
  <img src="https://img.shields.io/badge/Steam-user-blue.svg" alt="Steam user badge"/>
</a>
<a href="https://github.com/ZixeSea/SteamIdler">
  <img src="https://img.shields.io/badge/Version-1.1.0-green.svg" alt="Version Badge"/>
</a>
<a href="https://github.com/ZixeSea/SteamIdler/blob/master/LICENSE.md">
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="Version Badge"/>
</a>

---

## **General information**
### **Author**
**ZixeSea#1234** - *Lead developer* - github: [ZixeSea](https://github.com/ZixeSea)

### **The project**
This project has been created for me to easily run a steam idler 24/7 in the background without using many resources. this project has been put on hold for a long time until some people contacted me about it and because of it, I rewrote everything at 2022. With this rewrite, I also added things like randomGameIdle, randomTimeIdle, and parallelGameIdle up to 32 games at once (before it idled just a static list of games).

### **Required dependencies**
[steam-user](https://www.npmjs.com/package/steam-user) - Allows interaction with the Steam network via the Steam client protocol.\
[time-stamp](https://www.npmjs.com/package/time-stamp) - Get a formatted timestamp.\
[asciiart-logo](https://www.npmjs.com/package/asciiart-logo) - renders a splash screen in text console with logo from ASCII characters.

### **License**
This project is licensed under the MIT License - see the [LICENSE](https://github.com/ZixeSea/SteamIdler/blob/master/LICENSE.md) file for details (deleting and/or modifying the license file after forking isn't allowed).

---

## **Table of contents**
**1\.** [Preparations](#preparations)\
&nbsp;&nbsp;&nbsp;&nbsp;**1\.1.** [Requirements](#requirements)\
&nbsp;&nbsp;&nbsp;&nbsp;**1\.2.** [Get code](#get-code)
<br>

**2\.** [Config](#config)\
&nbsp;&nbsp;&nbsp;&nbsp;**2\.1.** [Idler config](#idler-config)\
&nbsp;&nbsp;&nbsp;&nbsp;**2\.2.** [PM2 config](#pm2-config)
<br>

**3\.** [Linux](#linux)\
&nbsp;&nbsp;&nbsp;&nbsp;**3\.1.** [Update system (L)](#update-system-l)\
&nbsp;&nbsp;&nbsp;&nbsp;**3\.2.** [Install Node.js (L)](#install-nodejs-l)\
&nbsp;&nbsp;&nbsp;&nbsp;**3\.3.** [Start the bot (L)](#start-the-bot-l)
<br>

**4\.** [Windows](#windows)\
&nbsp;&nbsp;&nbsp;&nbsp;**4\.1.** [Install Node.js (W)](#install-nodejs-w)\
&nbsp;&nbsp;&nbsp;&nbsp;**4\.2.** [Start the bot (W)](#start-the-bot-w)

---

## **Preparations**
### **Requirements**
`git` command line ([Windows](https://git-scm.com/download/win)|[Linux](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)|[MacOS](https://git-scm.com/download/mac))\
`node` version 14.17.3 or higher (**expained later**)\
`Steam` account is also required ([get here](https://store.steampowered.com/))
<br><br>

> ⚠️ WARNING ⚠️<br>If you have 2AF on for you steam account, you need to provide that too and app will ask for it while starting.

### **Get code**
Run the following command in a CMD/terminal window in the location where you want the folder to be.
```
git clone https://github.com/ZixeSea/SteamIdler.git
```
<br>

> ⚠️ WARNING ⚠️<br>Remember to change the config file after getting the code otherwise, it won't work ([more info here](###Config)).

---

## **Config**
### **Idler config**
You can find the config file in the folder that was created in the previous step (["this one"](###Get-code)), it should be in the folder "src/config" and there change the file "account.js".\

In the config file, there are 2 really important things that must be changed first, here is what they mean\
`username` The username you use to login to steam\
`password` The password you use to login to steam

Than there are sme addicinal thing you can config/change to make the idler work how you want it, and does are\
`statusInvisible` If this is set to **true** it will show your account as offline instead of online\
`randomIdleGames` If set to **true**, **listToIdle** won't be used and it will randomly idle games\
`idleFreeGames` If set to **true** the **randomIdleGames** will includes free to play games\
`parallelGameIdle` The number of games it should idle at ones if using **randomIdleGames** (can been between 0 and 32)\
`staticIdleTime` If set to **0** it will create a random number, else it will use this number (number must be in MS)\
`blacklist` A list of games you don't want to idle if using **randomIdleGames** (use game IDs here)\
`SkipBannedGames` If set to **true** it won't idle games your banned in while using **randomIdleGames**\
`listToIdle` Static list of games to idle, only gets used if **randomIdleGames** is **false**

Hereunder is an example config:
```
accOptions: {
	username: 'some username',
	password: 'some password',
	statusInvisible: false
},
idleOptions: {
	randomIdleGames: true,
	idleFreeGames: true,
	parallelGameIdle: 1, 
	staticIdleTime: 0,
	blacklist: [],
	SkipBannedGames: false,
	listToIdle: [ 730, 570, 440 ]
}
```

---

## **Linux**
> ⚠️ WARNING ⚠️<br>Everything in this section is based on a server running **Ubuntu 18.04 without GUI**, this bot and all commands mentioned here can be performed on another distro but the commands or steps may be slightly different.

### **Update system (L)**
To make you get the most recent versions of any software you download, update your system first with the following command in a terminal window.
```
sudo apt update && sudo apt upgrade -y
```

### **Install Node.js (L)**
Run the following 2 commands in a terminal window to install **Node.js**.
```
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install -y nodejs
```

### **Start the bot (L)**
Open the folder you downloaded in the previous step (["this one"](###Get-code)), and open a terminal window there and run the following 3 commands.
```
npm i
node .
```

---

## **Windows**
> ⚠️ WARNING ⚠️<br>Everything in this section is based on a server running **Windows 10**, this bot and all commands mentioned here can be performed on another Windows version but the commands or steps may be slightly different.

### **Install Node.js (W)**
Installing **Node.js** on windows is really easy, they have a normal installer for it and you can download it on their  website (so it's simply clicking "next" and "ok").\
**Link:** https://nodejs.org/en

### **Start the bot (W)**
Open the folder you downloaded in the previous step (["this one"](###Get-code)), and open a CMD window there and run the following 3 commands.
```
npm i
node .
```

---
