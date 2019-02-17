const sequelize = require("../../src/db/models/index").sequelize;
const Follow = require("../../src/db/models").Follow;
const User = require("../../src/db/models").User;

describe("Follow", () => {

    beforeEach((done) => {
        this.topic;
        sequelize.sync({force: true})
        .then(() => {
            User.create({
                first: "Blob",
                last: "Blob",
                email: "blob@example.com",
                password: "123456789"
            })
            .then((user) => {
                this.user = user;
                done();
            })
            .catch((err) => {
                console.log(err);
            })
        })
        .catch((err) => {
            console.log(err);
            done();
        });
    });

    describe("#create()", () => {

        it("should create a Follow object with a valid userId and artistId", (done) => {
            Follow.create({
                userId: this.user.id,
                artistId: '13'
            }) 
            .then((follow) => {
                expect (follow.userId).toBe(1);
                expect(follow.artistId).toBe('13');
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });

        it("should not create a Follow with invalid userId or artistId", (done) => {
            Follow.create({
                userId: this.user.id,
            })
            .then((follow) => {
                done();
            })
            .catch((err) => {
                expect(err.message).toContain("Follow.artistId cannot be null");
                done();
            });
        });

        it("should not create a Follow with a matching userId and artistId to another", (done) => {
            Follow.create({
                userId: this.user.id,
                artistId: '12'
            })
            .then((follow) => {
                Follow.create({
                    userId: this.user.id,
                    artistId: '12'
                })
                .then((follow) => {
                    done();
                })
                .catch((err) => {
                    expect(err.message).toContain("Validation error");
                    done();
                });
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });
    });

    describe("#destroy", () => {
        it("should delete a Follow object from database", (done) => {
            Follow.create({
                userId: this.user.id,
                artistId: '12'
            })
            .then((follow) => {
                Follow.findAll()
                .then((follows) => {
                    let followCount = follows.length;
                    Follow.destroy({
                        where: {
                            userId: this.user.id,
                            artistId: '12'
                        }
                    })
                    .then(() => {
                        Follow.findAll()
                        .then((follows) => {
                            expect(follows.length).toBe(followCount - 1);
                            done();
                        })
                        .catch((err) => {
                            console.log(err);
                            done();
                        });
                    });
                });
            });
        });
    });
});