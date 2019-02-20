const schedule = require('node-schedule');
notifyController = require("./notifyController");
const sgMail = require('@sendgrid/mail');
const api_key = process.env.SEND_GRID_KEY;
sgMail.setApiKey(api_key);

const rule = new schedule.RecurrenceRule();
rule.hour = 17;
rule.minute = 00;

const j = schedule.scheduleJob(rule, function(){
    notifyController.checkNew;
    const msg = {
        to: 'nbjames2@gmail.com',
        from: 'nbjames2@gmail.com',
        subject: 'Music Notifier run',
        text: 'Schedule has been run at ' + new Date()
    };
    sgMail.send(msg);
})