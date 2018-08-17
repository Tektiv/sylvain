# Sylvain
**Sylvain** is a Discord bot to help players and game masters during Dungeons & Dragons sessions :
- Rolling dice
- Tracking a fight (initiative and turns)
- _... and more to come_

The bot is not hosted, tough not public, yet.  
This is a `0.x` release since I still have some idead to implement like a music/ambiance vocal channel when in session.

### Incoming features
- `!loot <challenge rating>` to give a random list of loot based on a group challenge ratings
- `!macro` function to easily make rolls, based on the user calling the function
#### [Any idea/suggestion is welcome !](https://github.com/Tektiv/sylvain/issues)

## Development
Follow these instructions to make it run :
1. Make sure you have node/npm installed
2. Fork the repository
3. Go into the root folder (where you can see [package.json](package.json))
4. Run `npm install`
5. Go to [this link](https://discordapp.com/developers/applications/) to create your bot and generate a identifier token
6. Run `node scripts/config.js` and follow the instructions
7. Run `npm start` and you should see the following
   > Logged in as <name>#1234 !

If you want to add your contribution, first thank you !  
You can check the modules already created in the [modules](modules/) directory if your idea is related to one of the existing modules. If that is the case, jump directly to step 3.

1. Create your own module creating a new `.js` containing your functions. You can use `require('../utils');` to get the project utils and globals.
2. In [modules/index.js](modules/index.js), add your file name to the `modules` array
3. Create a function, using as parameters `client` and `message`. The first refers to the bot and the latter to the message sent by the user triggering the command (author, content, date, etc.)
3. Export it at the end of the file, where a command is linked to a function  
   The command is what is triggered when written by the users e.g. `roll: rollDice;` makes `!roll` triggers the `rollDice` function
   ```js
   module.exports = {
      <command>: <function>,
   }
   ```
4. Run `npm start` again to see your changes !  
   _You can run `npm run dev` to see your changes as you develop, using nodemon_