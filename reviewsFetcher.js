const axios = require("axios"); 
const fs = require("fs").promises; 

// This helper function fetches the reviews data from the Apple Store RSS feed and writes that data into the "reviewsData.json" file.
async function addReviewsToFile() {
    console.log("addReviewsToFile invoked - fetching & writing data...");
    try {
        const url = `https://itunes.apple.com/us/rss/customerreviews/id=405075943/sortBy=mostRecent/page=1/json`;
        const response = await axios.get(url);

        if (response && response.data.feed.entry) {
            // Now using await with fs.promises.writeFile
            await fs.writeFile("reviewsData.json", JSON.stringify(response.data.feed.entry, null, 2));
            console.log("Reviews data successfully written into file!");
        };
    } catch (err) {
        console.error(err); 
    };
};

module.exports = addReviewsToFile; 