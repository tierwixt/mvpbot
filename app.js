// npm packages
var builder   = require('botbuilder')
var restify   = require('restify')

//File Dependencies
const cfpDialog = require('./dialogs/cfp')
const noneDialog = require('./dialogs/none')

// bot setup
var connector = new builder.ChatConnector()
var bot       = new builder.UniversalBot(connector)

// main menu choices
var menulist = ['Speaking Opportunities', 'Catering', 'General MVP Questions']

// bot setup for restify server
var server = restify.createServer()
server.listen(3978, function() {
    console.log('test bot endpoint at http://localhost:3978/api/messages')
})
server.post('/api/messages', connector.listen()) 

// Luis Setup
var luisEndpoint ='https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/d13236ab-30ec-4434-b2ff-5980593fcff2?subscription-key=511b5f5824ca4a2782e7956cb66883a0&verbose=true&q='
var recognizer = new builder.LuisRecognizer(luisEndpoint)
var intents = new builder.IntentDialog({ recognizers: [recognizer] })

// loading dialogs
cfpDialog(bot)
noneDialog(bot)

// dialogs
bot.dialog('/', intents) 
    // this "Greeting" below is from our Luis intent. Naming has to match intent capitalization and spelling
    .matches('Greeting', [
        function (session, response) {
            session.send('Hi! MVP Bot here, at your service!😏')
            builder.Prompts.choice(session,'Here are some of the ways I can help you today, please select from the list below:', menulist)
        }, 
        function (session, response) {
            if (response.response.index == 0) {
                session.send('You want to hear about speaking opportunities, let\'s see what is happening in your region.')
                // call CFP dialog
            }
            else if (response.response.index == 1) {
                session.send('You want to hear about catering. Pizza anyone?')
                // call dominos offer dialog
            }
            else {
                session.send('You have questions around the MVP program. What can I answer for you today?')
                // call QnA maker
            }
        }
    ])
    .matches('None', [
        function(session, response) {
            session.beginDialog('/none', response)
        }
    ])

    