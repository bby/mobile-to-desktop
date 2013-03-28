Mobile to Desktop
==========

Quick hacked together use of socket.io to transfer device data (in this case orientation)between said device and browser. The a bit over blown with the inclusion of backbone, require and grunt but if it goes further they might be useful.

Install
-----

You will need node & npm; http://nodejs.org/ 

Run the following in your terminal in the root of the directory.

```
npm install
```
```
npm run-script grunt
```
```
npm start
```

You should now be up and running at http://localhost:8080 You need to visit the site on your mobile at the same address as you have connected to in your browser. Since you can't visit localhost on your mobile this means you need to find out your IP address of your computer and use that instead (dont forget the port number).
