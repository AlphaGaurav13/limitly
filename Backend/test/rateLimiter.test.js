const request = require("supertest");

const app = require("../app");

describe("Demo Rate  Limiter", () => {
    test("Should block after 5 request", async () => {


        for(let i = 0; i < 5; i++){
            const response = await request(app).get("/api/test-rate-limit");
            
            expect(response.statusCode).toBe(200);
        }

        const blockedResponse = await request(app).get("/api/test-rate-limit");

        expect(blockedResponse.statusCode).toBe(429);
    });
});