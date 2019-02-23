const Discord = require('discord.js');
const bot = new Discord.Client();

bot.on('ready', async () => {
    console.log(`${bot.user.tag} is online!`);
});

bot.on("message", async message => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;

    let prefix = botconfig.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    if(cmd === `${prefix}hello`) {
        message.channel.send("Hello!");
    }

    if(cmd === `${prefix}avatar`) {
        let avatar = new Discord.RichEmbed()
        .setDescription("Member Information")
        .addField("Name", message.author.username)
        .addField("ID", message.author.id)
        return message.channel.send(avatar);
    }

    if(cmd === `${prefix}kick`) {
        // This command must be limited to mods and admins. In this example we just hardcode the role names.
        // Please read on Array.some() to understand this bit: 
        // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some?
        if(!message.member.roles.some(r=>["partner n' crime", "Logi"].includes(r.name)) )
          return message.reply("Sorry, you don't have permissions to use this!");
        
        // Let's first check if we have a member and if we can kick them!
        // message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
        // We can also support getting the member by ID, which would be args[0]
        let member = message.mentions.members.first() || message.guild.members.get(args[0]);
        if(!member)
          return message.reply("Please mention a valid member of this server");
        if(!member.kickable) 
          return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");
        
        // slice(1) removes the first part, which here should be the user mention or ID
        // join(' ') takes all the various parts to make it a single string.
        let reason = args.slice(1).join(' ');
        if(!reason) reason = "No reason provided";
        
        // Now, time for a swift kick in the nuts!
        await member.kick(reason)
          .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
        message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);
    
      }
      
      if(cmd === `${prefix}ban`) {
        // Most of this command is identical to kick, except that here we'll only let admins do it.
        // In the real world mods could ban too, but this is just an example, right? ;)
        if(!message.member.roles.some(r=>["Logi", "partner n' crime"].includes(r.name)) )
          return message.reply("Sorry, you don't have permissions to use this!");
        
        let member = message.mentions.members.first();
        if(!member)
          return message.reply("Please mention a valid member of this server");
        if(!member.bannable) 
          return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");
    
        let reason = args.slice(1).join(' ');
        if(!reason) reason = "No reason provided";
        
        await member.ban(reason)
          .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
        message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
      }
      
      if(cmd === `${prefix}purge`) {
        // This command removes all messages from all users in the channel, up to 100.
        
        if(!message.member.roles.some(r=>["Logi", "partner n' crime"].includes(r.name)) )
          return message.reply("Sorry, you don't have permissions to use this!");
        // get the delete count, as an actual number.
        const deleteCount = parseInt(args[0], 10);
        
        // Ooooh nice, combined conditions. <3
        if(!deleteCount || deleteCount < 2 || deleteCount > 100)
          return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
        
        // So we get our messages, and delete them. Simple enough, right?
        const fetched = await message.channel.fetchMessages({limit: deleteCount});
        message.channel.bulkDelete(fetched)
          .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
      }
});

bot.login("NTQ4ODI1MDQ3MzYwNjAyMTQy.D1M7lw.1hATu1WHJKa6WngSWBsAJE0YjNs");
