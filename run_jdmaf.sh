#!/bin/bash

echo "Killing any previous instance of NodeJS server..."
pkill jdmaf-server -f
echo "Restarting server.js"
exec -a jdmaf-server node server/server.js &

echo "Killing any previous instance og Angular NG server..."
fuser -k 4200/tcp
echo "Starting Angular dev. server on port 4200 "

echo " ▄▄▄██▀▀▀▓█████▄  ███▄ ▄███▓    ▄▄▄        █████▒"
echo "   ▒██   ▒██▀ ██▌▓██▒▀█▀ ██▒   ▒████▄    ▓██   ▒ "
echo "   ░██   ░██   █▌▓██    ▓██░   ▒██  ▀█▄  ▒████ ░ "
echo "▓██▄██▓  ░▓█▄   ▌▒██    ▒██    ░██▄▄▄▄██ ░▓█▒  ░ "
echo " ▓███▒   ░▒████▓ ▒██▒   ░██▒    ▓█   ▓██▒░▒█░    "
echo " ▒▓▒▒░    ▒▒▓  ▒ ░ ▒░   ░  ░    ▒▒   ▓▒█░ ▒ ░    "
echo " ▒ ░▒░    ░ ▒  ▒ ░  ░      ░     ▒   ▒▒ ░ ░      "
echo " ░ ░ ░    ░ ░  ░ ░      ░        ░   ▒    ░ ░    "
echo " ░   ░      ░           ░            ░  ░        "
echo "          ░                                      "
echo ""

echo ""
ng serve --host=0.0.0.0 --disable-host-check --port 4200

