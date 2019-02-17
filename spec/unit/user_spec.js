const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;

describe("User", () => {

    beforeEach((done) => {
        sequelize.sync({force: true})
        .then(() => {
            done();
        })
        .catch((err) => {
            console.log(err);
            done();
        });
    });

    describe("#create()", () => {

        it("should create a User object with a valid email and password", (done) => {
            User.create({
                first: "bob",
                last: "bob",
                email: "user@example.com",
                password: "123456789"
            }) 
            .then((user) => {
                expect (user.email).toBe("user@example.com");
                expect(user.id).toBe(1);
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });

        it("should not create a User with invalid email or password", (done) => {
            User.create({
                first: "bob",
                last: "bob",
                email: "It's-a me, Mario!",
                password: "1234567890"
            })
            .then((user) => {
                done();
            })
            .catch((err) => {
                expect(err.message).toContain("Validation error: must be a valid email");
                done();
            });
        });

        it("should not create a User with an email already taken", (done) => {
            User.create({
                first: "bob",
                last: "bob",
                email: "user@example.com",
                password: "123456798"
            })
            .then((user) => {
                User.create({
                    first: "bob",
                    last: "bob",
                    email: "user@example.com",
                    password: "987654321"
                })
                .then((user) => {
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
});