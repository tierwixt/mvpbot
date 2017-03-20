const builder = require('botbuilder')
const request = require('request')
const querystring = require('querystring')

module.exports = function (bot) {
  bot.dialog('/qna', [
    (session, response) => {
      builder.Prompts.text(session, 'You have questions about the MVP program. What can I answer for you today?')
    },
    (session, response) => {
      // call QnA Maker endpoint
      qna(response.response, (err, result) => {
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
          builder.Prompts.confirm(session, 'Do you have any more questions about the MVP program? (Yes or No)')
        }
      })
    },
    (session, response) => {
      if (response.response) {
        // user has another question
        session.endDialog()
        session.beginDialog('/qna')
        return
      }
      session.send('Okay great!')
      session.endDialog()
    }
  ])
}

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
