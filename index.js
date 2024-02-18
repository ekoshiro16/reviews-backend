const axios = require("axios"); 
const express = require("express");
const fs = require("fs"); 
const app = express(); 
const PORT = 3000; 

app.use(express.json()); 

// This helper function fetches the reviews data from the Apple Store RSS feed and writes that data into the "reviewsData.json" file
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

// This endpoint is used to read the reviews data from the "reviewsData.json" file, parse it, and send it to our frontend client. 
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

// This endpoint is used to manually refresh the JSON file with the reviews data and send that parsed data back to the frontend client. 
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

// This backend client polls the Apple Store RSS feed every minute to ensure the stored JSON reviews data is kept up to date 
setInterval(addReviewsToFile, 60000);

app.listen(PORT, () => {
    console.log(`We're running on port ${PORT}`);
    addReviewsToFile(); 
});