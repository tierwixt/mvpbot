const builder = require('botbuilder')

module.exports = function (bot) {
    bot.dialog('/catering', [
        (session, response) => {
            session.send('Sounds like you want some food for your event. We have a Domino\'s catering offer that includes food and beverage for up to 100 people per event. Here are the eligibility requirements: the event must have a developer audience, Microsoft content delivery, and recommended over 20 attendees.')
        
            builder.Prompts.confirm(session, 'Does your event fit these requirements? (Yes or No)')
        },  
        (session, response) => {
            if (response.response) {
                session.send('Glad to hear! Sounds like a pretty cool event. Go to https://aka.ms/USDXcatering to request Domino\'s catering. Fill it out and follow the instructions to request.')
            } else {
                session.send('Unfortunately, you\'re event is not eligible for the catering offer. Please reach out to your local Community Evangelist with further questions.')
            }
        }       
    ])
 }

   



  