const { MessengerClient } = require('messaging-api-messenger');
const client = MessengerClient.connect(require('./secret').page_access_token);
const database = require('./database');

// Storing for context
var context = {
  location: '',
  duration: 0
};

function handleEvent(event) {
  let senderID = event.sender.id;
  let recipientID = event.recipient.id;
  let time = event.timestamp;

  let message = event.message;
  let messageId = message.mid;
  let messageText = message.text;
  let messageAttachments = message.attachments;
  let payload = message.payload;

  console.log("Received msg from %d at %d with message: %s", senderID, time, messageText);

  let intents = [];

  for (let key in message.nlp.entities) {
    intents.push({
      catagory: key,
      datum: message.nlp.entities[key].sort((a, b) => b.confidence - a.confidence)[0] /* Sort within catagories */
    });
  }

  // Sort across catagories
  intents.sort((a, b) => b.datum.confidence - a.datum.confidence);

  console.log(intents);
  console.log(context);

  if (intents.length > 0) {
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
              title: 'Tokyo',
              payload: ''
            },
            {
              content_type: 'text',
              title: 'Kyoto',
              payload: ''
            },
            {
              content_type: 'text',
              title: 'Bangkok',
              payload: ''
            }
          ]
        ).catch(() => {console.log('Failure....')});
        break;
      case 'location':
        context.location = intents[0].datum.value.toLowerCase();
        client.sendText(senderID, 'How many days do you plan for your trip?');
        break;
      case 'duration':
      case 'number':
        context.duration = parseInt(intents[0].datum.value);
        let willRain = false;
        if (context.location === 'taipei') {
          database.query(
            (err, res, field) => {
              if (err) throw err;
              if (parseInt(res[0].pop) > 50) willRain = true;
            },
            'taiwan_12hr_weather', 'pop', `WHERE city='臺北市'`);
        } else { /* TODO */ }
        database.getSites(context.duration * 2, context.location, 'normal',
          (sites) => {
            console.log(sites);
            for (let idx in sites) {
              client.sendText(senderID, sites[idx].name);
            }
          });
        break;
    }
  }
}

module.exports = {
  handleEvent: handleEvent
}
