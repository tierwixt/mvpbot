// npm packages
const builder   = require('botbuilder')
const restify   = require('restify') 

// file Dependencies
const cfpDialog = require('./dialogs/cfp')
const noneDialog = require('./dialogs/none')
const cateringDialog = require('./dialogs/catering')

// bot setup
const connector = new builder.ChatConnector()
const bot       = new builder.UniversalBot(connector)

// main menu choices
const menulist = ['Speaking Opportunities', 'Catering', 'General MVP Questions']

// bot setup for restify server
const server = restify.createServer()
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
cateringDialog(bot)
noneDialog(bot)

// dialogs
bot.dialog('/', intents) 
    // this "Greeting" below is from our Luis intent. Naming has to match intent capitalization and spelling
    .matches('Greeting', [
        (session, response) => {
            session.send('Hi! MVP Bot here, at your service!😏')
            builder.Prompts.choice(session,'Here are some of the ways I can help you today, please select from the list below:', menulist)
        }, 
        (session, response) => {        
            if (response.response.index == 0) {
                session.replaceDialog('/cfp')
            }
            else if (response.response.index == 1) {
                session.beginDialog('/catering')
            }
            else {
                // we need to change this message later
                session.send('You have questions around the MVP program. What can I answer for you today?')
                // QnA maker 
            }
        }
    ])
    .matches('CFP', [
        function(session, response) {
            session.beginDialog('/cfp', response)
        }
    ])
    .matches('Catering', [
        function(session, response) {
            session.beginDialog('/catering', response)
        }
    ])
    .matches('None', [
        function(session, response) {
            session.beginDialog('/none', response)
        }
    ])
