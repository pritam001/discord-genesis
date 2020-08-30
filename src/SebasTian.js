/***
 * @author Pritam Sarkar
 * @github https://github.com/pritam001
 * Bot name: "SebasTian"
 * Bot nature: Gentle, Humble
 * Bot image: SebasTian, the butler from Overlord
 * Bot accent: English
 ***/

/***
 * Feature: Bump server cron
 * 1. If any kind of activity happens on guild forum, check if there has been any server bump in last 2 hours.
 * 2. Send server bump message.
 * 3. Send other types of server promoting message.
 ***/


// ================ START SERVER CODE ==================

const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('SebasTianAI is online!'));

app.listen(port, () => console.log(`SebasTianAI app listening at http://localhost:${port}`));


// ================= START BOT CODE ===================

'use strict';

require("dotenv").config();

const {Client, MessageEmbed} = require("discord.js");
const moment = require("moment");
const client = new Client();


// Global constants
const BOT_NAME = "SebasTian";
const BOT_EMBED_COLOR = "GOLD";
const FORUM_CHANNEL_ID = "748976524484542684";
const DISBOARD_REVIEW_LINK = "https://disboard.com/review";

const DEFAULT_LAST_BUMP_DATE = moment().subtract(1, "days");
const DISBOARD_BUMP_INTERVAL = 2 * 60 * 60; // 2 hours
const DISBOARD_BUMP_COMMAND = "!d bump";
const BUMP_SERVER_MESSAGE =
    "*Greetings! :person_bowing: Please bump and help the growth of this server!* \n" +
    "\n" +
    "I can't do it because **I officially count as a bot**, but you can!\n" +
    "\n" +
    "Just send a message saying `!d bump` in this channel " +
    "and this server will be put to the top of the server list on Disboard" +
    " so that more people can see and join this server.";
const PROMOTION_MESSAGE_DELAY_IN_MS = 8000;
const SERVER_SELF_PROMOTION_MESSAGE =
    "*Thank you for your help!* :person_bowing: \n" +
    "Kindly share your rating and reviews on Disboard! \n" +
    "\n" +
    "**Disboard review link:** " + DISBOARD_REVIEW_LINK;


// Bot variables
let last_bump_message_date = DEFAULT_LAST_BUMP_DATE;

// Bot login process
client.login(process.env.SEBASTIAN_BOT_TOKEN).then(() => {
    console.log(`${BOT_NAME} : Login succeeded!`);
});

// Bot on ready event
client.on("ready", () => {
    console.log(`${client.user.username} is now connected to Discord server`);

    client.guilds.client.channels.fetch(FORUM_CHANNEL_ID).then((forumChannel => {
        forumChannel.messages
            .fetch({ limit: 50 })
            .then(fetchedMessages => {
                console.log(`Received last ${fetchedMessages.size} messages`);
                for(let message of fetchedMessages) {
                    if(message[1].content.includes(DISBOARD_BUMP_COMMAND)) {
                        last_bump_message_date = message[1].createdTimestamp;
                        console.log("Last bump message received on " + new Date(last_bump_message_date));
                        break;
                    }
                }
                if(last_bump_message_date <= DEFAULT_LAST_BUMP_DATE) {
                    console.log(`Not found bump message in last ${fetchedMessages.size} messages`);
                }
            }).catch(console.error);
    }));
});

// bump message handling
client.on("message", (message) => {
    if(!message.author.bot) {
        if(message.content !== DISBOARD_BUMP_COMMAND && last_bump_message_date < moment().subtract(DISBOARD_BUMP_INTERVAL, "seconds")) {
            console.log(`Sending bump message as ${DISBOARD_BUMP_INTERVAL} seconds have passed since the last bump message`);
            const embeddedMessage = new MessageEmbed()
                .setColor(BOT_EMBED_COLOR)
                .setDescription(BUMP_SERVER_MESSAGE);
            message.channel.send(embeddedMessage);
            last_bump_message_date = new Date();
            console.log(`last_bump_message_date changed to : ${last_bump_message_date}`);
        }

        if(message.content === DISBOARD_BUMP_COMMAND) {
            const userId = "<@" + message.author.id + ">";
            console.log(`Bump command received from User. username: ${message.author.username} with userId: ${userId}`);
            setTimeout(sendMessagePostXSeconds, PROMOTION_MESSAGE_DELAY_IN_MS, message.channel, userId, SERVER_SELF_PROMOTION_MESSAGE);
        }
    }
});

function sendMessagePostXSeconds(channel, userId, messageTemplate) {
    console.log(`Sending post bump message to userId: ${userId}`);
    const embeddedMessage = new MessageEmbed()
        .setColor(BOT_EMBED_COLOR)
        .setDescription(userId + " " + messageTemplate);
    channel.send(embeddedMessage);
}

