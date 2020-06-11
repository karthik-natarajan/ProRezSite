const AWS = require('aws-sdk');
const SES = new AWS.SES();

function sendEmail(formData, callback) {
  const emailParams = {
    Source: 'webadmin@karthiknatarajan.in', // SES SENDING EMAIL
    ReplyToAddresses: [formData.rsEmail],
    Destination: {
      ToAddresses: ['karthiknatarajanmba@gmail.com'], // SES RECEIVING EMAIL
    },
    Message: {
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: `${formData.rsMessage}\n\nName: ${formData.rsName}\nEmail: ${formData.rsEmail}`,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: `${formData.rsSubject}`,
      },
    },
  };
  SES.sendEmail(emailParams, callback);
}

module.exports.staticSiteMailer = (event, context, callback) => {
  const formData = JSON.parse(event.body);

  sendEmail(formData, function(err, data) {
    const response = {
      statusCode: err ? 500 : 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://www.karthiknatarajan.in',
      },
      body: JSON.stringify({
        message: err ? err.message : data,
      }),
    };

    callback(null, response);
  });
};