var   Sp_totalsprites=0,
	Sp_xoffset=0,
	Sp_yoffset=0,
	Gl_version=1.997,
	Gl_n=0,
	Gl_STT=null,
	Gl_speedTestDiv=null,
	Gl_speedTestFinish=false,
	Gl_callBack='',
	Gl_fps=0,
	Gl_layers=new Array(),
	Gl_totalpreimages=0,
	Gl_interval=null,
	Gl_hooked=new Array(),
	Gl_preimage=new Array(),
	Gl_ticker=0,
	Gl_sin=new Array(),
	Gl_cos=new Array(),
	Gl_cookies=new Array(),
	Gl_layer_index=0,
	Gl_iebuffer=null,
	Gl_firstlayer=true,
	Gl_loadwait=null,
	Gl_movedata=null,
	Gl_loadtimer=0,
	Gl_loadattempts=0,
	Gl_f=new Array(),
	Gl_flength=0,
	Gl_timerSpeed=50,
	Gl_browser=null,
	Gl_onSpecialItem=false;
function Gl_preloader(img){var x=Gl_totalpreimages++;Gl_preimage[x]=new Image;Gl_preimage[x].src=img}
function Gl_hook(fnc){Gl_hooked[Gl_hooked.length]=fnc}
function Gl_unhook(fnc){var fnd=false;for(var n=0;n<Gl_hooked.length;n++) if(Gl_hooked[n]==fnc){fnd=true;break}if(fnd){for(var i=n;i<Gl_hooked.length-1;i++) Gl_hooked[i]=Gl_hooked[i+1];Gl_hooked.length--}}
function Gl_start(){if(Gl_browser.panic){Gl_alert('Gl_start()','Error! Gamelib could not start!');return}Gl_interval=setInterval("Gl_loop()",Gl_timerSpeed)}
function Gl_stop(){clearInterval(Gl_interval)}
function Gl_setTimerSpeed(x){Gl_stop();Gl_timerSpeed=x;Gl_start()}
function Gl_makedegs(){for(n=0;n<360;n++){Gl_sin[n]=(Math.sin(3.14159*n/180));Gl_cos[n]=-(Math.cos(3.14159*n/180))}}
function Gl_get_cookies(){var tar=document.cookie.split("; ");for(var n=0;n<tar.length;n++) Gl_cookies[n]=new Gl_Cookie_construct(tar[n])}
function Gl_Cookie_construct(Gl_var){var tmp=Gl_var.split("=");this.name=unescape(tmp[0]);this.value=unescape(tmp[1])}
function Gl_set_cookie(Gl_value){document.cookie=this.name+"="+escape(Gl_value)+"; expires= Wed, 1 May 2030 23:00:00 UTC; path=/";this.value=Gl_value;return true}
function Gl_delete_cookie(){for(var n=0;n<Gl_cookies.length;n++){if(Gl_cookies[n].name==this.name){this.value=null;document.cookie=this.name+"=; expires= Mon, 3 Jan 2000 00:00:00 UTC; path=/";Gl_cookies[n].name="";Gl_cookies[n].value="";break}}return true}
function Gl_get_cookie(c_name){for(var n=0;n<Gl_cookies.length;n++){if(Gl_cookies[n].name==c_name){return Gl_cookies[n].value}}return null}
function Gl_cookie(Gl_name){this.name=Gl_name;this.value=Gl_get_cookie(Gl_name);this.setvalue=Gl_set_cookie;this.erase=Gl_delete_cookie}
function Gl_get_window_height(){if(Gl_browser.ie) return windowheight=document.body.offsetHeight;else return windowheight=window.innerHeight}
function Gl_get_window_width(){if(Gl_browser.ie) return windowwidth=document.body.offsetWidth;else return windowwidth=window.innerWidth}
function Gl_get_window_scrollX(){if(Gl_browser.ie) return document.body.scrollLeft;else return window.scrollX}
function Gl_get_window_scrollY(){if(Gl_browser.ie) return document.body.scrollTop;else return window.scrollY}
function Gl_scrollWindow(x,y){window.scrollTo(x,y)}
function Gl_scrollbars(Gl_a){Gl_a=Gl_a.toLowerCase();if(Gl_a=="off") Gl_a="no";else if(Gl_a=="on") Gl_a="yes";if(Gl_a=="yes"||Gl_a=="no"){if(Gl_browser.ie) document.body.scroll=Gl_a}}
function Gl_layer(Gl_xstart,Gl_ystart,Gl_w,Gl_html){this.on=true;this.mouse=true;this.x=Gl_xstart;this.y=Gl_ystart;this.z=Gl_layer_index;this.xmax=1000;this.xmin=0;this.ymax=1000;this.ymin=0;this.URL="";this.lock=null;this.lockxoff=0;this.lockyoff=0;this.innerHTML=Gl_html;this.draggable=false;this.dragnormal=true;this.dragvert=false;this.draghoriz=false;this.onmouseover="";this.onmouseout="";this.onclickup="";this.onclickdown="";this.opacity=100;this.clipleft=0;this.clipright=0;this.cliptop=0;this.clipbottom=0;this.clipped=false;this.following=null;this.followingx=0;this.followingy=0;this.followingox=-1000;this.followingoy=-1000;this.alive=true;this.index=Gl_layer_index;if(Gl_browser.ie){if(Gl_firstlayer){document.body.insertAdjacentHTML("BeforeEnd",'<iframe id="buffer" border=0 frameborder=no width=1 height=1 scrolling=no src="" style="position:absolute; left:0; top: -20; visibility:hidden"></iframe>');Gl_iebuffer=document.frames["buffer"];Gl_firstlayer=false}this.raw=genDiv(Gl_xstart,Gl_ystart,Gl_w,"Adiv",Gl_layer_index,Gl_html);this.ob=this.raw.style;this.width=this.raw.clientWidth;this.height=this.raw.clientHeight;this.write=Gl_layerwriteIE;this.append=Gl_layerappendIE;this.moveTo=Gl_movetoIE;this.clip=Gl_obclipIE;this.load=Gl_loadIE;this.resizeTo=Gl_layerresizeIE;this.setBgcolor=Gl_setbgcolorIE;this.setBackground=Gl_setbackgroundIE;this.setOpacity=Gl_setOpacityIE}else if(Gl_browser.dom2){var addTo=document.getElementsByTagName("body").item(0);if(Gl_firstlayer){var f=document.createElement("IFRAME");f.setAttribute("id",'buffer');f.setAttribute("name",'buffer');f.setAttribute("style","position:absolute;left:-1000px;top:-1000px;width:1px;height:1px;visibility:visible");f.setAttribute("src",'');f.src='';f.id='buffer';f.name='buffer';f.width=1;f.height=1;f.style.position="absolute";f.style.overflow="hidden";f.style.visibility="visible";addTo.appendChild(f);f.style.left='-1000px';f.style.top='-1000px';Gl_iebuffer=document.getElementById('buffer');Gl_firstlayer=false}this.raw=genDiv(Gl_xstart,Gl_ystart,Gl_w,"Adiv",Gl_layer_index,Gl_html,addTo);this.ob=this.raw.style;this.width=this.raw.offsetWidth;this.height=this.raw.offsetHeight;this.write=Gl_layerwriteIE;this.append=Gl_layerappendIE;this.moveTo=Gl_movetoDOM2;this.setBgcolor=Gl_setbgcolorIE;this.clip=Gl_obclipDOM2;this.setOpacity=Gl_setOpacityDOM2;this.setBackground=Gl_setbackgroundIE;this.resizeTo=Gl_layerresizeDOM2;this.load=Gl_loadDOM2}else if(Gl_browser.ns4){this.raw=genDiv(Gl_xstart,Gl_ystart,Gl_w,"Adiv",Gl_layer_index,Gl_html);this.ob=this.raw;this.width=this.ob.clip.width;this.height=this.ob.clip.height;this.write=Gl_layerwriteNS;this.append=Gl_layerappendNS;this.moveTo=Gl_movetoNS;this.clip=Gl_obclipNS;this.load=Gl_loadNS;this.resizeTo=Gl_layerresizeNS;this.setBgcolor=Gl_setbgcolorNS;this.setBackground=Gl_setbackgroundNS;this.setOpacity=Gl_null}this.lockLayer=Gl_locklayer;this.unlockLayer=Gl_unlocklayer;this.dragType=Gl_dragtype;this.makeDraggable=Gl_makeDraggable;this.makeUndraggable=Gl_makeUndraggable;this.setZ=Gl_setz;this.hide=Gl_hide;this.show=Gl_show;this.setXlimits=Gl_setxlimits;this.setYlimits=Gl_setylimits;this.follow=Gl_layerfollow;this.stopFollowing=Gl_stoplayerfollow;this.Gl_index=Gl_layer_index++;Gl_layers[Gl_layers.length]=this;return this}
function genDiv(x,y,w,baseName,index,html,parent){
	var ob;
	if(Gl_browser.ns4){
		if(!parent) document[baseName+index]=ob=new Layer(w);
		else document[baseName+index]=ob=new Layer(w,parent);
		ob.name=index;
		ob.height=0;
		ob.left=x;
		ob.top=y;
		ob.layers=new Array();
		ob.zIndex=index;
		ob.visibility="show";
		ob.document.open();
		ob.document.write(html);
		ob.document.close();
		return ob
	}else if(Gl_browser.ie){
		if(parent) parent.insertAdjacentHTML("BeforeEnd",'<div id="'+baseName+index+'" style="position:absolute;left:'+x+';top:'+y+';width:'+w+';visibility:visible;z-index:'+index+'">\n'+html+'\n</div>\n');
		else document.body.insertAdjacentHTML("BeforeEnd",'<div id="'+baseName+index+'" style="position:absolute;left:'+x+';top:'+y+';width:'+w+';visibility:visible;overflow:hidden;z-index:'+index+'">\n'+html+'\n</div>\n');
		return document.all[baseName+index]
	}else if(Gl_browser.dom2){
		var obj=document.createElement('DIV');
		obj.setAttribute("style","position:absolute;left:-1000;top:-1000;overflow:hidden;z-index:"+index);
		obj.setAttribute("id",baseName+index);
		obj.innerHTML=html+"\n";
		if(parent) parent.appendChild(obj);
		else document.getElementsByTagName("body").item(0).appendChild(obj);
		obj.style.position="absolute";
		obj.style.left=x+"px";
		obj.style.top=y+"px";
		obj.style.width=w+'px';
		return document.getElementById(baseName+index)
	}
}

function Gl_setbackgroundNS(Gl_i){this.ob.background.src=Gl_i}
function Gl_setbackgroundIE(Gl_i){this.ob.backgroundImage="url("+Gl_i+")"}
function Gl_makeDraggable(){this.draggable=true}
function Gl_makeUndraggable(){this.draggable=false;this.dragnormal=true}
function Gl_layerresizeIE(Gl_w,Gl_h){this.ob.width=Gl_w;this.ob.height=Gl_h;this.ob.clip="rect(0 "+Gl_w+" "+Gl_h+" 0)";this.width=Gl_w;this.height=Gl_h;this.clipped=true;this.cliptop=0;this.clipbottom=Gl_h;this.clipleft=0;this.clipright=Gl_w}
function Gl_layerresizeNS(Gl_w,Gl_h){this.ob.width=Gl_w;this.ob.height=Gl_h;this.ob.clip.left=0;this.ob.clip.right=Gl_w;this.ob.clip.top=0;this.ob.clip.bottom=Gl_h;this.width=Gl_w;this.height=Gl_h;this.clipped=true;this.cliptop=0;this.clipbottom=Gl_h;this.clipleft=0;this.clipright=Gl_w}
function Gl_layerresizeDOM2(Gl_w,Gl_h){this.ob.width=Gl_w+'px';this.ob.height=Gl_h+'px';this.ob.clip="rect(0px,"+Gl_w+"px,"+Gl_h+"px,0)";this.width=Gl_w;this.height=Gl_h;this.clipped=true;this.cliptop=0;this.clipbottom=Gl_h;this.clipleft=0;this.clipright=Gl_w}
function Gl_layerfollow(Gl_ob,Gl_x,Gl_y){this.followingx=Gl_x;this.followingy=Gl_y;if(Gl_ob.alive){this.following=Gl_ob;this.draggable=false;Gl_ob.followedby[Gl_ob.followedby.length]=this;Gl_ob.beingfollowed=true}else alert("Error!\nLayer cannot follow object (not a sprite or mouse!). Check code!")}
function Gl_stoplayerfollow(){var f=false;for(var n=0;n<this.following.followedby.length;n++){if(this.following.followedby[n]==this){f=true;break}}if(f){for(var n2=n;n2<this.following.followedby.length-1;n2++) this.following.followedby[n2]=this.following.followedby[n2+1];if(--this.following.followedby.length==0) this.following.beingfollowed=false}}
function Gl_layerwriteIE(Gl_txt){this.raw.innerHTML=Gl_txt+"\n";this.innerHTML=Gl_txt;if(!this.clipped){this.width=this.raw.clientWidth;this.height=this.raw.clientHeight;this.moveTo(this.x,this.y)}}
function Gl_layerappendIE(Gl_txt,Gl_pos){if(Gl_pos && Gl_pos<this.innerHTML.length){var Gl_tmp=this.innerHTML.substring(0,Gl_pos)+Gl_txt+this.innerHTML.substring(Gl_pos,this.innerHTML.length);this.innerHTML=Gl_tmp;this.raw.innerHTML=Gl_tmp}else{this.innerHTML+=Gl_txt;this.raw.innerHTML=this.innerHTML}if(!this.clipped){this.width=this.raw.clientWidth;this.height=this.raw.clientHeight;this.moveTo(this.x,this.y)}}
function Gl_layerappendNS(Gl_txt,Gl_pos){if(Gl_pos && Gl_pos<this.innerHTML.length){var Gl_tmp=this.innerHTML.substring(0,Gl_pos)+Gl_txt+this.innerHTML.substring(Gl_pos,this.innerHTML.length);this.innerHTML=Gl_tmp}else this.innerHTML+=Gl_txt;this.ob.document.open();this.ob.document.write(this.innerHTML);this.ob.document.close();if(!this.clipped){this.width=this.raw.clip.width;this.height=this.raw.clip.height;this.moveTo(this.x,this.y)}}
function Gl_layerwriteNS(Gl_txt){this.ob.width=0;this.ob.height=0;this.ob.document.open();this.ob.document.write(Gl_txt);this.ob.document.close();this.innerHTML=Gl_txt;if(!this.clipped){this.width=this.raw.clip.width;this.height=this.raw.clip.height;this.moveTo(this.x,this.y)}}
function Gl_movetoNS(Gl_x,Gl_y){if(Gl_x>this.xmax-this.width) Gl_x=this.xmax-this.width;if(Gl_y>this.ymax-this.height) Gl_y=this.ymax-this.height;if(Gl_x<this.xmin) Gl_x=this.xmin;if(Gl_y<this.ymin) Gl_y=this.ymin;this.ob.moveTo(Gl_x,Gl_y);this.x=Gl_x;this.y=Gl_y;if(this.lock!=null) this.lock.moveTo(this.x+this.lockxoff,this.y+this.lockyoff)}
function Gl_movetoIE(Gl_x,Gl_y){if(Gl_x>this.xmax-this.width) Gl_x=this.xmax-this.width;if(Gl_y>this.ymax-this.height) Gl_y=this.ymax-this.height;if(Gl_x<this.xmin) Gl_x=this.xmin;if(Gl_y<this.ymin) Gl_y=this.ymin;this.ob.posTop=Gl_y;this.ob.posLeft=Gl_x;this.x=Gl_x;this.y=Gl_y;if(this.lock!=null) this.lock.moveTo(this.x+this.lockxoff,this.y+this.lockyoff)}
function Gl_movetoDOM2(Gl_x,Gl_y){if(Gl_x>this.xmax-this.width) Gl_x=this.xmax-this.width;if(Gl_y>this.ymax-this.height) Gl_y=this.ymax-this.height;if(Gl_x<this.xmin) Gl_x=this.xmin;if(Gl_y<this.ymin) Gl_y=this.ymin;this.ob.top=Gl_y+'px';this.ob.left=Gl_x+'px';this.x=Gl_x;this.y=Gl_y;if(this.lock!=null) this.lock.moveTo(this.x+this.lockxoff,this.y+this.lockyoff)}
function Gl_setxlimits(x1,x2){this.xmin=x1;this.xmax=x2;if(this.x<this.xmin) this.x=this.xmin;else if(this.x+this.width>this.xmax) this.x=this.xmax-this.width;this.moveTo(this.x,this.y)}
function Gl_setylimits(y1,y2){this.ymin=y1;this.ymax=y2;if(this.y<this.ymin) this.y=this.ymin;else if(this.y+this.height>this.ymax) this.y=this.ymax-this.height;this.moveTo(this.x,this.y)}
function Gl_setz(Gl_z){this.ob.zIndex=Gl_z;this.z=Gl_z}
function Gl_show(){this.ob.visibility="visible"}
function Gl_hide(){this.ob.visibility="hidden"}
function Gl_get_heightIE(){return this.raw.clientHeight}
function Gl_get_heightNS(){return this.raw.clip.height}
function Gl_get_widthIE(){return this.raw.clientWidth}
function Gl_get_widthNS(){return this.raw.clip.width}
function Gl_obclipNS(Gl_left,Gl_right,Gl_top,Gl_bottom){this.ob.clip.left=Gl_left;this.ob.clip.right=Gl_right;this.ob.clip.top=Gl_top;this.ob.clip.bottom=Gl_bottom;this.clipleft=Gl_left;this.cliptop=Gl_top;this.clipright=Gl_right;this.clipbottom=Gl_bottom;this.clipped=true}
function Gl_obclipIE(Gl_left,Gl_right,Gl_top,Gl_bottom){this.ob.clip="rect("+Gl_top+","+Gl_right+","+Gl_bottom+","+Gl_left+")";this.clipleft=Gl_left;this.cliptop=Gl_top;this.clipright=Gl_right;this.clipbottom=Gl_bottom;this.clipped=true}
function Gl_obclipDOM2(Gl_left,Gl_right,Gl_top,Gl_bottom){this.ob.clip="rect("+Gl_top+"px,"+Gl_right+"px,"+Gl_bottom+"px,"+Gl_left+"px)";this.clipleft=Gl_left;this.cliptop=Gl_top;this.clipright=Gl_right;this.clipbottom=Gl_bottom;this.clipped=true}
function Gl_loadNS(Gl_file,Gl_st){window.status="Loading layer, attempt "+(Gl_loadattempts+1)+"...";Gl_loadtimer=0;if(Gl_loadattempts==3){Gl_loadwait=null;Gl_loadattempts=0;return}Gl_app="";if(Gl_loadwait==null){this.ob.height=0;this.URL=Gl_file;Gl_movedata=this;if(Gl_st) Gl_app="?"+(Math.floor(Math.random()*999999));this.ob.load(Gl_file+Gl_app,this.width);Gl_loadwait=setTimeout("Gl_wait_for_loadNS()",200)}}
function Gl_loadIE(Gl_file,Gl_st){window.status="Loading layer, attempt "+(Gl_loadattempts+1)+"...";Gl_loadtimer=0;if(Gl_loadattempts==3){Gl_loadwait=null;Gl_loadattempts=0;return}Gl_app="";if(Gl_loadwait==null){this.URL=Gl_file;if(Gl_st) Gl_app="?"+(Math.floor(Math.random()*999999));if(Gl_iebuffer.document.body) Gl_iebuffer.document.body.innerHTML="";Gl_iebuffer.document.location.href=Gl_file+Gl_app;Gl_movedata=this;Gl_loadwait=setTimeout("Gl_wait_for_loadIE()",200)}}
function Gl_loadDOM2(Gl_file,Gl_st){window.status="Loading layer, attempt "+(Gl_loadattempts+1)+"...";Gl_loadtimer=0;if(Gl_loadattempts==3){Gl_loadwait=null;Gl_loadattempts=0;return}Gl_app="";if(Gl_loadwait==null){this.URL=Gl_file;if(Gl_st) Gl_app="?"+(Math.floor(Math.random()*999999));Gl_iebuffer.innerHTML="";Gl_iebuffer.src=Gl_file+Gl_app;Gl_movedata=this;Gl_loadwait=setTimeout("Gl_wait_for_loadDOM2()",200)}}
function Gl_wait_for_loadDOM2(){clearTimeout(Gl_loadwait);Gl_loadwait=null;var Gl_in=""+window.frames["buffer"].document.body.innerHTML;if(Gl_in.length>10!=-1){Gl_loadattempts=0;Gl_movedata.raw.innerHTML=Gl_in;Gl_movedata.innerHTML=Gl_in;Gl_movedata.width=Gl_movedata.raw.offsetWidth;Gl_movedata.height=Gl_movedata.raw.offsetHeight;Gl_movedata.moveTo(Gl_movedata.x,Gl_movedata.y);window.status="Done";this.clipped=false}else if(Gl_loadtimer++==100) Gl_loadCOM2(Gl_movedata.URL,true);else Gl_loadwait=setTimeout("Gl_wait_for_loadDOM2()",200)}
function Gl_wait_for_loadIE(){clearTimeout(Gl_loadwait);Gl_loadwait=null;var Gl_in=""+Gl_iebuffer.document.body.outerHTML.toLowerCase();if(Gl_in.length>100&&Gl_in.indexOf('</body>')!=-1){Gl_loadattempts=0;Gl_movedata.raw.innerHTML="";Gl_movedata.ob.height=0;Gl_movedata.ob.clientHeight=0;Gl_movedata.ob.scrollHeight=0;Gl_movedata.raw.innerHTML=Gl_iebuffer.document.body.innerHTML;Gl_movedata.innerHTML=Gl_iebuffer.document.body.innerHTML;Gl_movedata.width=Gl_movedata.raw.clientWidth;Gl_movedata.height=Gl_movedata.raw.clientHeight;Gl_movedata.moveTo(Gl_movedata.x,Gl_movedata.y);window.status="Done";this.clipped=false}else if(Gl_loadtimer++==100) Gl_loadIE(Gl_movedata.URL,true);else Gl_loadwait=setTimeout("Gl_wait_for_loadIE()",200)}
function Gl_wait_for_loadNS(){clearTimeout(Gl_loadwait);Gl_loadwait=null;if(Gl_movedata.ob.clip.height>0){Gl_loadattempts=0;Gl_movedata.width=Gl_movedata.ob.clip.width;Gl_movedata.height=Gl_movedata.ob.clip.height;Gl_movedata.innerHTML="";Gl_movedata.moveTo(Gl_movedata.x,Gl_movedata.y);window.status="Done";this.clipped=false}else if(Gl_loadtimer++==100) Gl_loadNS(Gl_movedata.URL,true);else Gl_loadwait=setTimeout("Gl_wait_for_loadNS()",200)}
function Gl_setbgcolorIE(Gl_a){this.ob.backgroundColor=Gl_a}
function Gl_setbgcolorNS(Gl_a){this.ob.bgColor=Gl_a}
function Gl_setOpacityIE(Gl_a){if(Gl_a<100){this.ob.filter="alpha(opacity="+Gl_a+")";this.opacity=Gl_a}else{this.ob.filter="";this.opacity=100}}
function Gl_setOpacityDOM2(Gl_a){this.ob.MozOpacity=Gl_a+"%";this.opacity=Gl_a}
function Gl_locklayer(Gl_a){this.lock=Gl_a;this.lockxoff=Gl_a.x-this.x;this.lockyoff=Gl_a.y-this.y}
function Gl_unlocklayer(){this.lock=null}
function Gl_dragtype(Gl_a){this.dragnormal=this.dragvert=this.draghoriz=false;if(Gl_a==0||(isNaN(Gl_a)&&Gl_a.toLowerCase()=="normal")) this.dragnormal=true;else if(Gl_a==1||(isNaN(Gl_a)&&Gl_a.toLowerCase()=="vertical")) this.dragvert=true;else if(Gl_a==2||(isNaN(Gl_a)&&Gl_a.toLowerCase()=="horizontal")) this.draghoriz=true}
function Gl_null(){}

function Gl_loop(){Sp_spritesonscreen=0;var sp=null,sx=0,sy=0,sp2=null,sz=0,n;var mainMove=((Sp_xoffset!=Sp_cxoffset)||(Sp_yoffset!=Sp_cyoffset))?true:false;for(n=0;n<Sp_totalsprites;n++){sp=Sp_sprite[n];if(sp.on){Sp_spritesonscreen++;if(sp.targetting){Sp_x2=sp.targetting.x+sp.targettingx;Sp_y2=sp.targetting.y+sp.targettingy;Gl_Sp_setDirection(sp)}if(sp.routing){if(Math.round(sp.x)==sp.routeToX&&Math.round(sp.y)==sp.routeToY){sp.x=sp.routeToX;sp.y=sp.routeToY;sp.routePos+=2;if(sp.routePos>=sp.route.length){if(sp.routeLoop) sp.routePos=0;else sp.routing=false}sp.routeToX=sp.route[sp.routePos];sp.routeToY=sp.route[sp.routePos+1]}Sp_x2=sp.routeToX;Sp_y2=sp.routeToY;Gl_Sp_setDirection(sp)}sp.x+=sp.xspeed;sp.y+=sp.yspeed;if((sp.x!=sp.cx)||(sp.y!=sp.cy)||mainMove){if((sp.x+sp.width>sp.xmax)&&sp.xdir>0){if(sp.bounces){sp.setDir(-sp.xdir,sp.ydir)}else{sp.x=sp.xmax-sp.width;sp.setDir(0,sp.ydir)}}else if(sp.x<sp.xmin&&sp.xdir<0){if(sp.bounces){sp.setDir(-sp.xdir,sp.ydir)}else{sp.x=sp.xmin;sp.setDir(0,sp.ydir)}}if((sp.y+sp.height>sp.ymax)&&sp.ydir>0){if(sp.bounces){sp.setDir(sp.xdir,-sp.ydir)}else{sp.y=sp.ymax-sp.height;sp.setDir(sp.xdir,0)}}else if(sp.y<sp.ymin&&sp.ydir<0){if(sp.bounces){sp.setDir(sp.xdir,-sp.ydir)}else{sp.y=sp.ymin;sp.setDir(sp.xdir,0)}}}if(sp.beingfollowed)for(Sp_x=0;Sp_x<sp.followedby.length;Sp_x++){Sp_a=sp.followedby[Sp_x];Sp_a.moveTo(sp.x+Sp_a.followingx,sp.y+Sp_a.followingy)}if(sp.animspd>0&&sp.animtmr--==1&&sp.crepeat!=sp.animrepeat){				sp.animtmr=sp.animspd;sp.animpos+=sp.animd;if(sp.animpos<0)sp.animpos=sp.animsend;else if(sp.animpos==sp.anims)sp.animpos=sp.animsstart;				sp.setAnimation(sp.animpos);if(sp.animrepeat!=-1) sp.crepeat++}else sp.moveTo_l()}	}Sp_cxoffset=Sp_xoffset;Sp_cyoffset=Sp_yoffset;for(n=0;n<Gl_hooked.length;n++)eval(Gl_hooked[n]);Gl_ticker++}

function Gl_Sp_setDirection(sp){Sp_x1=sp.x;Sp_y1=sp.y;if(Math.abs(Sp_x1-Sp_x2)>Math.abs(Sp_y1-Sp_y2)){Sp_Spd=(Math.abs(Sp_x1-Sp_x2)<sp.speed)?Math.abs(Sp_x1-Sp_x2):sp.speed;Sp_ya=(Sp_x1-Sp_x2!=0)?Sp_x1-Sp_x2:1;sp.xdir=(Sp_ya>0)?-1:1;sp.ydir=-(Sp_y1-Sp_y2)/Math.abs(Sp_ya)}else{Sp_Spd=(Math.abs(Sp_y1-Sp_y2)<sp.speed)?Math.abs(Sp_y1-Sp_y2):sp.speed;Sp_xa=(Sp_y1-Sp_y2!=0)?Sp_y1-Sp_y2:1;sp.ydir=(Sp_xa>0)?-1:1;sp.xdir=-(Sp_x1-Sp_x2)/Math.abs(Sp_xa)}if(sp.fbdSet){sp.xydegs=Math.round(360*((Math.atan2(-sp.xdir,sp.ydir)+3.14159)/6.28318));if(sp.xydegs==360) sp.xydegs=0;if(sp.frame!=sp.fbd[sp.xydegs])sp.setFrame(sp.fbd[sp.xydegs])}sp.xspeed=sp.xdir*Sp_Spd;sp.yspeed=sp.ydir*Sp_Spd}
function Gl_getBrowser(){this.ie=this.ie5=this.ie6=this.ns=this.ns4=this.ns6=this.unix=this.webtv=this.apple=this.dom2=false;this.panic=true;var ua=navigator.userAgent.toLowerCase();var ver=parseInt(navigator.appVersion);if(ua.indexOf('opera')!=-1) return this;if(ua.indexOf('webtv')!=-1&&document.all){this.webtv=true;return this}if(ua.indexOf('mac')!=-1||ua.indexOf('apple')!=-1) this.apple=true;if(navigator.userAgent.indexOf('X11')!=-1) this.unix=true;if(ua.indexOf("msie")!=-1){if(document.all){this.ie=true;this.panic=false}if(ua.indexOf("msie 5")!=-1){this.ie5=true;this.dom2=true;this.panic=false;}if(ua.indexOf("msie 6")!=-1){this.ie6=true;this.dom2=true;this.panic=false}}else if(ua.indexOf("mozilla")!=-1){this.ns=true;if(document.layers){this.ns4=true;this.panic=false}if(!this.ie&&this.ns&&(ver>4)){this.ns6=true;this.dom2=true;this.panic=false}}if(document.getElementById){this.dom2=true;this.panic=false}return this}
function Gl_styleSheet(){var html='<style type="text/css">\n';html+='</style>';document.write(html)}
function Gl_calibrate(callBackFunc,fps){var d=null;Gl_callBack=callBackFunc;d=genDiv(0,0,200,"STdiv",Gl_layer_index++,'<table border=0><tr><td bgcolor="#444444" NOWRAP><font color="#ffffff" face="sans-serif" size=3>Gamelib Speed Calibration</font></td></tr></table>');if(Gl_browser.ns4)Gl_speedTestDiv=d;else Gl_speedTestDiv=d.style;Gl_n=fps*5;Gl_fps=1000/fps;Gl_speedTestFinish=false;Gl_STT=setInterval('Gl_speedTestFinish=true',5000);setTimeout('Gl_speedTestLoop()',1)}
function Gl_speedTestLoop(){if(Gl_browser.panic){Gl_alert('Gl_speedTestLoop()','Error! Could not start speed test!');return}Gl_speedTestDiv.top=85-Math.floor((Math.cos(3.14159*(250-Gl_n)/180))*100);Gl_n--;if(!Gl_speedTestFinish)setTimeout('Gl_speedTestLoop()',Gl_fps);else{Gl_timerSpeed=Gl_fps-Math.round(Gl_n/5);Gl_speedTestDiv.top=-100;Gl_speedTestDiv.visibility="hidden";setTimeout(Gl_callBack,1)}}
function Gl_alert(f,t){Gl_browser.panic=true;alert('Gamelib Alert: Error using method "'+f+'"\n\n'+t);Gl_stop()}
Gl_browser=new Gl_getBrowser;Gl_styleSheet();Gl_makedegs();Gl_get_cookies();