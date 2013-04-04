Mobile to Desktop
==========

Quick hacked together use of socket.io to transfer device data (in this case orientation) between said device and browser. It's a bit over blown with the inclusion of backbone, require and grunt but if it goes further they might be useful.

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

You should now be up and running at http://localhost:8080 You need to visit the site on your mobile at the same address as you have connected to in your browser. Since you can't visit localhost on your mobile this means you need to find out your IP address of your computer (e.g. ifconfig in your terminal). 

Once you have this you will need change the client connection;

```
on line 97 of app/js/views/app.js 
```

Then point your browser and mobile to the same ip address and port

TODO
-----

Aside from less hackery balls;

- Make it less hackery balls

