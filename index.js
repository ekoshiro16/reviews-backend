const app = require("./app");
const addReviewsToFile = require("./reviewsFetcher");

// This backend client polls the Apple Store RSS feed every minute to ensure the stored JSON reviews data is kept up to date.
setInterval(addReviewsToFile, 60000);

const PORT = 3000; 
app.listen(PORT, () => {
    console.log(`We're running on port ${PORT}`);
    addReviewsToFile(); 
});