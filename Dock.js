var PERM = PERM || {};
PERM.jsProject = PERM.jsProject || {};

PERM.jsProject.Dock = {
	
	init: function () {
		
		// Dock
		var dock = document.getElementById("dock");
		var dockOpac = document.createElement("div");
		dockOpac.id = "dockOpac";
		dock.parentNode.insertBefore(dockOpac, dock);
		
		
		// Show desktop
		var showDeskA = document.createElement("a");
		var numberOfWin = document.createElement("span");
		numberOfWin.id = "numberOfWin";
		showDeskA.href = "#";
		showDeskA.id = "showDesktop";
		dock.appendChild(showDeskA);
		var showDeskImg = document.createElement("img");
		showDeskImg.src = "img/showdesktop.png";
		showDeskImg.style.width = "40px";
		showDeskImg.style.height = "40px";
		showDeskA.appendChild(showDeskImg);
		showDeskA.appendChild(numberOfWin);

		PERM.jsProject.EventUtil.addHandler(showDeskA, "mouseover", function (e) {
			PERM.jsProject.Dock.dockLabel(showDeskImg,"Show Desktop");
			PERM.jsProject.EventUtil.stopEvent(e);
		});
		PERM.jsProject.EventUtil.addHandler(showDeskA, "click", function (e) {
			new PERM.jsProject.ShowDesktop();
			PERM.jsProject.EventUtil.stopEvent(e);
		});
		
		// ImageViewer
		var imageViewerA = document.createElement("a");
		imageViewerA.href = "#";
		dock.appendChild(imageViewerA);
		var imageViewerImg = document.createElement("img");
		imageViewerImg.src = "img/imageviewer.png";
		imageViewerImg.style.width = "40px";
		imageViewerImg.style.height = "40px";
		imageViewerA.appendChild(imageViewerImg);

		PERM.jsProject.EventUtil.addHandler(imageViewerA, "mouseover", function (e) {
			PERM.jsProject.Dock.dockLabel(imageViewerImg,"Image Viewer");
			PERM.jsProject.EventUtil.stopEvent(e);
		});
		PERM.jsProject.EventUtil.addHandler(imageViewerA, "click", function (e) {
			new PERM.jsProject.ImageViewer();
			PERM.jsProject.EventUtil.stopEvent(e);
		});
		
		// Memory
		var memoryA = document.createElement("a");
		memoryA.href = "#";
		dock.appendChild(memoryA);
		var memoryImg = document.createElement("img");
		memoryImg.src = "img/memory.png";
		memoryImg.style.width = "40px";
		memoryImg.style.height = "40px";
		memoryA.appendChild(memoryImg);
		PERM.jsProject.EventUtil.addHandler(memoryA, "mouseover", function (e) {
			PERM.jsProject.Dock.dockLabel(memoryImg,"Memory");
			PERM.jsProject.EventUtil.stopEvent(e);
		});
		PERM.jsProject.EventUtil.addHandler(memoryA, "click", function (e) {
			new PERM.jsProject.Memory();
			PERM.jsProject.EventUtil.stopEvent(e);
		});
		
		// RSS reader
		var rssReaderA = document.createElement("a");
		rssReaderA.href = "#";
		dock.appendChild(rssReaderA);
		var rssReaderImg = document.createElement("img");
		rssReaderImg.src = "img/rss.png";
		rssReaderImg.style.width = "40px";
		rssReaderImg.style.height = "40px";
		rssReaderA.appendChild(rssReaderImg);
		PERM.jsProject.EventUtil.addHandler(rssReaderA, "mouseover", function (e) {
			PERM.jsProject.Dock.dockLabel(rssReaderImg,"RSS Reader");
			PERM.jsProject.EventUtil.stopEvent(e);
		});
		PERM.jsProject.EventUtil.addHandler(rssReaderA, "click", function (e) {
			new PERM.jsProject.RssReader();
			PERM.jsProject.EventUtil.stopEvent(e);
		});
		
		// Labby Mezzage
		var labbyMezzA = document.createElement("a");
		labbyMezzA.href = "#";
		dock.appendChild(labbyMezzA);
		var labbyMezzImg = document.createElement("img");
		labbyMezzImg.src = "img/labbymezzage.png";
		labbyMezzImg.style.width = "40px";
		labbyMezzImg.style.height = "40px";
		labbyMezzA.appendChild(labbyMezzImg);
		PERM.jsProject.EventUtil.addHandler(labbyMezzA, "mouseover", function (e) {
			PERM.jsProject.Dock.dockLabel(labbyMezzImg,"Labby Mezzage");
			PERM.jsProject.EventUtil.stopEvent(e);
		});
		PERM.jsProject.EventUtil.addHandler(labbyMezzA, "click", function (e) {
			new PERM.jsProject.MessageBoard();
			PERM.jsProject.EventUtil.stopEvent(e);
		});

	},
	
	
	dockLabel: function (elem,text) {
		
		if (!document.getElementById("dockLabelContainer")) {
			var dock = document.getElementById("dock");
			var desktopCoverForDockLabel = document.getElementById("desktopCoverForDockLabel");
			var desktop = document.getElementById("desktop");
			var labelCont = document.createElement("div");
			labelCont.id = "dockLabelContainer";
			var label = document.createElement("div");
			label.id = "dockLabel";
			label.innerHTML = text;
			labelCont.appendChild(label);
			var labelArrow = document.createElement("div");
			labelArrow.id = "dockLabelArrow";
			labelCont.appendChild(labelArrow);
			desktopCoverForDockLabel.appendChild(labelCont);
			

			labelCont.style.top = desktop.clientHeight - dock.clientHeight - labelCont.clientHeight +"px";
			labelCont.style.left = elem.offsetLeft + (elem.clientWidth / 2) - (labelCont.clientWidth / 2) +"px";
			//labelArrow.style.left = labelCont.clientWidth / 2 +"px"; // save this just in case
			
			PERM.jsProject.EventUtil.addHandler(document.body, "mouseover", function (e) {
				removeLabel();
				PERM.jsProject.EventUtil.stopEvent(e);
			});
			PERM.jsProject.EventUtil.addHandler(elem, "mouseout", function (e) {
				removeLabel();
				PERM.jsProject.EventUtil.stopEvent(e);
			});
			
			function removeLabel () {
				if (labelCont.parentNode !== null) {
					labelCont.parentNode.removeChild(labelCont);
				}
			}	
		}
	}
}

window.onload = function () {
	PERM.jsProject.Dock.init();
}
