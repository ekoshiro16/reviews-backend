# Setting up the reviews displayer backend

1. `npm install` 
2. `npm run start`

# To execute test suite

1. `npm test`

# Notes
- Please note that there are two JSON data files: reviewsData.json and testReviewsData.json. 
    - testReviewsData.json contains test data used for unit testing.
    - reviewsData.json contains the actual reviews data, is persistent, and is populated by the `/api/reviews/refresh` endpoint. 
- Note that this backend app is meant to be run in tangent with its accompanying frontend client, which you can find [here](https://github.com/ekoshiro16/runway-frontend)