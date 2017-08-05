var https = require('https');
var express = require('express')
var bodyParser = require('body-parser');

var reply = require('./reply')

var app = express();
var router = express.Router();

function validation() {
  router.get('/webhook', (req, res) => {
    if (req.query['hub.mode'] === 'subscribe' &&
        req.query['hub.verify_token'] === 'weavelbot') {
      console.log("Validating webhook");
      res.status(200).send(req.query['hub.challenge']);
    } else {
      console.error("Failed validation. Make sure the validation tokens match.");
      res.sendStatus(403);
    }
  });
}

function pageMsgListener() {
  router.post('/webhook', function (req, res) {
    let data = req.body;

    // Make sure this is a page subscription
    if (data.object === 'page') {

      // Iterate over each entry - there may be multiple if batched
      data.entry.forEach((entry) => {
        let pageID = entry.id;
        let timeOfEvent = entry.time;

        // Iterate over each messaging event
        entry.messaging.forEach((event) => {
          if (event.message) {
            receivedMessage(event);
          } else {
            // console.log("Webhook received unknown event: ", event);
          }
        });
      });

      // Assume all went well.
      //
      // You must send back a 200, within 20 seconds, to let us know
      // you've successfully received the callback. Otherwise, the request
      // will time out and we will keep trying to resend.
      res.sendStatus(200);
    }
  });
}

function receivedMessage(event) {
  let senderID = event.sender.id;
  let recipientID = event.recipient.id;
  let timeOfMessage = event.timestamp;

  let message = event.message;
  let messageId = message.mid;

  // console.log(JSON.stringify(message));

  for (let key in message.nlp) {
    console.log(message.nlp[key]);
  }

  let messageText = message.text;
  let messageAttachments = message.attachments;

  console.log("Received msg from %d at %d with message: %s",
    senderID, timeOfMessage, messageText);

  // TODO: process text
  // process(messageText)

  // TODO: proper response,
  reply.sendTextMessage(senderID, messageText);
}

function startWebhook() {

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  validation();
  pageMsgListener();

  app.use('/', router);

  app.listen(3000, () => {
      console.log((new Date()) + ' HTTP server is listening on port 3000');
  });

  var ssl = require('./ssl')
  httpsServer = https.createServer(ssl, app);
  httpsServer.listen(3001, () => {
      console.log((new Date()) + ' HTTPS server is listening on port 3001');
  });
}

module.exports = {
  startWebhook: startWebhook
}

