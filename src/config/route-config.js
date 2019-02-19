module.exports = {
    init(app){
        const staticRoutes = require("../routes/static");
        const userRoutes = require("../routes/users");
        const musicRoutes = require("../routes/music");
        const notifyRoutes = require("../routes/notify");
        
        app.use(staticRoutes);
        app.use(userRoutes);
        app.use(musicRoutes);
        app.use(notifyRoutes);
    }
}