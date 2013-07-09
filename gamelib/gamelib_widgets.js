////////////////////////////////////////////////////////////////
//                                                            //
// Widget Module. This module adds Window objects and other   //
// GUI components to Gamelib. It can be used as a stand-alone //
// module. It does not require the gamelib_core.js module to  //
// function. Last update 30/06/02 - Scott Porter.             //
//                                                            //
////////////////////////////////////////////////////////////////

var widgetManagerObject=null;
var widgetManager=null;
var Gl_widgetsInUse=true;
var Gl_oldMouseInUse=false;

function InitWidgetManager(sty,callBack){
	if(document.layers){
		alert("ERROR: Netscape 4 is not supported by the Widget modules!\n\nPlease Use Mozilla, Netscape 6 or preferrably IE5+.");
		return;
	}
	widgetManager=new WidgetManager(sty,callBack);
}

function WidgetManager(styleDir,callBack){
	Gl_widgetsInUse=true;
	this.browserIE=(navigator.userAgent.toLowerCase().indexOf('msie')!=-1);
	this.browserNS=(!this.browserIE&&(navigator.userAgent.toLowerCase().indexOf('mozilla')!=-1));
	this.windowsAndIEPlatform=(this.browserIE&&navigator.userAgent.toLowerCase().indexOf('win')!=-1);
	if(!styleDir){
		alert('You have not defined the style directory!! You must\ndefine the style directory before widgetManager can work!');
		return null;
	}
	this.type="WidgetManager";
	this.callBack=callBack;
	this.styleDir=styleDir;
	this.iconDir=styleDir+'/menu_icons/';
	this.decorationDir=styleDir+'/window_decorations/';
	this.menuBars=new Array();
	this.windows=new Array();
	this.icons=new Array();
	this.windowStartX=10;
	this.windowStartY=10;
	this.windowHighestZ=100;
	this.nextMenuZ=10000;
	this.windowMaxHeight=600;
	this.windowMaxWidth=800;
	this.windowsOnScreen=0;
	this.activeWindowIX=-1;
	this.browserWidth=0;
	this.browserHeight=0;
	this.loadStack=new Array();
	this.loadIX=-1;
	this.loading=false;
	this.loadTicks=0;
	this.maxTicks=100;
	this.loadTicker=null;
	this.loadFF=false;
	this.fResizeFunc=null;

	this.zoomerTmr=null;
	this.zoomerOn=false;
	this.zoomerDiv=0;
	this.zoomerStartW=0;
	this.zoomerStartH=0;
	this.zoomerWSteps=0;
	this.zoomerHSteps=0;
	this.zoomerStartX=0;
	this.zoomerStartY=0;
	this.zoomerXSteps=0;
	this.zoomerYSteps=0;

	this.outlineOb=null;
	widgetManagerObject=this;

	if(this.browserIE){	// hack, as IE5 originally came with a bug that prevented
					// IFrames being created with all of their attributes intact!
		document.body.insertAdjacentHTML("BeforeEnd",'<iframe name="WMLF" id="WMLF" src="" style="position:absolute;left:-100;top:-100;width:10;height:10;visibility:visible"></iframe>\n');
		this.bEl=document.getElementById('WMLF');
	}else{
		this.bEl=document.createElement("IFRAME");
		this.bEl.setAttribute("id",'WMLF');
		this.bEl.setAttribute("name",'WMLF');
		this.bEl.setAttribute("src",'');
		this.bEl.id='WMLF';
		this.bEl.name='WMLF';
		this.bEl.src='';
		this.bEl.style.width=600;
		this.bEl.style.height=400;
		this.bEl.style.position="absolute";
		this.bEl.style.left=-10000;
		this.bEl.style.top=0;
		this.bEl.style.overflow="hidden";
		document.getElementsByTagName('BODY')[0].appendChild(this.bEl);
	}

	this.bEl.src=this.styleDir+'/setup.html';
	return this;
}

WidgetManager.prototype.createWindow=WM_CreateWindow;
WidgetManager.prototype.addEvent=WM_AddEvent;
WidgetManager.prototype.readSetup=WM_ReadSetup;
WidgetManager.prototype.makeImage=WM_MakeImage;
WidgetManager.prototype.getBrowserHeight=WM_GetBrowserHeight;
WidgetManager.prototype.getBrowserWidth=WM_GetBrowserWidth;
WidgetManager.prototype.loadDWindow=WM_LoadDWindow;
WidgetManager.prototype.loadKick=WM_LoadKick;
WidgetManager.prototype.checkLoadDone=WM_CheckLoadDone;
WidgetManager.prototype.zoomerStart=WM_ZoomerStart;
WidgetManager.prototype.zoomerLoop=WM_ZoomerLoop;
WidgetManager.prototype.zoomerFinish=WM_ZoomerFinish;
WidgetManager.prototype.destroyWindow=WM_DestroyWindow;
WidgetManager.prototype.eventWindowResize=WM_EventWindowResize;
WidgetManager.prototype.doWindowSearch=WM_DoWindowSearch;
WidgetManager.prototype.doWindowPrint=WM_DoWindowPrint;
WidgetManager.prototype.searchWindow=WM_SearchWindow;
WidgetManager.prototype.showSearchBox=WM_ShowSearchBox;
WidgetManager.prototype.hideSearchBox=WM_HideSearchBox;
WidgetManager.prototype.forwardResizeEvents=WM_ForwardResizeEvents;

function WM_ForwardResizeEvents(x){
	this.fResizeFunc=x;
}

function WM_GetBrowserHeight(){if(this.browserIE) return this.browserHeight=document.body.offsetHeight;else return this.browserHeight=window.innerHeight}
function WM_GetBrowserWidth(){if(this.browserIE) return this.browserWidth=document.body.offsetWidth;else return this.browserWidth=window.innerWidth}

function WM_DoWindowPrint(){
	if(this.windows[this.activeWindowIX]){
		var wHTML=this.windows[this.activeWindowIX].contentContainer.innerHTML;
		if(this.windowsAndIEPlatform){
			this.bFrame.document.body.innerHTML=wHTML;
			this.bFrame.document.body.focus();
			window.print();
		}else{
			var newWin=window.open("","printwin","toolbar=no,status=no,titlebar=no,fullscreen=no,menubar,location=no,scrollbars,width=500,height=400");
			newWin.document.open();
			newWin.document.write(wHTML);
			newWin.document.close();
		}
	}
}

function WM_EventWindowResize(){
	var n,wm=widgetManager;
	wm.getBrowserWidth();
	wm.getBrowserHeight();
	for(n=0;n<wm.windows.length;n++){
		if(wm.windows[n])
			wm.windows[n].moveTo(wm.windows[n].x,wm.windows[n].y);
	}
	if(wm.fResizeFunc)
		eval(wm.fResizeFunc);
}

function WM_DestroyWindow(x){
	var wch=(x!=null?x:this.activeWindowIX);
	if(wch==-1){
		alert('BUG!: WidgetManager doesn\'t have an active window to destroy! Please report this event to author.');
		return;
	}
	var w=this.windows[wch],width=w.width,height=w.height,ecs=w.x+Math.floor(w.width/2),y=w.y+Math.floor(w.height/2);
	if(this.loading&&this.loadStack[this.loadIX]==wch){
		if(this.loadTicker){
			clearTimeout(this.loadTicker);
			this.loadTicker=null;
		}
		this.loadKick();
	}
	w.isDead=true;
	w.x=w.x+Math.floor(width/2)
	w.y=w.y+Math.floor(height/2)
	w.width=50;
	w.height=50;
	widgetManager.zoomerStart(wch,ecs,y,width,height);
	if(wch==this.activeWindowIX)
		this.activeWindowIX=-1;
	this.hideSearchBox();
}

function WM_LoadDWindow(ix){
	this.loadStack[this.loadStack.length]=ix;
	if(!this.loading)
		this.loadKick();
}

function WM_LoadKick(){
	var w;
	this.loading=false;
	this.loadIX++;
	if(this.loadIX==this.loadStack.length){
		this.loadStack=new Array();
		this.loadIX=-1;
		this.loading=false;
		return;
	}
	w=this.windows[this.loadStack[this.loadIX]];
	this.loadTicks=0;
	this.loading=true;
	if(w.hasStatusBar){
		w.statusTxtBackup=w.statusTxt;
		w.setStatus('Loading');
	}
	this.bFrame.document.body.innerHTML='\n';
	this.bEl.src=w.URL;
	this.bEl.onload=function(){widgetManager.loadFF=true;};
	this.loadFF=false;
	this.loadTicker=setTimeout('widgetManager.checkLoadDone()',100);
}

function WM_CheckLoadDone(){
	var wIX=this.loadStack[this.loadIX];
	var w=this.windows[wIX];
 	var iHTML='';
	this.loadTicker=null;
	if(
		(this.browserIE&&this.bFrame.document.readyState.toLowerCase()=='complete'&&this.bFrame.document.body.innerHTML.length>20)||
		(!this.browserIE&&this.loadFF)
	){
		iHTML=this.bFrame.document.body.innerHTML;
	}else{
		if(this.loadTicks++<this.maxTicks){
			var n,t='';
			for(n=0;n<this.loadTicks;n++) t+='.';
			w.setStatus('Loading'+t);
			this.loadTicker=setTimeout('widgetManager.checkLoadDone()',100);
		}else{
			if(w&&w.hasStatusBar)
				w.setStatus(w.statusTxtBackup);
			this.loadKick();
		}
		return;
	}
	var lS='onclick="widgetManager.windows['+wIX+'].load(\'';
	var lS2='\');return false"';

	if(iHTML.indexOf('<!-- EXTERNAL_LINKS -->')==-1){
		var re,reResult;
		re=/<a href="+([^#'])([^"]*)"+/i;
		reResult=re.test(iHTML);
	 	re=/<a href="+([^#'])([^"]*)"+/i;
		while(reResult){
			reResult=re.exec(iHTML);
			if(reResult){
				iHTML=iHTML.replace(re,'<a href="#" '+lS+reResult[1]+reResult[2]+lS2);
			}
		}
	}
	var ix=0,ixN=0,rep=' target="WMLF" onsubmit="setTimeout(\'widgetManager.destroyWindow('+wIX+')\',200)"';
	while(iHTML.toLowerCase().indexOf('<form',ix)!=-1){
		ixN=iHTML.toLowerCase().indexOf('<form',ix);
		iHTML=iHTML.substring(0,ixN+5)+rep+iHTML.substring(ixN+5,iHTML.length);
		ix=ixN+rep.length;
	}

	if(w.hasStatusBar)
		w.setStatus(w.statusTxtBackup);
	w.changeContent(iHTML);
	w.scrollX=0;
	w.scrollY=0;
	w.positionElements();
	this.loadKick();
}

function WM_ReadSetup(){
	this.windowHasOutlines=			WINDOWS_HAVE_OUTLINES;
	this.windowOpacity=(navigator.userAgent.toLowerCase().indexOf('msie')==-1?100:WINDOW_OPACITY_LEVEL);
	this.windowDragOpaque=			WINDOW_DRAG_OPAQUE;
	this.windowResizeOpaque=		WINDOW_RESIZE_OPAQUE;
	this.windowOutlineColour=		WINDOW_OUTLINE_COLOUR;

	this.windowSearchMatchColour=		WINDOW_SEARCH_MATCH_COLOUR;
	this.searchBoxWidth=			WINDOW_SEARCH_BOX_WIDTH;
	this.searchBoxHeight=			WINDOW_SEARCH_BOX_HEIGHT;
	this.searchBoxFieldX=			WINDOW_SEARCH_BOX_FIELD_X;
	this.searchBoxFieldY=			WINDOW_SEARCH_BOX_FIELD_Y;
	this.searchBoxFieldWidth=		WINDOW_SEARCH_BOX_FIELD_WIDTH;
	this.searchBoxFieldHeight=		WINDOW_SEARCH_BOX_FIELD_HEIGHT;
	this.searchBoxButtonX=			WINDOW_SEARCH_BOX_BUTTON_X;
	this.searchBoxButtonY=			WINDOW_SEARCH_BOX_BUTTON_Y;
	this.searchBoxFieldColour=		WINDOW_SEARCH_BOX_FIELD_TEXT_COLOUR;
	this.searchBoxFieldBgColour=		WINDOW_SEARCH_BOX_FIELD_BACKGROUND_COLOUR;
	this.searchBoxFieldBorderColour=	WINDOW_SEARCH_BOX_FIELD_BORDER_COLOUR;

	this.windowMinWidth=			WINDOW_MINIMUM_WIDTH;
	this.windowMinHeight=			WINDOW_MINIMUM_HEIGHT;
	this.windowZoomerSteps=			WINDOW_ZOOMER_STEPS;
	this.windowTitleBarHasDestroyButton= 	TITLEBAR_BUTTON_DESTROY_VISIBLE;
	this.windowTitleBarHasMaximizeButton=	TITLEBAR_BUTTON_MAXIMIZE_VISIBLE;
	this.windowTitleBarHasMinimizeButton=	TITLEBAR_BUTTON_MINIMIZE_VISIBLE;
	this.windowTitleBarHasHelpButton=    	TITLEBAR_BUTTON_HELP_VISIBLE;
	this.windowTitleBarHasOptionButton=  	TITLEBAR_BUTTON_OPTION_VISIBLE;
	this.windowTitleBarButtonOrder=      	TITLEBAR_BUTTON_ORDER;

	this.windowTitleBarHasBgImage=	 	TITLEBAR_USE_BACKGROUND_IMAGE;
	this.windowTitleBarBgLoColour=	 	TITLEBAR_INACTIVE_BACKGROUND_COLOUR;
	this.windowTitleBarBgHiColour=	 	TITLEBAR_ACTIVE_BACKGROUND_COLOUR;
	this.windowTitleBarFgLoColour=	 	TITLEBAR_INACTIVE_TEXT_COLOUR;
	this.windowTitleBarFgHiColour=	 	TITLEBAR_ACTIVE_TEXT_COLOUR;
	this.windowTitleBarFontSize=		TITLEBAR_FONT_SIZE;
	this.windowTitleBarHeight=		TITLEBAR_HEIGHT;
	this.windowTitleBarFontFamily=	 	TITLEBAR_FONT_FAMILY;
	this.windowTitleBarStretchToEdge=	TITLEBAR_STRETCH_TO_EDGE;
	this.windowTitleBarStretches=		TITLEBAR_STRETCHES;

	this.windowTitleBarLeftImageWidth=	TITLEBAR_LEFT_IMAGE_WIDTH;
	this.windowTitleBarRightImageWidth=	TITLEBAR_RIGHT_IMAGE_WIDTH;
	this.windowTitleBarMaximizeButtonWidth=	TITLEBAR_MAXIMIZE_BUTTON_WIDTH;
	this.windowTitleBarMinimizeButtonWidth=	TITLEBAR_MINIMIZE_BUTTON_WIDTH;
	this.windowTitleBarDestroyButtonWidth=	TITLEBAR_DESTROY_BUTTON_WIDTH;
	this.windowTitleBarOptionButtonWidth=	TITLEBAR_OPTION_BUTTON_WIDTH;
	this.windowTitleBarHelpButtonWidth=	TITLEBAR_HELP_BUTTON_WIDTH;
	this.windowScrollBarWidth=		SCROLLBAR_WIDTH;

	this.windowStatusBarHasBgImage=	 	STATUSBAR_USE_BACKGROUND_IMAGE;
	this.windowStatusBarFontSize=		STATUSBAR_FONT_SIZE;
	this.windowStatusBarFontFamily=	 	STATUSBAR_FONT_FAMILY;
	this.windowStatusBarStretchToEdge=	STATUSBAR_STRETCH_TO_EDGE;
	this.windowStatusBarHheight=		STATUSBAR_HEIGHT;

	this.windowCanvasHasBgColour=		WINDOW_CANVAS_HAS_BACKGROUND_COLOUR;
	this.windowCanvasBgLoColour=		WINDOW_CANVAS_INACTIVE_BACKGROUND_COLOUR;
	this.windowCanvasBgHiColour=		WINDOW_CANVAS_ACTIVE_BACKGROUND_COLOUR;

	this.menuBarOpacity=			MENUBAR_OPACITY_LEVEL;
	this.menuBarBgColour=			MENUBAR_MAIN_BACKGROUND_COLOUR;
	this.menuBarButtonLoColour=		MENUBAR_BUTTON_LO_COLOUR;
	this.menuBarButtonHiColour=		MENUBAR_BUTTON_HI_COLOUR;
	this.menuBarButtonBrdColour=		MENUBAR_BUTTON_BORDER_COLOUR;
	this.menuBarHasBgImage=			MENUBAR_USE_BACKGROUND_IMAGE;
	this.menuBarFgHiColour=			MENUBAR_ACTIVE_TEXT_COLOUR;
	this.menuBarFgLoColour=			MENUBAR_INACTIVE_TEXT_COLOUR;
	this.menuBarFontSize=			MENUBAR_FONT_SIZE;
	this.menuBarFontFamily=			MENUBAR_FONT_FAMILY;
	this.menuBarInset=			MENUBAR_OVERLAP;
	this.menuDelayBeforeClose=		MENUBAR_DELAY_BEFORE_CLOSE;

	this.menuItemMaximumWidth=		MENUITEM_MAXIMUM_WIDTH;
	this.menuItemIconWidth=			MENUITEM_ICON_WIDTH;
	this.menuItemIconHeight=		MENUITEM_ICON_HEIGHT;
	this.menuItemIconDefaultName=		MENUITEM_ICON_DEFAULT_NAME;

	this.bFrame=window.frames['WMLF'];

	this.searchEl=document.createElement('div');
	this.searchEl.style.position="absolute";
	this.searchEl.style.left=-1000;
	this.searchEl.style.top=500;
	this.searchEl.style.zIndex=1000000;
	this.searchEl.style.width=this.searchBoxWidth;
	this.searchEl.style.height=this.searchBoxHeight;
	this.searchEl.style.backgroundImage='URL('+this.decorationDir+'searchbox_background.gif)';
	this.searchEl.innerHTML=''+
		'<form onsubmit="widgetManager.doWindowSearch(this.searchTextField.value);return false">'+
		'<input id="searchBoxTextFieldEL" style="position:absolute;top:'+this.searchBoxFieldY+';left:'+this.searchBoxFieldX+';width:'+this.searchBoxFieldWidth+';height:'+this.searchBoxFieldHeight+';font-family:Arial,Helvetica,sans-serif;font-size:'+(this.searchBoxFieldHeight-6)+';border: 1ps solid '+this.searchBoxFieldBorderColour+';color:'+this.searchBoxFieldColour+';background-color:'+this.searchBoxFieldBgColour+'" type="text" name="searchTextField" /><br />'+
		'<input  style="position:absolute;top:'+this.searchBoxButtonY+';left:'+this.searchBoxButtonX+';" type="image" src="'+this.decorationDir+'search_button.gif" />'+
		'</form>\n';
	var b=document.getElementsByTagName('BODY')[0];
	b.appendChild(this.searchEl);

	InitWMouse();			// initialise the custom WidgetManager mouse handler. This will forward events on to
						// the normal gamelib mouse handler if necessary and if it exists.
	this.outlineOb=new OutlineOb();
	this.bEl.src='';
	document.getElementsByTagName('body')[0].onresize=this.eventWindowResize;
	eval(this.callBack);
}

function WM_DoWindowSearch(x){
	this.hideSearchBox();
	if(this.windows[this.activeWindowIX])
		this.windows[this.activeWindowIX].search(x);
}

function WM_SearchWindow(){
	this.searchingWindow=this.activeWindowIX;
	this.showSearchBox();
}

function WM_ShowSearchBox(){
	var w=this.windows[this.activeWindowIX];
	this.searchEl.style.left=w.x+((w.width-this.searchBoxWidth)/2);
	this.searchEl.style.top=w.y+((w.height-this.searchBoxHeight)/2);
	this.searchEl.style.visibility="visible";
	document.getElementById('searchBoxTextFieldEL').focus();
}

function WM_HideSearchBox(){
	this.searchEl.style.left=-1000;
	this.searchEl.style.visibility="hidden";
}

function WM_AddEvent(ob,eType,f,cap){
	if(ob.addEventListener)
		ob.addEventListener(eType,f,cap);
	else if(ob.attachEvent)
		ob.attachEvent("on"+eType,f);
	else if(navigator.userAgent.toLowerCase().indexOf('mac')!=-1||navigator.userAgent.toLowerCase().indexOf('apple')!=-1)
		eval('ob.on'+eType+'='+f);
	else
		alert("WidgetManager: Handler could not be added");
}

function WM_ZoomerStart(n,sX,sY,sW,sH){
	if(this.zoomerOn)
		this.zoomerFinish();
	if(sW<2) sW=2;
	if(sH<2) sH=2;
	this.zoomerOn=true;
	this.zoomerIX=n;
	var w=widgetManager.windows[this.zoomerIX];
	this.zoomerStartW=sW;
	this.zoomerStartH=sH;
	this.zoomerStartX=sX;
	this.zoomerStartY=sY;
	this.zoomerDiv=0;
	this.zoomerWSteps=(w.width-sW)/widgetManager.windowZoomerSteps;
	this.zoomerHSteps=(w.height-sH)/widgetManager.windowZoomerSteps;
	this.zoomerXSteps=((w.x+(w.width/2))-sX)/widgetManager.windowZoomerSteps;
	this.zoomerYSteps=((w.y+(w.height/2))-sY)/widgetManager.windowZoomerSteps;

	w.el.style.left=-3000;
	w.titleBarContainer.style.left=-3000;
	for(n=0;n<w.item.length;n++)
		w.item[n].parentMoved();

	this.outlineOb.titleBarWidth=(w.titleBarWidth>0?w.titleBarWidth:80);
	this.outlineOb.titleBarHeight=w.titleBarHeight;

	this.outlineOb.shaded=false;
	this.outlineOb.show();
	this.zoomerTmr=setTimeout('widgetManager.zoomerLoop()',50);
}

function WM_ZoomerLoop(){
	clearTimeout(this.zoomerTmr);
	this.zoomerTmr=null;
	var w=widgetManager.windows[this.zoomerIX];

	if(++this.zoomerDiv>widgetManager.windowZoomerSteps){
		this.zoomerFinish();
		return;
	}

	var nw=this.zoomerStartW+(this.zoomerWSteps*this.zoomerDiv);
	var nh=this.zoomerStartH+(this.zoomerHSteps*this.zoomerDiv);
	var nx=Math.floor(this.zoomerStartX+(this.zoomerXSteps*this.zoomerDiv)-(nw/2));
	var ny=Math.floor(this.zoomerStartY+(this.zoomerYSteps*this.zoomerDiv)-(nh/2));

	this.outlineOb.moveTo(nx,ny);
	this.outlineOb.ZresizeTo(nw,nh);

	this.zoomerTmr=setTimeout('widgetManager.zoomerLoop()',30);
}

function WM_ZoomerFinish(){
	if(this.zoomerTmr){
		clearTimeout(this.zoomerTmr);
		this.zoomerTmr=null;
	}
	this.zoomerOn=false;
	if(widgetManager.windows[this.zoomerIX].isDead){
		widgetManager.windows[this.zoomerIX].destroy();
		widgetManager.windows[this.zoomerIX]=null;
		widgetManager.windowsOnScreen--;
	}else{
		var w=widgetManager.windows[this.zoomerIX];
		w.positionElements();
		if(w.toLoad){
			w.load(w.URL);
			w.toLoad=false;
		}
	}
	if(!WMs_m.dragging&&!WMs_m.resizing)
		this.outlineOb.hide();
}

function WM_CreateWindow(width,height,title,x,y,URL,zX,zY){
	var nX,nY,w,n;
	this.hideSearchBox();
	if(this.browserWidth==0){
		this.getBrowserWidth();
		this.getBrowserHeight();
	}
	for(n=0;n<this.windows.length;n++){
		if(!this.windows[n])
			break;
	}
	w=new Gl_Window(n,width,height,title);
	this.windows[n]=w;
	if(x){
		nX=x;
		nY=y;
	}else{
		this.windowStartX+=20;
		this.windowStartY+=20;
		if(this.windowStartY>200)
			this.windowStartY=20;
		if(this.windowStartX>400){
			this.windowStartY=20;
			this.windowStartX=20;
		}
		nX=this.windowStartX;
		nY=this.windowStartY;
	}
	w.x=nX;
	w.y=nY;
	if(URL&&URL!=''){
		w.URL=URL;
		w.toLoad=true;
	}
	widgetManager.zoomerStart(n,(zX||w.x+(w.width/2)),(zY||w.y+(w.height/2)),0,0);
	this.windowsOnScreen++;
	return w;
}

function WM_MakeImage(src,x,y){
	var img=document.createElement('img');
	img.src=src;
	if(x){
		img.style.width=x;
		img.width=x;
	}
	if(y){
		img.style.height=y;
		img.height=y;
	}
	return img;
}

function OutlineOb(){
	var n,b=document.getElementsByTagName('BODY');
	this.x=0;
	this.y=0;
	this.visible=false;
	this.width=0;
	this.height=0;
	this.titleBarStretches=false;
	this.titleBarWidth=0;
	this.titleBarHeight=0;
	this.shaded=false;
	this.el=new Array();
	for(n=0;n<2;n++){
		this.el[n]=document.createElement('div');
		this.el[n].style.border="1px solid "+widgetManager.windowOutlineColour;
		this.el[n].style.position="absolute";
		this.el[n].style.width=this.width;
		this.el[n].style.height=this.height;
		this.el[n].style.left=-100;
		this.el[n].style.zIndex=1000000;
		this.el[n].style.top=0;
		b[0].appendChild(this.el[n]);
	}
}

OutlineOb.prototype.resizeTo=OL_ResizeTo;
OutlineOb.prototype.ZresizeTo=OL_ZResizeTo;
OutlineOb.prototype.moveTo=  OL_MoveTo;
OutlineOb.prototype.hide=    OL_Hide;
OutlineOb.prototype.show=    OL_Show;

function OL_ResizeTo(w,h){
	if(w>widgetManager.browserWidth) w=widgetManager.browserWidth;
	else if(w<widgetManager.windowMinWidth) w=widgetManager.windowMinWidth;
	if(h>widgetManager.browserHeight) h=widgetManager.browserHeight;
	else if(h<widgetManager.windowMinHeight) h=widgetManager.windowMinHeight;
	this.width=w;
	this.height=h;
	if(this.titleBarStretches)
		this.el[0].style.width=w;
	this.el[1].style.width=w;
	this.el[1].style.height=h-this.titleBarHeight;
}

function OL_ZResizeTo(w,h){
	this.width=w;
	this.height=h;
	if(this.titleBarStretches||w<this.titleBarWidth)
		this.el[0].style.width=w;
	else
		this.el[0].style.width=this.titleBarWidth;
	this.el[1].style.width=w;
	this.el[1].style.height=h-this.titleBarHeight;
}

function OL_MoveTo(x,y){
	if(!this.visible) return;
	if(y<0) y=0;
	else if(widgetManager.browserHeight-y<this.titleBarHeight) y=Math.floor(widgetManager.browserHeight-this.titleBarHeight);
	if(x<-(this.width/2)) x=-(this.width/2);
	else if(x+(this.width/2)>widgetManager.browserWidth) x=Math.floor(widgetManager.browserWidth-(this.width/2));
	this.x=x;
	this.y=y;
	this.el[0].style.left=x;
	this.el[0].style.top=y;
	if(!this.shaded){
		this.el[1].style.left=x;
		this.el[1].style.top=y+this.titleBarHeight;
	}
}

function OL_Show(){
	this.visible=true;
	if(this.shaded) this.el[1].style.left=-10000;
	this.el[0].style.width=this.titleBarWidth;
	this.el[0].style.height=this.titleBarHeight+(widgetManager.browserNS?-1:1);
}

function OL_Hide(){
	var n;
	for(n=0;n<2;n++){
		this.el[n].style.top=0;
		this.el[n].style.left=-3000;
	}
	this.visible=false;
}





//////////////////////////////////
// Gl_Window block starts here >>>
//////////////////////////////////

function Gl_Window(i,w,h,title){
	var b=document.getElementsByTagName('BODY');
	this.x=0;
	this.y=0;
	this.z=0;
	this.width=w;
	this.height=h;
	this.scrollX=0;
	this.scrollY=0;
	this.index=i;
	this.type="Window";
	this.title=title;
	this.titleBarHeight=widgetManager.windowTitleBarHeight;
	this.titleBarWidth=0;
	this.titleBarStretches=widgetManager.windowTitleBarStretches;
	this.titleBarWidthReduce=0;
	this.menuBarHeight=0;
	this.statusBarHeight=0;
	this.canvasHeight=0;
	this.statusBarContainer=null;
	this.statusOb=null;
	this.statusTxt='Done.';
	this.statusTxtBackup='';
	this.shaded=false;
	this.maximized=false;
	this.minimized=false;
	this.bgColour=null;
	this.mX=0;
	this.mY=0;
	this.mW=0;
	this.mH=0;
	this.scrollRelAmt=1;
	this.scrollRelAmtN=1;
	this.scrollPos=0;
	this.scrollBarWidth=0;
	this.scrollBarGfxWidth=widgetManager.windowScrollBarWidth;
	this.scrollChannelEndsHeight=0;
	this.scrollPadEndsHeight=0;
	this.hasMenuBar=false;
	this.menuBar=null;
	this.hasStatusBar=false;
	this.item=new Array();
	this.open=true;
	this.searchMatches=0;
	this.URL='';
	this.toLoad=false;
	this.isDead=false;
	this.buttons=new Array();
	this.el=document.createElement('div');
	this.el.style.width=w;
	this.el.style.height=h;
	this.el.style.position="absolute";
	this.el.style.overflow="hidden";
	this.el.style.left=-w;
	var buttons=new Array();
	buttons[0]=new Array();
	buttons[1]=new Array();

	var buttonWidths=new Array();
	buttonWidths[0]=new Array();
	buttonWidths[1]=new Array();

	var bp=0,wR1,n,c,bO=widgetManager.windowTitleBarButtonOrder;
	var buttonRef=new Array('destroy','maximize','minimize','option','help');
	var buttonWidthRef=new Array(widgetManager.windowTitleBarDestroyButtonWidth,widgetManager.windowTitleBarMaximizeButtonWidth,widgetManager.windowTitleBarMinimizeButtonWidth,widgetManager.windowTitleBarOptionButtonWidth,widgetManager.windowTitleBarHelpButtonWidth);
	var valid="X+-O?.";
	for(n=0;n<bO.length;n++){
		c=bO.charAt(n);
		if(valid.indexOf(c)==-1){
			alert('ERROR! Unknown button "'+c+'" in titlebar button position definition! Ignored...');
			continue;
		}
		if(bO.charAt(n)=='.'){
			wR1=this.titleBarWidthReduce;
			bp=1;
			continue;
		}
		buttons[bp][buttons[bp].length]=buttonRef[valid.indexOf(c)];
		buttonWidths[bp][buttonWidths[bp].length]=buttonWidthRef[valid.indexOf(c)];
		this.titleBarWidthReduce+=buttonWidthRef[valid.indexOf(c)];
	}
	if(widgetManager.windowHasOutlines)
		this.el.style.border="1px outset";
	if(widgetManager.windowOpacity<100){
		if(widgetManager.browserIE)
			this.el.style.filter="alpha(opacity="+widgetManager.windowOpacity+")";
		else if(widgetManager.browserNS)
			this.el.style.MozOpacity=widgetManager.windowOpacity+"%";
	}
	this.titleBarContainer=document.createElement('div');
	this.titleBarContainer.style.position="absolute";
	this.titleBarContainer.style.left=-1000;
	this.titleBarContainer.style.top=10;
	this.titleBarContainer.style.cursor="default";
	this.titleBarContainer.style.height=widgetManager.windowTitleBarHeight;

	var aTD;
	this.titleBarContainer.appendChild(widgetManager.makeImage(widgetManager.decorationDir+'titlebar_left.gif',widgetManager.windowTitleBarLeftImageWidth,widgetManager.windowTitleBarHeight));

	this.titleBarWidthReduce+=widgetManager.windowTitleBarLeftImageWidth;


	for(n=0;n<buttons[0].length;n++){
		aTD=widgetManager.makeImage(widgetManager.decorationDir+buttons[0][n]+'_button.gif',buttonWidths[0][n],widgetManager.windowTitleBarHeight)
		this.titleBarContainer.appendChild(aTD);
		eval('f=function (){WM_CONTROL_BUTTON_'+buttons[0][n]+'('+this.index+')}');
		widgetManager.addEvent(aTD,'mousedown',f,true);
		widgetManager.addEvent(aTD,'mouseover',function(){WMs_m.onButton=true},true);
		widgetManager.addEvent(aTD,'mouseout',function(){WMs_m.onButton=false},true);
		this.buttons[this.buttons.length]=aTD;
	}

	this.titleBar=document.createElement('div');
	this.titleBar.style.position="absolute";
	this.titleBar.style.top=0;
	this.titleBar.style.left=wR1+widgetManager.windowTitleBarLeftImageWidth;
	this.titleBar.style.fontFamily=widgetManager.windowTitleBarFontFamily;
	this.titleBar.style.fontSize=widgetManager.windowTitleBarFontSize;
	this.titleBar.style.height=widgetManager.windowTitleBarHeight;
	this.titleBar.style.paddingTop=Math.floor((widgetManager.windowTitleBarHeight-widgetManager.windowTitleBarFontSize)/2);
	this.titleBar.style.paddingLeft=8;
	this.titleBar.style.paddingRight=8;
	if(widgetManager.windowTitleBarHasBgImage)
		this.titleBar.style.backgroundImage='URL('+widgetManager.decorationDir+'titlebar_background.gif)'
	this.titleBarContainer.appendChild(this.titleBar);

	this.titleOb=document.createTextNode(this.title);
	this.titleBar.appendChild(this.titleOb);

	this.titleBarRContainer=document.createElement('span');

	for(n=0;n<buttons[1].length;n++){
		aTD=widgetManager.makeImage(widgetManager.decorationDir+buttons[1][n]+'_button.gif',buttonWidths[1][n],widgetManager.windowTitleBarHeight)
		this.titleBarRContainer.appendChild(aTD);
		eval('f=function (){WM_CONTROL_BUTTON_'+buttons[1][n]+'('+this.index+')}');
		widgetManager.addEvent(aTD,'mousedown',f,true);
		widgetManager.addEvent(aTD,'mouseover',function(){WMs_m.onButton=true},true);
		widgetManager.addEvent(aTD,'mouseout',function(){WMs_m.onButton=false},true);
		this.buttons[this.buttons.length]=aTD;
	}

	this.titleBarContainer.appendChild(this.titleBarRContainer);
	this.titleBarRContainer.style.position="absolute";
	this.titleBarRContainer.style.top=0;
	this.titleBarRContainer.style.right=0;

	this.titleBarRContainer.appendChild(widgetManager.makeImage(widgetManager.decorationDir+'titlebar_right.gif',widgetManager.windowTitleBarRightImageWidth,widgetManager.windowTitleBarHeight));
	this.titleBarWidthReduce+=widgetManager.windowTitleBarRightImageWidth;

	if(this.titleBarStretches){
		this.titleBarContainer.style.width=w;
		this.titleBar.style.width=w-this.titleBarWidthReduce;
	}else{
		this.titleBarContainer.style.width=w;
	}
	var f;
	eval('f=function (){WMs_OnTitleBar('+this.index+')}');

	widgetManager.addEvent(this.titleBarContainer,'mouseover',f,true);
	widgetManager.addEvent(this.titleBarContainer,'mouseout',WMs_OffOb,true);
	widgetManager.addEvent(this.titleBar,'mouseover',f,true);
	widgetManager.addEvent(this.titleBar,'mouseout',WMs_OffOb,true);

	this.contentContainer=document.createElement('div');
	this.contentContainer.style.position="absolute";
	this.contentContainer.style.width=this.width;
	this.contentContainer.style.height=0;
	this.contentContainer.style.top=0;
	this.contentContainer.style.left=0;
	this.contentContainer.style.marginLeft=2;
	this.contentContainer.style.marginRight=2;
	this.contentContainer.style.backgroundColor=widgetManager.windowCanvasBgLoColour;
	this.el.appendChild(this.contentContainer);
	this.contentContainer2=document.createElement('div');
	this.contentContainer2.style.position="absolute";
	this.contentContainer2.style.width=this.width;
	this.contentContainer2.style.top=0;
	this.contentContainer2.style.left=-10000;
	this.contentContainer2.style.marginLeft=2;
	this.contentContainer2.style.marginRight=2;
	b[0].appendChild(this.contentContainer2);
	b[0].appendChild(this.el);
	b[0].appendChild(this.titleBarContainer);

	this.scrollBarContainer=document.createElement('div');
	this.scrollBarContainer.style.position="absolute";
	this.scrollBarContainer.style.left=this.width;
	this.scrollBarContainer.style.top=0;
	this.scrollBarContainerTop=widgetManager.makeImage(widgetManager.decorationDir+'scrollchannel_top.gif');
	this.scrollBarContainer.appendChild(this.scrollBarContainerTop);
	this.scrollBarContainer.appendChild(document.createElement('br'));
	this.scrollBarContainerMiddle=widgetManager.makeImage(widgetManager.decorationDir+'scrollchannel_middle.gif');
	this.scrollBarContainer.appendChild(this.scrollBarContainerMiddle);
	this.scrollBarContainer.appendChild(document.createElement('br'));
	this.scrollBarContainerBottom=widgetManager.makeImage(widgetManager.decorationDir+'scrollchannel_bottom.gif');
	this.scrollBarContainer.appendChild(this.scrollBarContainerBottom);
	this.el.appendChild(this.scrollBarContainer);

	this.scrollBarPad=document.createElement('div');
	this.scrollBarPad.style.position="absolute";
	this.scrollBarPad.style.left=0;
	this.scrollBarPad.style.top=0;
	this.scrollBarPadTop=widgetManager.makeImage(widgetManager.decorationDir+'scrollbar_top.gif');
	this.scrollBarPadTop.style.width=12;
	this.scrollBarPad.appendChild(this.scrollBarPadTop);
	this.scrollBarPad.appendChild(document.createElement('br'));
	this.scrollBarPadMiddle=widgetManager.makeImage(widgetManager.decorationDir+'scrollbar_middle.gif');
	this.scrollBarPadMiddle.style.width=12;
	this.scrollBarPad.appendChild(this.scrollBarPadMiddle);
	this.scrollBarPad.appendChild(document.createElement('br'));
	this.scrollBarPadBottom=widgetManager.makeImage(widgetManager.decorationDir+'scrollbar_bottom.gif');
	this.scrollBarPadBottom.style.width=12;
	this.scrollBarPad.appendChild(this.scrollBarPadBottom);

	eval('f=function (){WMs_OnScrollPad('+this.index+')}');
	widgetManager.addEvent(this.scrollBarPad,'mouseover',f,true);
	widgetManager.addEvent(this.scrollBarPad,'mouseout',WMs_OffOb,true);

	this.scrollBarContainer.appendChild(this.scrollBarPad);
	this.scrollBarContainer.style.visibility="hidden";
}

function WM_CONTROL_BUTTON_destroy(index){
	setTimeout('widgetManager.destroyWindow('+index+');WMs_m.onButton=false;WMs_m.over=null',1);
}

function WM_CONTROL_BUTTON_maximize(index){
	var w=widgetManager.windows[index];
	if(w.shaded)
		w.unShade();
	if(w.maximized)
		w.unMaximize();
	else
		w.maximize();
}

function WM_CONTROL_BUTTON_minimize(index){
	var w=widgetManager.windows[index];
	if(w.shaded)
		w.unShade();
	else
		w.shade();
}

function WM_CONTROL_BUTTON_help(index){
	alert('Window #'+index+' has had help button pressed!!!');
}

function WM_CONTROL_BUTTON_option(index){
	alert('Window #'+index+' has had option button pressed!!!');
}

Gl_Window.prototype.moveTo=DW_MoveTo;
Gl_Window.prototype.moveNoClipTo=DW_MoveNoClipTo;
Gl_Window.prototype.dragMoveTo=DW_DragMoveTo;
Gl_Window.prototype.resizeTo=DW_ResizeTo;
Gl_Window.prototype.dragResizeTo=DW_DragResizeTo;
Gl_Window.prototype.moveToTop=DW_MoveToTop;
Gl_Window.prototype.setBGColour=DW_SetBGColour;
Gl_Window.prototype.setTitle=DW_SetTitle;
Gl_Window.prototype.addMenuBar=DW_AddMenuBar;
Gl_Window.prototype.addStatusBar=DW_AddStatusBar;
Gl_Window.prototype.setActive=DW_SetActive;
Gl_Window.prototype.childDead=DW_ChildDead;
Gl_Window.prototype.scroll=DW_Scroll;
Gl_Window.prototype.positionElements=DW_PositionElements;
Gl_Window.prototype.setStatus=DW_SetStatus;
Gl_Window.prototype.switchToOutlines=DW_SwitchToOutlines;
Gl_Window.prototype.switchToOpaque=DW_SwitchToOpaque;
Gl_Window.prototype.shade=DW_Shade;
Gl_Window.prototype.unShade=DW_UnShade;
Gl_Window.prototype.maximize=DW_Maximize;
Gl_Window.prototype.unMaximize=DW_UnMaximize;
Gl_Window.prototype.changeContent=DW_ChangeContent;
Gl_Window.prototype.addVScrollBar=DW_AddVScrollBar;
Gl_Window.prototype.removeVScrollBar=DW_RemoveVScrollBar;
Gl_Window.prototype.load=DW_Load;
Gl_Window.prototype.destroy=DW_Destroy;
Gl_Window.prototype.search=DW_Search;

function DW_Search(s){
	var n,p,d,g;
	this.contentContainer.innerHTML=this.contentContainer2.innerHTML;
	this.searchMatches=0;
	s=s.toLowerCase();
	if(s=='') return;
	var d=this.contentContainer;
	p=d.getElementsByTagName("*");
	for(n=0;n<p.length;n++){
		if(p[n].id.toString().indexOf('SEARCHELEMENTCONTAINER')==-1)
			processElement(s,p[n],this);
	}
	if(this.hasStatusBar)
		this.setStatus('Found '+this.searchMatches+' matches.');
}

function processElement(s,e,win){
	for(var g=0;g<e.childNodes.length;g++){
		if(e.childNodes[g].nodeType==3)
			processTextNode(s,e.childNodes[g],g,win);
	}
}

function processTextNode(s,c,eIX,win){
	var t=c.nodeValue,sp,t1,t2,ix=t.toLowerCase().indexOf(s);
	if(ix==-1) return;
	var p=c.parentNode;
	sp=document.createElement('span');
	while(ix>-1){
		t1=t.substring(0,ix);
		t2=t.substring(ix,ix+s.length);
		t=t.substring(ix+s.length,t.length);

		var tN=document.createTextNode(t1);
		sp.appendChild(tN);

		var e=document.createElement('span');
		tN=document.createTextNode(t2);
		e.appendChild(tN);
		e.style.backgroundColor=widgetManager.windowSearchMatchColour;
		e.id="SEARCHELEMENTCONTAINER"+(win.searchMatches++)
		sp.appendChild(e);

		ix=t.toLowerCase().indexOf(s);
	}
	if(t!=''){
		var tN=document.createTextNode(t);
		sp.appendChild(tN);
	}
	p.replaceChild(sp,p.childNodes[eIX]);
}

function DW_Destroy(){
	var b=document.getElementsByTagName('BODY'),n;
	for(n=0;n<this.item.length;n++)
		this.item[n].destroy();
	this.item=null;
	this.contentContainer2.parentNode.removeChild(this.contentContainer2);
	this.titleBarContainer.parentNode.removeChild(this.titleBarContainer);	
	this.el.parentNode.removeChild(this.el);
}

function DW_Load(URL){
	this.URL=URL;
	widgetManager.loadDWindow(this.index)
}

function DW_AddVScrollBar(){
	if(this.shaded) return;
	this.scrollBarWidth=this.scrollBarGfxWidth;
	this.scrollBarContainerMiddle.style.height=this.canvasHeight-this.scrollChannelEndsHeight;
	this.scrollBarContainerMiddle.style.width=this.scrollBarGfxWidth;
	this.scrollBarContainer.style.left=this.width-this.scrollBarWidth;
	this.scrollBarContainer.style.visibility="visible";
	this.contentContainer.style.width=this.width-this.scrollBarWidth;
	this.contentContainer2.style.width=this.width-this.scrollBarWidth;
	this.scrollBarPad.style.top=0;
}

function DW_RemoveVScrollBar(){
	this.scrollBarWidth=0;
	this.scrollBarContainer.style.left=this.width;
	this.scrollBarContainer.style.visibility="hidden";
	this.contentContainer.style.width=this.width;
	this.contentContainer2.style.width=this.width;
}

function DW_ChangeContent(data){
	this.scrollPos=0;
	this.scrollX=0;
	this.scrollY=0;
	this.contentContainer.innerHTML=data+'\n';
	this.contentContainer2.innerHTML=data+'\n';
	if(this.index!=widgetManager.zoomerIX)
		this.positionElements();
}

function DW_Maximize(){
	if(this.maximized) return;
	this.mX=this.x;
	this.mY=this.y;
	this.mW=this.width;
	this.mH=this.height;
	if(this.shaded) this.unShade();
	widgetManager.getBrowserWidth();
	widgetManager.getBrowserHeight();
	this.moveTo(0,0);
	this.resizeTo(widgetManager.browserWidth,widgetManager.browserHeight);
	widgetManager.zoomerStart(this.index,Math.floor(this.mX+(this.mW/2)),Math.floor(this.mY+(this.mH/2)),this.mW,this.mH)
	this.maximized=true;
}

function DW_UnMaximize(){
	if(!this.maximized) return;
	var oldW=this.width,oldH=this.height,oldX=this.x,oldY=this.y;
	this.moveTo(this.mX,this.mY);
	this.resizeTo(this.mW,this.mH);
	widgetManager.zoomerStart(this.index,Math.floor(oldX+(oldW/2)),Math.floor(oldY+(oldH/2)),oldW,oldH)
	this.maximized=false;	
}

function DW_Shade(){
	var n;
	if(this.maximized) return;
	this.el.style.visibility="hidden";
	if(this.hasMenuBar)
		this.menuBar.el.style.visibility="hidden";
	this.removeVScrollBar();
	this.shaded=true;
}

function DW_UnShade(){
	if(this.maximized) return;
	this.el.style.visibility="visible";
	if(this.hasMenuBar)
		this.menuBar.el.style.visibility="visible";
	this.shaded=false;
	this.scroll(this.scrollX,this.scrollY);
}

function DW_SwitchToOutlines(){
	var w=widgetManager.outlineOb;
	w.titleBarStretches=this.titleBarStretches
	w.titleBarHeight=this.titleBarHeight;
	w.titleBarWidth=this.titleBarWidth;
	w.shaded=this.shaded;
	w.show();
	w.resizeTo(this.width,this.height);
	w.moveTo(this.x,this.y);
	this.moveNoClipTo(-(this.width+10),0);
}

function DW_SwitchToOpaque(){
	var w=widgetManager.outlineOb;
	this.resizeTo(w.width,w.height);
	this.moveTo(w.x,w.y);
	w.hide();
}

function DW_AddStatusBar(t){
	var txt=(t?t:'Done.');
	var tbTab=document.createElement('table');
	tbTab.border=0;
	tbTab.cellPadding=0;
	tbTab.cellSpacing=0;
	this.statusBarContainer=document.createElement('div');
	this.statusBarContainer.style.position="absolute";
	this.statusBarContainer.style.width="100%";
	this.statusBarContainer.style.left=0;
	this.statusBarContainer.style.top=50;
	var tbBod=document.createElement('tbody');
	var tbTR=document.createElement('tr');

	var tbTD=document.createElement('td');
	tbTD.appendChild(widgetManager.makeImage(widgetManager.decorationDir+'statusbar_left.gif'));
	tbTR.appendChild(tbTD);

	tbTD=document.createElement('td');
	tbTD.style.fontFamily=widgetManager.windowStatusBarFontFamily;
	tbTD.style.fontSize=widgetManager.windowStatusBarFontSize;
	if(widgetManager.windowStatusBarHasBgImage){
		tbTD.style.backgroundImage='URL('+widgetManager.decorationDir+'statusbar_background.gif)'
	}
	this.statusOb=document.createTextNode(txt);
	tbTD.appendChild(this.statusOb);
	tbTD.style.width="99%";
	tbTR.appendChild(tbTD);

	var tbTD=document.createElement('td');
	tbTD.appendChild(widgetManager.makeImage(widgetManager.decorationDir+'statusbar_right.gif'));
	tbTR.appendChild(tbTD);
	var f;
	eval('f=function (){WMs_OnResizePad('+this.index+')}');
	widgetManager.addEvent(tbTD,'mouseover',f,true);
	widgetManager.addEvent(tbTD,'mouseout',WMs_OffOb,true);

	tbBod.appendChild(tbTR);
	tbTab.appendChild(tbBod);
	this.statusBarContainer.appendChild(tbTab);
	this.el.appendChild(this.statusBarContainer);
	this.hasStatusBar=true;
}

function DW_SetStatus(txt){
	if(!this.hasStatusBar)
		return;
	this.statusOb.nodeValue=txt;
	this.statusTxt=txt;
}

function DW_PositionElements(){
	var n;
	if(this.titleBarStretches){
		this.titleBarContainer.style.width=this.width;
		this.titleBar.style.width=this.width-this.titleBarWidthReduce;
	}else{
		this.titleBarContainer.style.width=this.titleBar.offsetWidth+this.titleBarWidthReduce;
	}
	this.scrollChannelEndsHeight=this.scrollBarContainerTop.offsetHeight+this.scrollBarContainerBottom.offsetHeight;
	this.scrollPadEndsHeight=this.scrollBarPadTop.offsetHeight+this.scrollBarPadBottom.offsetHeight;
	this.titleBarWidth=parseInt(this.titleBarContainer.offsetWidth);
	this.menuBarHeight=0;
	this.statusBarHeight=widgetManager.windowStatusBarHheight;
	if(this.hasMenuBar)
		this.menuBarHeight=this.menuBar.el.offsetHeight;
	if(this.hasStatusBar){
		this.statusBarContainer.style.top=this.height-(this.statusBarHeight+this.titleBarHeight);
	}
	this.canvasHeight=this.height-(this.statusBarHeight+this.menuBarHeight+this.titleBarHeight)
	this.canvasWidth=this.width-this.scrollBarWidth;
	this.canvasTop=this.menuBarHeight;
	this.scrollBarContainer.style.top=this.menuBarHeight;
	this.el.style.height=this.height-this.titleBarHeight;
	this.moveTo(this.x,this.y);
	for(n=0;n<this.item.length;n++)
		this.item[n].parentMoved();
	this.scroll(this.scrollX,this.scrollY);
	this.setActive();
}

function DW_Scroll(x,y){
	var sph,relamt;
	if(x<0) x=0;
	if(y<0) y=0;
	var cc=this.contentContainer;
	var cc2=this.contentContainer2;
	cc.style.width=(this.width-this.scrollBarWidth);
	cc2.style.width=(this.width-this.scrollBarWidth);
	var cW=cc.offsetWidth;
	var cH=cc2.offsetHeight;
	cc.style.height=cH;
	this.canvasHeight=this.height-(this.statusBarHeight+this.menuBarHeight+this.titleBarHeight)

	if((cH>this.canvasHeight)&&(this.scrollBarWidth==0)){
		this.addVScrollBar();
	}else if((cH<=this.canvasHeight)&&(this.scrollBarWidth>0)){
		this.removeVScrollBar();
	}
	if(this.scrollBarWidth>0){
		sph=(this.canvasHeight-this.scrollPadEndsHeight)-(cH-this.canvasHeight);
		if(sph<0) sph=0;
		this.scrollBarPadMiddle.style.height=sph;
		this.scrollRelAmt=(this.canvasHeight-(sph+this.scrollPadEndsHeight))/(cH-this.canvasHeight);
		this.scrollRelAmtN=(1/this.scrollRelAmt);
	}
	this.canvasWidth=this.width-this.scrollBarWidth;

	if(cW<this.canvasWidth){cc.style.width=this.canvasWidth;x=0}
	if(cH<this.canvasHeight){cc.style.height=this.canvasHeight;y=0}
	if(cW-x<this.canvasWidth) x=cW-this.canvasWidth;
	if(cH-y<this.canvasHeight) y=cH-this.canvasHeight;
	if(y<0) y=0;
	if(x<0) x=0;
	this.scrollX=x;
	this.scrollY=y;
	if(this.scrollBarWidth>0){
		this.scrollPos=this.scrollRelAmt*this.scrollY;
		this.scrollBarPad.style.top=this.scrollPos;
	}
	cc.style.left=-x;
	cc.style.top=this.canvasTop-y;
}

function DW_ChildDead(ob){
	var n,l=this.item.length;
	for(n=0;n<this.item.length;n++){
		if(this.item[n]==ob) break;
	}
	if(n<this.item.length){
		for(;n<this.item.length-1;n++)
			this.item[n]=this.item[n+1];
		this.item[n]=null;
		this.item.length=l-1;
	}
}

function DW_AddMenuBar(m){
	this.menuBar=this.item[this.item.length]=m;
	m.parent=this;
	m.moveTo(0,0);
	m.xOffset=0;
	m.yOffset=0;
	this.el.appendChild(m.el);
	m.init();
	m.setWidth(this.width);
	this.hasMenuBar=true;
}

function DW_SetTitle(x){
	this.title=x;
	this.titleOb.data=x
	this.titleOb.nodeValue=x
	this.positionElements();
}

function DW_SetBGColour(x){
	this.bgColour=x;
	this.el.style.backgroundColor=x;
	this.contentContainer.style.backgroundColor=this.bgColour;
}

function DW_MoveTo(x,y){
	var n;
	if(y<0) y=0;
	else if(widgetManager.browserHeight-y<this.titleBarHeight) y=Math.floor(widgetManager.browserHeight-this.titleBarHeight);
	if(x<-(this.width/2)) x=-(this.width/2);
	else if(x+(this.width/2)>widgetManager.browserWidth) x=Math.floor(widgetManager.browserWidth-(this.width/2));
	this.x=x;
	this.y=y;
	this.el.style.left=x;
	this.el.style.top=y+this.titleBarHeight;
	this.titleBarContainer.style.left=x;
	this.titleBarContainer.style.top=y;
	for(n=0;n<this.item.length;n++)
		this.item[n].parentMoved();
}

function DW_MoveNoClipTo(x,y){
	var n;
	this.x=x;
	this.y=y;
	this.el.style.left=x;
	this.el.style.top=y+this.titleBarContainer.offsetHeight;
	this.titleBarContainer.style.left=x;
	this.titleBarContainer.style.top=y;
	for(n=0;n<this.item.length;n++)
		this.item[n].parentMoved();
}

function DW_DragMoveTo(x,y){
	if(widgetManager.windowDragOpaque)
		this.moveTo(x,y);
	else
		widgetManager.outlineOb.moveTo(x,y);
}

function DW_DragResizeTo(x,y){
	if(widgetManager.windowResizeOpaque)
		this.resizeTo(x,y);
	else
		widgetManager.outlineOb.resizeTo(x,y);
}

function DW_ResizeTo(w,h){
	if(w>widgetManager.browserWidth) w=widgetManager.browserWidth;
	else if(w<widgetManager.windowMinWidth) w=widgetManager.windowMinWidth;
	if(h>widgetManager.browserHeight) h=widgetManager.browserHeight;
	else if(h<widgetManager.windowMinHeight) h=widgetManager.windowMinHeight;
	this.width=w;
	this.height=h;
	if(this.titleBarStretches)
		this.titleBarContainer.style.width=this.width;
	this.el.style.width=this.width;
	this.positionElements();
	this.scrollBarPadMiddle.style.width=this.scrollBarGfxWidth;
	this.scrollBarContainer.style.left=this.width-this.scrollBarWidth;
	this.scrollBarContainerMiddle.style.width=this.scrollBarGfxWidth;
	this.scrollBarContainerMiddle.style.height=this.canvasHeight-this.scrollChannelEndsHeight;
	for(n=0;n<this.item.length;n++)
		this.item[n].parentResized();
}

function DW_MoveToTop(){
	var n;
	widgetManager.windowHighestZ+=100;
	this.z=widgetManager.windowHighestZ;
	this.el.style.zIndex=this.z;
	this.titleBarContainer.style.zIndex=this.z-1;
	for(n=0;n<this.item.length;n++)
		this.item[n].setZ(this.z+1);
	if(this.hasStatusBar)
		this.statusBarContainer.style.zIndex=this.z+1;
	this.scrollBarContainer.style.zIndex=this.z+1;
}

function DW_SetActive(){
	var n,g;
	for(n=0;n<widgetManager.windows.length;n++){
		if(widgetManager.windows[n]){
			for(g=0;g<widgetManager.windows[n].item.length;g++){
				if(widgetManager.windows[n].item[g].type=="MenuBar")
					widgetManager.windows[n].item[g].hideAll();
			}
			if(widgetManager.windows[n]!=this){
				if(widgetManager.windowTitleBarStretchToEdge)
					widgetManager.windows[n].titleBar.style.backgroundColor=widgetManager.windowTitleBarBgLoColour;
				widgetManager.windows[n].titleBar.style.color=widgetManager.windowTitleBarFgLoColour;
				if(!widgetManager.windows[n].bgColour)
					widgetManager.windows[n].contentContainer.style.backgroundColor=widgetManager.windowCanvasBgLoColour
			}
		}
	}
	this.moveToTop();
	if(widgetManager.windowTitleBarStretchToEdge)
		this.titleBod.style.backgroundColor=widgetManager.windowTitleBarBgHiColour;
	this.titleBar.style.color=widgetManager.windowTitleBarFgHiColour;
	if(!this.bgColour)
		this.contentContainer.style.backgroundColor=widgetManager.windowCanvasBgHiColour;
	for(n=0;n<this.item.length;n++)
		this.item[n].parentSetActive();
	widgetManager.activeWindowIX=this.index;
	widgetManager.hideSearchBox();
}







////////////////////////////////
// menuBar block starts here >>>
////////////////////////////////

function Gl_MenuBar(width){
	var n;
	this.x=0;
	this.y=0;
	this.xOffset=0;
	this.yOffset=0;
	this.type="MenuBar";
	this.fontSize=widgetManager.menuBarFontSize;
	this.fontFamily=widgetManager.menuBarFontFamily;

	this.inSet=widgetManager.menuBarInset;
	this.width=width||null;
	this.item=new Array();
	this.menuOpen=-1;
	this.fixed=false;
	this.isSetUp=false;
	this.hasButtonBorder=(widgetManager.menuBarButtonBrdColour!=''?true:false);
	this.tmr=null;
	this.parent=null;
	this.el=document.createElement('div');
	this.el.style.position="absolute";
	this.el.style.paddingTop="3px";
	this.el.style.paddingBottom="3px";
	this.el.style.paddingLeft="2px";
	this.el.style.paddingRight="2px";
	this.el.style.backgroundColor=widgetManager.menuBarButtonBrdColour;
	this.el.style.border="1px outset";
	this.el.style.overflow="visible";
	this.el.style.textAlign="left";
	if(widgetManager.menuBarHasBgImage)
		this.el.style.backgroundImage='URL('+widgetManager.decorationDir+'menubar_background.gif)';
	this.el.style.zIndex=widgetManager.nextMenuZ++;
	if(this.width) this.el.style.width=width;
	for(n=0;n<widgetManager.menuBars.length;n++)
		if(!widgetManager.menuBars[n]) break;
	this.index=n;
	widgetManager.menuBars[n]=this;
	this.name='widgetManager.menuBars['+n+']';
	return this;
}

Gl_MenuBar.prototype.addMenu=MB_AddMenu;	// adds a menu object to the bar
Gl_MenuBar.prototype.moveTo=MB_MoveTo;		// moves bar to x,y
Gl_MenuBar.prototype.init=MB_Init;		// initialises menubar. must do this before using bar!
Gl_MenuBar.prototype.show=MB_Show;		// displays bar
Gl_MenuBar.prototype.hide=MB_Hide;		// hides bar
Gl_MenuBar.prototype.hideAll=MB_HideAll;	// closes any open menus
Gl_MenuBar.prototype.setWidth=MB_SetWidth;	// sets width of bar
Gl_MenuBar.prototype.destroy=MB_Destroy;	// destroys bar, recursively destroys all menus and menu items under bar
Gl_MenuBar.prototype.setUp=MB_SetUp;		// private method. Do not call.
Gl_MenuBar.prototype.parentResized=MB_ParentResized;	// parent has resized!
Gl_MenuBar.prototype.parentMoved=MB_ParentMoved;		// parent has moved!
Gl_MenuBar.prototype.parentSetActive=MB_ParentSetActive;	// parent has been made active (usually only happens to windows)
Gl_MenuBar.prototype.setZ=MB_SetZ;				// parent has changed zIndex
Gl_MenuBar.prototype.addToDesktop=MB_AddToDesktop;	// attach this to the desktop

function MB_AddToDesktop(x,y){
	var b=document.getElementsByTagName('body')[0];
	b.appendChild(this.el);
	this.init();
	this.moveTo((x||0),(y||0));
	this.setZ(20000);
}

function MB_ParentMoved(){
	this.el.style.width=this.parent.width;
//	this.setUp()
}

function MB_ParentResized(){

}

function MB_ParentSetActive(){
	this.isSetUp=false;
}

function MB_Destroy(){
	var n;
	if(this.tmr){
		clearTimeout(this.tmr);
		this.tmr=null;
	}
	for(n=0;n<this.item.length;n++){
		this.item[n].destroy();
		this.item[n]=null;
	}
	this.el.parentNode.removeChild(this.el);
	if(this.parent)
		this.parent.childDead(this);
	widgetManager.menuBars[this.index]=null;
}

function MB_SetWidth(x){
	if(x==this.width) return;
	this.el.style.width=x;
	this.width=x;
	this.setUp();
}

function MB_HideAll(){
	if(this.tmr){
		clearTimeout(this.tmr);
		this.tmr=null;
	}
	for(var n=0;n<this.item.length;n++)
		this.item[n].hide();
	this.menuOpen=-1;
}

function MB_Init(){
	if(!this.fixed){
		var n=0,t=this.el.getElementsByTagName('span');
		for(;n<t.length;n++)
			this.item[n].setProperties(this,this.name+'.item['+n+']');
		this.fixed=true;
		setTimeout(this.name+'.show()',30);
	}else
		this.show();
}

function MB_Show(h){
	var viz=(h?'hidden':'visible');
	this.el.style.visibility=viz;
	this.moveTo(this.x,this.y)
	for(n=0;n<this.item.length;n++)
		this.item[n].el.visibility=viz;
}

function MB_Hide(){this.show(true)}

function MB_AddMenu(m){
	var f;
	this.item[this.item.length]=m;
	var s=document.createElement('span');
	if(this.hasButtonBorder){
		s.style.padding="2px 10px 2px 10px";
		s.style.border="1px solid "+widgetManager.menuBarButtonBrdColour;
	}else{
		s.style.padding="2px 11px 2px 11px";
		s.style.border="1px";
	}
	s.style.cursor="default";
	s.style.fontFamily=widgetManager.menuBarFontFamily;
	s.style.fontSize=widgetManager.menuBarFontSize+"px";
	s.style.color=widgetManager.menuBarFgLoColour;
	s.style.backgroundColor=widgetManager.menuBarBgColour;
	s.style.marginLeft=2;
	var t=document.createTextNode(m.text);
	s.appendChild(t);

	eval('f=function (){MB_mover('+this.name+','+(this.item.length-1)+')}');
	widgetManager.addEvent(s,'mouseover',f,true);
	eval('f=function (){MB_mout('+this.name+','+(this.item.length-1)+')}');
 	widgetManager.addEvent(s,'mouseout',f,true);
	eval('f=function (){MB_mdown('+this.name+','+(this.item.length-1)+')}');
	widgetManager.addEvent(s,'mousedown',f,true);
	widgetManager.addEvent(s,'dblclick',f,true);
	widgetManager.addEvent(s,'selectstart',function(){return false},true);

	this.el.appendChild(s);
	m.pad=s;	
	var b=document.getElementsByTagName('BODY');
	b[0].appendChild(m.el);

	m.el.style.backgroundColor=widgetManager.menuBarBgColour;

	m.el.style.top=widgetManager.menuBarFontSize+4;
	m.el.style.left=0;
	m.parent=this;
}
function MB_mover(bar,ix){
	if(WMs_m.dragging) return;
	var sp=bar.item[ix];
	sp.pad.style.backgroundColor=widgetManager.menuBarButtonHiColour;
	sp.pad.style.color=widgetManager.menuBarFgHiColour;

	if(!bar.hasButtonBorder){
		sp.pad.style.paddingLeft="10px";
		sp.pad.style.paddingRight="10px";
	}

	sp.pad.style.border="1px outset";
	if(bar.menuOpen>-1){
		bar.hideAll();
		sp.show();
		sp.pad.style.border="1px inset";
		bar.menuOpen=ix;
	}
}

function MB_mout(bar,ix){
	if(WMs_m.dragging) return;
	var sp=bar.item[ix];
	sp.pad.style.backgroundColor=widgetManager.menuBarButtonLoColour;
	sp.pad.style.color=widgetManager.menuBarFgLoColour;

	if(bar.hasButtonBorder){
		sp.pad.style.border="1px solid "+widgetManager.menuBarButtonBrdColour;
	}else{
		sp.pad.style.border="1px";
		sp.pad.style.paddingLeft="11px";
		sp.pad.style.paddingRight="11px";
	}
}

function MB_mdown(bar,ix){
	var sp=bar.item[ix];
	sp.pad.style.border="1px inset";

	if(bar.parent&&bar.parent.type=="Window")
		bar.parent.setActive();
	if(!bar.isSetUp) bar.setUp();

	if(sp.open){
		sp.hide();
		bar.menuOpen=-1;
	}else{
		for(var n=0;n<bar.item.length;n++)
			bar.item[n].hide();
		sp.show();
		bar.menuOpen=ix;
	}
}

function MB_MoveTo(x,y){
	this.x=x;
	this.y=y;
	this.el.style.left=x;
	this.el.style.top=y;
	if(this.fixed)
		this.setUp();
}

function MB_SetZ(x){
	var n;
	this.el.style.zIndex=x;
	for(n=0;n<this.item.length;n++)
		this.item[n].setZ(++x);
}

function MB_SetUp(){
	var a,n=0,t=this.el.getElementsByTagName('span');
	a=t[0].offsetLeft;
	var oL=this.xOffset+(this.parent?this.parent.el.offsetLeft:0)+this.x;
	var oT=this.yOffset+(this.parent?this.parent.el.offsetTop:0)+this.y;
	for(;n<t.length;n++){
		this.item[n].moveTo(oL+a,oT+this.el.offsetHeight-2);
		a+=t[n].offsetWidth+2;
	}
	this.isSetUp=true;
}

function Gl_Menu(text,brdColour,bgColour,mobgColour,fontFamily,fontSize,fontColour,moFontColour,iconImage,opacity){
	this.x=0;
	this.y=0;
	this.menu=true;
	this.type="Menu";
	this.topParent=null;
	this.text=text;
	this.textHeight=0;
	this.textWidth=0;
	this.longestItemTextWidth=0;
	this.opacity=opacity||widgetManager.menuBarOpacity;
	this.open=false;
	this.children=null;
	this.item=new Array();
	this.parent=null;
	this.menuBar=null;
	this.brdColour=brdColour;
	this.backgroundColour=bgColour;
	this.mobackgroundColour=mobgColour;
	this.iconImage=iconImage;
	this.fontFamily=fontFamily;
	this.fontSize=fontSize;
	this.fontColour=fontColour;
	this.moFontColour=moFontColour||fontColour;
	this.pad=null;

	this.el=document.createElement('div');
	this.el.style.padding="2px 2px 2px 2px";
	this.el.style.position="absolute";
	this.el.style.cursor="default";
 	this.el.style.overflow="visible";
	this.el.style.visibility="hidden";
	this.el.style.zIndex=200; //(widgetManager.nextMenuZ++);

	if(this.opacity<100){
		if(widgetManager.browserIE)
			this.el.style.filter="alpha(opacity="+this.opacity+")";
		else if(widgetManager.browserNS)
			this.el.style.MozOpacity=this.opacity+'%';
	}

	return this;
}

Gl_Menu.prototype.moveTo=M_MoveTo;
Gl_Menu.prototype.setProperties=M_SetProperties;
Gl_Menu.prototype.addItem=M_AddItem;
Gl_Menu.prototype.addMenu=M_AddMenu;
Gl_Menu.prototype.createButton=M_CreateButton;
Gl_Menu.prototype.show=M_Show;
Gl_Menu.prototype.hide=M_Hide;
Gl_Menu.prototype.toggle=M_Toggle;
Gl_Menu.prototype.destroy=M_Destroy;
Gl_Menu.prototype.setZ=M_SetZ;

function M_SetZ(z){
	var n,z2=z+1;
	this.z=z;
	this.el.style.zIndex=z;
	for(n=0;n<this.item.length;n++){
		if(this.item[n].type=="Menu")
			this.item[n].setZ(z2);
	}
}

function M_Destroy(){
	var n;
	for(n=0;n<this.item.length;n++){
		if(this.item[n].menu)
			this.item[n].destroy();
		else
			this.item[n]=null;
	}
	this.el.parentNode.removeChild(this.el);
}

function M_MoveTo(x,y){
	var g,cHeight=0,ob=this.el.getElementsByTagName('div'),pX=(this.topParent.parent?this.topParent.parent.x:0);
	if(x+this.el.offsetWidth>this.topParent.width+pX){
		if(this.parent){
			if(this.parent.type=="MenuBar")
				x=4+this.topParent.width-this.el.offsetWidth;
			else
				x=this.parent.x+this.topParent.inSet-this.el.offsetWidth;
		}
	}
	this.x=x;
	this.y=y;
	this.el.style.left=x;
	this.el.style.top=y;
	for(g=0;g<this.item.length;g++){
		if(this.item[g].menu)
			this.item[g].moveTo(this.x+this.el.offsetWidth-this.topParent.inSet,this.y+cHeight+Math.floor(this.topParent.fontSize/2));
		cHeight+=ob[g].offsetHeight;
	}
}

function M_Toggle(){
	if(this.open)
		this.hide();
	else
		this.show();
}

function M_Show(){
	var n;
	this.open=true;
	this.el.style.visibility="visible";
}

function M_Hide(){
	var n;
	for(n=0;n<this.item.length;n++){
		if(this.item[n].menu)
			this.item[n].hide();
	}
	this.open=false;
	this.el.style.visibility="hidden";
}

function M_AddItem(text,callback,target,icon){
	var pad=this.createButton(text,icon);
	this.item[this.item.length]=new MenuItem(text,callback,target,pad,this)
	this.el.appendChild(pad);
}

function M_AddMenu(m){
	this.item[this.item.length]=m;
	m.pad=this.createButton(m.text+'...',m.iconImage);
	this.el.appendChild(m.pad);
	var b=document.getElementsByTagName('BODY');
	b[0].appendChild(m.el);
	m.el.style.zIndex=this.el.style.zIndex+1;
	m.parent=this
}

function M_CreateButton(text,i,op){
	var icon=null;
	var d=document.createElement('div');
	var img=document.createElement('img');
	if(i)
		icon=widgetManager.styleDir+'/menu_icons/'+i;
	img.src=(icon?icon:widgetManager.iconDir+widgetManager.menuItemIconDefaultName);
	img.style.width=widgetManager.menuItemIconWidth;
	img.style.height=widgetManager.menuItemIconHeight;
	d.appendChild(img);
	var tn=document.createTextNode(' '+text);
	d.appendChild(tn);
	return d;
}

function M_SetProperties(p,nm){
	var f;
	var n,stretchWidth,d=this.el.getElementsByTagName('div');
	this.topParent=p;
	this.el.style.backgroundColor=this.brdColour||p.brdColour;
	stretchWidth=(this.el.offsetWidth<widgetManager.menuItemMaximumWidth?this.el.offsetWidth:widgetManager.menuItemMaximumWidth);
	for(n=0;n<d.length;n++){

		d[n].style.fontFamily=this.fontFamily||p.fontFamily;
		d[n].style.fontSize=this.fontSize||p.fontSize;
		d[n].style.color=this.fontColour||p.fontColour;
		d[n].style.backgroundColor=(this.backgroundColour?this.backgroundColour:p.backgroundColour);
		d[n].style.border="1px solid "+(this.backgroundColour?this.backgroundColour:p.backgroundColour);
		d[n].style.width=stretchWidth;

		eval('f=function (){M_mover('+p.name+','+nm+','+n+')}');
		widgetManager.addEvent(d[n],'mouseover',f,true);
		eval('f=function (){M_mout('+p.name+','+nm+','+n+')}');
		widgetManager.addEvent(d[n],'mouseout',f,true);
		eval('f=function (){M_mdown('+p.name+','+nm+','+n+')}');
		widgetManager.addEvent(d[n],'mousedown',f,true);
		widgetManager.addEvent(d[n],'dblclick',f,true);
		widgetManager.addEvent(d[n],'selectstart',function(){return false},true);
	}
	for(n=0;n<this.item.length;n++){
		if(this.item[n].menu)
			this.item[n].setProperties(p,nm+'.item['+n+']');
	}
}

function M_mover(bar,ob,ix){
	if(WMs_m.dragging) return;
	var n,p=ob.item[ix];

	if(bar.tmr){
		clearTimeout(bar.tmr);
		bar.tmr=null;
	}
	for(n=0;n<ob.item.length;n++){
		if(ob.item[n].type=="Menu"&&ob.item[n].open)
			ob.item[n].hide();
	}

	if(p.type=="Menu")
		p.show();

	p.pad.style.backgroundColor=ob.mobackgroundColour||widgetManager.menuBarBgColour;
	p.pad.style.color=ob.moFontColour||widgetManager.menuBarFgHiColour;
	p.pad.style.border="1px inset "+(ob.mobackgroundColour||widgetManager.menuBarButtonHiColour);
}

function M_mout(bar,ob,ix){
	if(WMs_m.dragging) return;
	var p=ob.item[ix];
	p.pad.style.backgroundColor=ob.backgroundColour||widgetManager.menuBarBgColour;
	p.pad.style.color=ob.fontColour||widgetManager.menuBarFgLoColour;
	p.pad.style.border="1px solid "+(ob.backgroundColour||widgetManager.menuBarBgColour);
	bar.tmr=setTimeout(bar.name+'.hideAll()',widgetManager.menuDelayBeforeClose);
}

function M_mdown(bar,ob,ix){
	var p=ob.item[ix];
	if(p.menu)
		p.toggle();
	else{
		if(bar.tmr){
			clearTimeout(bar.tmr);
			bar.tmr=null;
		}
		bar.hideAll();
		if(p.callback.indexOf('(')>-1)
			setTimeout(p.target+'.'+p.callback,10);	
		else
			setTimeout(p.target+'.location.href="'+p.callback+'"',10);
	}
}

function MenuItem(text,callback,target,pad){
	this.menu=false;
	this.type="MenuItem";
	this.callback=callback;
	this.target=target||'window';
	this.text=text;
	this.pad=pad;
	this.parent=parent;
}



//////////////////////////////
// Mouse block starts here >>>
//////////////////////////////

function WMouse(){
	this.x=0;
	this.y=0;
	this.xOffset=0;
	this.yOffset=0;
	this.xStart=0;
	this.yStart=0;
	this.oWidth=0;
	this.oHeight=0;
	this.over=null;
	this.overType='';
	this.overArea='';
	this.onButton=false;
	this.onButtonIX=-1;
	this.buttonDown=false;
	this.dragging=false;
	this.resizing=false;
}

WMouse.prototype.mouseMoved=WM_MouseMoved;

var WMs_m=null;

function InitWMouse(){
	if(document.all){
		document.onmousemove=WMs_getmouseXYIE;
		document.ondragstart=WMs_null;
		document.ondrag=WMs_null;
		document.onselectstart=WMs_null
	}else{
		document.onmousemove=WMs_getmouseXYDom2;
	}
	document.onmousedown=WMs_md;
	document.onmouseup=WMs_mu;
	WMs_m=new WMouse();
}

function WMs_null(){return false}

function WMs_mu(evnt){
	WMs_m.mousedown=false;
	if(WMs_m.dragging){
		WMs_m.dragging=false;
		if(!widgetManager.windowDragOpaque)
			WMs_m.over.switchToOpaque();
		WMs_m.over=null;
		if(Gl_oldMouseInUse) Ms_mu();
		return false;
	}else if(WMs_m.resizing){
		WMs_m.resizing=false;
		if(!widgetManager.windowResizeOpaque)
			WMs_m.over.switchToOpaque();
		WMs_m.over=null;
		if(Gl_oldMouseInUse) Ms_mu();
		return false;
	}else if(WMs_m.scrolling){
		WMs_m.scrolling=false;
		WMs_m.over=null;
		if(Gl_oldMouseInUse) Ms_mu();
		return false;
	}
	if(Gl_oldMouseInUse) Ms_mu();
	return true
}

function WMs_md(evnt){
	if(WMs_m.onButton){
		widgetManager.windowActiveIX=WMs_m.onButtonIX;
		if(Gl_oldMouseInUse) Ms_md();
		return;
	}
	widgetManager.getBrowserWidth();
	widgetManager.getBrowserHeight();
	WMs_m.mousedown=true;
	if(WMs_m.over!=null){
		if(WMs_m.dragging||WMs_m.resizing) return false;
		WMs_m.over.setActive();
		WMs_m.xOffset=WMs_m.over.x-WMs_m.x;
		WMs_m.yOffset=WMs_m.over.y-WMs_m.y;
		WMs_m.xStart=WMs_m.x;
		WMs_m.yStart=WMs_m.y;
		WMs_m.oWidth=WMs_m.over.width;
		WMs_m.oHeight=WMs_m.over.height;
		if(WMs_m.over.type=="Window"){
			WMs_m.scrollPadStartY=WMs_m.over.scrollPos;
		}
		if(WMs_m.overArea=='TitleBar'){
			if(!widgetManager.windowDragOpaque)
				WMs_m.over.switchToOutlines();
			WMs_m.dragging=true;
			return false;
		}else if(WMs_m.overArea=='ResizePad'){
			if(!widgetManager.windowResizeOpaque)
				WMs_m.over.switchToOutlines();
			WMs_m.resizing=true;
			return false;
		}else if(WMs_m.overArea=='ScrollPad'){
			WMs_m.scrolling=true;
			return false;
		}
	}
	if(Gl_oldMouseInUse) Ms_md();
	return true
}

function WMs_getmouseXYIE(){
	WMs_m.x=event.clientX+document.body.scrollLeft;
	WMs_m.y=event.clientY+document.body.scrollTop;
	WMs_m.mouseMoved();
	if(Gl_oldMouseInUse)
		Ms_getmousexy2()
}

function WMs_getmouseXYDom2(event){
	WMs_m.x=event.clientX+window.scrollX;
	WMs_m.y=event.clientY+window.scrollY;
	WMs_m.mouseMoved();
	if(Gl_oldMouseInUse)
		Ms_getmousexy(event)
}

function WM_MouseMoved(){
	if(this.dragging){
		this.over.dragMoveTo(this.x+this.xOffset,this.y+this.yOffset);
		return false;
	}
	if(this.resizing){
		this.over.dragResizeTo(this.oWidth+(this.x-this.xStart),this.oHeight+(this.y-this.yStart))
		return false;
	}
	if(this.scrolling){
		this.over.scroll(this.over.scrollX,(this.scrollPadStartY+(this.y-this.yStart)*WMs_m.over.scrollRelAmtN));
		return false;
	}
	return true
}

function WMs_OnResizePad(index){
	if(WMs_m.over) return;
	if(widgetManager.windows[index].maximized)return;
	WMs_m.overArea='ResizePad';
	WMs_m.over=widgetManager.windows[index];
}

function WMs_OnTitleBar(index){
	if(WMs_m.over) return;
	if(widgetManager.windows[index].maximized)return;
	WMs_m.overArea='TitleBar';
	WMs_m.over=widgetManager.windows[index];
}

function WMs_OnScrollPad(index){
	if(WMs_m.over) return;
	WMs_m.overArea='ScrollPad';
	WMs_m.over=widgetManager.windows[index];
}

function WMs_OffOb(){
	if(!WMs_m.dragging&&!WMs_m.resizing&&!WMs_m.scrolling){
		WMs_m.over=null;
		WMs_m.overArea='';
	}
}