// npm packages
var builder   = require('botbuilder')
var restify   = require('restify')

// adding dialog files
const greetingDialog = require('./dialogs/greeting')
const noneDialog = require('./dialogs/none')

// bot setup
var connector = new builder.ChatConnector()
var bot       = new builder.UniversalBot(connector)

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
greetingDialog(bot)
noneDialog(bot)

// dialogs
bot.dialog('/', intents) 
    // this "Greeting" below is from our Luis intent. Naming has to match intent capitalization and spelling
    .matches('Greeting', [
        function(session, response) {
            session.beginDialog('/greeting', response)
        }
    ])
    .matches('None', [
        function(session, response) {
            session.beginDialog('/none', response)
        }
    ])

    
    


//Helper functions

const extractEntities = (session, response) => {
    var foundEntities =[]

    var foodtype = builder.EntityRecognizer.findEntity(response.entities, 'FoodType')
    var money = builder.EntityRecognizer.findEntity(response.entities, 'builtin.money')

    if (foodtype) {
        session.userData.foodtype = foodtype
        foundEntities.push(foodtype)
    }
    if (money) {
        session.userData.money = money
        foundEntities.push(money)
    }

    return foundEntities
}