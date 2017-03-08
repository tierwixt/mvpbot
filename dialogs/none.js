module.exports = function (bot) {
    bot.dialog('/none', [
        function (session, response) {
            session.send('😭 I\'m soooo sorry, I don\'t know what you mean. Let\'s try this again!')
            session.endDialog()   
        }
    ])
}