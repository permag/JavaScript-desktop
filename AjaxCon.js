  var PERM = PERM || {};
  PERM.jsProject = PERM.jsProject || {};

  PERM.jsProject.AjaxCon = function (url, callback, method, data, loaderElem) { // url, callbackfunction, method (get/post), data to send (post), elem for ajaxloader gif.
	var READY_STATE_UNINITIALIZED = 0;
	var READY_STATE_OPENED = 1;
	var READY_STATE_SENT = 2;
	var READY_STATE_LOADING = 3;
	var READY_STATE_COMPLETE = 4;
	var that = this;

	var xhr = this.getXHR();
	
	this.ajaxLoader(loaderElem, false); // false = loader is not finished

	xhr.onreadystatechange = function(){

		if(xhr.readyState === READY_STATE_COMPLETE)
		{
			if(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)
			{
				that.ajaxLoader(loaderElem, true); // true = loader is finished

				if (callback) {
					if (xhr.responseText) {
						callback(xhr.responseText);
					}
					else if (xhr.responseXML) {
						callback(xhr.responseXML);
					}
				}				
			}
			else
			{
				console.log("Läsfel, status:"+xhr.status);	
			}
		}
	};

	xhr.open(method || "get", url, true);

	//xhr.setRequestHeader('If-Modified-Since', 'Mon, 01 Sep 2007 00:00:00 GMT');
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.setRequestHeader("Connection", "close");
	
	xhr.send(data || null);
  }

  PERM.jsProject.AjaxCon.prototype.getXHR = function(){
		var xhr = null;
		try {
			xhr = new XMLHttpRequest();	
		} catch (error){
			try {
				xhr = new ActiveXObject("Microsoft.XMLHTTP");	
			} catch (error){
				throw new Error("No XHR object available");
			}
		}
		return xhr;
  };
  
PERM.jsProject.AjaxCon.prototype.ajaxLoader = function (elem, finished) {
	elem = elem || null;
	finished = finished || false;
	if (finished === true && elem !== null) {
		elem.innerHTML = "";
	}
	else if (finished === false && elem !== null) {
    	elem.innerHTML = '<img src="img/ajax-loader.gif" />';
	}
}
