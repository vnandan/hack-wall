var In_interface=new Array();
var In_pathToGamelib='';
var In_MenuList=new Array();
var In_LMenu=null;
var In_LMenuTimer=null;
var In_MenuComputedWidth=0

function In_Interface(w,h,pathToGamelib){
	this.iType="interface";
	this.x=0;
	this.y=0;
	this.z=Gl_layer_index;
	this.zStack=true;
	this.width=w;
	this.height=h;
	this.index=In_interface.length;
	this.url=new Array();		// holds urls for all elements that use them
	this.dragnormal=true;
	this.draggable=false;
	this.on=true;
	this.visible=true;
	this.mouse=true;
	In_PathToGamelib=pathToGamelib||In_PathToGamelib;

	if(Gl_browser.ns4){
		this.ob=this.rawUnclipped=genDiv(-1000,-1000,1000,'In_',Gl_layer_index++,'');
		this.ob.clip.height=1000;
		this.ob.height=-1000;
		this.rob=this.raw=genDiv(0,0,w,'In_',Gl_layer_index++,'',this.rawUnclipped);

		this.rob.height=h;
		this.rob.clip.left=0;
		this.rob.clip.top=0;
		this.rob.clip.bottom=h;
		this.rob.clip.right=w;
	}else{
		this.rawUnclipped=genDiv(-1000,-1000,0,'InU_',Gl_layer_index++,'');
		this.rawUnclipped.style.overflow="visible";
		this.ob=this.rawUnclipped.style;
		this.raw=genDiv(0,0,w,'In_',Gl_layer_index++,'',this.rawUnclipped);
		this.rob=this.raw.style;
		this.rob.height=h;
		this.raw.height=h;
		this.rob.clip='rect(0,'+w+','+h+',0)';
	}

	this.element=new Array();

	this.add=In_interfaceAdd;
	this.show=In_interfaceShow;
	this.hide=In_interfaceHide;
	this.moveTo=In_interfaceMoveTo;
	this.setZ=In_interfaceSetZ;
	this.setBgColor=In_interfaceSetbgColor;
	this.setBackground=In_interfaceSetBackground;
	this.makeDraggable=Gl_makeDraggable;
	this.makeUndraggable=Gl_makeUndraggable;
	this.divWrite=In_DivWrite;
	In_interface[In_interface.length]=this;
	Gl_layers[Gl_layers.length]=this
	return this;
}

function In_DivWrite(l,x){
	if(Gl_browser.ns4){
		l.document.open();
		l.document.write(x);
		l.document.close();
	}else
		l.innerHTML=x+'\n';
}

function In_Eval(i,x){
	eval(In_interface[i].url[x]);
	return false
}

function In_interfaceSetbgColor(Gl_a){
	if(Gl_browser.ns4)
		this.rob.bgColor=Gl_a;
	else
		this.rob.backgroundColor=Gl_a
}

function In_interfaceSetBackground(Gl_a){
	if(Gl_browser.ns4)
		this.rob.background.src=Gl_a;
	else
		this.rob.backgroundImage="url("+Gl_a+")"
}

function In_interfaceSetZ(z){
	this.z=z;
	this.ob.zIndex=z;
}

function In_interfaceShow(){
	this.on=true;
	this.visible=true;
	this.moveTo(this.x,this.y);
}

function In_interfaceHide(){
	this.on=false;
	this.visible=false;
	this.ob.top=-10000;
	this.ob.left=-10000;
}

function In_interfaceMoveTo(x,y){
	this.x=x;
	this.y=y;
	this.ob.top=y;
	this.ob.left=x;
}

function In_interfaceAdd(ob){
	if(!ob.iType){
		alert('ERROR: Attempt to add non interface element to interface. Please read the docs!');
		return
	}
	this.element[this.element.length]=ob;
	ob.parent=this;
	if(ob.iType=="nDisplay"){
		var n,w;
		var imageOffsets=new Array(0,17,23,34,43,53,62,76,82,95,99,118,122,135,142,155,161,175,177,199,200,217,223,234,243,253,262,276,282,295,299,318,322,335,342,355,361,375,377,399);
		ob.leftClip=imageOffsets[ob.face*2];
		ob.rightClip=imageOffsets[(ob.face*2)+1];
		w=ob.rightClip-ob.leftClip;
		for(n=0;n<ob.digits;n++){
			if(Gl_browser.ns4){
				ob.digitLayer[n]=genDiv((ob.x-ob.leftClip)+(n*w),ob.y,w,'display_',Gl_layer_index++,'<img src="'+In_PathToGamelib+'/gamelib_images/numbers.gif">',this.raw);
				ob.digitLayer[n].clip.top=0;
				ob.digitLayer[n].clip.bottom=20;
				ob.digitLayer[n].clip.left=ob.leftClip;
				ob.digitLayer[n].clip.right=ob.rightClip
			}else{
				ob.digitLayer[n]=genDiv(ob.x+(n*w),ob.y,w,'display_',Gl_layer_index++,' &nbsp; ',this.raw);
				ob.digitLayer[n].style.backgroundImage='url('+In_PathToGamelib+'/gamelib_images/numbers.gif)';
				ob.digitLayer[n].style.clip='rect(0,'+w+',20,0)';
			}
			ob.digitPosition[n]=-1;
		}
		ob.reset();
	}else if(ob.iType=="menu")
		menuCreate(this.rawUnclipped,this,ob,0,this.index);
	else if(ob.iType=="button"){
		if(ob.type=='image'){
			var buttonHTML='<a href="#" onmouseout="In_interface['+this.index+'].element['+(this.element.length-1)+'].mo(0)" onmouseover="In_interface['+this.index+'].element['+(this.element.length-1)+'].mo(1)" onclick="In_interface['+this.index+'].element['+(this.element.length-1)+'].click();return false">';
			buttonHTML+='<image id="In_BImg_'+Gl_layer_index+'" name="In_BImg_'+Gl_layer_index+'" src="'+ob.legend+'" width='+ob.width+' height='+ob.height+' border=0>';
			buttonHTML+='</a>';
			ob.imageRef='In_BImg_'+Gl_layer_index;
			ob.layer=genDiv(ob.x,ob.y,ob.width,'button_',Gl_layer_index++,buttonHTML,this.raw);
		}else{
			var buttonHTML=ob.createButtonHTML();
			ob.layer=genDiv(ob.x,ob.y,ob.width,'button_',Gl_layer_index++,buttonHTML,this.raw);
			var buttonHTML='<a href="#" onmouseout="In_interface['+this.index+'].element['+(this.element.length-1)+'].mo(0)" onmouseover="In_interface['+this.index+'].element['+(this.element.length-1)+'].mo(1)" onclick="In_interface['+this.index+'].element['+(this.element.length-1)+'].click();return false"><img src="'+In_PathToGamelib+'/gamelib_images/blank.gif" width='+ob.width+' height='+ob.height+' border=0></a>';
			ob.overLayer=genDiv(ob.x,ob.y,ob.width,'button_',Gl_layer_index++,buttonHTML,this.raw);
			ob.mo(0);
		}
	}else if(ob.iType=="image"){
		ob.layer=genDiv(ob.x,ob.y,ob.width,'inimage_',Gl_layer_index++,'<img name="inimg'+Gl_layer_index+'" id="inimg'+Gl_layer_index+'" src="'+ob.src+'" width='+ob.width+' height='+ob.height+'>',this.raw);
		ob.imageRef='inimg'+(Gl_layer_index++)
	}else if(ob.iType=="label"){
		ob.layer=genDiv(ob.x,ob.y,ob.width,'inlabel_',Gl_layer_index++,ob._reWrite(),this.raw);
	}
}

function In_Label(x,y,w,h,txt,align,fontColor,fontSize,fontFace,borderColor,backgroundColor){
	this.iType='label';
	this.x=x;
	this.y=y;
	this.width=w;
	this.height=h;
	this.layer=null;
	this.txt=txt;
	this.align=align||"left";
	this.borderColor=borderColor;
	this.backgroundColor=backgroundColor;
	this.fontColor=fontColor||'#000000';
	this.fontSize=fontSize||3;
	this.fontFace=fontFace||'Arial,Helvetica,sans-serif';
	this.setText=In_LabelSetText;
	this.setAlignment=In_LabelSetAlignment;
	this.setFontFace=In_LabelSetFontFace;
	this.setFontColor=In_LabelSetFontColor;
	this.setFontSize=In_LabelSetFontSize;
	this.setBorderColor=In_LabelSetBorderColor;
	this._reWrite=_In_LabelReWrite;
	return this;
}

function In_LabelSetAlignment(x){this.align=x;In_DivWrite(this.layer,this._reWrite())}
function In_LabelSetBackgroundColor(x){this.backgroundColor=x;In_DivWrite(this.layer,this._reWrite())}
function In_LabelSetBorderColor(x){this.borderColor=x;In_DivWrite(this.layer,this._reWrite())}
function In_LabelSetFontColor(x){this.fontColor=x;In_DivWrite(this.layer,this._reWrite())}
function In_LabelSetFontFace(x){this.fontFace=x||'Arial,Helvetica,sans-serif';In_DivWrite(this.layer,this._reWrite())}
function In_LabelSetFontSize(x){this.fontSize=x;In_DivWrite(this.layer,this._reWrite())}
function In_LabelSetText(x){if(x!=this.txt){this.txt=x;In_DivWrite(this.layer,this._reWrite())}}

function _In_LabelReWrite(){
	var html='';
	var cHtml='<font face="'+this.fontFace+'" color="'+this.fontColor+'" size='+this.fontSize+'">'+this.txt+'</font>';
	var a=(this.align)?this.align.toLowerCase():'';
	if(a!='left'&&a!='right'&&a!='center') this.align='left';
	if(this.borderColor&&this.backgroundColor){
		html='<table width='+this.width+' height='+this.height+' cellpadding=0 cellspacing=0 border=0><tr>';

		html+='<tr><td bgcolor="'+this.borderColor+'"><img src="'+In_PathToGamelib+'/gamelib_images/blank.gif" width=1 height=1></td>';
		html+='<td bgcolor="'+this.borderColor+'"><img src="'+In_PathToGamelib+'/gamelib_images/blank.gif" width='+(this.width-2)+' height=1></td>';
		html+='<td bgcolor="'+this.borderColor+'"><img src="'+In_PathToGamelib+'/gamelib_images/blank.gif" width=1 height=1></td></tr>';
	
		html+='<tr><td bgcolor="'+this.borderColor+'"><img src="'+In_PathToGamelib+'/gamelib_images/blank.gif" width=1 height='+(this.height-2)+'></td>';
		html+='<td align=left valign=top bgcolor="'+this.backgroundColor+'"><table border=0 width='+(this.width-2)+' height='+(this.hight-2)+' cellpadding=1 cellspacing=0><tr><td align='+this.align+'>'+cHtml+'</td></tr></table></td>';
		html+='<td bgcolor="'+this.borderColor+'"><img src="'+In_PathToGamelib+'/gamelib_images/blank.gif" width=1 height='+(this.height-2)+'></td></tr>';

		html+='<tr><td bgcolor="'+this.borderColor+'"><img src="'+In_PathToGamelib+'/gamelib_images/blank.gif" width=1 height=1></td>';
		html+='<td bgcolor="'+this.borderColor+'"><img src="'+In_PathToGamelib+'/gamelib_images/blank.gif" width='+(this.width-2)+' height=1></td>';
		html+='<td bgcolor="'+this.borderColor+'"><img src="'+In_PathToGamelib+'/gamelib_images/blank.gif" width=1 height=1></td></tr>';

		html+='</table>';
	}else
		html=cHtml;
	return html;
}

function In_Image(x,y,w,h,src){
	this.iType="image";
	this.x=x;
	this.y=y;
	this.width=w;
	this.height=h;
	this.src=src;
	this.layer=null;
	this.imageRef='';
	this.setImage=In_ImageSetImage;
	return this;
}

function In_ImageSetImage(src){
	this.src=src;
	if(Gl_browser.ns4)
		this.layer.document.images[0].src=src;
	else
		document.getElementById(this.imageRef).src=src;
}

function In_Button(x,y,w,h,type,url,legend,low,high,pressed,borderColor,fontColor,fontSize,borderSize){
	this.iType='button';
	this.x=x;
	this.y=y;
	this.width=w;
	this.height=h;
	this.url=url;
	this.type=(type.toLowerCase()=='image'?'image':'color');
	this.legend=legend;
	this.low=low;
	this.high=high;
	this.pressed=pressed;
	this.borderColor=borderColor||false;
	this.borderSize=borderSize||1;
	this.fontColor=fontColor||false;
	this.fontSize=fontSize||false;
	this.layer=null;
	this.overLayer=null;
	this.imageRef=null;
	this.parent=null;
	this.group=new Array();
	this.down=false;
	this.mo=In_ButtonMo;
	this.click=In_ButtonClick;
	this.createButtonHTML=In_ButtonCreateButtonHTML;
	this.setLegend=In_ButtonSetLegend;
	this.setColors=In_ButtonSetColors;
	this.setAction=In_ButtonSetAction;
	this.setImages=In_ButtonSetImages;
	this.makeRadio=In_ButtonMakeRadio;
	this.clearRadio=In_ButtonClearRadio;
	return this;
}

function In_ButtonMakeRadio(){
	var n,g;
	var a=new Array();
	for(n=0;n<arguments.length;n++)
		a[a.length]=arguments[n];
	a[a.length]=this;
	for(n=0;n<a.length;n++){
		a[n].group=new Array();
		for(g=0;g<a.length;g++){
			if(a[g]!=a[n])
				a[n].group[a[n].group.length]=a[g];
		}
	}
}

function In_ButtonClearRadio(){
	for(var n=0;n<this.group.length;n++){
		this.group[n].down=false;
		this.group[n].group=new Array();
		this.group[n].mo(0);
	}
	this.down=false;
	this.group=new Array();
	this.mo(0);
}

function In_ButtonSetImages(low,high,pressed){
	this.low=low;
	this.high=high;
	this.pressed=pressed;
	this.mo(0);
}

function In_ButtonSetColors(low,high,pressed,borderColor,fontColor){
	this.low=low;
	this.high=high;
	this.pressed=pressed;
	this.borderColor=borderColor||this.borderColor;
	this.fontColor=fontColor||this.fontColor;
	this.setLegend(this.legend);
	this.mo(0);
}

function In_ButtonSetLegend(legend){
	this.legend=legend;
	In_DivWrite(this.layer,this.createButtonHTML());
}

function In_ButtonSetAction(url){
	this.url=url;
}

function In_ButtonCreateButtonHTML(){
	var b='<img src="'+In_PathToGamelib+'/gamelib_images/blank.gif" width=';
	var bS=this.borderSize;
	var bH=this.height-(bS*2);
	var bW=this.width-(bS*2);
	var c=this.borderColor;
	var buttonHTML='<table cellpadding=0 cellspacing=0 border=0 width='+this.width+' height='+this.height+'><tr>';

	buttonHTML+='<td bgcolor='+c+' width='+bS+' height='+bS+'>'+b+bS+' height='+bS+'></td>'
	buttonHTML+='<td bgcolor='+c+' width='+bW+' height='+bS+'>'+b+bW+' height='+bS+'></td>'
	buttonHTML+='<td bgcolor='+c+' width='+bS+' height='+bS+'>'+b+bS+' height='+bS+'></td></tr><tr>'

	buttonHTML+='<td bgcolor='+c+' width='+bS+' height='+bS+'>'+b+bS+' height='+bS+'></td>'
	buttonHTML+='<td width='+bW+' height='+bH+' align=center valign=middle><font face="Arial,Helvetica,sans-serif" size='+this.fontSize+' color='+this.fontColor+'>'+this.legend+'</font></td>';
	buttonHTML+='<td bgcolor='+c+' width='+bS+' height='+bS+'>'+b+bS+' height='+bS+'></td></tr><tr>'

	buttonHTML+='<td bgcolor='+c+' width='+bS+' height='+bS+'>'+b+bS+' height='+bS+'></td>'
	buttonHTML+='<td bgcolor='+c+' width='+bW+' height='+bS+'>'+b+bW+' height='+bS+'></td>'
	buttonHTML+='<td bgcolor='+c+' width='+bS+' height='+bS+'>'+b+bS+' height='+bS+'></td></tr>'

	buttonHTML+='</table>';
	return buttonHTML;
}

function In_ButtonMo(s){
	if(!this.down){
		if(this.type=='image'){
			if(Gl_browser.ns4){
				this.layer.document.images[0].src=(s)?this.high:this.low;
			}else{
				var i=document.getElementById(this.imageRef);
				i.src=(s)?this.high:this.low;
			}
		}else{
			if(Gl_browser.ns4)
				this.layer.bgColor=(s)?this.high:this.low;
			else
				this.layer.style.backgroundColor=(s)?this.high:this.low;
		}
	}
}

function In_ButtonClick(i,e){
	if(this.type=='image'){
		if(Gl_browser.ns4)
			this.layer.document.images[0].src=this.pressed;
		else{
			var i=document.getElementById(this.imageRef);
			i.src=this.pressed;
		}
	}else{
		if(Gl_browser.ns4)
			this.layer.bgColor=this.pressed;
		else
			this.layer.style.backgroundColor=this.pressed;
	}
	if(this.group.length>0){
		this.down=true;
		for(var n=0;n<this.group.length;n++){
			this.group[n].down=false;
			this.group[n].mo(0);
		}
	}
	eval(this.url);
	return false
}

function menuCreate(raw,parent,o,b,pTopIX){
	var pTopIX=pTopIX;
	var n,h,i,ob=o;
	var bIX=b;
	var xoff=b*30;
	var y=(b)?5:ob.y;
	if(b==0){
		In_MenuComputedWidth=ob.width;

		if(Gl_browser.ns4){
			ob.uLayer[0]=genDiv(0,0,ob.width,'menu_',Gl_layer_index++,'<table cellpadding=0 cellspacing=0 border=0 width='+ob.width+'><tr><td width='+ob.width+'><font face="Arial,Helvetica,sans-serif" size='+ob.fontSize+' color='+ob.fontColor+'>'+ob.text+'</font></td></tr></table>',raw);
			ob.uLayer[0].bgColor=ob.loColor;
		}else{
			ob.uLayer[0]=genDiv(0,0,ob.width,'menu_',Gl_layer_index++,'<font face="Arial,Helvetica,sans-serif" size='+ob.fontSize+' color='+ob.fontColor+'>'+ob.text+'</font>',raw);
			ob.uLayer[0].style.backgroundColor=ob.loColor;
		}
		if(Gl_browser.ie)
			ob.uLayer[0].style.filter='alpha(opacity='+ob.opacity+')';
		if(Gl_browser.ns6)
			ob.uLayer[0].MozOpacity=ob.opacity+'%';
		ob.oLayer[0]=genDiv(0,0,ob.width,'menu_',Gl_layer_index++,'',raw);
	}else if(xoff+ob.width>In_MenuComputedWidth)
		In_MenuComputedWidth=xoff+ob.width;

	for(n=ob.element.length-1;n>-1;n--){
		i=ob.element[n];

		if(Gl_browser.ns4){
			ob.uLayer[n+1]=genDiv(xoff,0,ob.width,'menuItem_',Gl_layer_index++,'<table cellpadding=0 cellspacing=0 border=0 width='+ob.width+'><tr><td width='+ob.width+'><font face="Arial,Helvetica,sans-serif" size='+ob.fontSize+' color='+ob.fontColor+'>'+i.text+'</font></td></tr></table>',raw);
			ob.uLayer[n+1].bgColor=ob.loColor;
		}else{
			ob.uLayer[n+1]=genDiv(xoff,0,ob.width,'menuItem_',Gl_layer_index++,'<font face="Arial,Helvetica,sans-serif" size='+ob.fontSize+' color='+ob.fontColor+'>'+i.text+'</font>',raw);
			ob.uLayer[n+1].style.backgroundColor=ob.loColor;
		}
		if(Gl_browser.ie)
			ob.uLayer[n+1].style.filter='alpha(opacity='+ob.opacity+')';
		if(Gl_browser.ns6)
			ob.uLayer[n+1].MozOpacity=ob.opacity+'%';

		ob.oLayer[n+1]=genDiv(xoff,0,ob.width,'menuItem_',Gl_layer_index++,'',raw);
		if(i.iType=='menu'){
			ob.child[ob.child.length]=i;
			ob.childIX[ob.childIX.length]=n;
			menuCreate(raw,ob,i,bIX+1,pTopIX);
		}
	}
	ob.parent=parent;
	parent.element[parent.element.length-1].fullWidth=In_MenuComputedWidth;
	setTimeout('findMenuHeight('+ob.index+','+bIX+','+pTopIX+')',50);	// Good old Netscape. Why reflect the real size of a layer
											// immediately when you can do it after a screen refresh? ;-)
}

// NS4 code needed in this sub!

function findMenuHeight(ix,b,pTopIX){
	var n,tH,m=In_MenuList[ix],h=0,urlIX;
	var pTop=In_interface[pTopIX];
	var xoff=b*(m.width-20);
	if(m.uLayer[0]){
		if(Gl_browser.ns4){
			h=m.uLayer[0].clip.height+1;
			In_DivWrite(m.oLayer[0],'<a href="#" onclick="In_MenuList['+ix+'].openClose(null,true);return false" onmouseover=";top.status=\'\';return true"><img src="'+In_PathToGamelib+'/gamelib_images/blank.gif" width='+m.width+' height='+h+' border=0></a>');
			m.oLayer[0].top=m.y;
			m.oLayer[0].left=m.x;
			m.uLayer[0].top=m.y;
			m.uLayer[0].left=m.x
		}else{
			h=m.uLayer[0].offsetHeight+1;
			In_DivWrite(m.oLayer[0],'<a href="#" onclick="In_MenuList['+ix+'].openClose(null,true);top.status=\'\';return false" onmouseover=";top.status=\'\';return true"><img src="'+In_PathToGamelib+'/gamelib_images/blank.gif" width='+m.width+' height='+h+' border=0></a>');
			m.oLayer[0].style.top=m.y;
			m.oLayer[0].style.left=m.x;
			m.uLayer[0].style.top=m.y;
			m.uLayer[0].style.left=m.x
		}
	}

	for(n=1;n<m.uLayer.length;n++){
		if(m.element[n-1].url!=-1){
			urlIX=pTop.url.length;
			pTop.url[pTop.url.length]=m.element[n-1].url;
		}
		if(Gl_browser.ns4){
			tH=m.uLayer[n].clip.height;
			if(m.element[n-1].url==-1)
				In_DivWrite(m.oLayer[n],'<a href="#" onmouseover="In_MenuList['+ix+'].hiLo('+n+',1);top.status=\'\';return true" onmouseout="In_MenuList['+ix+'].hiLo('+n+',0);return false" onclick="In_MenuList['+m.element[n-1].index+'].openClose();return false"><img src="'+In_PathToGamelib+'/gamelib_images/blank.gif" width='+m.width+' height='+tH+' border=0></a>');
			else
				In_DivWrite(m.oLayer[n],'<a href="#" onmouseover="In_MenuList['+ix+'].hiLo('+n+',1);top.status=\'\';return true" onmouseout="In_MenuList['+ix+'].hiLo('+n+',0);return false" onclick="In_MenuList['+ix+'].doUrl('+(n-1)+');return false"><img src="'+In_PathToGamelib+'/gamelib_images/blank.gif" width='+m.width+' height='+tH+' border=0></a>');
			m.uLayer[n].top=h+m.y;
			m.oLayer[n].top=h+m.y;
			m.uLayer[n].left=m.x+xoff;
			m.oLayer[n].left=m.x+xoff;
			m.oLayer[n].zIndex=1000+b+1;
			m.uLayer[n].zIndex=1000+b
		}else{
			tH=m.uLayer[n].offsetHeight;
			if(m.element[n-1].url==-1)
				In_DivWrite(m.oLayer[n],'<a href="#" onmouseover="In_MenuList['+ix+'].hiLo('+n+',1);top.status=\'\';return true" onmouseout="In_MenuList['+ix+'].hiLo('+n+',0);return false" onclick="In_MenuList['+m.element[n-1].index+'].openClose();return false"><img src="'+In_PathToGamelib+'/gamelib_images/blank.gif" width='+m.width+' height='+tH+' border=0></a>');
			else
				In_DivWrite(m.oLayer[n],'<a href="#" onmouseover="In_MenuList['+ix+'].hiLo('+n+',1);top.status=\'\';return true" onmouseout="In_MenuList['+ix+'].hiLo('+n+',0);return false" onclick="In_MenuList['+ix+'].doUrl('+(n-1)+');return false"><img src="'+In_PathToGamelib+'/gamelib_images/blank.gif" width='+m.width+' height='+tH+' border=0></a>');
			m.uLayer[n].style.top=h+m.y;
			m.oLayer[n].style.top=h+m.y;
			m.uLayer[n].style.left=m.x+xoff;
			m.oLayer[n].style.left=m.x+xoff;
			m.oLayer[n].style.zIndex=1000+b+1;
			m.uLayer[n].style.zIndex=1000+b
		}
		h+=tH+1;
		positionMenu(m,n,m.x+xoff,h+m.y)
	}

	In_MenuList[ix].openClose(true);
}

function positionMenu(iM,iN,iL,iT){
	var n=iN,m=iM,l=iL,t=iT,d,rD,t,c;
	for(var g=0;g<m.child.length;g++){
		if(m.childIX[g]==n){
			c=m.child[g];
			if(Gl_browser.ns4)
				d=m.uLayer[n].top+m.uLayer[n].clip.height+5;
			else
				d=parseInt(m.uLayer[n].style.top)+parseInt(m.uLayer[n].offsetHeight)+5;
			rD=d;
			for(t=1;t<c.uLayer.length;t++){
				if(Gl_browser.ns4){
					rD=d;
					c.uLayer[t].top=d;
					c.oLayer[t].top=d;
					c.uLayer[t].left=l+m.width-20;
					c.oLayer[t].left=l+m.width-20;
					d+=c.uLayer[t].clip.height+1;		
				}else{
					rD=d;
					c.uLayer[t].style.top=d;
					c.oLayer[t].style.top=d;
					c.uLayer[t].style.left=l+m.width-20;
					c.oLayer[t].style.left=l+m.width-20;
					d+=parseInt(c.uLayer[t].offsetHeight)+1;		
				}
				if(c.child.length>0)
					positionMenu(c,t,l+m.width-20,rD);
			}
		}
	}
}

function In_Menu(x,y,w,text,opacity,fontSize,fontColor,loColor,hiColor,disabledColor){
	this.iType="menu";
	this.x=x;
	this.y=y;
	this.width=w;
	this.z=0;
	this.index=In_MenuList.length;
	this.open=false;
	this.fullWidth=500;
	this.text=text;
	this.url=-1;
	this.opacity=opacity;
	this.fontSize=fontSize;
	this.fontColor=fontColor;
	this.hiColor=hiColor;
	this.loColor=loColor;
	this.disabledColor=disabledColor||'#000000';
	this.parent=null;
	this.child=new Array();
	this.childIX=new Array();
	this.element=new Array();
	this.uLayer=new Array();
	this.oLayer=new Array();
	this.raw=null;
	this.add=In_MenuAdd;
	this.openClose=In_MenuOpenClose;
	this.treeClose=In_MenuTreeClose;
	this.hiLo=In_MenuHiLo;
	this.doUrl=In_MenuDoUrl;
	In_MenuList[In_MenuList.length]=this;
	return this;
}

function In_MenuDoUrl(x){
	if(this.element[x].enabled){
		this.treeClose();
		eval(this.element[x].url);
	}
}

function In_MenuTreeClose(){
	var t=this;
	while((t.parent)&&(t.parent.iType=='menu')) t=t.parent;
	t.openClose(true);
}

function In_MenuOpenClose(force,special){
	var n,f=force,s=special;
	if(In_LMenuTimer){
		clearTimeout(In_LMenuTimer);
		In_LMenuTimer=null;
	}
	if(f!=null)	this.open=f;
	if(s){
		if(!this.open){
			for(n=0;n<In_MenuList.length;n++){
				if(In_MenuList[n].open&&In_MenuList[n]!=this)
					In_MenuList[n].openClose(true);
			}
		}
	}
	if(this.open){
		this.open=false;
		for(n=0;n<this.uLayer.length;n++) this.hiLo(n,0);
		for(n=1;n<this.uLayer.length;n++){
			if(this.uLayer[n]){
				if(Gl_browser.ns4){
					this.uLayer[n].visibility="hidden";
					this.oLayer[n].visibility="hidden";
				}else{
					this.uLayer[n].style.visibility="hidden";
					this.oLayer[n].style.visibility="hidden";
				}
			}
		}
		for(n=0;n<this.child.length;n++)
			this.child[n].openClose(true)
	}else{
		this.open=true;
		var t=this;
		while(t.parent.iType=='menu')
			t=t.parent;
		In_LMenu=t;
		this.hiLo(0,1);
		for(n=1;n<this.uLayer.length;n++){
			if(this.uLayer[n]){
				if(Gl_browser.ns4){
					this.uLayer[n].visibility="visible";
					this.oLayer[n].visibility="visible";
				}else{
					this.uLayer[n].style.visibility="visible";
					this.oLayer[n].style.visibility="visible";
				}
			}
		}
	}
}

function In_MenuHiLo(ix,s){
	Gl_onSpecialItem=(s)?true:false;
	if((s>-1)&&(ix>0)&&(s!=-1)&&(this.element[ix-1].iType=='menuItem'&&!this.element[ix-1].enabled))
		return
	if(In_LMenuTimer){
		clearTimeout(In_LMenuTimer);
		In_LMenuTimer=null;
	}
	if(!this.uLayer[ix])
		return
	var c=this.loColor;
	if(s==1) c=this.hiColor;
	else if(s==-1) c=this.disabledColor;
	if(Gl_browser.ns4)
		this.uLayer[ix].bgColor=c;
	else
		this.uLayer[ix].style.backgroundColor=c;
	if(s==0&&ix>0&&In_LMenu&&In_LMenu.open)
		In_LMenuTimer=setTimeout('In_LMenu.openClose(true)',1000);
}

function In_MenuAdd(){
	for(var n=0;n<arguments.length;n++){
		arguments[n].parent=this;
		arguments[n].ix=this.element.length;
		this.element[this.element.length]=arguments[n]
	}
}

function In_MenuItem(text,url,enabled){
	this.iType="menuItem";
	this.text=text;
	this.url=url;
	this.enabled=enabled;
	this.child=null;
	this.parent=null;
	this.ix=-1;
	this.setAction=In_MenuItemSetAction;
	this.enable=In_MenuItemEnable;
	this.disable=In_MenuItemDisable
	return this;
}

function In_MenuItemSetAction(x){this.url=x}
function In_MenuItemEnable(){this.enabled=true;this.parent.hiLo(this.ix+1,0)}
function In_MenuItemDisable(){this.enabled=false;this.parent.hiLo(this.ix+1,-1)}

function In_NumericDisplay(x,y,d,f){
	this.iType="nDisplay";
	this.x=x;
	this.y=y;
	this.z=0;
	this.digits=d;
	this.face=f;
	this.on=false;
	this.value=0;
	this.leftClip=0;
	this.rightClip=0
	this.resetValue=0;
	this.digitLayer=new Array();
	this.digitPosition=new Array();
	this.setValue=ND_setValue;
	this.setResetValue=ND_setResetValue;
	this.reset=ND_reset;
	this.getValue=ND_getValue;
	return this;
}

function ND_getValue(){return this.value}
function ND_reset(){this.setValue(this.resetValue)}
function ND_setResetValue(x){this.resetValue=x}
function ND_setValue(x){
	var n,t;
	this.value=x;
	for(n=this.digits-1;n>-1;n--){
		t=x%10;
		if(this.digitPosition[n]!=t){
			if(Gl_browser.ns4){
				this.digitLayer[n].top=this.y-(20*t);
				this.digitLayer[n].clip.top=20*t;
				this.digitLayer[n].clip.bottom=20*(t+1);
			}else
				this.digitLayer[n].style.backgroundPosition=-this.leftClip+'px '+(-(20*t))+'px';
			this.digitPosition[n]=t
		}
		x=Math.floor(x/10);
	}
}