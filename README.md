# Notes App Bot

This is a Telegram bot that allows users to take and manage notes. The bot provides various commands to interact with the notes app. Here is a brief overview of the available commands:

## Commands

- `/start`: Start the bot and receive a welcome message with instructions on how to use the app.
- `/guide`: Get a guide on how to use the app (currently not implemented).
- `/help`: Display a list of all available commands.
- `/tnotes + [details]`: Take notes on the app. Append the note details after the command.
- `/list`: List all notes per day.
- `/text`: Get a text file containing the notes.

## Setup and Configuration

To run this bot, ensure you have the following components installed:

- Node.js
- Telegraf library
- dotenv library

1. Clone the repository and navigate to the project directory.
2. Create a `.env` file and add your Telegram bot token in the format: `BOT_TOKEN=<your_bot_token>`
3. Install the required dependencies by running the following command:

```sh
npm install
```

4. Start the bot by executing the following command:

```sh
node notesapp.js
```

## How to Use

1. Start the bot by sending the `/start` command. You will receive a welcome message with instructions.
2. Use the `/help` command to see a list of all available commands.
3. Use the `/tnotes + [details]` command to take notes. Replace `[details]` with the content of your note.
4. Use the `/list` command to view a list of notes per day.
5. Use the `/text` command to receive a text file containing the notes for a specific day.
6. Follow the on-screen instructions to navigate and interact with the bot.

Note: The bot stores the notes in a `notes.json` file. If the file does not exist, it will be created automatically.

Please note that the `/guide` command is currently not implemented and will display a placeholder message.

Feel free to explore and utilize this bot for managing your notes efficiently!
