var PERM = PERM || {};
PERM.jsProject = PERM.jsProject || {};

PERM.jsProject.MessageBoard = function (id) {
	
	this.app();
	
	// key and button event listener
	this.pressedSomething();
	
	// close window
	this.windowCloseEvents();
	
} // end MessageBoard constructor	

PERM.jsProject.MessageBoard.prototype.app = function() {
	
	var newWin = new PERM.jsProject.DeskWindow("Labby Mezzage","labbymezzage.png",300,375,true,false);
	
	this.windowContainerRef = newWin.getWindowContainer();
	this.windowCloseXRef = newWin.getWindowCloseX();
	this.windowCloseMenuRef = newWin.getWindowCloseMenu();
	this.windowBodyRef = newWin.getWindowBody();
	this.windowStatusBarRef = newWin.getWindowStatusBar();
	var windowMenuBarRef = newWin.getWindowMenuBar();
	var windowMenuBarUlRef = newWin.getWindowMenuBar().firstChild.firstChild;
	///
	this.getMessageUrl = "http://homepage.lnu.se/staff/tstjo/labbyserver/getMessage.php";
	this.setMessageUrl = "http://homepage.lnu.se/staff/tstjo/labbyserver/setMessage.php";
	this.timeOut;
	
	// Local storage
	if (!localStorage.chatUserName) {
		localStorage.chatUserName = "Username";
	}
	if (!localStorage.messageUpdateTime) {
		localStorage.messageUpdateTime = 10000;
	}
	if (!localStorage.historyMessages) {
		localStorage.historyMessages = 20;
	}
	
	// window submenu
	// "Inställningar" in the menu
	var preferenceLi = document.createElement("li");
	preferenceLi.className = "windowMenuBarLi";
	preferenceLi.innerHTML = '<a href="#">Inställningar</a>';
	windowMenuBarUlRef.appendChild(preferenceLi);
	// sub drop down menu
	var that = this;
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
			that.getMessages();
			that.autoUpdateMessages();
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
		// nr of messages
		var numberOfMessagesLi = document.createElement("li");
		numberOfMessagesLi.className = "windowMenuBarDrowDownLi";
		numberOfMessagesLi.innerHTML = '<a href="#">Antal meddelanden</a>';
		preferenceLiSubUl.appendChild(numberOfMessagesLi);
		PERM.jsProject.EventUtil.stopEvent(e);
		PERM.jsProject.EventUtil.addHandler(numberOfMessagesLi, "click", function (e) {
			that.showNrOfMessages();
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
	
	////////
		
	// message container
	this.messagesContainer = document.createElement("div");
	this.messagesContainer.className = "messageContainer";
	this.windowBodyRef.appendChild(this.messagesContainer);
	
	// ajax get messages
	this.getMessages();
	
	// timeout function; auto update messages
	this.autoUpdateMessages();
	
	// create board
	var board = document.createElement("div");
	board.className = "board";
	this.windowBodyRef.appendChild(board);
	
	// create message zone
	this.messageZone = document.createElement("div");
	board.appendChild(this.messageZone);
	
	// user name input
	this.inputUserName = document.createElement("input");
	this.inputUserName.className = "inputUserName";
	board.appendChild(this.inputUserName);
	//
	this.inputUserName.value = localStorage.chatUserName;

	// create textarea
	this.textareaMessage = document.createElement("textarea");
	this.textareaMessage.className = "textareaMessage";
	board.appendChild(this.textareaMessage);
	
	// create button
	this.buttonMessage = document.createElement("button");
	this.buttonMessage.className = "buttonMessage";
	this.buttonMessage.innerHTML = "skriv";
	board.appendChild(this.buttonMessage);
};

PERM.jsProject.MessageBoard.prototype.pressedSomething = function() {
	// Button pressed
	var that = this;
	this.buttonMessage.onclick = function(e) { 
		that.sendMessage(); 
		return false; 
	}
	
	// Enter-key pressed
	this.textareaMessage.onkeypress = function(e) {
		if (!e) { e = window.event; }
		
		if (e.keyCode === 13 && !e.shiftKey) { // 13 = enter. (enter pressed without shift)
			that.sendMessage();
			return false;
		}
	}
} // end pressedSomething

PERM.jsProject.MessageBoard.prototype.getMessages = function () {
	var that = this;
	new PERM.jsProject.AjaxCon(this.getMessageUrl+"?history="+localStorage.historyMessages+"&type=xml", function (data) {
		that.messagesContainer.innerHTML = "";
		that.messagesContainer.innerHTML = data;
		
		var time = that.messagesContainer.getElementsByTagName("time");
		
		for (var i = 0; i < time.length; i++) {
			var theTime = new Date(parseInt(time[i].innerHTML));
			time[i].innerHTML = theTime.toLocaleDateString() +" " +theTime.toLocaleTimeString();
		}
		
		// scroll to bottom of window
		that.messagesContainer.parentNode.scrollTop = that.messagesContainer.parentNode.scrollHeight;

		// status bar update
		var currentTime = new Date().toLocaleTimeString();
		that.windowStatusBarRef.innerHTML = "Uppdaterad: " + currentTime;

	}, null, null, this.windowStatusBarRef);
};

PERM.jsProject.MessageBoard.prototype.sendMessage = function() {
	var that = this;
	var text = this.textareaMessage.value;
	var username = localStorage.chatUserName;
	// don't send empty messages
	if (text.replace(/^\s+|\s+$/g, "") === "") {
		return false;
	}
	if (this.inputUserName.value.replace(/^\s+|\s+$/g, "") !== "") {
		username = this.inputUserName.value;
		localStorage.chatUserName = username;
	} else {
		username = "Default user";
		this.inputUserName.value = username;
		localStorage.chatUserName = username;
	}
	
	var dataString = "text="+text+"&username="+username;

	// new ajax post message
	new PERM.jsProject.AjaxCon(this.setMessageUrl, getMessagesAfterSubmit, "post", dataString, this.windowStatusBarRef);
	function getMessagesAfterSubmit () { // wait to reload messages til message has been submited
		that.getMessages();
	}
	this.textareaMessage.value = ""; // empty textarea
	
	
} // end sendMessage

PERM.jsProject.MessageBoard.prototype.autoUpdateMessages = function (clear) {
	if (clear === true) { 
		clearTimeout(this.timeOut);
	} else {
		var that = this;
		clearTimeout(this.timeOut);
		this.timeOut = window.setTimeout(function () {
			that.getMessages();
			that.autoUpdateMessages();
		},localStorage.messageUpdateTime || 10000);
	}
}

PERM.jsProject.MessageBoard.prototype.updateInterval = function () {
	
	clearTimeout(this.timeOut); // stop autoUpdateMessages whilst on this page
	var that = this;
	
	var selected = localStorage.messageUpdateTime;
	
	var container = document.createElement("div");
	container.className = "intervalContainer";
	var select = document.createElement("select");
	var option1 = document.createElement("option");
	var option2 = document.createElement("option");
	var option3 = document.createElement("option");
	option1.innerHTML = "10 sekunder";
	option1.value = 1;
	option2.innerHTML = "20 sekunder";
	option2.value = 2;
	option3.innerHTML = "30 sekunder";
	option3.value = 3;
	
	if (selected == 1*10000) {
		option1.defaultSelected = true;
	}
	if (selected == 2*10000) {
		option2.defaultSelected = true;
	}
	if (selected == 3*10000) {
		option3.defaultSelected = true;
	}
	
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
		localStorage.messageUpdateTime = select.options[index].value * 10000;
		container.parentNode.removeChild(container);
		that.getMessages();
		that.autoUpdateMessages();
	});
};

PERM.jsProject.MessageBoard.prototype.showNrOfMessages = function () {
	
	clearTimeout(this.timeOut); // stop autoUpdateMessages whilst on this page
	var that = this;
	var history1 = 20;
	var	history2 = 50;
	var	history3 = 100;
	
	var selected = localStorage.historyMessages;
	
	var container = document.createElement("div");
	container.className = "nrOfMessagesContainer";
		var select = document.createElement("select");
	var option1 = document.createElement("option");
	var option2 = document.createElement("option");
	var option3 = document.createElement("option");
	option1.innerHTML = history1 + " meddelanden";
	option1.value = history1;
	option2.innerHTML = history2 + " meddelanden";
	option2.value = history2;
	option3.innerHTML = history3 + " meddelanden";
	option3.value = 100;
	
	if (selected == history1) {
		option1.defaultSelected = true;
	}
	else if (selected == history2) {
		option2.defaultSelected = true;
	}
	else if (selected == history3) {
		option3.defaultSelected = true;
	}
	
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
		localStorage.historyMessages = select.options[index].value;
		container.parentNode.removeChild(container);
		that.getMessages();
		that.autoUpdateMessages();
	});
};

PERM.jsProject.MessageBoard.prototype.windowCloseEvents = function () {
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