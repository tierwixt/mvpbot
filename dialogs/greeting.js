module.exports = function (bot) {
    bot.dialog('/greeting', [
        function (session, response) {
            session.send('Hi! I am the MVP Bot.😏')
            session.send('Here are some of the ways I can assist you: speaking opportunities, catering, and general MVP questions. What can I help you with today?')
            session.endDialog()   
        }
    ])
}