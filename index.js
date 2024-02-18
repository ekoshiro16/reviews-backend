const axios = require("axios"); 
const express = require("express");
const fs = require("fs"); 
const app = express(); 
const PORT = 3000; 
const reviewsPathName = "reviewsData.json";

app.use(express.json()); 

async function writeReviewsData(jsonData) {
    try {  
        fs.writeFile("reviewsData.json", jsonData, (err) => {
            if (err) throw err; 
            console.log("Reviews data has been written!");
        });
    } catch (e) {
        console.error(e); 
    };
};

async function addReviewsToFile() {
    console.log("addReviewsToFile invoked - fetching & writing data...");
    try {
        const url = `https://itunes.apple.com/us/rss/customerreviews/id=405075943/sortBy=mostRecent/pag
        e=1/json`;

        const response = await axios.get(url);

        if (response && response?.data.feed.entry.length) {
            fs.writeFile("reviewsData.json", JSON.stringify(response.data.feed.entry, null, 2), (err) => {
                if (err) throw error; 
                console.log("Reviews data successfully written into file!");
            });
        };
    } catch (err) {
        console.error(err); 
    };
};

app.get("/api/reviews", async (req, res) => {
    console.log("/api/reviews hit")
    try {
        const filePathName = "reviewsData.json";

        fs.readFile(filePathName, (err, data) => {
            if (err) {
                res.status(500).send("Failed to read data.");
                return;
            };

            try {
                const parsedData = JSON.parse(data);
                res.json(parsedData);
            } catch (e) {
                console.error(e);
                res.status(500).send("Failed to parse JSON data.");
            };
        });
    } catch (e) {
        console.error(e); 
        res.status(500).send("Failed to retrieve JSON data.")
    };
});

app.get("/api/reviews/refresh", async (req, res) => {
    try {
        await addReviewsToFile(); 
        const filePathName = "reviewsData.json";

        fs.readFile(filePathName, (err, data) => {
            if (err) {
                res.status(500).send("Failed to read data.");
                return;
            };

            try {
                const parsedData = JSON.parse(data);
                res.json(parsedData);
            } catch (e) {
                console.error(e);
                res.status(500).send("Failed to parse JSON data.");
            };
        });
    } catch (err) {
        console.error(err); 
    };
});

setInterval(addReviewsToFile, 60000);

app.listen(PORT, () => {
    console.log(`We're running on port ${PORT}`);
    addReviewsToFile(); 
});