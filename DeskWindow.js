var PERM = PERM || {};
PERM.jsProject = PERM.jsProject || {};

// Constructor : titleOfWinHeader, iconFileName, width, height, resizeable, closeWinUsingEventOnThisPage-(not using events on own page for clearTimeouts)

PERM.jsProject.DeskWindow = function(headerTitle,icon,width,height,resize,simpleClose) {
	
	this.headerTitle = headerTitle;
	this.icon = icon;
	this.width = width;
	this.height = height;
	this.resize = resize || false;
	this.simpleClose = simpleClose;

	
	this.createWindow();
	
	this.getWindowContainer = function () {
		return this.windowContainer;
	};
	this.getWindowBody = function () {
		return this.windowBody;
	};
	this.getWindowStatusBar = function () {
		return this.windowStatusBar;
	};
	this.getWindowMenuBar = function () {
		return this.windowMenuBar;
	};
	this.getWindowCloseX = function () {
		return this.windowClose;
	};
	this.getWindowCloseMenu = function () {
		return this.liDD1;
	};
	
	
	this.setWindowWidth = function (_width) {
		this.getWindowBody().style.width = _width +"px";
	};
	this.setWindowHeight = function (_height) {
		this.getWindowBody().style.height = _height +"px";
	};
	
};

PERM.jsProject.DeskWindow.prototype.createWindow = function () {

	var desktop = document.getElementById("desktop");
	
	this.windowContainer = document.createElement("section");
	this.windowContainer.className = "windowContainer";
	
	var windowTop = document.createElement("div");
	windowTop.className = "windowTop";
	
	var iconHeader = document.createElement("img");
	iconHeader.src = "img/"+this.icon;
	iconHeader.className = "windowIconHeader";
	iconHeader.style.width = "14px";
	iconHeader.style.height = "14px";
	windowTop.appendChild(iconHeader);
	var pHeader = document.createElement("p");
	pHeader.className = "windowHeader";
	pHeader.appendChild(document.createTextNode(this.headerTitle));
	windowTop.appendChild(pHeader);
	windowTop.appendChild(pHeader);
	this.windowContainer.appendChild(windowTop);
	
	this.windowClose = document.createElement("div");
	this.windowClose.className = "windowClose";
	this.windowClose.innerHTML = '<a href="#">x</a>';
	windowTop.appendChild(this.windowClose);
	
	this.windowMenuBar = document.createElement("div");
	this.windowMenuBar.className = "windowMenuBar";
	this.windowContainer.appendChild(this.windowMenuBar);
	
	// add menu to window
	var windowMenuBarCont = document.createElement("div");
	windowMenuBarCont.className = "windowMenuBarCont";
	this.windowMenuBar.appendChild(windowMenuBarCont);
	//
	var ul = document.createElement("ul");
	ul.className = "windowMenuBarUl";
	windowMenuBarCont.appendChild(ul);
	var li1 = document.createElement("li");
	li1.className = "windowMenuBarLi";
	ul.appendChild(li1);
	li1.innerHTML = '<a href="#">Arkiv</a>';
	
	var ulDD = document.createElement("ul");
	this.liDD1 = document.createElement("li");
	var that = this;
	PERM.jsProject.EventUtil.addHandler(li1, "click", function (e) {
		ulDD.className = "windowMenuBarDrowDownUl";
		ulDD.style.top = that.windowMenuBar.offsetHeight - 1 +"px";
		ulDD.style.left = li1.offsetLeft + "px";
		windowMenuBarCont.appendChild(ulDD);
		that.liDD1.className = "windowMenuBarDrowDownLi";
		ulDD.appendChild(that.liDD1);
		that.liDD1.innerHTML = '<a href="#">Stäng</a>';
		
		PERM.jsProject.EventUtil.addHandler(document.body, "click", function (e) {
			PERM.jsProject.EventUtil.removeHandler(e);
			PERM.jsProject.EventUtil.stopEvent(e);
			if (ulDD.parentNode !== null) {
				ulDD.parentNode.removeChild(ulDD);
			}
		});
		PERM.jsProject.EventUtil.stopEvent(e);
	});
	
	this.windowBody = document.createElement("div");
	this.windowBody.className = "windowBody";
	this.windowContainer.appendChild(this.windowBody);
	// window body size	
	this.windowBody.style.width = this.width+"px";
	this.windowBody.style.height = this.height+"px";
	
	var windowFooter = document.createElement("div");
	windowFooter.className = "windowFooter";
	this.windowContainer.appendChild(windowFooter);
	
	this.windowStatusBar = document.createElement("div");
	this.windowStatusBar.className = "windowStatusBar";
	windowFooter.appendChild(this.windowStatusBar);
	
	if (this.resize === true) {
		var windowResize = document.createElement("div");
		windowResize.className = "windowResize";
		windowFooter.appendChild(windowResize);
	}
	desktop.appendChild(this.windowContainer);
	
	// height of window bars together (not body) used in PERM.jsProject.Resize
	PERM.jsProject.DeskWindow.windowBarsHeight = this.windowMenuBar.offsetHeight + windowTop.offsetHeight + windowFooter.offsetHeight;
	
	if (that.simpleClose === true) { // close window using this code, (no clearTimeouts)
		PERM.jsProject.EventUtil.addHandler(this.windowClose, "click", function (e) {
			that.windowContainer.parentNode.removeChild(that.windowContainer);
			PERM.jsProject.EventUtil.removeHandler(e);
			PERM.jsProject.EventUtil.stopEvent(e);
		});
		PERM.jsProject.EventUtil.addHandler(that.liDD1, "click", function (e) {
			that.windowContainer.parentNode.removeChild(that.windowContainer);
			PERM.jsProject.EventUtil.stopEvent(e);
		});
	}
	// new pop up window within screen
	if (this.windowContainer.previousSibling !== null) {
		var preSibTop = this.windowContainer.previousSibling.offsetTop;
		var preSibLeft = this.windowContainer.previousSibling.offsetLeft;
		
		var newTop = preSibTop+20;
		var newLeft = preSibLeft+20;
		
		var pxToBott = desktop.clientHeight - (this.windowContainer.clientHeight + newTop);
		var pxToRight = desktop.clientWidth - (this.windowContainer.clientWidth + newLeft);
		
		if (pxToBott < 20) {
			this.windowContainer.style.top = 20+"px";
			this.windowContainer.style.left = preSibLeft+50+"px";
		} 
		else if (pxToRight < 50) {
			this.windowContainer.style.top = 20+"px";
			this.windowContainer.style.left = 50+"px";
		} else {
			this.windowContainer.style.top = newTop+"px";
			this.windowContainer.style.left = newLeft+"px";
		}
	}
	
	PERM.jsProject.DeskWindow.focusElem(this.windowContainer);
	PERM.jsProject.EventUtil.addHandler(windowTop, "mousedown", PERM.jsProject.DnD.beginDrag);
	PERM.jsProject.EventUtil.addHandler(this.windowClose, "mousedown", PERM.jsProject.EventUtil.stopEvent);
	PERM.jsProject.EventUtil.addHandler(this.windowContainer, "mousedown", function (e) {
		PERM.jsProject.DeskWindow.focusElem(PERM.jsProject.DnD.selectWin(e)); // focus to the selected elem
	});
	if (this.resize === true) {
		PERM.jsProject.EventUtil.addHandler(windowResize, "mousedown", function (e) {
			PERM.jsProject.DeskWindow.focusElem(PERM.jsProject.DnD.selectWin(e)); // focus to the selected elem
			PERM.jsProject.Resize.beginResize(e);
		});
	}
};

PERM.jsProject.DeskWindow.focusElem = function (elem) {
	var winFocusId = document.getElementById("windowFocusColor");
	if (winFocusId) {
		winFocusId.removeAttribute("id");
		winFocusId.firstChild.className = "windowTop";
	}
	var elem = elem || PERM.jsProject.DnD.dragElem;
	PERM.jsProject.DnD.focusZindex++;
	elem.style.zIndex = PERM.jsProject.DnD.focusZindex;
	elem.id = "windowFocusColor";
	elem.firstChild.className = "windowTopFocus";
};
