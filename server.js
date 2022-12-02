require('dotenv').config()
const express = require('express')
const router = express.Router()
const path = require('path')
const app = express()
const busboy = require('connect-busboy')
const bodyParser = require('body-parser')
const favicon = require('serve-favicon')
const os = require('os');
const osu = require('node-os-utils')
const cpuosu = osu.cpu
const ping = require('ping');
const si = require('systeminformation');

// Variables
var cputemp = null;
var networktemp = {};
var networkhosts = [process.env.ROUTER, 'google.com', 'espanastore.es'];
var static_data = [[],[],[],[],[],[],[],[]];
var dynamic_data = [{id: 1, freeram: null}];

// Port
app.listen(process.env.PORT);
console.log("Listening on port " + process.env.PORT)

// USE
app.use(express.json({limit: '20mb'}));
app.use(express.urlencoded({limit: '20mb', extended: true}));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json({limit: '20mb'}));
app.use(bodyParser.urlencoded({limit: '20mb', extended: true}));
app.set('view-engine', 'ejs')
app.use(favicon(__dirname + '/img/logo/logo-icon.ico'));
app.use(busboy());

// Get static data
si.cpu().then(data => {
	static_data[0][0] = data.manufacturer,
	static_data[0][1] = data.brand,
	static_data[0][2] = data.socket,
	static_data[0][3] = data.speed,
	static_data[0][4] = data.cores
}).catch(error => console.error(error));
	
si.system().then(data => {
	static_data[1][0] = data.manufacturer,
	static_data[1][1] = data.model
}).catch(error => console.error(error));
  
si.bios().then(data => {
	static_data[1][2] = data.vendor,
	static_data[1][3] = data.version,
	static_data[1][4] = data.releaseDate
}).catch(error => console.error(error));

si.memLayout().then(data => {
	static_data[2].push(data)
}).catch(error => console.error(error));

si.osInfo().then(data => {
	static_data[1][5] = data.uefi,
	static_data[3][0] = data.distro,
	static_data[3][1] = data.release,
	static_data[3][2] = data.hostname
}).catch(error => console.error(error));

si.battery().then(data => {
	static_data[4][0] = data.model,
	static_data[4][1] = data.manufacturer,
	static_data[4][2] = data.acConnected,
	static_data[4][3] = data.percent,
	static_data[4][4] = data.maxCapacity,
	static_data[4][5] = data.hasBattery
}).catch(error => console.error(error));

si.diskLayout().then(data => {
	static_data[5].push([data[0].type, data[0].name, data[0].vendor, data[0].size, data[0].interfaceType])
}).catch(error => console.error(error));

si.graphics().then(data => {
	static_data[6].push([data.controllers])
}).catch(error => console.error(error));

si.networkGatewayDefault().then(data => {
	static_data[7][0] = data
}).catch(error => console.error(error));

si.networkInterfaceDefault().then(data => {
	static_data[7][1] = data
}).catch(error => console.error(error));

/*

--> ADD returns wifi info (ssid, quality etc)
si.wifiNetworks()
.then(data => console.log(data))
.catch(error => console.error(error));

--> ADD rj42 & wifi (filter only wifi and Ethernet)
si.networkInterfaceDefault() --> wifi
.then(data => console.log(data))
.catch(error => console.error(error));

--> ADD in specification smalles divs with each storage unit C:/D: DVD local etc 
si.blockDevices()
.then(data => console.log(data))
.catch(error => console.error(error));

--> ADD relation with above blockDevices (just add in same array), match D: or C: with the above, this one provides available space
si.fsSize()
.then(data => console.log(data))
.catch(error => console.error(error));

*/

// Updates
var intervalId = setInterval(function() {
	cpuosu.usage().then(cpuPercentage => {
		cputemp = cpuPercentage;
	})
	networkhosts.forEach(function(host){
		ping.sys.probe(host, function(isAlive){
			networktemp[host] = [isAlive];
		});
	});
	dynamic_data = [{id: 1, freeram: (os.freemem() / 1000 / 1000 / 1000).toFixed(2), cpusage: cputemp, network: JSON.stringify(networktemp)}];
}, process.env.SPEED);

// Get
app.get(['/', '/index'], function (req, res) {
	res.render('index.ejs', { staticdata: JSON.stringify(static_data)}),
	app.use(express.static(__dirname + '/css')),
	app.use(express.static(__dirname + '/img')),
	app.use(express.static(__dirname + '/js'))
})

app.get('/api/nodemonitor', (req, res) => {
	res.send(dynamic_data);
});


