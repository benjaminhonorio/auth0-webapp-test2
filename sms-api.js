const express = require('express');
const path = require('path');
require('dotenv').config();
const client = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const app = express();
const port = 8000;

app.use(express.json());

app.post('/send-verification', async (req, res) => {
  client.verify
    .services(process.env.VERIFY_SERVICE_SID)
    .verifications.create({
      to: `+${req.body.phoneNumber}`,
      channel: 'sms',
      locale: 'en',
    })
    .then((verification) => console.log(verification.status))
    .catch((e) => {
      console.log(e);
      res.status(500).send(e);
    });

  res.sendStatus(200);
});

app.post('/verify-otp', async (req, res) => {
  const check = await client.verify
    .services(process.env.VERIFY_SERVICE_SID)
    .verificationChecks.create({
      to: `+${req.body.phoneNumber}`,
      code: req.body.otp,
    })
    .catch((e) => {
      console.log(e);
      res.status(500).send(e);
    });

  res.status(200).send(check);
});

app.listen(port);
console.log('Server started at http://localhost:' + port);
