# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

### `sudo apt install git`

installs git

### `git clone https://github.com/metux-o0/2022-2023-L2G1-velib-based-web-app.git`

clones the github repository

### `sudo apt install nodejs`

installs the last version of node on your computer

In the project directory, you can run:

### `npm install`

installs [node_modules] (libraries needed to run program ).

### `npm start`

Runs both back and front at the same time.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.
if it does not work use the next two scipts on diffrent terminals

### `npm run back`

Runs the back in the development mode.
Open [http://localhost:3030](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.
If you have trouble launching it please check [BACK/src/services/mongoose.js] (your mongodb id and <password>)

### `npm run front`

Runs the front in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.
If you have trouble launching it please check [front/src/App.js] line [358] (your <GoogleMapsApiKey>).



## `API Key`
Create a file named `apiKey.js` on [front/src/components/page/Map].
paste this line of code :
	Const NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="Google api key";
	export default NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
replace `Google api key` with you google maps api key.

modify[Back/src/services/MongoDBlink] and replace "mongodb+srv://NomUser:mdp@test.ppkdbye.mongodb.net/?retryWrites=true&w=majority" by the code and password given to you on your DataBase MongoDB

