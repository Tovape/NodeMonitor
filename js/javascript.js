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
	//console.log(staticdata[0].cpu[0].model)
	//console.log(staticdata[0].ram)
	
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
		temp += staticdata[0].ram / 9;
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
	if (data[0].cpusage != undefined) {cpuchartext.textContent = data[0].cpusage + "%";}
	if (data[0].freeram != undefined) {ramchartext.textContent = (100 - (data[0].freeram*100/rampercentage)).toFixed(2) + "%";}
	// Network
	for (let i = 0; i < Object.entries(JSON.parse(data[0].network)).length; i++) {
		if (JSON.parse(data[0].network)[Object.keys(JSON.parse(data[0].network))[i]][0] === true) {
			networkserverdom[i].querySelector("span").classList.add("active");
		} else {
			networkserverdom[i].querySelector("span").classList.remove("active");
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
			dataset.data.push(parseInt((staticdata[0].ram - data[0].freeram).toFixed(2)));
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