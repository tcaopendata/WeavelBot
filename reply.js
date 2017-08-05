const { MessengerClient } = require('messaging-api-messenger')
const client = MessengerClient.connect(require('./token').page_access_token)

// var STATE = {
//   GREETINGS: 0,
//   LOCATION: 1,
//   DURATION: 2,
//   TRIP: 3,
//   THANKS: 4
// }

// var state = 0;

function handleEvent(event) {
  let senderID = event.sender.id;
  let recipientID = event.recipient.id;
  let time = event.timestamp;

  let message = event.message;
  let messageId = message.mid;
  let messageText = message.text;
  let messageAttachments = message.attachments;
  let payload = message.payload;

  console.log(message.nlp);

  console.log("Received msg from %d at %d with message: %s", senderID, time, messageText);

  let intents = [];

  for (let key in message.nlp.entities) {
    intents.push({
      catagory: key,
      datum: message.nlp.entities[key].sort((a, b) => b.confidence - a.confidence)[0] /* Sort within catagories */
    })
  }

  // Sort across catagories
  intents.sort((a, b) => b.datum.confidence - a.datum.confidence)

  switch (intents[0].catagory) {
    case 'greetings':
      client.sendQuickReplies(senderID, { text: 'Hello, I\'m WeavelBOT!\nWhere do you want to go?' },
        [
          {
            content_type: 'text',
            title: 'Taipei',
            payload: ''
          },
          {
            content_type: 'text',
            title: 'New Taipei',
            payload: ''
          },
          {
            content_type: 'text',
            title: 'Tokyo',
            payload: ''
          },
          {
            content_type: 'text',
            title: 'Bangkok',
            payload: ''
          },
          {
            content_type: 'text',
            title: 'Seoul',
            payload: ''
          }
        ]
      ).catch(() => {console.log('Failure....')})
      break;
    case 'location':
      break;
  }
}

module.exports = {
  handleEvent: handleEvent
}
