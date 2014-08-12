var PERM = PERM || {};
PERM.jsProject = PERM.jsProject || {};

PERM.jsProject.Memory = function () {
	// table size rows*cols
	this.rows = 4;
	this.cols = 4;
	this.randomPictureArray = [];
	this.checkPic1 = null;
	this.checkPic2 = null;
	this.timesTried = 0;
	this.timesSuccess = 0;
	
	this.setRandomGen = function () {
		this.randomPictureArray = PERM.jsProject.RandomGenerator.getPictureArray(this.rows, this.cols);
	};
	
	this.app(); // function for creating table
	
}; // end Memory

PERM.jsProject.Memory.prototype.app = function() {

	var newWin = new PERM.jsProject.DeskWindow("Memory","memory.png",141,145,false,true);
	this.windowBodyRef = newWin.getWindowBody();
	var windowMenuBarRef = newWin.getWindowMenuBar();
	var windowMenuBarUlRef = newWin.getWindowMenuBar().firstChild.firstChild;
	
	// window submenu
	// "Redigera" in the menu
	var EditLi = document.createElement("li");
	EditLi.className = "windowMenuBarLi";
	EditLi.innerHTML = '<a href="#">Redigera</a>';
	windowMenuBarUlRef.appendChild(EditLi);
	// sub drop down menu
	var that = this;
	PERM.jsProject.EventUtil.addHandler(EditLi, "click", function (e) {
		removeMenu(e);
		var EditLiSubUl = document.createElement("ul");
		EditLiSubUl.className = "windowMenuBarDrowDownUl";
		EditLi.appendChild(EditLiSubUl);
		EditLiSubUl.style.top = windowMenuBarRef.offsetHeight - 1 +"px";
		EditLiSubUl.style.left = EditLi.offsetLeft +"px";
		// update now
		var restartLi = document.createElement("li");
		restartLi.className = "windowMenuBarDrowDownLi";
		restartLi.innerHTML = '<a href="#">Starta om</a>';
		EditLiSubUl.appendChild(restartLi);
		PERM.jsProject.EventUtil.addHandler(restartLi, "click", function (e) {
			that.windowBodyRef.innerHTML = "";
			that.checkPic1 = null;
			that.checkPic2 = null;
			that.timesTried = 0;
			that.timesSuccess = 0;
			that.createTable();
			removeMenu();
			PERM.jsProject.EventUtil.stopEvent(e);
		});
		// Game plan
		var gamePlanLi = document.createElement("li");
		gamePlanLi.className = "windowMenuBarDrowDownLi";
		gamePlanLi.innerHTML = '<a href="#">Spelplan</a>';
		EditLiSubUl.appendChild(gamePlanLi);
		PERM.jsProject.EventUtil.addHandler(gamePlanLi, "click", function (e) {
			that.changeGamePlan();
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
	this.createTable = function () {

		this.setRandomGen(); // randomize
		
		// table
		var table = document.createElement("table");
		table.className = "memoryTableNoSelect";
		this.windowBodyRef.appendChild(table);
		
		// tbody
		var tbody = document.createElement("tbody");
		table.appendChild(tbody);
	
		var tr = null;
		var td = null;
		var a = null;
		// tr
		var count = 0;
		for (var i = 0; i < this.rows; i++) {
			tr = document.createElement("tr");
			tbody.appendChild(tr);
			// td
			for (var j = 0; j < this.cols; j++) {
				td = document.createElement("td");
				tr.appendChild(td);
				a = document.createElement("a");
				a.href = "#";
				a.innerHTML = '<img src="memory/memorypics/0.png" />';
				td.appendChild(a);
				this.getPic(a, count); // function for event handling etc
				count++;
			}
		}
	}; // end createTable
	this.createTable();
}; // end app

PERM.jsProject.Memory.prototype.getPic = function(a, count) {
	var that = this;

	a.onclick = function() {

		if (that.checkPic1 === null) {
			that.checkPic1 = a;
			a.innerHTML = '<img src="memory/memorypics/'+that.randomPictureArray[count]+'.png" />';
		} else if (that.checkPic1 !== null && that.checkPic2 === null && that.checkPic1 !== a) {
			that.checkPic2 = a;
			a.innerHTML = '<img src="memory/memorypics/'+that.randomPictureArray[count]+'.png" />';
			that.timesTried++; // add 1 to  count times tried
		} else {
			return;
		}
		
		// 2 bricks - a match
		if ((that.checkPic1 !== null && that.checkPic2 !== null) && (that.checkPic1.innerHTML === that.checkPic2.innerHTML) && (that.checkPic1 !== that.checkPic2)) {
			// add 1 to count number of pairs
			that.timesSuccess++;
			// reset
			that.checkPic1.onclick = null;
			that.checkPic2.onclick = null;
			that.checkPic1 = null;
			that.checkPic2 = null;
			
			// alert game over….
			if (that.timesSuccess === (that.rows*that.cols)/2) {
				alert("Game Over. Du vann! \n\nAntal försök: " +that.timesTried);
			}
			
		// 2 bricks - not null and not a match
		} else if ((that.checkPic1 !== null && that.checkPic2 !== null) && that.checkPic1.innerHTML !== that.checkPic2.innerHTML) {
			
			// setTimer...
			window.setTimeout(function() {
				that.checkPic1.innerHTML = '<img src="memory/memorypics/0.png" />';
				that.checkPic2.innerHTML = '<img src="memory/memorypics/0.png" />';
				that.checkPic1 = null;
				that.checkPic2 = null;
			}, 650);
		}
		return false;
	};

}; // end getPic

PERM.jsProject.Memory.prototype.changeGamePlan = function () {
	
	var that = this;
	var container = document.createElement("div");
	container.className = "changeGamePlan";
	var select = document.createElement("select");
	this.windowBodyRef.appendChild(select);
	var option1 = document.createElement("option");
	var option2 = document.createElement("option");
	var option3 = document.createElement("option");
	option1.innerHTML = "2 x 2";
	option1.value = 1;
	option2.innerHTML = "2 x 4";
	option2.value = 2;
	option3.innerHTML = "4 x 4";
	option3.value = 3;
	select.appendChild(option1);
	select.appendChild(option2);
	select.appendChild(option3);
	container.appendChild(select);
	this.windowBodyRef.appendChild(container);

	var button = document.createElement("button");
	button.innerHTML = "Välj";
	container.appendChild(button);
	

	PERM.jsProject.EventUtil.addHandler(button, "click", function () {
		that.checkPic1 = null;
		that.checkPic2 = null;
		that.timesTried = 0;
		that.timesSuccess = 0;
		var index = select.selectedIndex;
		var alternative = select.options[index].value;

		
		if (alternative == 1) {
			that.rows = 2;
			that.cols = 2;
		}
		else if (alternative == 2) {
			that.rows = 2;
			that.cols = 4;
		}
		else if (alternative == 3) {
			that.rows = 4;
			that.cols = 4;
		}
		container.parentNode.removeChild(container);
		
		that.windowBodyRef.innerHTML = "";
		that.createTable();
	});
};