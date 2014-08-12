var PERM = PERM || {};
PERM.jsProject = PERM.jsProject || {};

PERM.jsProject.Resize = {
	
	resizeElem: null, 
  
	dx: 0, dy: 0, // Difference between the mouse and the dragged element
  
	beginResize: function (e) { 
    	if (!e) e = window.event;

		PERM.jsProject.Resize.resizeElem = PERM.jsProject.EventUtil.getEventElem(e);
		while (PERM.jsProject.Resize.resizeElem.className.toUpperCase() != "WINDOWCONTAINER") { 
			PERM.jsProject.Resize.resizeElem = PERM.jsProject.Resize.resizeElem.parentNode;
		}
		PERM.jsProject.Mouse.getPos(e); // mouse position when the event occurred
		var w = parseInt(PERM.jsProject.Resize.resizeElem.clientWidth);
		var h = parseInt(PERM.jsProject.Resize.resizeElem.clientHeight - PERM.jsProject.DeskWindow.windowBarsHeight);
		
		PERM.jsProject.Resize.dx = PERM.jsProject.Mouse.x - w; // Difference between the mouse and the element
		PERM.jsProject.Resize.dy = PERM.jsProject.Mouse.y - h; // Will be used to adjust the new position in function moveHandler
		
		PERM.jsProject.EventUtil.addHandler(document, "mousemove", PERM.jsProject.Resize.moveHandler);
		PERM.jsProject.EventUtil.addHandler(document, "mouseup", PERM.jsProject.Resize.upHandler);
		PERM.jsProject.EventUtil.stopEvent(e);
	},
	
	moveHandler: function (e) {
		if (!e) e = window.event;
		PERM.jsProject.Mouse.getPos(e); // new mouse position

		// stop on edges
		var desktop = document.getElementById("desktop");
		var dock = document.getElementById("dock");
		var elems = PERM.jsProject.Resize.resizeElem.getElementsByTagName("div");
		var elem = null;
		for (var i = 0; i < elems.length; i++) {
			if (elems[i].className.toUpperCase() == "WINDOWBODY") {
				elem = elems[i];
			}
		}

		if (PERM.jsProject.Mouse.x - PERM.jsProject.Resize.dx > desktop.clientWidth - PERM.jsProject.Resize.resizeElem.offsetLeft - 3) {
			elem.style.width = desktop.style.right - PERM.jsProject.Resize.resizeElem.offsetLeft - 3 + "px";
		}
		else if (elem.clientWidth < 100) {
			elem.style.width = PERM.jsProject.Resize.resizeElem.offsetWidth + "px";
		}
		else {
			elem.style.width = PERM.jsProject.Mouse.x - PERM.jsProject.Resize.dx + "px"; // Move the dragged element
		}
		
		if (PERM.jsProject.Mouse.y - PERM.jsProject.Resize.dy > desktop.clientHeight - PERM.jsProject.Resize.resizeElem.offsetTop - dock.offsetHeight - 65) {
			elem.style.height = desktop.clientHeight - PERM.jsProject.Resize.resizeElem.offsetTop - dock.offsetHeight - 63 + "px";
		} 
		else {
			elem.style.height = PERM.jsProject.Mouse.y - PERM.jsProject.Resize.dy + "px";
		}
		
		PERM.jsProject.EventUtil.stopEvent(e);
	},
   
	upHandler: function (e) {
		if (!e) e = window.event;
		PERM.jsProject.EventUtil.removeHandler(document,"mousemove",PERM.jsProject.Resize.moveHandler);
		PERM.jsProject.EventUtil.removeHandler(document,"mouseup",PERM.jsProject.Resize.upHandler);
		PERM.jsProject.EventUtil.stopEvent(e);
	},
	
};
