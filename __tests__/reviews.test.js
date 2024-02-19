const request = require("supertest");
const app = require("../app"); 
const fs = require("fs").promises; 

async function writeTestData () {
    try {
        const filePathName = "reviewsData.json";
        const data = await fs.readFile("testReviewsData.json", "utf8");
        const parsedData = JSON.parse(data); 

        await fs.writeFile(filePathName, JSON.stringify(parsedData, null, 2)); 
    } catch (err) {
        console.error(err); 
    };
};

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

    // Testing to see if the JSON file has been written.
    it("writes the reviews data to the JSON file", async () => {
        const pathName = "reviewsData.json";
        await fs.unlink(pathName, (err) => {
            if (err) {
                console.error(err);
                return;
            };
            console.log("File deleted successfully!");
        });

        await request(app).get("/api/reviews/refresh");

        const data = await fs.readFile(pathName, "utf8");
        const parsedData = JSON.parse(data); 
        expect(typeof parsedData[0].author.name.label).toBe("string");
        expect(typeof parsedData[0].content.label).toBe("string");
        expect(typeof parsedData[0].updated.label).toBe("string");
        expect(typeof parsedData[0]["im:rating"].label).toBe("string");
    });

    // 404 test
    it("should response appropriately in 404 scenarios", async () => {
        const response = await request(app).get("/api/reviews/refresh/nonexistent");
        expect(response.statusCode).toBe(404); 
    });
});

describe("GET /reviews", () => {
    // Testing whether we receive any actual data
    it("responds with the reviews data", async () => {
        await writeTestData();
        const response = await request(app).get("/api/reviews");
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBeGreaterThanOrEqual(1); 
    });

    // Testing for the correct data formatting for the reviews
    it("responds with the correctly formatted type of data", async () => {
        await writeTestData(); 
        const response = await request(app).get("/api/reviews");
        expect(response.statusCode).toBe(200); 
        expect(response.body[0].author.name.label).toBe("cwsterling");
        expect(response.body[0].content.label).toBe("Have all push notifications turned off, yet day after day, keep getting push notifications");
        expect(response.body[0].updated.label).toBe("2024-02-16T13:08:52-07:00");
        expect(response.body[0]["im:rating"].label).toBe("1");
    });

    // 404 test 
    it("should response appropriately in 404 scenarios", async () => {
        const response = await request(app).get("/api/reviews/nonexistent");
        expect(response.statusCode).toBe(404); 
    });
});
