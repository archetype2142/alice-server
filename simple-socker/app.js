const watch = require('node-watch');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const FileReader = require('filereader');
const fs = require('fs');
const WebSocket = require('ws');
const chokidar = require('chokidar');

const ws = new WebSocket.Server({ port: 5080 });
var filename = '../alice_container/events/event4047_run226466.json';
// var filename = '../alice_container/sample.json';


ws.on('connection', function connection(ws) {
  readTextFile(filename, ws);
  
  chokidar.watch(filename).on(
    'change', (event, path) => {
    readTextFile(filename, ws);
    console.log("change sent");
  });

  ws.on('message', function incoming(message) {
    if(message === "retrieve_data") {
      console.log("Sending data...");
      readTextFile(filename, ws);
    }
  });
});

function readTextFile(file, ws) {
  fs.readFile(file, 'utf-8', (err, data) => { 
    if (err) throw err; 
    ws.send(data.toString()); 
  });
}
