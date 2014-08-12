var PERM = PERM || {};
PERM.jsProject = PERM.jsProject || {};

PERM.jsProject.ImageViewer = function() {
	
	this.app();

}

PERM.jsProject.ImageViewer.prototype.app = function () {
	
	var newWin = new PERM.jsProject.DeskWindow("Image Viewer","imageviewer.png",320,300,true,true);

	var windowMenuBarRef = newWin.getWindowMenuBar();
	var windowBodyRef = newWin.getWindowBody();
	var windowStatusBarRef = newWin.getWindowStatusBar();
	
	new PERM.jsProject.AjaxCon("Backend/getJSONThumbs.php", function (data) {
	
		var images = JSON.parse(data);
		
		var maxThumbWidth = images[0].thumbWidth;
		var maxThumbHeight = images[0].thumbHeight;

		for (var i = 0; i < images.length; i++)
		{
			if (images[i].thumbWidth > maxThumbWidth) maxThumbWidth = images[i].thumbWidth;
			if (images[i].thumbHeight > maxThumbHeight) maxThumbHeight = images[i].thumbHeight;
		}
		for (var i = 0; i < images.length; i++) {
			var a = document.createElement("a");
			a.href = "#";
			a.className = "imageViewerA";
			a.style.width = maxThumbWidth +"px";
			a.style.height = maxThumbHeight +"px";
			var img = document.createElement("img");
			img.src = "pics/thumbs/"+images[i].fileName;
			img.className = "imageViewerImg";
			a.appendChild(img);
			imgShowBig(images[i]);
			imgMouseOverShowStatus(images[i]);
			windowBodyRef.appendChild(a);
		}
		
		function imgShowBig (imageRef) {
			PERM.jsProject.EventUtil.addHandler(a, "click", function (e) {
				
				var width = imageRef.width+1;
				var height = imageRef.height+1;
				var desk = document.getElementById("desktop");
				
				if (width > desk.clientWidth) width = desk.clientWidth-9;
				if (height+100 > desk.clientHeight) height = desk.clientHeight-122;
				
				var newWin = new PERM.jsProject.DeskWindow(imageRef.fileName,"imageviewer.png",width,height,false,true);
				
				newWin.getWindowBody().innerHTML = '<img src="pics/'+imageRef.fileName+'"" />';
				
				PERM.jsProject.EventUtil.stopEvent(e);
			});
		}
		
		function imgMouseOverShowStatus (imageRef) {
			PERM.jsProject.EventUtil.addHandler(a, "mouseover", function (e) {
				
				windowStatusBarRef.innerHTML = imageRef.fileName +" Mått: "+ imageRef.width + " x " + imageRef.height;
				
				PERM.jsProject.EventUtil.addHandler(document.body, "mouseover", function (e) {
					windowStatusBarRef.innerHTML = "";
					PERM.jsProject.EventUtil.stopEvent(e);
				});

				PERM.jsProject.EventUtil.stopEvent(e);
			});
		}
	}, null, null, windowStatusBarRef); // end Ajax call
};