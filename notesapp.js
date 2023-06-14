const { Telegraf, session } = require("telegraf")
const dotenv = require("dotenv")
const fs = require("fs")

//load the environment variables from the .env
dotenv.config()

//create the instance of the telegraf class using the API Token
const bot = new Telegraf(process.env.BOT_TOKEN)

//start command handler
bot.command("start", (ctx) => {
    ctx.reply(
        "Welcome to the notes app bot, let me take your notes \n\n" +
            "use /guide for instructions on the now to use the app\n" +
            "use /help to see all the available commands"
    )
})

//guide command handler
bot.command("guide", (ctx) => {
    ctx.reply("Note Yet")
})

//help command handler
bot.command("help", (ctx) => {
    const availableCommands = [
        "/start - start the bot",
        "/guide - guide on how to use this app",
        "/help - show all available commands \n",
        "/tnotes + [details] - take notes on app",
        "/list  - list all notes [per day]",
        "/text  - get a text file from the notes",
    ]
    ctx.reply(`Here are the available commands: \n ${availableCommands.join("\n")}`)
})

//tnotes command handler
bot.command("tnotes", (ctx) => {
    const array = ctx.update.message.text.split("/tnotes ")

    if (array.length == 1)
        ctx.reply("Please include a note on the command '/tnotes + [note details]'")
    else {
        const note = array[1]
        const currentDate = new Date().toLocaleDateString()
        const currentTime = new Date().toLocaleTimeString()
        const userId = ctx.from.id

        const data = {
            time: currentTime,
            note: note,
        }

        //read the existing notes from the JSON file
        let notes = {}
        try {
            const notesData = fs.readFileSync("notes.json")
            notes = JSON.parse(notesData)
        } catch (err) {
            console.log("notes.json does not exists and would be created")
        }

        //add the new note to the existing notes under the user's ID/date
        if (!notes[userId]) notes[userId] = {}
        if (!notes[userId][currentDate]) notes[userId][currentDate] = []
        notes[userId][currentDate].push(data)

        //Write the update note back to the JSON file
        try {
            fs.writeFileSync("notes.json", JSON.stringify(notes))
        } catch (err) {
            console.log(err)
        }
    }

    ctx.reply("notes saved!")
})

//list command handler
bot.command("list", (ctx) => {
    const userId = ctx.from.id

    //read the notes from the JSON file
    let notes = {}
    notes = getNotes()

    if (notes[userId]) {
        const dates = Object.keys(notes[userId])

        if (dates.length > 0) {
            const inlineKeyboard = dates.map((date) => ({
                text: date,
                callback_data: `view_note_${date}`,
            }))

            const replyMarkup = {
                inline_keyboard: [inlineKeyboard],
            }

            ctx.reply("Select a date to view notes:", { reply_markup: replyMarkup })
        } else ctx.reply("You have no notes")
    } else ctx.reply("You have no notes")
})

//text command handler
bot.command("text", (ctx) => {
    const userId = ctx.from.id

    //read the notes from the JSON file
    let notes = {}
    notes = getNotes()

    if (notes[userId]) {
        const dates = Object.keys(notes[userId])

        if (dates.length > 0) {
            const inlineKeyboard = dates.map((date) => ({
                text: date,
                callback_data: `text_note_${date}`,
            }))

            const replyMarkup = {
                inline_keyboard: [inlineKeyboard],
            }

            ctx.reply("Select a date get notes to text:", { reply_markup: replyMarkup })
        } else ctx.reply("You have no notes")
    } else ctx.reply("You have no notes")
})

function getNotes() {
    let notes = {}
    try {
        const notesData = fs.readFileSync("notes.json")
        notes = JSON.parse(notesData)
    } catch (err) {
        console.log("notes.json does not exists and would be created")
    }
    return notes
}

//callback query
bot.on("callback_query", async (ctx) => {
    const callbackData = ctx.update.callback_query.data

    //handler for view callback
    if (callbackData.startsWith("view_note_")) {
        const date = callbackData.replace("view_note_", "")

        //read the notes from JSON
        let notes = {}
        notes = getNotes()

        //check if the user has notes for the selected date
        const userId = ctx.from.id.toString()
        if (notes[userId] && notes[userId][date]) {
            const userNotes = notes[userId][date]
            let notesText = ""

            //build notes text
            userNotes.forEach((note) => {
                const time = note.time
                const noteText = note.note
                notesText += `${time} : ${noteText}\n`
            })

            ctx.reply(`Notes for ${date}: \n\n ${notesText}`)
        } else ctx.reply(`No notes found for user/date`)
    }

    //handler for view callback
    if (callbackData.startsWith("text_note_")) {
        const date = callbackData.replace("text_note_", "")

        //read the notes from JSON
        let notes = {}
        notes = getNotes()

        //check if the user has notes for the selected date
        const userId = ctx.from.id.toString()
        if (notes[userId] && notes[userId][date]) {
            const userNotes = notes[userId][date]

            //build notes text
            let notesText = "Notes for " + date + ":\n\n"
            userNotes.forEach((note) => {
                const time = note.time
                const noteText = note.note
                notesText += `${time} : ${noteText}\n`
            })

            //create a text file
            const filename = `${userId}_${date.replace(/\//g, "_")}_notes.txt`
            try {
                fs.writeFileSync(filename, notesText)

                //send the notes file as a reply
                await ctx.replyWithDocument({ source: filename })

                //delete the file after sending it
                fs.unlinkSync(filename)
            } catch (err) {
                console.log(err)
                ctx.reply("Failed to create or send the notes file")
            }
        } else ctx.reply(`No notes found for user/date`)
    }
})

bot.launch()
