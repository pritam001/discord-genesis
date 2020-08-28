require("dotenv").config();

const {Client} = require("discord.js");
const client = new Client();

client.on("ready", () => {
    console.log(`${client.user.username} is connected`);
});

client.on("message", (message) => {
    if(!message.author.bot) {
        if(message.content === "hello") {
            console.log(message);
            message.channel.send("hello");
        }
    }
});

client.on("typingStart", args => {
    console.log(args);
});

client.login(process.env.PING_JS_BOT_TOKEN).then(r => console.log(r));