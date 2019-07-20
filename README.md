# Weather info

This site shows the weather in the browser. It fetches the weather information from OpenWeather.

## Setup

### Certificates

The Weather app needs to run on https to use the geolocation API. 

* Get a certificate. Here's an article [how to generate a self signed certificate on a mac](https://certsimple.com/blog/localhost-ssl-fix)
* The pem file for the key goes to `private/server.key`
* The pem file for the certificate goes to `private/server.crt`

### API key

* Get an API key from [OpenWeather](https://openweathermap.org);
* Create a file `api.js` in the directory `private`
* Set its contents to: 
```js
exports.API_KEY = ''; // your API key;
```

## Build the project

Use `yarn` or `npm install` to get all dependencies.

## Run the project

```bash
node app.js
```


Then open the browser on [https://localhost:3000](https://localhost:3000)
 