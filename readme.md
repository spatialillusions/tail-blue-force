#Tail Blue Force

*A tail is something that always follows you around.*

Tail is a minimal blue force tracker to show what a real world usecase of milsymbol could be. It is still in very early development.

Tail uses socket.io for the backend of the server for handling messages, and openlayers 3 for the frontend to display where the current connected units are located.

The message format used in Tail is based on open information of the VMF messages described in MIL-STD-2016, but since the standard is limited distribution the message format has only implemented what is available in open sources.

## Roadmap
- Actually convert the messages to/from binary code in the client
- Move to https
- Use the connected users real position if available (requires https)
- Make the buttons in the client do more stuff
- Better reconnect functionality if connection is lost

## Live demo
At the moment there is a live demo at:
https://tail.spatialillusions.com

The port/server/other stuff might change at any time, so it's guaranteed that the demo will work. If you want to see how the information is pushed to the clients the recommendation is to open several windows and sign in with them.

No information about positions are stored on the server, once you disconnect all your connection information will be removed from the in memory dataset. (Logging can however be added quite easy.)

## Getting started with tail

- Download the source code, no npm yet.
- Run `npm install` in the directory where you have the source
- Patch the milsymbol library with the latest dist file from GitHub (we are using functionality not yet released)
- Add your own Mapbox accesstoken in index.html
- Update server.js with paths to your own ssl certificates
- Change portnumbers, or run `sudo setcap 'cap_net_bind_service=+ep' /usr/bin/nodejs` to allow node to run on ports lower than 1024
- Run `node server.js` to start tail.
- You should now be able to browse to your server and get the tail client as a response.


## Contact
Please use contact details found on http://www.spatialillusions.com if you want to get in contact with me.