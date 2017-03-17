// npm packages
const builder   = require('botbuilder')
const restify   = require('restify') 
const cogserv   = require('botbuilder-cognitiveservices')
const request   = require('request')
const querystring = require('querystring')

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

// // QnA Setup
// var qnaRecognizer = new cogserv.QnAMakerRecognizer({
//     knowledgeBaseId: 'f2fd70fa-0c3e-4e0d-abd1-95d19811212b',
//     subscriptionKey: '61a22ce5b7c041939330fcc9496f64d6'
// })
// var qnaDialog = new cogserv.QnAMakerDialog({
//     recognizers: [qnaRecognizer]
//     // defaultMessage: 'Ask me another question about the MVP program.',
//     // qnaThreshold: 0.5 
// })

// loading dialogs
cfpDialog(bot)
cateringDialog(bot)
noneDialog(bot)

// // dialogs
// bot.dialog('/QnA', qnaDialog)

bot.dialog('/', intents) 
    // this "Greeting" below is from our Luis intent. Naming has to match intent capitalization and spelling
    .matches('Greeting', [
        (session, response) => {
            session.send('Hi! MVP Bot here, at your service!😏')
            builder.Prompts.choice(session,'What can I do for you today? Some of the ways I can help are listed below. Please select from the following options:', menulist)
        }, 
        (session, response) => {        
            if (response.response.index == 0) {
                session.beginDialog('/cfp')
            }
            else if (response.response.index == 1) {
                session.beginDialog('/catering')
            }
            else {
                builder.Prompts.text(session,'You have questions about the MVP program. What can I answer for you today?')
            }
        },
        (session, response) => {
            // QnA maker 
            // To do: add while loop, move qna to a new dialog file
            qna(response.response, (err, result) =>     {

                if (err) {
                    console.error(err)
                    session.send('Unfortunately an error occurred. Try again.')
                } else {
                    // The QnA returns a JSON: { answer:XXXX, score: XXXX: }
                    // where score is a confidence the answer matches the question.
                    // Advanced implementations might log lower scored questions and
                    // answers since they tend to indicate either gaps in the FAQ content
                    // or a model that needs training
                    session.send(JSON.parse(result).answer)
                }
            // session.endDialog()
            })
        }
    ])

// matches responses with the intents that we trained in Luis
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

// Helper functions
const qna = (q, cb) => {
  // Here's where we pass anything the user typed along to the QnA service.
    q = querystring.escape(q)
    request('http://qnaservice.cloudapp.net/KBService.svc/GetAnswer?kbId=f2fd70fa-0c3e-4e0d-abd1-95d19811212b&question=' + q, function (error, response, body) {
        if (error) {
            cb(error, null)
        } else if (response.statusCode !== 200) {
            // Valid response from QnA but it's an error
            // return the response for further processing
            cb(response, null)
        } else {
            // All looks OK, the answer is in the body
            cb(null, body)
        }
    })
}
