#!/bin/sh

# Make sure we're in the right place
DIR=$(cd $(dirname "$0"); pwd)
cd $DIR

sudo forever stop admin-back  || echo "No forever admin-backend procces running to stop";
sudo forever stop admin-front  || echo "No forever admin-front procces running to stop";