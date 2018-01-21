# imagefetcher
## This application has 3 page: 
## 1. A page containing an input field and a submit button to Fetch images from google and save top 15 images after passing through a compression algorithm then pass it through a black and white filter and upload all the images to a particular location(Google Cloud)
## 2. A page which lists all the keywords searched before by the user
## 3. After clicking on any word on the listing page open up another page which will have all the images for that particular keyword, but this time the images should be loaded from the location/path on which you saved those images.
### Instructions
- npm install
- node server
- open "localhost:8080" to access the site
### Note: Google Cloud Storage is used instead of AWS
### Note: The application is a bit buggy and work is being done to remove those bugs
### Note: The logic implemented may some times fail and the page may hang.
