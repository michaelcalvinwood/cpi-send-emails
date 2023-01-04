const listenPort = 5500;
require('dotenv').config();
const axios = require('axios');
const privateKeyPath = '/etc/letsencrypt/live/node.pymnts.com/privkey.pem';
const fullchainPath = '/etc/letsencrypt/live/node.pymnts.com/fullchain.pem';

const express = require('express');
const https = require('https');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(express.static('public'));
app.use(express.json({limit: '200mb'})); 
app.use(cors());

const sendEmail = (recipientEmailAddress, senderEmailAddress, subject, html, fromName = '') => {
    return new Promise((resolve, reject) => {
        let request = {
            url: `https://api.smtp.com/v4/messages?api_key=${process.env.SMTP_API_KEY}`,
            method: 'post',
            data: {
                "channel": process.env.SMTP_CHANNEL,
                "recipients": {
                  "to": [
                    {
                      "address": recipientEmailAddress
                    }
                  ]
                },
                "originator": {
                  "from": {
                    "name": fromName ? fromName : senderEmailAddress,
                    "address": senderEmailAddress
                  }
                },
                "subject": subject,
                "body": {
                  "parts": [
                    {
                      "type": "text/html",
                      "content": html
                    }
                  ]
                }
              }
        }
     
        axios(request)
        .then(result => {
            //console.log ("hello result");
             resolve(result.data)       
            return;
        })
        .catch(err => {
            // TODO: add error function that not only sends errors to customers but logs them in the error database as well
            // TODO: use this error function for all res errors.
     
            console.log('error', JSON.stringify(err));
            reject(err)
            return;
        })
     
        return;
    })
 }

 const email = `
 Testing <b>SMTP.com</b>
 `

 //sendEmail('admin@pymnts.com', 'admin@pymnts.com', 'Testing SMTP.com', email, 'admin_pymnts_com299', "PYMNTS");

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

const httpsServer = https.createServer({
    key: fs.readFileSync(privateKeyPath),
    cert: fs.readFileSync(fullchainPath),
  }, app);
  

  httpsServer.listen(listenPort, () => {
    console.log(`HTTPS Server running on port ${listenPort}`);
});
