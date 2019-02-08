const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/";

describe("routes : static", () => {

    describe("GET /", () => {

        it("should return a status code of 200 and have 'Welcome to Music Notifier in the body of the response", (done) => {
            request.get(base, (err, res, body) => {
                expect(res.statusCode).toBe(200);
                expect(body).toContain("Welcome to Music Notifier");
                done();
            });
        });
    });
});