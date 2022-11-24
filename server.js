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
const cpu = osu.cpu
const ping = require('ping');
var cputemp = null;
var networktemp = null;

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

// Data
var staticdata = [{id: 1, cpu: os.cpus(), ram: (os.totalmem() / 1000 / 1000 / 1000).toFixed(2)}]; 
var data = [{id: 1, freeram: null}];

var intervalId = setInterval(function() {
	cpu.usage().then(cpuPercentage => {
		cputemp = cpuPercentage;
	})
	netstat.inOut().then(info => {
		networktemp = info;
	})
	data = [
		{id: 1, freeram: (os.freemem() / 1000 / 1000 / 1000).toFixed(2), cpusage: cputemp, network: networktemp}
	];
}, 2000);

// Get
app.get(['/', '/index'], function (req, res) {
	res.render('index.ejs', { staticdata: JSON.stringify(staticdata) }),
	app.use(express.static(__dirname + '/css')),
	app.use(express.static(__dirname + '/img')),
	app.use(express.static(__dirname + '/js'))
})

app.get('/api/nodemonitor', (req, res) => {
	res.send(data);
});