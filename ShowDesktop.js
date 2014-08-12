var PERM = PERM || {};
PERM.jsProject = PERM.jsProject || {};

PERM.jsProject.ShowDesktop = function() {
	
	var showDesktopIcon = document.getElementById("showDesktop") || document.getElementById("hideDesktop");
	var desktop = document.getElementById("desktop");
	var windows = desktop.getElementsByTagName("section");
	var count = 0;
	
	if (document.getElementById("showDesktop")) {
		
		showHideDesktop("none", "hideDesktop");
		
	} else if (document.getElementById("hideDesktop")) {
		
		showHideDesktop("block", "showDesktop");
	}
	
	function showHideDesktop (display, id) {
		
		var count = 0;
		var numberOfWin = document.getElementById("numberOfWin"); 
		
		for (var i = 0; i < windows.length; i++) {
	
			if (windows[i].className.toUpperCase() == "WINDOWCONTAINER") {
				windows[i].style.display = display;
				count++;
			}
		}
		showDesktopIcon.id = id;
		
		if (display === "none" && count !== 0) {
			numberOfWin.innerHTML = count;
			numberOfWin.style.top = showDesktopIcon.clientTop -5 +"px";
			numberOfWin.style.left = showDesktopIcon.offsetLeft + 27 +"px";
			numberOfWin.style.display = "block";
			if (numberOfWin.innerHTML.length === 2) {
				numberOfWin.style.fontSize = "9px";
			} else if (numberOfWin.innerHTML.length > 2) {
				numberOfWin.style.fontSize = "9px";
				numberOfWin.innerHTML = "...";
			} else {
				numberOfWin.style.fontSize = "11px";
			}
		
		} else {
			numberOfWin.innerHTML = "";
			numberOfWin.style.display = "none";
		}
	}
};