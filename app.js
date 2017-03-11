// npm packages
const builder = require('botbuilder')
const restify = require('restify')
// const cognitiveservices = require('botbuilder-cognitiveservices')

// file Dependencies
const cfpDialog = require('./dialogs/cfp')
const noneDialog = require('./dialogs/none')
const cateringDialog = require('./dialogs/catering')

// bot setup
const connector = new builder.ChatConnector()
const bot = new builder.UniversalBot(connector)

// main menu choices
const menulist = ['Speaking Opportunities', 'Catering', 'General MVP Questions']

// bot setup for restify server
const server = restify.createServer()
server.listen(3978, function () {
  console.log('test bot endpoint at http://localhost:3978/api/messages')
})
server.post('/api/messages', connector.listen())

// Luis Setup
var luisEndpoint = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/d13236ab-30ec-4434-b2ff-5980593fcff2?subscription-key=511b5f5824ca4a2782e7956cb66883a0&verbose=true&q='
var recognizer = new builder.LuisRecognizer(luisEndpoint)
var intents = new builder.IntentDialog({ recognizers: [recognizer] })

// QnA requires botbuilder-cognitiveservices npm package
// // QnA Maker Setup
// var recognizer2 = new cognitiveservices.QnAMakerRecognizer({
//   knowledgeBaseId: 'f2fd70fa-0c3e-4e0d-abd1-95d19811212b',
//   subscriptionKey: '61a22ce5b7c041939330fcc9496f64d6'})

// var BasicQnAMakerDialog = new cognitiveservices.QnAMakerDialog({
//   recognizers: [recognizer2],
//   defaultMessage: 'No good match in FAQ.',
//   qnaThreshold: 0.5})

// // dialogs
// bot.dialog('/', BasicQnAMakerDialog)

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
          builder.Prompts.choice(session, 'What can I do for you today? Some of the ways I can help are listed below. Please select from the following options:', menulist)
        },
      (session, response) => {
          if (response.response.index == 0) {
              session.beginDialog('/cfp')
            }            else if (response.response.index == 1) {
              session.beginDialog('/catering')
            }            else {
                // we need to change this message later
              session.send('You have questions about the MVP program. What can I answer for you today?')
                // QnA maker
            }
        }
    ])

// matches responses with the intents that we trained in Luis
    .matches('CFP', [
      function (session, response) {
          session.beginDialog('/cfp', response)
        }
    ])
    .matches('Catering', [
      function (session, response) {
          session.beginDialog('/catering', response)
        }
    ])
    .matches('None', [
      function (session, response) {
          session.beginDialog('/none', response)
        }
    ])

// npm packages
var builder = require('botbuilder')
var restify = require('restify')
var cognitiveservices = require('botbuilder-cognitiveservices')

// bot setup
var connector = new builder.ChatConnector()
var bot = new builder.UniversalBot(connector)

// bot setup for restify server
var server = restify.createServer()
server.listen(3978, function () {
  console.log('test bot endpoint at http://localhost:3978/api/messages')
})
server.post('/api/messages', connector.listen())
