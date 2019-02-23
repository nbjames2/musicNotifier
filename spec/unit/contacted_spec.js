const sequelize = require("../../src/db/models/index").sequelize;
const Follow = require("../../src/db/models").Follow;
const User = require("../../src/db/models").User;
const Contacted = require("../../src/db/models").Contacted;

describe("Contacted", () => {

    beforeEach((done) => {
        this.topic;
        this.follow;
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
                Follow.create({
                    userId: this.user.id,
                    artistId: "bob dylan"
                })
                .then((follow) => {
                    this.follow = follow;
                    done();
                })
                .catch((err) => {
                    console.log(err);
                });
            })
            .catch((err) => {
                console.log(err);
            });
        })
        .catch((err) => {
            console.log(err);
            done();
        });
    });

    describe("#create()", () => {

        it("should create a Contacted object with a valid userId and artistId", (done) => {
            Contacted.create({
                userId: this.user.id,
                artistId: this.follow.artistId,
                albumId: 'happy'
            }) 
            .then((contacted) => {
                expect (contacted.userId).toBe(1);
                expect(contacted.artistId).toBe('bob dylan');
                expect(contacted.albumId).toBe('happy');
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });

        it("should not create a Contacted with invalid userId, albumId or artistId", (done) => {
            Contacted.create({
                userId: this.user.id,
            })
            .then((contacted) => {
                done();
            })
            .catch((err) => {
                expect(err.message).toContain("Contacted.artistId cannot be null");
                done();
            });
        });

        it("should not create a Contacted with a matching userId and artistId and albumId to another", (done) => {
            Contacted.create({
                userId: this.user.id,
                artistId: this.follow.artistId,
                albumId: 'happy'
            })
            .then((contacted) => {
                Contacted.create({
                    userId: this.user.id,
                    artistId: this.follow.artistId,
                    albumId: 'happy'
                })
                .then((contacted) => {
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
        it("should delete a contacted object from database", (done) => {
            Contacted.create({
                userId: this.user.id,
                artistId: this.follow.artistId,
                albumId: 'happy'
            })
            .then((contacted) => {
                Contacted.findAll()
                .then((contacteds) => {
                    let contactedCount = contacteds.length;
                    Contacted.destroy({
                        where: {
                            userId: this.user.id,
                            artistId: this.follow.artistId,
                            albumId: 'happy'
                        }
                    })
                    .then(() => {
                        Contacted.findAll()
                        .then((contacteds) => {
                            expect(contacteds.length).toBe(contactedCount - 1);
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