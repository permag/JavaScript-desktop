var PERM = PERM || {};
PERM.jsProject = PERM.jsProject || {};


PERM.jsProject.DnD = { // Object drag and drop
  
	dragElem: null, // Reference to the element which is dragged
	
	focusZindex: 0,
  
	dx: 0, dy: 0, // Difference between the mouse and the dragged element
  
	beginDrag: function (e) {
    	if (!e) e = window.event; 
		PERM.jsProject.DnD.dragElem = PERM.jsProject.DnD.selectWin(e);
		PERM.jsProject.DeskWindow.focusElem(); // Put the box on top of the others
		PERM.jsProject.DnD.dragElem.firstChild.id = "windowDragCursor"
		
		PERM.jsProject.Mouse.getPos(e); // Mouse  position when the event occurred
		var l = parseInt(PERM.jsProject.DnD.dragElem.offsetLeft); // x coordinate of the element
		var t = parseInt(PERM.jsProject.DnD.dragElem.offsetTop); // y coordinate of the element
		
		PERM.jsProject.DnD.dx = PERM.jsProject.Mouse.x - l; // Difference between the mouse and the element
		PERM.jsProject.DnD.dy = PERM.jsProject.Mouse.y - t; // Will be used to adjust the new position in function moveHandler
		
		PERM.jsProject.EventUtil.addHandler(document, "mousemove", PERM.jsProject.DnD.moveHandler);
		PERM.jsProject.EventUtil.addHandler(document, "mouseup", PERM.jsProject.DnD.upHandler);
		PERM.jsProject.EventUtil.stopEvent(e);
	}, // End beginDrag

	moveHandler: function (e) { // Called each time the mouse is moved
		if (!e) e = window.event;
		PERM.jsProject.Mouse.getPos(e); // New mouse position
		
		// stop on edges
		var desktop = document.getElementById("desktop");

		if (PERM.jsProject.Mouse.x - PERM.jsProject.DnD.dx < 0) {
			PERM.jsProject.DnD.dragElem.style.left = "0px";
		}
		else if (PERM.jsProject.Mouse.x - PERM.jsProject.DnD.dx > desktop.clientWidth - PERM.jsProject.DnD.dragElem.clientWidth - 2) {
			PERM.jsProject.DnD.dragElem.style.left = desktop.clientWidth - PERM.jsProject.DnD.dragElem.clientWidth - 2 + "px";
		}
		else {
			PERM.jsProject.DnD.dragElem.style.left = PERM.jsProject.Mouse.x - PERM.jsProject.DnD.dx + "px"; // Move the dragged element
		}
		
		if (PERM.jsProject.Mouse.y - PERM.jsProject.DnD.dy < 0) {
			PERM.jsProject.DnD.dragElem.style.top = "0px";
		} 
		else if (PERM.jsProject.Mouse.y - PERM.jsProject.DnD.dy > desktop.clientHeight - PERM.jsProject.DnD.dragElem.clientHeight - 2) {
			PERM.jsProject.DnD.dragElem.style.top = desktop.clientHeight - PERM.jsProject.DnD.dragElem.clientHeight - 2 + "px";
		} 
		else {
			PERM.jsProject.DnD.dragElem.style.top = PERM.jsProject.Mouse.y - PERM.jsProject.DnD.dy + "px";
		}
		
		PERM.jsProject.EventUtil.stopEvent(e); 
	}, // End moveHandler
   
	upHandler: function (e) {
		if (!e) e = window.event;
		PERM.jsProject.DnD.dragElem.firstChild.removeAttribute("id"); // remove #windowDragCursor
		PERM.jsProject.EventUtil.removeHandler(document,"mousemove",PERM.jsProject.DnD.moveHandler); // remove drag ...
		PERM.jsProject.EventUtil.removeHandler(document,"mouseup",PERM.jsProject.DnD.upHandler); // ... and drop handlers
		PERM.jsProject.EventUtil.stopEvent(e); 
	}, // End upHandler
    
	selectWin: function (e) {
		var elem = PERM.jsProject.EventUtil.getEventElem(e);
		while (elem.className.toUpperCase() != "WINDOWCONTAINER") { 
			elem = elem.parentNode;
		}
		return elem;
	}
}
