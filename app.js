const axios = require("axios"); 
const express = require("express");
const { parse } = require("path");
const fs = require("fs").promises; 
const app = express(); 
const PORT = 3000; 

app.use(express.json()); 

// This helper function fetches the reviews data from the Apple Store RSS feed and writes that data into the "reviewsData.json" file
// async function addReviewsToFile() {
//     console.log("addReviewsToFile invoked - fetching & writing data...");
//     try {
//         const url = `https://itunes.apple.com/us/rss/customerreviews/id=405075943/sortBy=mostRecent/page=1/json`;

//         const response = await axios.get(url);

//         if (response && response?.data.feed.entry) {
//             fs.writeFile("reviewsData.json", JSON.stringify(response.data.feed.entry, null, 2), (err) => {
//                 if (err) throw err; 
//                 console.log("Reviews data successfully written into file!");
//                 return;
//             });
//         } 
//     } catch (err) {
//         console.error(err); 
//     };
// };
async function addReviewsToFile() {
    console.log("addReviewsToFile invoked - fetching & writing data...");
    try {
        const url = `https://itunes.apple.com/us/rss/customerreviews/id=405075943/sortBy=mostRecent/page=1/json`;
        const response = await axios.get(url);

        if (response && response.data.feed.entry) {
            // Now using await with fs.promises.writeFile
            await fs.writeFile("reviewsData.json", JSON.stringify(response.data.feed.entry, null, 2));
            console.log("Reviews data successfully written into file!");
        }
    } catch (err) {
        console.error(err); 
    }
}


// This endpoint is used to read the reviews data from the "reviewsData.json" file, parse it, and send it to our frontend client. 
app.get("/api/reviews", async (req, res) => {
    console.log("/api/reviews hit")
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

// This endpoint is used to manually refresh the JSON file with the reviews data and send that parsed data back to the frontend client. 
app.get("/api/reviews/refresh", async (req, res) => {
    console.log("/api/reviews/refresh hit")
    try {
        await addReviewsToFile();
        const filePathName = "reviewsData.json";

        const data = await fs.readFile(filePathName, "utf8");
        const parsedData = JSON.parse(data);
        res.status(200).json(parsedData);
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to handle your request -sorry!"); 
    }
});

app.use((req, res, next) => {
    res.status(404).send("Invalid endpoint! Please try again!")
});

module.exports = app;