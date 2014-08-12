var PERM = PERM || {};
PERM.jsProject = PERM.jsProject || {};

PERM.jsProject.RssReader = function() {
	
	this.app();
};

PERM.jsProject.RssReader.prototype.app = function () {
	
	var newWin = new PERM.jsProject.DeskWindow("RSS Reader","rss.png",350,350,true,false);
	
	this.windowContainerRef = newWin.getWindowContainer();
	this.windowCloseXRef = newWin.getWindowCloseX();
	this.windowCloseMenuRef = newWin.getWindowCloseMenu();
	var windowMenuBarRef = newWin.getWindowMenuBar();
	var windowMenuBarUlRef = newWin.getWindowMenuBar().firstChild.firstChild;
	this.windowBodyRef = newWin.getWindowBody();
	this.windowStatusBarRef = newWin.getWindowStatusBar();
	this.rssSourceUrl = "http://lnu.se/1.454?l=sv_SE&format=rss";
	this.rssFeed = "Backend/rss.php?url=";
	this.rssUpdateTime = 60000;
	this.timeOut;
	var that = this;
	
	// "Inställningar" in the menu
	var preferenceLi = document.createElement("li");
	preferenceLi.className = "windowMenuBarLi";
	preferenceLi.innerHTML = '<a href="#">Inställningar</a>';
	windowMenuBarUlRef.appendChild(preferenceLi);
	// sub drop down menu
	
	PERM.jsProject.EventUtil.addHandler(preferenceLi, "click", function (e) {
		removeMenu(e);
		var preferenceLiSubUl = document.createElement("ul");
		preferenceLiSubUl.className = "windowMenuBarDrowDownUl";
		preferenceLi.appendChild(preferenceLiSubUl);
		preferenceLiSubUl.style.top = windowMenuBarRef.offsetHeight - 1 +"px";
		preferenceLiSubUl.style.left = preferenceLi.offsetLeft +"px";
		// update now
		var updateNowLi = document.createElement("li");
		updateNowLi.className = "windowMenuBarDrowDownLi";
		updateNowLi.innerHTML = '<a href="#">Uppdatera nu</a>';
		preferenceLiSubUl.appendChild(updateNowLi);
		PERM.jsProject.EventUtil.addHandler(updateNowLi, "click", function (e) {
			that.getRss();
			that.autoUpdateMessages();
			removeMenu();
			PERM.jsProject.EventUtil.stopEvent(e);
		});
		// select source
		var sourceLi = document.createElement("li");
		sourceLi.className = "windowMenuBarDrowDownLi";
		sourceLi.innerHTML = '<a href="#">Välj källa</a>';
		preferenceLiSubUl.appendChild(sourceLi);
		PERM.jsProject.EventUtil.addHandler(sourceLi, "click", function (e) {
			that.selectSource();
			removeMenu();
			PERM.jsProject.EventUtil.stopEvent(e);
		});
		// update interval
		var intervalLi = document.createElement("li");
		intervalLi.className = "windowMenuBarDrowDownLi";
		intervalLi.innerHTML = '<a href="#">Uppdateringsintervall</a>';
		preferenceLiSubUl.appendChild(intervalLi);
		PERM.jsProject.EventUtil.stopEvent(e);
		PERM.jsProject.EventUtil.addHandler(intervalLi, "click", function (e) {
			that.updateInterval();
			removeMenu();
			PERM.jsProject.EventUtil.stopEvent(e);
		});

		PERM.jsProject.EventUtil.addHandler(document.body, "click", function (e) {
			removeMenu();
		});
		
		PERM.jsProject.EventUtil.stopEvent(e);

	});
	
	function removeMenu () {
		var removeUls = windowMenuBarRef.getElementsByTagName("ul");
		for (var i = 0; i < removeUls.length; i++) {
			if (removeUls[i].className === "windowMenuBarDrowDownUl") {
				removeUls[i].parentNode.removeChild(removeUls[i]);
			}
		}
	}
	
	this.windowCloseEvents();
	this.getRss();
	this.autoUpdateMessages();
};

PERM.jsProject.RssReader.prototype.getRss = function () {
	var that = this;
	new PERM.jsProject.AjaxCon(this.rssFeed+escape(this.rssSourceUrl), function (data) {
		that.windowBodyRef.innerHTML = "";
		var rssContainer = document.createElement("div");
		rssContainer.className = "rssContainer";
		that.windowBodyRef.appendChild(rssContainer);
		rssContainer.innerHTML = data;
		
		// status bar update
		var currentTime = new Date().toLocaleTimeString();
		that.windowStatusBarRef.innerHTML = "Uppdaterad: " + currentTime;

	}, null, null, this.windowStatusBarRef);
};

PERM.jsProject.RssReader.prototype.autoUpdateMessages = function (clear) {
	if (clear === true) { 
		clearTimeout(this.timeOut);
	} else {
		var that = this;
		clearTimeout(this.timeOut);
		this.timeOut = window.setTimeout(function () {
			that.getRss();
			that.autoUpdateMessages();
		},this.rssUpdateTime);
	}
};

PERM.jsProject.RssReader.prototype.selectSource = function () {
	
	clearTimeout(this.timeOut); // stop autoUpdateMessages whilst on this page
	var that = this;
	var feeds = []; 
	feeds[0] = "http://lnu.se/1.454?l=sv_SE&format=rss";
	feeds[1] = "http://www.dn.se/ekonomi/m/rss/senaste-nytt";
	var feedsTitle = [];
	feedsTitle[0] = "LNU.se";
	feedsTitle[1] = "DN ekonomi";
	var randomNumber = Math.floor(Math.random()*999999);

	var container = document.createElement("div");
	container.className = "selectSourceContainer";
	container.style.height =  100 +"px";

	// input from array
	for (var i = 0; i < feeds.length; i++) {
		var source = document.createElement("input");
		var p = document.createElement("p");
		p.innerHTML = feedsTitle[i];
		source.type = "radio";
		source.name = "rss" + randomNumber;
		source.value = i+1;
		p.appendChild(source);
		container.appendChild(p);
	}
	// custom input
	var customSource = document.createElement("input");
	var customInput = document.createElement("input");
	var pCustom = document.createElement("p");
	pCustom.innerHTML = "Egen källa:";
	customSource.type = "radio";
	customSource.name = "rss" + randomNumber;
	pCustom.appendChild(customSource);
	container.appendChild(pCustom);
	container.appendChild(customInput);
	
	// button
	var sourceInputButton = document.createElement("button");
	sourceInputButton.innerHTML = "Välj";
	container.appendChild(sourceInputButton);
	this.windowBodyRef.appendChild(container);
	
	// add a false value to end of array = value for custom input
	feeds.push(false);
	
	// all radios in container
	var getRadios = container.getElementsByTagName("input");
	var count = 0;
	
	PERM.jsProject.EventUtil.addHandler(sourceInputButton, "click", function () {
		
		for (var i = 0; i < getRadios.length; i++) {
			
			if (getRadios[i].type == "radio") {
				
				if (getRadios[i].checked) {
					var url = feeds[count];
				}
			count++;
			}
		}
		// not false = rss from array
		if (url !== false) {
			that.rssSourceUrl = url;
		} else { // false = rss from custom input
			that.rssSourceUrl = customInput.value;
		}
		that.getRss();
		that.autoUpdateMessages();
	});
};


PERM.jsProject.RssReader.prototype.updateInterval = function () {
	
	clearTimeout(this.timeOut); // stop autoUpdateMessages whilst on this page
	var that = this;
	
	var container = document.createElement("div");
	container.className = "intervalContainer";
	var select = document.createElement("select");
	this.windowBodyRef.appendChild(select);
	var option1 = document.createElement("option");
	var option2 = document.createElement("option");
	var option3 = document.createElement("option");
	option1.innerHTML = "1 minut";
	option1.value = 1;
	option2.innerHTML = "5 minuter";
	option2.value = 5;
	option3.innerHTML = "10 minuter";
	option3.value = 10;
	select.appendChild(option1);
	select.appendChild(option2);
	select.appendChild(option3);
	container.appendChild(select);
	this.windowBodyRef.appendChild(container);

	var button = document.createElement("button");
	button.innerHTML = "Välj";
	container.appendChild(button);

	PERM.jsProject.EventUtil.addHandler(button, "click", function () {
		var index = select.selectedIndex;
		that.rssUpdateTime = select.options[index].value * 60000;
		container.parentNode.removeChild(container);
		that.getRss();
		that.autoUpdateMessages();
	});
	
};

PERM.jsProject.RssReader.prototype.windowCloseEvents = function () {
	
	var that = this;
	PERM.jsProject.EventUtil.addHandler(this.windowCloseXRef, "click", function (e) {
		that.windowContainerRef.parentNode.removeChild(that.windowContainerRef);
		that.autoUpdateMessages(true);
		PERM.jsProject.EventUtil.removeHandler(e);
		PERM.jsProject.EventUtil.stopEvent(e);
	});
	PERM.jsProject.EventUtil.addHandler(this.windowCloseMenuRef, "click", function (e) {
		that.windowContainerRef.parentNode.removeChild(that.windowContainerRef);
		that.autoUpdateMessages(true);
		PERM.jsProject.EventUtil.removeHandler(e);
		PERM.jsProject.EventUtil.stopEvent(e);
	});
};