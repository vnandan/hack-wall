function Ms_initmouse(){
	Gl_oldMouseInUse=true;
	if(!Gl_widgetsInUse){
		if(Gl_browser.ns4){
			document.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP|Event.MOUSEDOWN);
			document.onMouseMove=Ms_getmousexy
		}else if(Gl_browser.ie){
			document.onmousemove=Ms_getmousexy2;
			document.ondragstart=Ms_null;
			document.ondrag=Ms_null;
			document.onselectstart=Ms_null
		}else if(Gl_browser.dom2){
			document.onmousemove=Ms_getmousexydom2
		}
		document.onmousedown=Ms_md;
		document.onmouseup=Ms_mu;
		document.onMouseDown=Ms_md;
		document.onMouseUp=Ms_mu;
	}
	return Ms_m
}

function Ms_null(){
	return false
}

function Ms_mu(evnt){
	Ms_m.mousedown=false;
	Ms_m.dragging=false;
	if(Ms_m.over!=null){
		if(Ms_m.over.draggable){
			if(Ms_m.over.zStack){
				var n,tZ=-100000;
				for(var n=0;n<Gl_layers.length;n++){
					if(Gl_layers[n].z>tZ)
						tZ=Gl_layers[n].z
				}
				Ms_m.over.z=++tZ;
				Ms_m.over.ob.zIndex=tZ
			}else
				Ms_m.over.ob.zIndex=Ms_m.z;
			Ms_m.over.on=Ms_m.onstate
		}
		eval(Ms_m.over.onclickup);
		Ms_m.over=null
	}
	return true
}

function Ms_md(evnt){
	Ms_m.mousedown=true;
	if(Ms_m.over!=null){
		eval(Ms_m.over.onclickdown);
		if(Ms_m.over.draggable&&!Ms_m.dragging){
			Ms_m.xoff=Math.floor(Ms_m.x-Ms_m.over.x);
			Ms_m.yoff=Math.floor(Ms_m.y-Ms_m.over.y);
			Ms_m.onstate=Ms_m.over.on;Ms_m.over.on=false;
			Ms_m.z=Ms_m.over.ob.zIndex;Ms_m.over.ob.zIndex=10000
		}
		if(Gl_browser.ns4)
			return (Ms_m.over.iType||Ms_m.over.URL?true:false);
		else return false
	}
	return true
}

function Ms_getmousexy(evnt){
	Ms_m.x=evnt.pageX+window.pageXOffset-Sp_xoffset;
	Ms_m.y=evnt.pageY+window.pageYOffset-Sp_yoffset;
	if(Ms_m.beingfollowed){
		for(var n=0;n<Ms_m.followedby.length;n++){
			Sp_a=Ms_m.followedby[n];
			Sp_a.moveTo(Ms_m.x+Sp_a.followingx,Ms_m.y+Sp_a.followingy)
		}
	}
	if(Ms_mouseon){
		if(!Ms_m.mousedown)
			checkmo();
		else if(Ms_m.over!=null&&Ms_m.over.draggable){
			if(Ms_m.over.dragnormal)
				Ms_m.over.moveTo(Ms_m.x-Ms_m.xoff,Ms_m.y-Ms_m.yoff);
			else if(Ms_m.over.draghoriz)
				Ms_m.over.moveTo(Ms_m.x-Ms_m.xoff,Ms_m.over.y);
			else if(Ms_m.over.dragvert)
				Ms_m.over.moveTo(Ms_m.over.x,Ms_m.y-Ms_m.yoff);
			Ms_m.dragging=true
		}
		if(Ms_m.over!=null){
			return (Ms_m.over.URL?false:true)
		}
	}
	return true
}

function Ms_getmousexy2(){
	Ms_m.x=event.clientX-Sp_xoffset+document.body.scrollLeft;
	Ms_m.y=event.clientY-Sp_yoffset+document.body.scrollTop;
	if(Ms_m.beingfollowed){
		for(var n=0;n<Ms_m.followedby.length;n++){
			Sp_a=Ms_m.followedby[n];
			Sp_a.moveTo(Ms_m.x+Sp_a.followingx,Ms_m.y+Sp_a.followingy)
		}
	}
	if(Ms_mouseon){
		if(!Ms_m.mousedown)
			checkmo();
		else if(Ms_m.over!=null&&Ms_m.over.draggable){
			if(Ms_m.over.dragnormal)
				Ms_m.over.moveTo(Ms_m.x-Ms_m.xoff,Ms_m.y-Ms_m.yoff);
			else if(Ms_m.over.draghoriz)
				Ms_m.over.moveTo(Ms_m.x-Ms_m.xoff,Ms_m.over.y);
			else if(Ms_m.over.dragvert)
				Ms_m.over.moveTo(Ms_m.over.x,Ms_m.y-Ms_m.yoff);
			Ms_m.dragging=true
		}
		if(Ms_m.over!=null)
			return false
	}
	return true
}

function Ms_getmousexydom2(event){
	Ms_m.x=event.clientX+window.scrollX-Sp_xoffset;
	Ms_m.y=event.clientY+window.scrollY-Sp_yoffset;
	if(Ms_m.beingfollowed){
		for(var n=0;n<Ms_m.followedby.length;n++){
			Sp_a=Ms_m.followedby[n];
			Sp_a.moveTo(Ms_m.x+Sp_a.followingx,Ms_m.y+Sp_a.followingy)
		}
	}
	if(Ms_mouseon){
		if(!Ms_m.mousedown)
			checkmo();
		else if(Ms_m.over!=null&&Ms_m.over.draggable){
			if(Ms_m.over.dragnormal)
				Ms_m.over.moveTo(Ms_m.x-Ms_m.xoff,Ms_m.y-Ms_m.yoff);
			else if(Ms_m.over.draghoriz)
				Ms_m.over.moveTo(Ms_m.x-Ms_m.xoff,Ms_m.over.y);
			else if(Ms_m.over.dragvert)
				Ms_m.over.moveTo(Ms_m.over.x,Ms_m.y-Ms_m.yoff);
			Ms_m.dragging=true
		}
		if(Ms_m.over!=null){
			focus();
			return false
		}
	}
	return true
}

function checkmo(){
	var n,sp,x,y;
	Ms_m.over=null;
	if(Gl_onSpecialItem)
		return;
	var Ms_msfnd=-10000;
	for(n=0;n<Gl_layers.length;n++){
		sp=Gl_layers[n];
		x=Ms_m.x;
		y=Ms_m.y;
		if(sp.opacity){
			x+=Sp_xoffset;
			y+=Sp_yoffset
		}
		if(sp.on&&sp.mouse&&(x>sp.x)&&(x<sp.x+sp.width)&&(y>sp.y)&&(y<sp.y+sp.height)&&(sp.z>Ms_msfnd)){
			Ms_m.over=sp;
			Ms_msfnd=sp.z
		}
	}
	if(Ms_m.over!=Ms_m.cover){
		if(Ms_m.cover!=null)
			eval(Ms_m.cover.onmouseout);
		if(Ms_m.over!=null)
			eval(Ms_m.over.onmouseover)
	}
	Ms_m.cover=Ms_m.over
}

function Ms_msobj(){
	this.xoff=0;
	this.yoff=0;
	this.z=0;
	this.onstate=false;
	this.mousedown=false;
	this.dragging=false;
	this.lmd=null;
	this.x=100;
	this.y=100;
	this.width=1;
	this.height=1;
	this.alive=true;
	this.over=null;
	this.cover=null;
	this.enable=Ms_enable;
	this.disable=Ms_disable;
	this.followedby=new Array();
	this.beingfollowed=false
}

function Ms_enable(){
	Ms_mouseon=true
}

function Ms_disable(){
	Ms_mouseon=false;
	if(Ms_m.over!=null)
		eval(Ms_m.over.onmouseout);
	if(Ms_m.cover!=null)
		eval(Ms_m.cover.onmouseout);
	Ms_m.over=null;
	Ms_m.cover=null
}

var Ms_m=new Ms_msobj;
Ms_mouseon=true;