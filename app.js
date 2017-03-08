// npm packages
var builder   = require('botbuilder')
var restify   = require('restify') 

// file dependencies
var cateringDialog = require('./dialogs/catering')

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

// load module 
cateringDialog(bot)

// dialogs
bot.dialog('/', intents)
    .matches('Greeting' , [
    session => {
        session.send('Hey you!')
        }   
    ])
    .matches('MenuInquiry', [
        (session, response) => {
            var entities = extractEntities(session, response)

            entities.forEach( e => {
                session.send('I found an entity: ' + e.entity)
            })

            session.send('You want to know about the menu')
        }
    ])
    .matches('None', [
        session => {
            session.send('I do not undertand.')
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