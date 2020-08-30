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

'use strict';

require("dotenv").config();

const {Client} = require("discord.js");
const moment = require("moment");
const client = new Client();


// Global constants
const BOT_NAME = "SebasTian";
const FORUM_CHANNEL_ID = "748976524484542684";
const DEFAULT_LAST_BUMP_DATE = moment().subtract(1, "days");
const DISBOARD_BUMP_INTERVAL = 5 * 60; // 2 hours
const DISBOARD_BUMP_COMMAND = "!d bump";
const BUMP_SERVER_MESSAGE =
    "*Greetings! :person_bowing: Please bump and help the growth of this server!* \n" +
    "\n" + "I can't do it because **I officially count as a bot**, but you can!\n" +
    "\n" + "Just send a message saying `!d bump` in this channel " +
    "and this server will be put to the top of the server list on Disboard" +
    " so that more people can see and join this server.";
const SERVER_SELF_PROMOTION_MESSAGE =
    "*Thank you! :person_bowing: Kindly share your rating and reviews on Disboard!* \n" +
    "Disboard review link";


// Bot variables
let last_bump_message_date = DEFAULT_LAST_BUMP_DATE;

// Bot login process
client.login(process.env.SEBASTIAN_BOT_TOKEN).then(() => {
    console.log("Login succeeded!");
});

// Bot on ready event
client.on("ready", () => {
    console.log(`${client.user.username} is connected`);

    client.guilds.client.channels.fetch(FORUM_CHANNEL_ID).then((forumChannel => {
        forumChannel.messages
            .fetch({ limit: 50 })
            .then(fetchedMessages => {
                console.log(`Received last ${fetchedMessages.size} messages`);
                for(let message of fetchedMessages) {
                    if(message[1].author.username === BOT_NAME) {
                        if(message[1].content.includes(DISBOARD_BUMP_COMMAND)) {
                            last_bump_message_date = message[1].createdTimestamp;
                            console.log("Last bump message received on " + new Date(last_bump_message_date));
                            break;
                        }
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
    if(last_bump_message_date < moment().subtract(DISBOARD_BUMP_INTERVAL, "seconds")) {
        console.log(`Sending bump message as ${DISBOARD_BUMP_INTERVAL} seconds have passed since the last bump message`);
        message.channel.send(BUMP_SERVER_MESSAGE);
        last_bump_message_date = new Date();
    }
    if(!message.author.bot) {
        if(message.content === DISBOARD_BUMP_COMMAND) {
            console.log("Bump command received");
            setTimeout(sendMessagePostXSeconds, 10, message.channel, SERVER_SELF_PROMOTION_MESSAGE);
        }
    }
});

function sendMessagePostXSeconds(channel, template) {
    console.log("Sending post bump message");
    channel.send(template);
}

