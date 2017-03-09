//dialogs
const builder =  require("botbuilder") 

module.exports = function (bot, arg) {
    bot.dialog("/cfp", [
        (session, response) => {
            console.log('omg omg omg')
            session.send("Happy to hear you're interested in speaking opportunities. Let's get you a current list of open calls.")
            session.send("All open calls are listed here for your convenience: https://aka.ms/opencfps. The US DX team updates these opportunities monthly.")
            builder.Prompts.confirm(session, "Are we missing anything? Yes or No?")
        }
        ,
        (session, response) => {    
            if (response.response) {
                session.send("We'd love your feedback. Please contact Mary Baker marybak@microsoft.com with a link to the open call we're missing.")
            } else {
                session.send("Ok, great! Can I help you with anything else?")
            }
            session.endDialog()
        }
        
    ])
}