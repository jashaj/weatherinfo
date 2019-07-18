# Weather info

This site shows the weather in the browser. It fetches the weather information from OpenWeather.

## Setup

* Get an API key from [OpenWeather](https://openweathermap.org);
* Create a file `key.js` in the root of the project
* Set its contents to: 
```
weatherInfo.API_KEY = ''; // your API key;
```

## Run the project

Currently there is no webserver configured for this project. 

As example you can use the NodeJS [http-server](https://www.npmjs.com/package/http-server).

Install the http-server:

```bash
 npm install http-server -g
 ```

 Run the http-server

 ```bash
 http-server
 ```

Then open the browser on [http://127.0.0.1:8080](http://127.0.0.1:8080)
 