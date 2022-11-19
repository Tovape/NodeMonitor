document.addEventListener("DOMContentLoaded", function(event) { 

	// Variables
	var data = null;
	var updatespeed = 4000;
	var theme = "default";
	var defaultpage = "dashboard";
	var temp = null; 
	var temp2 = null;
	
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
	const api_url = "./api/nodemonitor";
	  
	// Async Api Fetcher
	async function fetchData() {
		const response = await fetch(api_url);
		data = await response.json();
		console.log(data)
		return;
	};

	async function fetchWait(){
		await fetchData();
	};

	// Updates
	var intervalId = window.setInterval(function(){
		fetchWait();
		updateUI();
	}, 3000);	
	
	// Dashboard
	
	// Set Scrollable Height
	temp = $(window).height() - 89 - 80;
	temp2 = document.getElementsByClassName("main-content-scrollable");
	for(let i = 0; i < temp2.length; i++) {temp2[i].style.height = temp + "px";}
	
	$(window).resize(function() {
		temp = $(window).height() - 89 - 80;
		temp2 = document.getElementsByClassName("main-content-scrollable");
		for(let i = 0; i < temp2.length; i++) {temp2[i].style.height = temp + "px";}
	});
	
	// Dashboard Menu
	$('.filter').click(function(){
		const value = $(this).attr('data-filter');
		if (value == 'all'){
			$('.main-content-page').show();
		} else {
			$('.main-content-page').not('.'+value).hide();
			$('.main-content-page').filter('.'+value).show();
		}
		localStorage.setItem("defaultpage", value);
	});
	
	$('.filter').click(function(){
		$(this).addClass('active').siblings().removeClass('active');
	})
	
	document.querySelectorAll('[data-filter=' + defaultpage + ']')[0].click();
	
});

// Update Data
function updateUI() {
	
}