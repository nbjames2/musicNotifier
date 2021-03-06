require("dotenv").config();
const path = require("path");
const viewsFolder = path.join(__dirname, "..", "views");
const expressValidator = require("express-validator");
const passportConfig = require("./passport-config");
const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require("express-flash");
const schedule = require('node-schedule');
notifyController = require("../controllers/notifyController");
const sgMail = require('@sendgrid/mail');
const api_key = process.env.SEND_GRID_KEY;
sgMail.setApiKey(api_key);


module.exports = {
    init(app, express){
        app.set("views", viewsFolder);
        app.set("view engine", "ejs");
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(expressValidator());
        app.use(session({
            secret: process.env.cookieSecret,
            resave: true,
            saveUninitialized: true,
            cookie: {maxAge: 1.21e+9}
        }));
        app.use(flash());
        passportConfig.init(app);
        app.use((req, res, next) => {
            res.locals.currentUser = req.user;
            next();
        });
        app.use(express.static(path.join(__dirname, "..", "assets")));
        
        var job = schedule.scheduleJob('00 02 * * *', function(){
            notifyController.checkNew();
            const msg = {
                to: 'nbjames2@gmail.com',
                from: 'nbjames2@gmail.com',
                subject: 'Music Notifier run',
                text: 'Schedule has been run at ' + new Date()
            };
            sgMail.send(msg);    
        });
    }
};