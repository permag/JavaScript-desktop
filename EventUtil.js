var PERM = PERM || {};
PERM.jsProject = PERM.jsProject || {};

PERM.jsProject.EventUtil = {
	
	addHandler: function(element, type, handler) {
		if (element.addEventListener) {
			element.addEventListener(type, handler, false);
		} else if (element.attachEvent) {
			element.attachEvent("on" + type, handler);
		} else {
			element["on" + type] = handler;
		}
	},
	
	removeHandler: function(element, type, handler) {
		if (element.removeEventListener) {
			element.removeEventListener(type, handler, false);
		} else if (element.detachEvent) {
			element.detachEvent("on" + type, handler);
		} else {
			element["on" + type] = null;
		}
	},
	
	stopEvent: function (evt) { // Stop event bubbling and default behaviour
		if (evt.stopPropagation) { // Mozilla
		  evt.stopPropagation();
		  evt.preventDefault();
		}
		else { // Internet Explorer
		  evt.cancelBubble = true;
		  evt.returnValue = false;
		}
	},
	
	getEventElem: function (evt) { // Get a reference to the element where the event occurred
		if (evt.target) return evt.target; // Mozilla 
		else if (evt.srcElement) return evt.srcElement; // Internet Explorer
		else return null; // Old browser
	}
};

PERM.jsProject.Mouse = {

  x:0, y:0, // Mouse (cursor) coordinates
  
  getPos: function (evt) { // Get the position from event evt
    if (evt.pageX) { 
    	PERM.jsProject.Mouse.x = evt.pageX; 
    	PERM.jsProject.Mouse.y = evt.pageY; 
    	} // browser dependent
    else { 
    	PERM.jsProject.Mouse.x = evt.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      	PERM.jsProject.Mouse.y = evt.clientY + document.body.scrollTop + document.documentElement.scrollTop; }
   }
   
};