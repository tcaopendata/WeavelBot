const { MessengerClient } = require('messaging-api-messenger');
const client = MessengerClient.connect(require('./secret').page_access_token);
const database = require('./database');

// Storing for context
var context = {
  location: '',
  duration: 0,
  sites: [],
  chosen: []
};


var lastSite;

function handleEvent(event) {
  let senderID = event.sender.id;
  let recipientID = event.recipient.id;
  let time = event.timestamp;

  let message = event.message;
  let messageId = message.mid;
  let messageText = message.text;
  let messageAttachments = message.attachments;

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
        // let willRain = false;
        // if (context.location === 'taipei') {
        //   database.query(
        //     (err, res, field) => {
        //       if (err) throw err;
        //       if (parseInt(res[0].pop) > 50) willRain = true;
        //     },
        //     'taiwan_12hr_weather', 'pop', `WHERE city='臺北市'`);
        // } else { /* TODO */ }
        database.getSites(context.location, 'normal',
          (sites) => {
            context.sites = sites;
            context.chosen = [];
            showInteractive(senderID);
          });
        break;
    }
  }
}

function handlePostback(event) {
  let senderID = event.sender.id;
  let postback = event.postback;
  let payload = postback.payload;
  if (payload === 'yes') context.chosen.push(lastSite);
  showInteractive(senderID);
}

function showInteractive(id) {
  if (context.chosen.length >= context.duration * 2)
    return showFinal(id);
  lastSite = context.sites[Math.floor(Math.random() * context.sites.length)];
  console.log(lastSite);
  client.sendText(id, `Do you want to go to ${lastSite.name}?`);
  client.sendButtonTemplate(id,
  `https://www.google.com.tw/maps/search/${encodeURIComponent(lastSite.name.trim())}`,[
  {
    type: 'postback',
    title: 'Yes',
    payload: 'yes'
  },
  {
    type: 'postback',
    title: 'No',
    payload: 'no'
  }
  ]);
}

function showFinal(id) {
  let str = '';
  for (let idx in context.chosen) {
    str += context.chosen[idx].name + ' ';
  }
  client.sendText(id, str);
}

module.exports = {
  handleEvent: handleEvent,
  handlePostback: handlePostback
}
