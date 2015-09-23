# Website-admin

This aplication is built to funcion with the [Website App](https://github.com/AugustoL/website), point this app to the same db that you use on the website and you will eb able to manage your posts and images on the website.

## Config File

You will need a config.js file next to server.js like this:
```
module.exports = {
	logLevel : 'debug', // none, normal, debug
	dbURI : 'mongodb://username:password@ds059712.mongolab.com:59712/dbname' // An URI of mongolab.com will look like these
};
```
Make sure that the user on the db has write/read permissions.

## Run the app

By default the app is configured to run over port 3010
```
sudo node server.js
```
Go to localhost:3010 and you will see the admin app.
