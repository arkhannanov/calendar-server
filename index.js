const express = require('express');
const bodyParser = require('body-parser');
const pdf = require('html-pdf');
const cors = require('cors');
const fs = require('fs');
const mailgun = require("mailgun-js");
const path = require("path");

const DOMAIN = 'sandboxafc8ac2bab3e45b7867d8b941ccd12de.mailgun.org';
const api_key = '816be980a9ca8259965a95d47df3cf96-f7910792-b232a826';

const emailBody = fs.readFileSync('./documents/activate.hbs').toString();
const filepath = path.join(__dirname, 'result.pdf');

const mg = mailgun({apiKey: api_key, domain: DOMAIN});
const pdfTemplate = require('./documents');
const app = express();

app.set('port', (process.env.PORT || 5000));
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.post('/create-pdf', (req, res) => {
    pdf.create(pdfTemplate(req.body), {}).toFile('result.pdf', (err) => {
        if (err) {
            res.send(Promise.reject());
        }

        res.send(Promise.resolve());
    });
});

app.post('/fetch-pdf', (req, res) => {
    // res.sendFile(`${__dirname}/result.pdf`)

    console.log(req.body.email);

    const data = {
        from: "Artur Khannanov <arkhannanov@gmail.com>",
        to: req.body.email,
        subject: 'Hello',
        html: emailBody,
        attachment: filepath
    };
    mg.messages().send(data, function (error, body) {
        console.log(body);
    });
})

app.get('/', function (request, response) {

    let result = 'App is running';
    response.send(result);
}).listen(app.get('port'), function () {
    console.log('App is running, server is listening on port ', app.get('port'));
});