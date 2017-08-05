var request = require('request')

function sendTextMessage(id, txt) {
  let messageData = {
    recipient: { id: id },
    message: { text: txt }
  };
  sendJson(id, messageData);
}

function sendJson(id, json) {
  request({
      uri: 'https://graph.facebook.com/v2.6/me/messages',
      qs: { access_token: require('./token').page_access_token },
      method: 'POST',
      json: json
    }, (err, res, body) => {
      if (!err && res.statusCode == 200) {
        let recipientId = body.recipient_id;
        let messageId = body.message_id;

        console.log("Successfully sent message to id %s", recipientId);
      } else {
        console.error("Unable to send message.");
        console.error(res);
        console.error(err);
      }
  });
}

module.exports = {
  sendTextMessage: sendTextMessage,
  sendJson: sendJson
}
