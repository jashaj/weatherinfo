# Weather info

[![Build status](https://github.com/jashaj/weatherinfo/workflows/Node.js%20CI/badge.svg)](https://github.com/jashaj/weatherinfo/actions)

This project creates a webpage that shows the weather. It fetches the weather information from [OpenWeather](https://openweathermap.org).

I have used this project to _experiment_ with [web components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) and [modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) in Vanilla JavaScript. Don't expect shiny, clean code.

## Setup

### Create a certificate

The Weather app needs to run on https to use the [geolocation api](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API). The geolocation api is used to resolve your current location.

* Get a certificate. Here's an article [how to generate a self signed certificate on a mac](https://certsimple.com/blog/localhost-ssl-fix)
* The pem file for the key goes to `private/server.key`
* The pem file for the certificate goes to `private/server.crt`

### API key

* [Get an API key](https://openweathermap.org/appid#get) from OpenWeather
* Create a file `api.js` in the directory `private`
* Set its contents to: 
```js
exports.API_KEY = ''; // fill in your API key;
```

## Build the project

Use `npm install` to get all dependencies. There are no other steps to build the project.

## Run the project

```bash
node app.js
```

Then open the browser on [https://localhost:3000](https://localhost:3000)
 
