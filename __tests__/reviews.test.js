const request = require("supertest");

const app = require("../app"); 

describe("GET /reviews", () => {
    // Testing whether we receive any actual data
    it("responds with the reviews data", async () => {
        const response = await request(app).get("/api/reviews");
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBeGreaterThanOrEqual(1); 
    });

    // Testing for the correct data formatting for the reviews
    it("responds with the correctly formatted type of data", async () => {
        const response = await request(app).get("/api/reviews");
        expect(response.statusCode).toBe(200); 
        expect(typeof response.body[0].author.name.label).toBe("string");
        expect(typeof response.body[0].content.label).toBe("string");
        expect(typeof response.body[0].updated.label).toBe("string");
        expect(typeof response.body[0]["im:rating"].label).toBe("string");
    });

    // 404 test 
    it("should response appropriately in 404 scenarios", async () => {
        const response = await request(app).get("/api/reviews/nonexistent");
        expect(response.statusCode).toBe(404); 
    });
});

describe("GET /reviews/refresh", () => {
    // Testing whether we receive any actual data after the manual refresh 
    it("responds with the reviews data", async () => {
        const response = await request(app).get("/api/reviews/refresh");
        expect(response.statusCode).toBe(200); 
        expect(response.body.length).toBeGreaterThanOrEqual(1); 
    });

    // Testing for the correct data formatting for the reviews
    it("responds with the correctly formatted type of data", async () => {
        const response = await request(app).get("/api/reviews/refresh");
        expect(response.statusCode).toBe(200); 
        expect(typeof response.body[0].author.name.label).toBe("string");
        expect(typeof response.body[0].content.label).toBe("string");
        expect(typeof response.body[0].updated.label).toBe("string");
        expect(typeof response.body[0]["im:rating"].label).toBe("string");
    });

    it("should response appropriately in 404 scenarios", async () => {
        const response = await request(app).get("/api/reviews/refresh/nonexistent");
        expect(response.statusCode).toBe(404); 
    });
});
