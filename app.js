const express = require("express");
const fs = require("fs").promises; 
const app = express(); 
const addReviewsToFile = require("./reviewsFetcher");

app.use(express.json()); 

// This endpoint is used to read the reviews data from the local "reviewsData.json" file, parse it, and send it to our frontend client. Sends 500 error if it fails to retrieve JSON data.
app.get("/api/reviews", async (req, res) => {
    console.log("/api/reviews hit");
    try {
        const filePathName = "reviewsData.json";
        const data = await fs.readFile(filePathName, "utf8");
        const parsedData = JSON.parse(data);
        res.status(200).json(parsedData);
    } catch (e) {
        console.error(e); 
        res.status(500).send("Failed to retrieve JSON data.")
    };
});

// This endpoint is used to manually refresh the JSON file with the reviews data from the App Store RSS feed and send that parsed data back to the frontend client. Returns a 500 error if the RSS feed call fails or is unparsable.
app.get("/api/reviews/refresh", async (req, res) => {
    console.log("/api/reviews/refresh hit");
    try {
        await addReviewsToFile();
        const filePathName = "reviewsData.json";
        const data = await fs.readFile(filePathName, "utf8");
        const parsedData = JSON.parse(data);
        res.status(200).json(parsedData);
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to handle your request -sorry!"); 
    };
});

app.use((req, res, next) => {
    res.status(404).send("Invalid endpoint! Please try again!")
});

module.exports = app;