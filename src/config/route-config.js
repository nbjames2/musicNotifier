module.exports = {
    init(app){
        const staticRoutes = require("../routes/static");
        const userRoutes = require("../routes/users");
        const musicRoutes = require("../routes/music");
        
        app.use(staticRoutes);
        app.use(userRoutes);
        app.use(musicRoutes);
    }
}