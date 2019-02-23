const Follow = require("./models").Follow;
const Contacted = require("./models").Contacted;
const User = require("./models").User;
const sgMail = require('@sendgrid/mail');
const api_key = process.env.SEND_GRID_KEY;
sgMail.setApiKey(api_key);

module.exports = {
    notify(newReleases, callback){
        newReleases.forEach((release) => {
            release.artists.forEach((artist) => {
                console.log(artist.name);
                Follow.findAll({
                    where: {
                        artistId: artist.id
                    }
                })
                .then((follows) => {
                    follows.forEach((follow) => {
                        Contacted.findOne({
                            where: {
                                userId: follow.userId,
                                albumId: release.id
                            }
                        })
                        .then((contacted) => {
                            if(!contacted){
                                User.findById(follow.userId)
                                .then((user) => {
                                    const msg = {
                                        to: user.email,
                                        from: 'nbjames2@gmail.com',
                                        subject: 'New Music release',
                                        text: 'New release available from ' + release.artists[0].name
                                    };
                                    sgMail.send(msg);
                                    Contacted.create({
                                        userId: user.id,
                                        artistId: artist.id,
                                        albumId: release.id
                                    })
                                    .then((contacted) => {
                                        console.log("created contacted");
                                    })
                                    .catch((err) => {
                                        callback(err);
                                    });
                                })
                                .catch((err) => {
                                    callback(err);
                                });
                            }
                        })
                        .catch((err) => {
                            callback(err);
                        });
                    })
                })
                .catch((err) => {
                    callback(err);
                });
            });
        });
        callback(null, 'complete');
    }
}