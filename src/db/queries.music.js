const Follow = require ("./models").Follow;

module.exports = {
    create(id, user, callback){
        Follow.findOne({ 
            where: { 
                userId: user.id,
                artistId: id
            }
        })
        .then((followed) => {
            if(followed) {
                Follow.destroy({
                    where: {
                        userId: user.id,
                        artistId: id
                    }
                })
                .then(() => {
                    callback(null, "existing");
                })
                .catch((err) => {
                    callback(err);
                })
            } else {
                Follow.create({
                    userId: user.id,
                    artistId: id
                })
                .then((newFollow) => {
                    callback(null, newFollow);
                })
                .catch((err) => {
                    callback(err);
                });
            }
        })
        .catch((err) => {
            callback(err);
        });      
    },
    checkFollowed(id, user, callback){
        Follow.findOne({
            where: {
                userId: user.id,
                artistId: id
            }
        })
        .then((follow) => {
            if(!follow){
                callback(null, "not");
            } else {
                callback(null, "followed");
            }
        })
        .catch((err) => {
            callback(err);
        });
    }
}
