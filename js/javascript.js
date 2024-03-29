// Global variables
var data = null;
var staticdata = null;
var cpuchartdom = null;
var cpuchart = null;
var cpuchartext = null;
var ramchartdom = null;
var ramchart = null;
var ramchartext = null;
var rampercentage = null;
var ramtotal = null;
var gpuchartdom = null;
var gpuchart = null;
var gpuchartext = null;
var hddchartdom = null;
var hddchart = null;
var hddchartext = null;
var networkserverpoint = null;
var networkserverdom = null;
var cross = null;
var bars = null;
var dropmenu = null;
var overlay = null;

document.addEventListener("DOMContentLoaded", function(event) { 

	// Variables
	var updatespeed = 3000;
	var theme = "default";
	var defaultpage = "dashboard";
	var temp = null; 
	var temp2 = null;

	// Dom
	cpuchartdom = document.getElementById("cpu-chart");
	ramchartdom = document.getElementById("ram-chart");
	gpuchartdom = document.getElementById("gpu-chart");
	hddchartdom = document.getElementById("hdd-chart");
	batterychart = document.getElementById("battery-chart");
	cpuchartext = document.getElementById("cpu-chart-text");
	ramchartext = document.getElementById("ram-chart-text");
	gpuchartext = document.getElementById("gpu-chart-text");
	hddchartext = document.getElementById("hdd-chart-text");
	networkserverpoint = document.getElementById("dashboard-network-flex");
	cross = document.getElementById("menu-cross");
	bars = document.getElementById("menu-bars");
	dropmenu = document.getElementById("responsive-menu");
	overlay = document.getElementById("background-over");

	// Get Presets
	if (localStorage.getItem("updatespeed")) {
		updatespeed = localStorage.getItem("updatespeed");
	}
	if (localStorage.getItem("theme")) {
		theme = localStorage.getItem("theme");
	}
	if (localStorage.getItem("defaultpage")) {
		defaultpage = localStorage.getItem("defaultpage");
	}

	// Api
	const apiurl = "./api/nodemonitor";
	  
	// Async Api Fetcher
	async function fetchData() {
		const response = await fetch(apiurl);
		data = await response.json();
		return;
	};

	async function fetchWait(){
		await fetchData();
	};
	
	// Parse Static Data
	staticdata = JSON.parse(document.getElementById("staticdata").getAttribute("value"));	
	document.getElementById("cpu-model").textContent = staticdata[0][0] + " " + staticdata[0][1];
	document.getElementById("cpu-socket").textContent = staticdata[0][2];
	document.getElementById("cpu-speed").textContent = staticdata[0][3] + " Ghz";
	document.getElementById("cpu-cores").textContent = staticdata[0][4];
	document.getElementById("hd-manufacturer").textContent = staticdata[1][0];
	document.getElementById("hd-name").textContent = staticdata[1][1];
	if (staticdata[1][5] == true) {document.getElementById("hd-bios").textContent = staticdata[1][2] + " | " + staticdata[1][4] + " | UEFI";} else {document.getElementById("hd-bios").textContent = staticdata[1][2] + " | " + staticdata[1][4];}
	for (let i = 0; i < staticdata[2][0].length; i++) {
		ramtotal += staticdata[2][0][0].size;
		document.getElementById("specifications-ram").insertAdjacentHTML("afterend", `
			<div>
			<div><p>Model</p><p id="ram-model-` + i + `"></p></div>
			<div><p>Manufacturer</p><p id="ram-manufacturer-` + i + `"></p></div>
			<div><p>Type</p><p id="ram-type-` + i + `"></p></div>
			<div><p>Speed</p><p id="ram-speed-` + i + `"></p></div>
			<div><p>Factor</p><p id="ram-factor-` + i + `"></p></div>
			<div><p>Size</p><p id="ram-size-` + i + `"></p></div>
			</div>
		`);
		document.getElementById("ram-model-" + i).textContent = staticdata[2][0][0].partNum;
		document.getElementById("ram-manufacturer-" + i).textContent = staticdata[2][0][0].manufacturer;
		document.getElementById("ram-type-" + i).textContent = staticdata[2][0][0].type;
		document.getElementById("ram-speed-" + i).textContent = staticdata[2][0][0].clockSpeed;
		document.getElementById("ram-factor-" + i).textContent = staticdata[2][0][0].formFactor;
		document.getElementById("ram-size-" + i).textContent = (staticdata[2][0][0].size / 1000 / 1000 / 1000).toFixed(2) + " GB";
	}
	for (let i = 0; i < staticdata[5].length; i++) {
		document.getElementById("specifications-storage").insertAdjacentHTML("afterend", `
			<div>
			<div><p>Name</p><p id="storage-name-` + i + `"></p></div>
			<div><p>Manufacturer</p><p id="storage-manufacturer-` + i + `"></p></div>
			<div><p>Type</p><p id="storage-type-` + i + `"></p></div>
			<div><p>Size</p><p id="storage-size-` + i + `"></p></div>
			<div><p>Interface</p><p id="storage-interface-` + i + `"></p></div>
			</div>
		`);
		document.getElementById("storage-name-" + i).textContent = staticdata[5][i][1];
		document.getElementById("storage-manufacturer-" + i).textContent = staticdata[5][i][2];
		document.getElementById("storage-type-" + i).textContent = staticdata[5][i][0];
		document.getElementById("storage-size-" + i).textContent = (parseFloat(staticdata[5][i][3] / 1000 / 1000 / 1000)).toFixed(2) + " GB";
		document.getElementById("storage-interface-" + i).textContent = staticdata[5][i][4];
	}
	for (let i = 0; i < staticdata[6][0][0].length; i++) {
		document.getElementById("specifications-gpu").insertAdjacentHTML("afterend", `
			<div>
			<div><p>Model</p><p id="gpu-model-` + i + `"></p></div>
			<div><p>Manufacturer</p><p id="gpu-manufacturer-` + i + `"></p></div>
			<div><p>VRAM</p><p id="gpu-vram-` + i + `"></p></div>
			<div><p>Clock</p><p id="gpu-clock-` + i + `"></p></div>
			</div>
		`);
		document.getElementById("gpu-model-" + i).textContent = staticdata[6][0][0][i].model;
		document.getElementById("gpu-manufacturer-" + i).textContent = staticdata[6][0][0][i].vendor;
		document.getElementById("gpu-vram-" + i).textContent = (parseFloat(staticdata[6][0][0][i].vram / 1000)).toFixed(2) + " GB";
		document.getElementById("gpu-clock-" + i).textContent = (parseFloat(staticdata[6][0][0][i].clockCore / 1000)).toFixed(2) + " Ghz";
	}
	ramtotal = parseFloat((ramtotal / 1000 / 1000 / 1000).toFixed(2));
	document.getElementById("sys-browser-res").textContent = window.innerWidth + "x" + window.innerHeight;
	document.getElementById("sys-screen-res").textContent = screen.width + "x" + screen.height;
	document.getElementById("sys-color").textContent = screen.colorDepth;
	document.getElementById("sys-language-pref").textContent = navigator.language || navigator.userLanguage;
	temp = "Unknown Browser";if (navigator.userAgent.match(/chrome|chromium|crios/i)) {temp = "Chrome";} else if (navigator.userAgent.match(/firefox|fxios/i)) {temp = "Firefox";} else if (navigator.userAgent.match(/safari/i)) {temp = "Safari";} else if (navigator.userAgent.match(/opr\//i)) {temp = "Opera";} else if (navigator.userAgent.match(/edg/i)) {temp = "Edge";}
	document.getElementById("sys-browser").textContent = temp;
	document.getElementById("sys-os").textContent = staticdata[3][0];
	document.getElementById("sys-release").textContent = staticdata[3][1];
	document.getElementById("sys-hostname").textContent = staticdata[3][2];
	document.getElementById("battery-model").textContent = staticdata[4][1] + " - " + staticdata[4][0];
	if (staticdata[4][2] == true) {document.getElementById("battery-status").textContent = "Charging";} else {document.getElementById("battery-status").textContent = "Unplugged";}
	document.getElementById("battery-percent").textContent = staticdata[4][3] + "%";
	if (staticdata[4][5] == true) {document.getElementById("battery-type").textContent = "Battery";} else {document.getElementById("battery-type").textContent = "Wall";}
	document.getElementById("network-mainstats-router").textContent = staticdata[7][0];
	if (staticdata[7][1] == 'Wi-Fi') {
		document.getElementById("lan").style.display = "none";
	} else {
		document.getElementById("wifi").style.display = "none";
	}

	// Updates
	var intervalId = window.setInterval(function(){
		fetchWait();
		if (data != null) {updateUI(data)}
	}, updatespeed);

	var staticIntervalId = window.setInterval(function(){
		if (data != null) {
			staticUI(data);
			clearInterval(staticIntervalId)
		}
	}, updatespeed);	
	
	/* Dashboard */
	
	// Set Scrollable Height
	if ($(window).width() < 720) {
		temp = $(window).height() - 89 - 100;
		temp2 = document.getElementsByClassName("main-content-scrollable");
		for(let i = 0; i < temp2.length; i++) {temp2[i].style.height = temp + "px";}
	} else {
		temp = $(window).height() - 89 - 80;
		temp2 = document.getElementsByClassName("main-content-scrollable");
		for(let i = 0; i < temp2.length; i++) {temp2[i].style.height = temp + "px";}
	}
	
	// Dashboard Menu
	$('.filter').click(function(){
		const value = $(this).attr('data-filter');
		$('.main-content-page').not('.'+value).hide();
		$('.main-content-page').filter('.'+value).fadeIn(500); 
		localStorage.setItem("defaultpage", value);
	});
	
	$('.filter').click(function(){
		$(this).addClass('active').siblings().removeClass('active');
	})
	
	document.querySelectorAll('[data-filter=' + defaultpage + ']')[0].click();
	
	// Setting the Charts.js
	var chartgen = [10,20,30,40,50,60,70,80,90,100];
	var chartram = [0];
	temp = 0;
	for (let i = 10; i > 1; i--) {
		temp += ramtotal / 9;
		chartram.push(parseInt(temp.toFixed(2)))
	}
	rampercentage = chartram[9];
	// CPU
	temp = cpuchartdom.getContext("2d");
	temp2 = temp.createLinearGradient(0, 0, 0, 360);
	temp2.addColorStop(0, 'rgba(255,184,31,1)');   
	temp2.addColorStop(1, 'rgba(0,26,102,0)');
	cpuchart = new Chart(cpuchartdom, { type: "line", data: { labels: chartgen, datasets: [{ data: [0,0,0,0,0,0,0,0,0,0], borderColor: "rgba(255,184,31,1)", backgroundColor: temp2 }] }, options: { responsive: true, maintainAspectRatio: true, plugins: { tooltip: { enabled: false } }, legend: {display: false}, scales: { xAxes: [{ display: false, ticks: { suggestedMin: 0, beginAtZero: true, max: 100 } }], yAxes: [{ display: false, ticks: { suggestedMin: 0, beginAtZero: true, max: 100 } }], }, elements: { point:{ radius: 0 } } } });
	// RAM
	temp = ramchartdom.getContext("2d");
	temp2 = temp.createLinearGradient(0, 0, 0, 360);
	temp2.addColorStop(0, 'rgba(44,188,99,1)');   
	temp2.addColorStop(1, 'rgba(0,26,102,0)');
	ramchart = new Chart(ramchartdom, { type: "line", data: { labels: chartram, datasets: [{ data: [0,0,0,0,0,0,0,0,0,0], borderColor: "rgba(44,188,99,1)", backgroundColor: temp2 }] }, options: { responsive: true, maintainAspectRatio: true, plugins: { tooltip: { enabled: false } }, legend: {display: false}, scales: { xAxes: [{ display: false, ticks: { suggestedMin: 0, beginAtZero: true, max: 100 } }], yAxes: [{ display: false, ticks: { suggestedMin: 0, beginAtZero: true, max: chartram[9] } }], }, elements: { point:{ radius: 0 } } } });
	// GPU
	temp = gpuchartdom.getContext("2d");
	temp2 = temp.createLinearGradient(0, 0, 0, 360);
	temp2.addColorStop(0, 'rgba(254,126,56,1)');   
	temp2.addColorStop(1, 'rgba(0,26,102,0)');
	gpuchart = new Chart(gpuchartdom, { type: "line", data: { labels: chartgen, datasets: [{ data: [0,0,0,0,0,0,0,0,0,0], borderColor: "rgba(254,126,56,1)", backgroundColor: temp2 }] }, options: { responsive: true, maintainAspectRatio: true, plugins: { tooltip: { enabled: false } }, legend: {display: false}, scales: { xAxes: [{ display: false, ticks: { suggestedMin: 0, beginAtZero: true, max: 100 } }], yAxes: [{ display: false, ticks: { suggestedMin: 0, beginAtZero: true, max: 100 } }], }, elements: { point:{ radius: 0 } } } });
	// HDD
	temp = hddchartdom.getContext("2d");
	temp2 = temp.createLinearGradient(0, 0, 0, 360);
	temp2.addColorStop(0, 'rgba(99,172,240,1)');   
	temp2.addColorStop(1, 'rgba(0,26,102,0)');
	hddchart = new Chart(hddchartdom, { type: "line", data: { labels: chartgen, datasets: [{ data: [0,0,0,0,0,0,0,0,0,0], borderColor: "rgba(99,172,240,1)", backgroundColor: temp2 }] }, options: { responsive: true, maintainAspectRatio: true, plugins: { tooltip: { enabled: false } }, legend: {display: false}, scales: { xAxes: [{ display: false, ticks: { suggestedMin: 0, beginAtZero: true, max: 100 } }], yAxes: [{ display: false, ticks: { suggestedMin: 0, beginAtZero: true, max: 100 } }], }, elements: { point:{ radius: 0 } } } });
});

// Update Data
function updateUI(data) {
	// Text
	document.getElementById("sys-uptime").textContent = (data[0].uptime / 3600).toFixed(2) + " Hours";
	if (data[0].cpusage != undefined) {cpuchartext.textContent = data[0].cpusage + "%";}
	if (data[0].freeram != undefined) {ramchartext.textContent = (100 - (data[0].freeram*100/rampercentage)).toFixed(2) + "%";}
	// Network
	if(networkserverdom !== null) {
		for (let i = 0; i < Object.entries(JSON.parse(data[0].network)).length; i++) {
			if (JSON.parse(data[0].network)[Object.keys(JSON.parse(data[0].network))[i]][0] === true) {
				networkserverdom[i].querySelector("span").classList.add("active");
			} else {
				networkserverdom[i].querySelector("span").classList.remove("active");
			}
		}
	}
	// CPU Chart
    if (data[0].cpusage != undefined) {
		cpuchart.data.datasets.forEach((dataset) => {
			dataset.data.push(data[0].cpusage);
			dataset.data.shift();
		});
		cpuchart.update();
	}
	// RAM Chart
	if (data[0].freeram != undefined) {
		ramchart.data.datasets.forEach((dataset) => {
			dataset.data.push(parseInt((ramtotal - data[0].freeram).toFixed(2)));
			dataset.data.shift();
		});
		ramchart.update();
	}
}

// Update Static
function staticUI(data) {
	// Set Network Dom
	for (var key in JSON.parse(data[0].network)) {
		networkserverpoint.innerHTML += "<div class='dashboard-network-each'><p>" + key + "</p><span>&nbsp;</span></div>";
	}
	networkserverdom = document.querySelectorAll(".dashboard-network-each");
}

// Responsive Menu
function menudropper() {	
	if(dropmenu.className === "responsive-menu") {
		dropmenu.classList.add("dropdown-show");
		bars.classList.add("dropdown-hide");
		cross.classList.add("dropdown-show");
		overlay.classList.add("dropdown-show");
	} else {
		dropmenu.classList.remove("dropdown-show");
		bars.classList.remove("dropdown-hide");
		cross.classList.remove("dropdown-show");
		overlay.classList.remove("dropdown-show");
	}
}