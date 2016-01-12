#!/bin/sh

# Make sure we're in the right place
DIR=$(cd $(dirname "$0"); pwd)
cd $DIR

sudo forever stop admin-back  || echo "No forever admin-backend procces running to restart";
sudo forever stop admin-front  || echo "No forever admin-front procces running to restart";

if [ $1 = 'dev' ]; then
	sudo forever start --workingDir admin-back --append --uid "admin-back" admin-back/server.js -dev && sudo forever start --workingDir admin-front --append --uid "admin-front" admin-front/server.js -dev && sudo forever list
else
	sudo forever start --workingDir admin-back --append --uid "admin-back" admin-back/server.js && sudo forever start --workingDir admin-front --append --uid "admin-front" admin-front/server.js && sudo forever list
fi
