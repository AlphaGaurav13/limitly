const request  = require("supertest");
const app = require("../app");


test("health route should return 200", async () => {
    const response = await request(app).get("/api/health");
    expect(response.statusCode).toBe(200);
});