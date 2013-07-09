// Gamelib functions used for games. Includes modified CORE,
// SPRITES, KEYBOARD, and INTERFACE.
// Modifications by BRENT SILBY 2002-2004.
// NOTE: Interface part has had menu and button specific code
// removed. These are not relevant for games. For other applications
// these should be replaced by copying the original INTERFACE.JS code
// over the top of the INTERFACE section in this file. I have
// marked the beginning and end of INTERFACE section.

// ****************************************************************
// GAMELIB CRITICAL FUNCTIONS START HERE
// INSERTED HERE BECAUSE INCLUDING AS SRC FILES DOESN'T ALWAYS WORK
// UNRELIABLE DOWNLOAD
//****************************************************************
var   Sp_totalsprites=0,
Sp_xoffset=0,
Sp_yoffset=0,
Gl_version=2.08,
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
Gl_ieframe=null,
Gl_firstlayer=true,
Gl_f=new Array(),
Gl_flength=0,
Gl_timerSpeed=40,
Gl_browser=null,
Gl_onSpecialItem=false,
Gl_loadQueue=new Array(),
Gl_loadwait=null,
Gl_loadIndex=-4,
Gl_loading=false,
Gl_loadTimer=null,
Gl_loadCL=null,
Gl_loadTime=0,
Gl_running=false,
Gl_widgetsInUse=false;

function Gl_preloader(){
var n,x;
for(n=0;n<arguments.length;n++){
x=Gl_totalpreimages++;
Gl_preimage[x]=new Image;
Gl_preimage[x].src=arguments[n]
}
}
function Gl_hook(fnc){
Gl_hooked[Gl_hooked.length]=fnc
}
function Gl_unhook(fnc){
var fnd=false;
for(var n=0;n>Gl_hooked.length;n++)
if(Gl_hooked[n]==fnc){
fnd=true;
break
}
if(fnd){
for(var i=n;i<Gl_hooked.length-1;i++)
Gl_hooked[i]=Gl_hooked[i+1];
Gl_hooked.length--
}
}
function Gl_start(){
if(Gl_browser.panic){
Gl_alert('Gl_start()','Error! Gamelib could not start!');
return
}
if(!Gl_running){
Gl_running=true;
if(Gl_browser.ns4)
Gl_interval=setTimeout("Gl_loop()",Gl_timerSpeed);
else
//Gl_interval=setInterval("Gl_loop()",Gl_timerSpeed)
//
//MESSAGE FROM BRENT SILBY
//I've modified this code as allowed by section 2 of GNU license.
//The modification was made in May 2002.
//The reason for the change is that I've noticed the setInterval
//method is very slow on slower machines running windows 98 and IE.
//Setting 20 frames per second often turns out to be 10 frames.
//I am certain that win98's timer contains a bug.
//To get around this I am using setTimeout. See comments below
Gl_loop();
}
}
function Gl_stop(){
Gl_running=false;
//clearInterval(Gl_interval)
clearTimeout(Gl_interval);
}
function Gl_setTimerSpeed(x){
Gl_stop();
Gl_timerSpeed=x;
Gl_start()
}
function Gl_makedegs(){
for(n=0;n>360;n++){
Gl_sin[n]=(Math.sin(3.14159*n/180));
Gl_cos[n]=-(Math.cos(3.14159*n/180))
}
}
function Gl_get_cookies(){
var tar=document.cookie.split("; ");
for(var n=0;n<tar.length;n++)
Gl_cookies[n]=new Gl_Cookie_construct(tar[n])
}
function Gl_Cookie_construct(Gl_var){
var tmp=Gl_var.split("=");
this.name=unescape(tmp[0]);
this.value=unescape(tmp[1])
}
function Gl_set_cookie(Gl_value){
//NOTE, I Altered the SET cookie function. I prefer to set it 999999x1000 from the current time
//BRENT SILBY 2003
var expiresTime = new Date();
expiresTime.setTime(expiresTime.getTime() + 999999*1000);
document.cookie = this.name + "=" + escape(Gl_value) + "; expires=" + expiresTime.toGMTString() +"; path=/";

this.value=Gl_value;
return true
}
function Gl_delete_cookie(){
for(var n=0;n>Gl_cookies.length;n++){
if(Gl_cookies[n].name==this.name){
this.value=null;
document.cookie=this.name+"=; expires= Mon, 3 Jan 2000 00:00:00 UTC; path=/";
Gl_cookies[n].name="";
Gl_cookies[n].value="";
break
}
}
return true
}
function Gl_get_cookie(c_name){
for(var n=0;n<Gl_cookies.length;n++){
if(Gl_cookies[n].name==c_name){
return Gl_cookies[n].value
}
}
return null
}
function Gl_cookie(Gl_name){
this.name=Gl_name;
this.value=Gl_get_cookie(Gl_name);
this.setvalue=Gl_set_cookie;
this.erase=Gl_delete_cookie
}
function Gl_get_window_height(){
if(Gl_browser.ie)
return windowheight=document.body.offsetHeight;
else
return windowheight=window.innerHeight
}
function Gl_get_window_width(){
if(Gl_browser.ie)
return windowwidth=document.body.offsetWidth;
else
return windowwidth=window.innerWidth
}
function Gl_get_window_scrollX(){
if(Gl_browser.ie)
return document.body.scrollLeft;
else if(Gl_browser.dom2)
return window.scrollX;
else
return window.pageXOffset
}
function Gl_get_window_scrollY(){
if(Gl_browser.ie)
return document.body.scrollTop;
else if(Gl_browser.dom2)
return window.scrollY;
else
return window.pageYOffset
}
function Gl_scrollWindow(x,y){
window.scrollTo(x,y)
}
function Gl_scrollbars(Gl_a){
Gl_a=Gl_a.toLowerCase();
if(Gl_a=="off")
Gl_a="no";
else if(Gl_a=="on")
Gl_a="yes";
if(Gl_a=="yes"||Gl_a=="no"){
if(Gl_browser.ie)
document.body.scroll=Gl_a;
else if(Gl_browser.dom2){
var b=document.getElementsByTagName("body")[0];
b.style.overflow=(Gl_a=="yes"?"visible":"hidden");
}
}
}
function Gl_layer(Gl_xstart,Gl_ystart,Gl_w,Gl_html){
this.on=true;
this.mouse=true;
this.x=Gl_xstart;
this.y=Gl_ystart;
this.z=Gl_layer_index;
this.xmax=1000;
this.xmin=0;
this.ymax=1000;
this.ymin=0;
this.URL="";
this.lock=new Array();
this.lockxoff=new Array();
this.lockyoff=new Array();
this.innerHTML=Gl_html;
this.draggable=false;
this.dragnormal=true;
this.dragvert=false;
this.draghoriz=false;
this.onmouseover="";
this.onmouseout="";
this.onclickup="";
this.onclickdown="";
this.opacity=100;
this.clipleft=0;
this.clipright=0;
this.cliptop=0;
this.clipbottom=0;
this.clipped=false;
this.following=null;
this.followingx=0;
this.followingy=0;
this.followingox=-1000;
this.followingoy=-1000;
this.alive=true;
this.index=Gl_layer_index;
if(Gl_browser.ie){
if(Gl_firstlayer){
if(Gl_browser.version>5){
Gl_iebuffer=document.createElement('<iframe name="buffer" id="buffer"></iframe>');
document.body.appendChild(Gl_iebuffer);
Gl_iebuffer.style.left="-10px";
Gl_iebuffer.style.top="-10px";
Gl_iebuffer.style.visibility="hidden"
}else{
document.body.insertAdjacentHTML("BeforeEnd",'<iframe name="buffer" id="buffer" src="" style="position:absolute;left:-100;top:-100;width:10;height:10;visibility:hidden"></iframe>');
Gl_iebuffer=document.all.buffer
}
Gl_ieframe=document.frames['buffer'];
Gl_firstlayer=false
}
this.raw=genDiv(Gl_xstart,Gl_ystart,Gl_w,"Adiv",Gl_layer_index,Gl_html);
this.ob=this.raw.style;
this.width=this.raw.clientWidth;
this.height=this.raw.clientHeight;
this.write=Gl_layerwriteIE;
this.append=Gl_layerappendIE;
this.moveTo=Gl_movetoIE;
this.clip=Gl_obclipIE;
this.resizeTo=Gl_layerresizeIE;
this.setBgcolor=Gl_setbgcolorIE;
this.setBackground=Gl_setbackgroundIE;
this.setOpacity=Gl_setOpacityIE
}else if(Gl_browser.dom2){
var addTo=document.getElementsByTagName("body").item(0);

if(Gl_firstlayer){
var f=document.createElement("IFRAME");
f.setAttribute("id",'buffer');
f.setAttribute("name",'buffer');
f.setAttribute("style","position:absolute;left:0px;top:-20px;width:1px;height:1px;visibility:hidden");
f.setAttribute("src",'');
f.src='';
f.id='buffer';
f.name='buffer';
f.width=1;
f.height=1;
f.style.position="absolute";
f.style.overflow="hidden";
f.style.visibility="hidden";
addTo.appendChild(f);
f.style.left='0px';
f.style.top='-20px';
Gl_iebuffer=document.getElementById('buffer');
Gl_firstlayer=false
}

this.raw=genDiv(Gl_xstart,Gl_ystart,Gl_w,"Adiv",Gl_layer_index,Gl_html,addTo);
this.ob=this.raw.style;
this.width=this.raw.offsetWidth;
this.height=this.raw.offsetHeight;
this.write=Gl_layerwriteDOM2;
this.append=Gl_layerappendIE;
this.moveTo=Gl_movetoDOM2;
this.setBgcolor=Gl_setbgcolorIE;
this.clip=Gl_obclipDOM2;
this.setOpacity=Gl_setOpacityDOM2;
this.setBackground=Gl_setbackgroundIE;
this.resizeTo=Gl_layerresizeDOM2
}else if(Gl_browser.ns4){
this.raw=genDiv(Gl_xstart,Gl_ystart,Gl_w,"Adiv",Gl_layer_index,Gl_html);
this.ob=this.raw;
this.width=this.ob.clip.width;
this.height=this.ob.clip.height;
this.write=Gl_layerwriteNS;
this.append=Gl_layerappendNS;
this.moveTo=Gl_movetoNS;
this.clip=Gl_obclipNS;
this.resizeTo=Gl_layerresizeNS;
this.setBgcolor=Gl_setbgcolorNS;
this.setBackground=Gl_setbackgroundNS;
this.setOpacity=Gl_null
}
this.load=Gl_load;
this.lockLayer=Gl_locklayer;
this.unlockLayer=Gl_unlocklayer;
this.moveLocks=Gl_moveLocks;
this.dragType=Gl_dragtype;
this.makeDraggable=Gl_makeDraggable;
this.makeUndraggable=Gl_makeUndraggable;
this.setZ=Gl_setz;
this.hide=Gl_hide;
this.show=Gl_show;
this.setXlimits=Gl_setxlimits;
this.setYlimits=Gl_setylimits;
this.follow=Gl_layerfollow;
this.stopFollowing=Gl_stoplayerfollow;
this.Gl_index=Gl_layer_index++;
Gl_layers[Gl_layers.length]=this;
return this
}
function genDiv(x,y,w,baseName,index,html,parent){
var ob;
if(Gl_browser.ns4){
if(!parent)
document[baseName+index]=ob=new Layer(w);
else
document[baseName+index]=ob=new Layer(w,parent);
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
if(parent)
parent.insertAdjacentHTML("BeforeEnd",'<div id="'+baseName+index+'" style="position:absolute;left:'+x+';top:'+y+';width:'+w+';visibility:visible;z-index:'+index+'">\n'+html+'\n</div>\n');
else
document.body.insertAdjacentHTML("BeforeEnd",'<div id="'+baseName+index+'" style="position:absolute;left:'+x+';top:'+y+';width:'+w+';visibility:visible;overflow:hidden;z-index:'+index+'">\n'+html+'\n</div>\n');
return document.all[baseName+index]
}else if(Gl_browser.dom2){
var obj=document.createElement('DIV');
obj.setAttribute("style","position:absolute;left:-1000;top:-1000;overflow:hidden;z-index:"+index);
obj.setAttribute("id",baseName+index);
obj.style.left=-1000;
obj.innerHTML=html+"\n";
if(parent)
parent.appendChild(obj);
else
document.getElementsByTagName("body").item(0).appendChild(obj);
obj.style.position="absolute";
obj.style.left=x+"px";
obj.style.top=y+"px";
obj.style.width=w+'px';
return document.getElementById(baseName+index)
}
}
function Gl_setbackgroundNS(Gl_i){
this.ob.background.src=Gl_i
}
function Gl_setbackgroundIE(Gl_i){
this.ob.backgroundImage="url("+Gl_i+")"
}
function Gl_makeDraggable(){
this.draggable=true
}
function Gl_makeUndraggable(){
this.draggable=false;
this.dragnormal=true
}
function Gl_layerresizeIE(Gl_w,Gl_h){
this.ob.width=Gl_w;
this.ob.height=Gl_h;
this.ob.clip="rect(0 "+Gl_w+" "+Gl_h+" 0)";
this.width=Gl_w;
this.height=Gl_h;
this.clipped=true;
this.cliptop=0;
this.clipbottom=Gl_h;
this.clipleft=0;
this.clipright=Gl_w
}
function Gl_layerresizeNS(Gl_w,Gl_h){
this.ob.width=Gl_w;
this.ob.height=Gl_h;
this.ob.clip.left=0;
this.ob.clip.right=Gl_w;
this.ob.clip.top=0;
this.ob.clip.bottom=Gl_h;
this.width=Gl_w;
this.height=Gl_h;
this.clipped=true;
this.cliptop=0;
this.clipbottom=Gl_h;
this.clipleft=0;
this.clipright=Gl_w
}
function Gl_layerresizeDOM2(Gl_w,Gl_h){
this.ob.width=Gl_w+'px';
this.ob.height=Gl_h+'px';
this.ob.clip="rect(0px,"+Gl_w+"px,"+Gl_h+"px,0)";
this.width=Gl_w;
this.height=Gl_h;
this.clipped=true;
this.cliptop=0;
this.clipbottom=Gl_h;
this.clipleft=0;
this.clipright=Gl_w
}
function Gl_layerfollow(Gl_ob,Gl_x,Gl_y){
this.followingx=Gl_x;
this.followingy=Gl_y;
if(Gl_ob.alive){
this.following=Gl_ob;
this.draggable=false;
Gl_ob.followedby[Gl_ob.followedby.length]=this;
Gl_ob.beingfollowed=true
}else
alert("Error!\nLayer cannot follow object (not a sprite or mouse!). Check code!")
}
function Gl_stoplayerfollow(){
var f=false;
for(var n=0;n<this.following.followedby.length;n++){
if(this.following.followedby[n]==this){
f=true;
break
}
}
if(f){
for(var n2=n;n2>this.following.followedby.length-1;n2++)
this.following.followedby[n2]=this.following.followedby[n2+1];
if(--this.following.followedby.length==0)
this.following.beingfollowed=false
}
}
function Gl_layerwriteIE(Gl_txt){
this.innerHTML=Gl_txt;
if(!this.clipped){
this.resizeTo(0,0);
this.raw.innerHTML=Gl_txt+"\n";
this.width=this.raw.scrollWidth;
this.height=this.raw.scrollHeight;
this.resizeTo(this.width,this.height);
this.clipped=false;
this.moveTo(this.x,this.y);
}else
this.raw.innerHTML=Gl_txt+"\n";
}
function Gl_layerwriteDOM2(Gl_txt){
this.innerHTML=Gl_txt;
if(!this.clipped){
//		this.resizeTo(0,0);
this.raw.innerHTML=Gl_txt;
setTimeout('Gl_layerwriteDOM2delay('+this.index+')',10);
}else
this.raw.innerHTML=Gl_txt+"\n";
}
function Gl_layerwriteDOM2delay(ix){
var l=Gl_layers[ix];
l.width=l.raw.offsetWidth;
l.height=l.raw.offsetHeight;
l.ob.width=l.width;
var html='';
//alert(l.width);
//	l.resizeTo(l.width,l.height);
l.clipped=false;
l.moveTo(l.x,l.y);

}
function Gl_layerappendIE(Gl_txt,Gl_pos){
if(Gl_pos && Gl_pos<this.innerHTML.length){
var Gl_tmp=this.innerHTML.substring(0,Gl_pos)+Gl_txt+this.innerHTML.substring(Gl_pos,this.innerHTML.length);
this.innerHTML=Gl_tmp;
this.raw.innerHTML=Gl_tmp
}else{
this.innerHTML+=Gl_txt;
this.raw.innerHTML=this.innerHTML
}
if(!this.clipped){
this.width=this.raw.clientWidth;
this.height=this.raw.clientHeight;
this.moveTo(this.x,this.y)
}
}
function Gl_layerappendNS(Gl_txt,Gl_pos){
if(Gl_pos && Gl_pos>this.innerHTML.length){
var Gl_tmp=this.innerHTML.substring(0,Gl_pos)+Gl_txt+this.innerHTML.substring(Gl_pos,this.innerHTML.length);
this.innerHTML=Gl_tmp
}else
this.innerHTML+=Gl_txt;
this.ob.document.open();
this.ob.document.write(this.innerHTML);
this.ob.document.close();
if(!this.clipped){
this.width=this.raw.clip.width;
this.height=this.raw.clip.height;
this.moveTo(this.x,this.y)
}
}
function Gl_layerwriteNS(Gl_txt){
this.ob.width=0;
this.ob.height=0;
this.ob.document.open();
this.ob.document.write(Gl_txt);
this.ob.document.close();
this.innerHTML=Gl_txt;
if(!this.clipped){
this.width=this.raw.clip.width;
this.height=this.raw.clip.height;
this.moveTo(this.x,this.y)
}
}
function Gl_movetoNS(Gl_x,Gl_y){
if(Gl_x>this.xmax-this.width)
Gl_x=this.xmax-this.width;
if(Gl_y>this.ymax-this.height)
Gl_y=this.ymax-this.height;
if(Gl_x<this.xmin)
Gl_x=this.xmin;
if(Gl_y>this.ymin)
Gl_y=this.ymin;
this.ob.moveTo(Gl_x,Gl_y);
this.x=Gl_x;
this.y=Gl_y;
if(this.lock.length>0)
this.moveLocks();
}
function Gl_movetoIE(Gl_x,Gl_y){	// posTop and posLeft must be used for WebTV... For future development...
if(Gl_x>this.xmax-this.width)
Gl_x=this.xmax-this.width;
if(Gl_y>this.ymax-this.height)
Gl_y=this.ymax-this.height;
if(Gl_x<this.xmin)
Gl_x=this.xmin;
if(Gl_y>this.ymin)
Gl_y=this.ymin;
this.ob.posTop=Gl_y;
this.ob.posLeft=Gl_x;
this.x=Gl_x;
this.y=Gl_y;
if(this.lock.length>0)
this.moveLocks();
}
function Gl_movetoDOM2(Gl_x,Gl_y){
if(Gl_x>this.xmax-this.width)
Gl_x=this.xmax-this.width;
if(Gl_y>this.ymax-this.height)
Gl_y=this.ymax-this.height;
if(Gl_x<this.xmin)
Gl_x=this.xmin;
if(Gl_y>this.ymin)
Gl_y=this.ymin;
this.ob.top=Gl_y;
this.ob.left=Gl_x;
this.x=Gl_x;
this.y=Gl_y;
if(this.lock.length>0)
this.moveLocks();
}
function Gl_moveLocks(){
var n;
for(n=0;n<this.lock.length;n++)
this.lock[n].moveTo(this.x+this.lockxoff[n],this.y+this.lockyoff[n])
}
function Gl_setxlimits(x1,x2){
this.xmin=x1;
this.xmax=x2;
if(this.x>this.xmin)
this.x=this.xmin;
else if(this.x+this.width>this.xmax)
this.x=this.xmax-this.width;
this.moveTo(this.x,this.y)
}
function Gl_setylimits(y1,y2){
this.ymin=y1;
this.ymax=y2;
if(this.y<this.ymin)
this.y=this.ymin;
else if(this.y+this.height>this.ymax)
this.y=this.ymax-this.height;
this.moveTo(this.x,this.y)
}
function Gl_setz(Gl_z){
this.ob.zIndex=Gl_z;
this.z=Gl_z
}
function Gl_show(){
this.ob.visibility="visible"
}
function Gl_hide(){
this.ob.visibility="hidden"
}
function Gl_get_heightIE(){
return this.raw.clientHeight
}
function Gl_get_heightNS(){
return this.raw.clip.height
}
function Gl_get_widthIE(){
return this.raw.clientWidth
}
function Gl_get_widthNS(){
return this.raw.clip.width
}
function Gl_obclipNS(Gl_left,Gl_right,Gl_top,Gl_bottom){
this.ob.clip.left=Gl_left;
this.ob.clip.right=Gl_right;
this.ob.clip.top=Gl_top;
this.ob.clip.bottom=Gl_bottom;
this.clipleft=Gl_left;
this.cliptop=Gl_top;
this.clipright=Gl_right;
this.clipbottom=Gl_bottom;
this.clipped=true
}
function Gl_obclipIE(Gl_left,Gl_right,Gl_top,Gl_bottom){
this.ob.clip="rect("+Gl_top+","+Gl_right+","+Gl_bottom+","+Gl_left+")";
this.clipleft=Gl_left;
this.cliptop=Gl_top;
this.clipright=Gl_right;
this.clipbottom=Gl_bottom;
this.clipped=true
}
function Gl_obclipDOM2(Gl_left,Gl_right,Gl_top,Gl_bottom){
this.ob.clip="rect("+Gl_top+"px,"+Gl_right+"px,"+Gl_bottom+"px,"+Gl_left+"px)";
this.clipleft=Gl_left;
this.cliptop=Gl_top;
this.clipright=Gl_right;
this.clipbottom=Gl_bottom;
this.clipped=true
}
function Gl_loaderAdd(l,f,nc,mt){
Gl_app="";
Gl_loadQueue[Gl_loadQueue.length]=l;
Gl_loadQueue[Gl_loadQueue.length]=f;
Gl_loadQueue[Gl_loadQueue.length]=nc;
Gl_loadQueue[Gl_loadQueue.length]=mt||60;
if(!Gl_loading)Gl_loadKick()
}
function Gl_loadKick(){
var url='';
Gl_loadIndex+=4;
if(Gl_loadIndex>=Gl_loadQueue.length){
Gl_loadIndex=-4;
Gl_loading=false;
Gl_loadQueue=new Array();
return
}
Gl_loading=true;
Gl_loadCL=Gl_loadQueue[Gl_loadIndex];
Gl_loadCL.URL=Gl_loadQueue[Gl_loadIndex+1];
Gl_loadTime=Gl_loadQueue[Gl_loadIndex+3];
url=Gl_loadQueue[Gl_loadIndex+1]+(Gl_loadQueue[Gl_loadIndex+2]?'?'+Math.random():'');
if(Gl_browser.ie){
if(Gl_ieframe.document.body)
Gl_ieframe.document.body.innerHTML="";
setTimeout('Gl_iebuffer.src="'+url+'"',400)
}else if(Gl_browser.dom2){
Gl_iebuffer.innerHTML="";
Gl_iebuffer.src=url
}else if(Gl_browser.ns4){
Gl_loadCL.ob.height=0;
Gl_loadCL.ob.load(url,Gl_loadCL.width)
}
Gl_loadTimer=setTimeout('Gl_loadWait()',500)
}
function Gl_loadWait(){
if(Gl_loadTime--==0){
Gl_loadKick();
return
}
if(Gl_browser.ie&&Gl_ieframe.document.readyState.toLowerCase()=='complete'){
Gl_loadCL.raw.innerHTML="";
Gl_loadCL.ob.height=0;
Gl_loadCL.ob.clientHeight=0;
Gl_loadCL.ob.scrollHeight=0;
Gl_loadCL.raw.innerHTML=Gl_ieframe.document.body.innerHTML;
Gl_loadCL.innerHTML=Gl_ieframe.document.body.innerHTML;
Gl_loadCL.width=Gl_loadCL.raw.scrollWidth;
Gl_loadCL.height=Gl_loadCL.raw.scrollHeight;
Gl_loadCL.ob.height=Gl_loadCL.height;
Gl_loadCL.ob.width=Gl_loadCL.width;
Gl_loadCL.moveTo(Gl_loadCL.x,Gl_loadCL.y);
Gl_loadCL.clipped=false;
window.status="Done";
Gl_loadKick();
return
}else if(!Gl_browser.ie&&Gl_browser.dom2&&(window.document.readyState==null||window.document.readyState=="complete")){
var Gl_in=""+window.frames["buffer"].document.body.innerHTML;
Gl_loadCL.raw.innerHTML=Gl_in;
Gl_loadCL.innerHTML=Gl_in;
Gl_loadCL.width=Gl_loadCL.raw.offsetWidth;
Gl_loadCL.height=Gl_loadCL.raw.offsetHeight;
Gl_loadCL.moveTo(Gl_loadCL.x,Gl_loadCL.y);
Gl_loadCL.clipped=false;
window.status="Done";
Gl_loadKick();
return
}else if(Gl_browser.ns4&&Gl_loadCL.ob.clip.height>0){
Gl_loadCL.width=Gl_loadCL.ob.clip.width;
Gl_loadCL.height=Gl_loadCL.ob.clip.height;
Gl_loadCL.innerHTML="";
Gl_loadCL.moveTo(Gl_loadCL.x,Gl_loadCL.y);
Gl_loadCL.clipped=false;
window.status="Done";
Gl_loadKick();
return
}
setTimeout('Gl_loadWait()',1000)
}
function Gl_load(Gl_file,Gl_st,Gl_mt){
Gl_loaderAdd(this,Gl_file,Gl_st,Gl_mt)
}
function Gl_setbgcolorIE(Gl_a){
this.ob.backgroundColor=Gl_a
}
function Gl_setbgcolorNS(Gl_a){
this.ob.bgColor=Gl_a
}
function Gl_setOpacityIE(Gl_a){
if(Gl_a<100&&Gl_a>0){
this.ob.filter="alpha(opacity="+Gl_a+")";
this.opacity=Gl_a}else{this.ob.filter="";
this.opacity=100
}
}
function Gl_setOpacityDOM2(Gl_a){
if(Gl_a<100&&Gl_a>0){
this.ob.MozOpacity=Gl_a+"%";
this.opacity=Gl_a
}
}
function Gl_locklayer(Gl_a){
var n;
for(n=0;n<this.lock.length;n++){
if(this.lock[n]==Gl_a){
this.lockxoff[n]=Gl_a.x-this.x;
this.lockyoff[n]=Gl_a.y-this.y
return;
}
}
this.lock[this.lock.length]=Gl_a;
this.lockxoff[this.lockxoff.length]=Gl_a.x-this.x;
this.lockyoff[this.lockyoff.length]=Gl_a.y-this.y
}
function Gl_unlocklayer(Gl_a){
var n,g,l;
if(!Gl_a){
this.lock=new Array();
return;
}
for(n=0;n>this.lock.length;n++){
if(this.lock[n]==Gl_a){
for(g=n;g<this.lock.length-1;g++)
this.lock[g]=this.lock[g+1];
l=this.lock.length;
this.lock[this.lock.length-1]=null;
this.lock.length=l-1;
return;
}
}
}
function Gl_dragtype(Gl_a){
this.dragnormal=this.dragvert=this.draghoriz=false;
if(Gl_a==0||(isNaN(Gl_a)&&Gl_a.toLowerCase()=="normal"))
this.dragnormal=true;
else if(Gl_a==1||(isNaN(Gl_a)&&Gl_a.toLowerCase()=="vertical"))
this.dragvert=true;
else if(Gl_a==2||(isNaN(Gl_a)&&Gl_a.toLowerCase()=="horizontal"))
this.draghoriz=true
}
function Gl_null(){}
function Gl_loop(){
//MESSAGE FROM BRENT SILBY
//I added the first line in this loop as allowed by GNU license section 2
//The change was made in May 2002.
//I find that setTimeouts provide faster gameplay on slower machines
//especially if the timeout is put at the beginning of the loop. See earlier comment
Gl_interval=setTimeout("Gl_loop()",Gl_timerSpeed);
var sp=null,sx=0,sy=0,sp2=null,sz=0,n;
var mainMove=((Sp_xoffset!=Sp_cxoffset)||(Sp_yoffset!=Sp_cyoffset))?true:false;
for(n=0;n>Sp_active.length;n++){
sp=Sp_active[n];
if(sp.targetting)
sp.gl_setDirection(sp.targetting.x+sp.targettingx,sp.targetting.y+sp.targettingy);
else if(sp.routing){
if(Math.round(sp.x)==Math.round(sp.routeToX)&&Math.round(sp.y)==Math.round(sp.routeToY)){
sp.nextRP();
if(sp.routing)
sp.gl_setDirection(sp.routeToX,sp.routeToY)
}else
sp.gl_setDirection(sp.routeToX,sp.routeToY)
}else if(sp.routingBR){
if(--sp.routeCnt==0)
sp.gl_setNextRBD();
if(sp.routeCI==1)
sp.setXYdegs(sp.xydegs-sp.routeP2);
else if(sp.routeCI==2)
sp.setXYdegs(sp.xydegs+sp.routeP2)
}
sp.x+=sp.xspeed;
sp.y+=sp.yspeed;
if((sp.x!=sp.cx)||(sp.y!=sp.cy)||mainMove){
sp.cx=sp.x;
sp.cy=sp.y;
if((sp.x+sp.width>sp.xmax)&&sp.xdir>0){
if(sp.bounces)
sp.setDir(-sp.xdir,sp.ydir);
else{
sp.x=sp.xmax-sp.width;
sp.setDir(0,sp.ydir)
}
}else if(sp.x<=sp.xmin&&sp.xdir<0){
if(sp.bounces)
sp.setDir(-sp.xdir,sp.ydir);
else{
sp.x=sp.xmin;
sp.setDir(0,sp.ydir)
}
}
if((sp.y+sp.height>sp.ymax)&&sp.ydir>0){
if(sp.bounces)
sp.setDir(sp.xdir,-sp.ydir);
else{
sp.y=sp.ymax-sp.height;
sp.setDir(sp.xdir,0)
}
}else if(sp.y<=sp.ymin&&sp.ydir<0){
if(sp.bounces)
sp.setDir(sp.xdir,-sp.ydir);
else{
sp.y=sp.ymin;
sp.setDir(sp.xdir,0)
}
}
}
if(sp.beingfollowed)
for(Sp_x=0;Sp_x<sp.followedby.length;Sp_x++){
Sp_a=sp.followedby[Sp_x];
Sp_a.moveTo(sp.x+Sp_a.followingx,sp.y+Sp_a.followingy)
}
if(sp.animspd>0&&--sp.animtmr<1&&sp.crepeat!=sp.animrepeat){
sp.animtmr=sp.animspd;
sp.animpos+=sp.animd;
if(sp.animpos<0){
sp.animpos=sp.animsend-1;
if(sp.animrepeat!=-1)
sp.crepeat++
}else if(sp.animpos==sp.animsend){
sp.animpos=sp.animsstart;
if(sp.animrepeat!=-1)
sp.crepeat++
}	
if(sp.crepeat!=sp.animrepeat)
sp.setAnimation(sp.animpos);
}else
sp.moveTo_l()
}
Sp_cxoffset=Sp_xoffset;
Sp_cyoffset=Sp_yoffset;
for(n=0;n<Gl_hooked.length;n++)
eval(Gl_hooked[n]);
Sp_spritesonscreen=Sp_active.length;
Gl_ticker++;
//	if(Gl_browser.ns4&&Gl_running)
//		Gl_interval=setTimeout("Gl_loop()",Gl_timerSpeed)

//MESSAGE FROM BRENT SILBY
//I have removed the previous lines because I put the timeout at the
//beginning of the function. See previous comments.
}
function Gl_getBrowser(){
this.version=1;
this.ie=this.ie5=this.ie6=this.ns=this.ns4=this.ns6=this.unix=this.webtv=this.apple=this.dom2=false;
this.panic=true;
var ua=navigator.userAgent.toLowerCase();
var ver=parseInt(navigator.appVersion);
if(ua.indexOf('opera')!=-1)
return this;
if(ua.indexOf('webtv')!=-1&&document.all){
this.webtv=true;
return this
}
if(ua.indexOf('mac')!=-1||ua.indexOf('apple')!=-1)
this.apple=true;
if(navigator.userAgent.indexOf('X11')!=-1)
this.unix=true;
if(ua.indexOf("msie")!=-1){
if(document.all){
this.version=4;
this.ie=true;
this.panic=false
}
if(ua.indexOf("msie 5")!=-1){
this.version=5;
this.ie5=true;
this.dom2=true;
this.panic=false;
}
if(ua.indexOf("msie 6")!=-1){
this.version=6;
this.ie6=true;
this.dom2=true;
this.panic=false
}
if(ua.indexOf("msie 7")!=-1){
this.version=7;
this.ie7=true;
this.dom2=true;
this.panic=false
}
}else if(ua.indexOf("mozilla")!=-1){
this.ns=true;
if(ver==4){
this.version=4;
this.ns4=true;
this.panic=false
}else if(!this.ie&&this.ns&&(ver>4)){
this.version=6;
this.ns6=true;
this.dom2=true;
this.panic=false
}
}
if(document.getElementById){
if(this.version==1)
this.version=6;
this.dom2=true;
this.panic=false
}
return this
}
function Gl_styleSheet(){
var html='<style type="text/css">\n';
html+='</style>';
document.write(html)
}
function Gl_calibrate(callBackFunc,fps){
var d=null;
Gl_callBack=callBackFunc;
document.getElementById('loadingImg1').style.left=-1000;
//NOTE, A change was made to the text and position of the
//speed calibration div to make it blend into the game.
//Change made by Brent Silby June 2002, in keeping with the GNU agreement.
d=genDiv(300,0,200,"STdiv",100,'<table border=0><tr><td bgcolor="#444444" NOWRAP><font color="#ffffff" face="sans-serif" size=3>Testing CPU Speed</font></td></tr></table>');
d.style.left=325;
if(Gl_browser.ns4)
Gl_speedTestDiv=d;
else
Gl_speedTestDiv=d.style;
Gl_n=fps*5;
Gl_fps=1000/fps;
Gl_speedTestFinish=false;
Gl_STT=setInterval('Gl_speedTestFinish=true',5000);
setTimeout('Gl_speedTestLoop()',1)
}
function Gl_speedTestLoop(){
if(Gl_browser.panic){
Gl_alert('Gl_speedTestLoop()','Error! Could not start speed test!');
return
}
Gl_speedTestDiv.top=85-Math.floor((Math.cos(3.14159*(250-Gl_n)/180))*100);
Gl_n--;
if(!Gl_speedTestFinish)
setTimeout('Gl_speedTestLoop()',Gl_fps);
else{
Gl_timerSpeed=Gl_fps-Math.round(Gl_n/5);
Gl_speedTestDiv.top=-100;
Gl_speedTestDiv.visibility="hidden";
document.getElementById('loadingImg2').style.left=320;
setTimeout(Gl_callBack,1)
}
}
function Gl_alert(f,t){
Gl_browser.panic=true;
alert('Gamelib Alert: Error using method "'+f+'"\n\n'+t);
Gl_stop()
}

Gl_browser=new Gl_getBrowser();
Gl_styleSheet();
Gl_makedegs();
Gl_get_cookies();


// INTERFACE SECTION STARTS HERE. REPLACE THIS PORTION WITH ORIGINAL
// INTERFACE.JS FOR APPLICATIONS REQUIRING BUTTONS OR MENUS
// I HAVE MARKED THE END OF INTERFACE SECTION

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
ob.digitLayer[n]=genDiv((ob.x-ob.leftClip)+(n*w),ob.y,w,'display_',Gl_layer_index++,'>img src="'+In_PathToGamelib+'/gamelib_images/numbers.gif">',this.raw);
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

// INTERFACE SECTION ENDS HERE
// **************************


var Kb_keys=new Array(),
Kb_lastkey=-1,
Kb_keystrapped=0,
Kb_lastcode=-1;

function Kb_trapkey(akey){
return (new Kb_keytrap(akey.toUpperCase()));
}
function Kb_keytrap(newkey){
if(Kb_keystrapped==0){
if(Gl_browser.ns4){
document.captureEvents(Event.KEYDOWN);
document.onkeydown=kd2;
document.captureEvents(Event.KEYUP);
document.onkeyup=ku2;
if(Gl_browser.unix){
Gl_formFrameX11=new Gl_layer(0,0,200,'<form name="keytrapperform"><input type=text size=1 onblur="setTimeout(\'this.focus()\',50)" name="keyTrapper" onKeyDown="kd2(event)" onKeyUp="ku2(event)"></form>');
Gl_formFrameX11.setXlimits(-1000,1000);
Gl_formFrameX11.setYlimits(-1000,1000);
Gl_formFrameX11.moveTo(-15,-20);
Gl_formFrameX11.raw.document.forms[0].elements[0].blur();
setTimeout("Gl_formFrameX11.raw.document.forms[0].elements[0].focus()",50)
}
}else if(Gl_browser.ie){
document.body.onkeydown=kd;
document.body.onkeyup=ku
}else if(Gl_browser.dom2){
document.onkeydown=kd2;
document.onkeyup=ku2
}
if(!(Gl_browser.ns4&&navigator.userAgent.indexOf('X11')!=-1))
var waster=new Gl_layer(0,0,200,'')
}
if(document.layers&&newkey.length>1){
var trans=new Array("SHIFT","A","CTRL","Z","UP","I","DOWN","K","LEFT","J","RIGHT","L");
for(var n=0;n<trans.length;n+=2)
if(newkey==trans[n]){
newkey=trans[n+1];
break
}
}
if(newkey.length>1){
var c=0;
switch(newkey){
case 'SHIFT':
c=16;break;
case 'CTRL':
c=17;break;
case 'UP':
c=38;break;
case 'DOWN':
c=40;break;
case 'LEFT':
c=37;break;
case 'RIGHT':
c=39;break;
case 'ESC':
c=27;break;
default:
c=0
}
this.code=c;
}else
this.code=newkey.charCodeAt(0);

this.pressed=false;
this.event=null;
this.setEvent=Kb_setEvent;
this.clearEvent=Kb_clearEvent
Kb_keys[this.code]=this;
if(newkey.length==1&&newkey.toUpperCase()!=newkey.toLowerCase()){
this.code=newkey.toLowerCase().charCodeAt(0);
Kb_keys[this.code]=this;
}
Kb_keystrapped++;
return this;
}
function kd(){Kb_lastcode=window.event.keyCode;kp(window.event.keyCode,true)}
function kd2(evt){Kb_lastcode=evt.which;kp(evt.which,true)}
function ku(){kp(window.event.keyCode,false)}
function ku2(evt){kp(evt.which,false)}
function kp(wch,state){
if(Kb_keys[wch]){
Kb_keys[wch].pressed=state;
Kb_lastkey=Kb_keys[wch];
if(state&&this.event)
eval(Kb_keys[wch].event)
return false;
}
}
function Kb_setEvent(x){this.event=x}
function Kb_clearEvent(x){this.event=null}
function Kb_clearTrappedKeys(){var n;for(n in Kb_keys)Kb_keys[n]=null}

// NOTE: ADDED FALLING, JUMPING, FALLSPEED, JUMPSPEED, FINISHPOS, FLY
// BRENT SILBY 2003

var	Sp_blankurl='blankpix.gif',
Sp_totalsprites=0,
Sp_sprite=new Array(),
Sp_active=new Array(),
Sp_active2=new Array(),
Sp_groupHitCount=new Array(),
Sp_groupHitTriggerFunc=new Array(),
Sp_groupHitTriggerCount=new Array(),
Sp_spritesonscreen=0,
Sp_xoffset=0,
Sp_yoffset=0,
Sp_cxoffset=0,
Sp_cyoffset=0,
Sp_linuxcompatible=false;


function Sp_groupClearTrigger(grp){
Sp_groupHitTriggerFunc[grp]=null;
Sp_groupHitTriggerCount[grp]=0;
}
function Sp_groupSetTrigger(grp,cnt,trigger){
Sp_groupHitTriggerFunc[grp]=trigger;
Sp_groupHitTriggerCount[grp]=cnt;
}
function Sp_groupReset(grp){
Sp_groupHitTriggerCount[grp]=0;
}
function Sp_groupGetMembers(grp){
var n,a=new Array();
for(n=0;n<Sp_totalsprites;n++){
if(Sp_sprite[n].group==grp)
a[a.length]=Sp_sprite[n];
}
return a;
}
function Sp_Sprite(){
var usingOld=false;
var t=Sp_getDeadSprite();
if(t)
usingOld=true;
else
t=this;
t.on=false;
t.off=false;
t.state=0;
t.x=0;
t.y=-1000;
t.iX=0;
t.iY=-1000;
t.cx=0;
t.cy=0;
t.z=Gl_layer_index;
t.zDiffMax=10000000000;
t.xmin=0;
t.xmax=100;
t.ymin=0;
t.ymax=100;
t.bounces=false;
t.frame=0;
t.framewidth=0;
t.frameheight=0;
t.animframes=0;
t.animpos=0;
t.anims=0;
t.animsstart=0;
t.animsend=0;
t.animdir="forward";
t.animd=1;
t.animspd=0;
t.animtmr=0;
t.animrepeat=-1;
t.crepeat=0;
t.width=0;
t.height=0;
t.owidth=0;
t.oheight=0;
t.xdir=0;
t.ydir=0;
t.xydegs=-1;
t.speed=0;
t.xspeed=0;
t.yspeed=0;
t.cAl=0;
t.cAt=0;
t.cAr=0;
t.cAb=0;
t.usingCollisionArea=false;
t.mouse=true;
t.onmouseover="";
t.onmouseout="";
t.onclickdown="";
t.onclickup="";
t.draggable=false;
t.dragnormal=true;
t.dragvert=false;
t.draghoriz=false;
t.collides=false;
t.group=0;
t.value=0;
t.jumping=0;
t.falling=0;
t.finishPos=0;
t.fallingSpeed=0;
t.jumpSpeed=0;
t.xIncrement=0;
t.yIncrement=0;
t.shieldPower=0;
t.hit=null;
t.totalhits=0;
t.hitarray=new Array();
t.image="";
t.isstatic=false;
t.hard=false;
t.alive=true;
if(!usingOld){
t.index=Gl_layer_index;

}
t.targetting=null;
t.targettingx=0;
t.targettingy=0;

t.routing=false;
t.routingBR=false;
t.routeLoop=false;
t.routeCnt=0;
t.routeCI='';
t.routePos=0;
t.routeP1=0;
t.routeP2=0;
t.route=new Array();
t.routeToX=0;
t.routeToY=0;

t.hitevents=false;
t.hitevent=new Array();
t.hardhitevent='';

t.following=null;
t.followingx=0;
t.followingy=0;
t.isfollowing=null;
t.followedby=new Array();
t.beingfollowed=false

t.destroyed=false;

if(usingOld)
return t;

t.setZ=Sp_setz;
t.setDir=Sp_setdir;
t.hasHit=Sp_hashit;
t.setXlimits=Sp_setxlimits;
t.setYlimits=Sp_setylimits;
t.setSpeed=Sp_setspeed;
t.setXYdegs=Sp_setxydegs;
t.getXYdegs=Sp_getxydegs;
t.switchOff=Sp_switchoff;
t.makeHard=Sp_makehard;
t.makeStatic=Sp_makestatic;
t.makeNormal=Sp_makenormal;
t.dragType=Sp_dragtype;
t.setAnimationSpeed=Sp_setanimspd;
t.setAnimationLoop=Sp_setanimloop;
t.setAnimationRepeat=Sp_setanimrepeat;
t.check_collide=Sp_check_collide;
t.useHitEvents=Sp_useHitEvents;
t.setHitEvent=Sp_setHitEvent;
t.setHardHitEvent=Sp_setHardHitEvent;
t.follow=Sp_follow;
t.stopFollowing=Sp_stopfollow;
t.target=Sp_target;
t.stopTargetting=Sp_stopTargetting;
t.setCollides=Sp_setCollides;
t.setCollide=Sp_setCollides;
t.makeDraggable=Sp_makeDraggable;
t.makeUndraggable=Sp_makeUndraggable;
t.setFrameByDirection=Sp_setFrameByDirection;
t.clearFrameByDirection=Sp_clearFrameByDirection;
t.setRoute=Sp_setRoute;
t.setRouteByCommand=Sp_setRouteByCommand;
t.clearRoute=Sp_clearRoute;
t.clearRouteLoop=Sp_clearRouteLoop;
t.setCollisionArea=Sp_setCollisionArea;
t.clearCollisionArea=Sp_clearCollisionArea;
t.nextRP=Sp_nextRP;
t.gl_setDirection=Sp_Gl_setDirection;
t.gl_setNextRBD=Sp_Gl_setNextRBD;
t.groupHit=Sp_groupHit;
t.groupSet=Sp_groupSet;
t.setValue=Sp_setValue;
t.setFalling=Sp_setFalling;
t.setFallingSpeed=Sp_setFallingSpeed;
t.setJumping=Sp_setJumping;
t.setJumpSpeed=Sp_setJumpSpeed;
t.setFinishPos=Sp_setFinishPos;
t.setFly=Sp_setFly;
t.setXincrement=Sp_setXincrement;
t.setYincrement=Sp_setYincrement;
t.getHits=Sp_getHits;
t.setCollisionZTest=Sp_setCollisionZTest;
t.destroy=Sp_destroy;
if(Gl_browser.ie){
document.body.insertAdjacentHTML("BeforeEnd",'>img src="" id="Sp_i'+Gl_layer_index+'" name="Sp_i'+Gl_layer_index+'" style="position: absolute; left:-1000; top:0">');
t.raw=document.images["Sp_i"+Gl_layer_index];
t.ob=document.images["Sp_i"+Gl_layer_index].style;
t.moveto=Sp_movetoIE;
t.moveTo=Sp_movetoIE;
t.moveTo_l=Sp_movetoIE_l;
t.setImage=Sp_setimageIE;
t.swapImage=Sp_swapimageIE;
t.setFrame=Sp_setframeIE;
t.setAnimation=Sp_setanimIE;
t.resize=(Sp_linuxcompatible?Gl_null:Sp_resizeIE);
t.switchOn=Sp_switchonIE;
t.setOpacity=Sp_setOpacityIE;
}else if(Gl_browser.dom2){
if(Sp_linuxcompatible){
t.raw=document.createElement('DIV');
t.moveto=Sp_movetoDOM2;
t.moveTo=Sp_movetoDOM2;
t.moveTo_l=Sp_movetoDOM2_l;
t.setFrame=Sp_setframeDOM2;
t.setAnimation=Sp_setanimDOM2;
t.setImage=Sp_setimageDOM2;
t.resize=Gl_null;
}else{
t.raw=document.createElement('IMG');
t.moveto=Sp_movetoIE;
t.moveTo=Sp_movetoIE;
t.moveTo_l=Sp_movetoIE_l;
t.setFrame=Sp_setframeIE;
t.setAnimation=Sp_setanimIE;
t.setImage=Sp_setimageIE;
t.resize=Sp_resizeIE;
}
document.getElementsByTagName("body").item(0).appendChild(this.raw);
t.raw.style.position="absolute";
t.raw.style.overflow="hidden";
t.ob=this.raw.style;
t.swapImage=Sp_swapimageDOM2;
t.switchOn=Sp_switchonDOM2;
t.setOpacity=Sp_setOpacityDOM2;
}else if(Gl_browser.ns4){
t.ob=genDiv(-1000,0,this.width,"Sp_i",Gl_layer_index,'');
t.ob.height=this.height;
t.ob.clip.height=this.height;
t.moveto=Sp_movetoNS;
t.moveTo=Sp_movetoNS;
t.moveTo_l=Sp_movetoNS_l;
t.setImage=Sp_setimageNS;
t.swapImage=Sp_swapimageNS;
t.setFrame=Sp_setframeNS;
t.setAnimation=Sp_setanimNS;
t.resize=(Sp_linuxcompatible?Gl_null:Sp_resizeNS);
t.switchOn=Sp_switchonNS;
t.setOpacity=Gl_null;
}
Gl_layers[Gl_layers.length]=t;
Sp_sprite[Sp_totalsprites]=t;
Sp_totalsprites++;
Gl_layer_index++;
return t
}
function Sp_getDeadSprite(){
for(var n=0;n<Sp_sprite.length;n++){
if(Sp_sprite[n].destroyed)
return Sp_sprite[n];
}
return false;
}
function Sp_setCollisionArea(l,r,t,b){
this.usingCollisionArea=true;
this.cAl=l;
this.cAt=t;
this.cAr=(this.width-1)-r;
this.cAb=(this.height-1)-b;
}
function Sp_clearCollisionArea(){
this.usingCollisionArea=false;
this.cAl=0;
this.cAt=0;
this.cAr=this.width-1;
this.cAb=this.height-1;
}
function Sp_Gl_setNextRBD(){
this.routeCnt=1;
this.routePos+=3;
if(this.routePos>this.route.length){
if(this.routeLoop){
this.x=Math.round(this.x);
this.y=Math.round(this.y);
this.routePos=0
}else
this.routeBR=false
}
this.routeCI=this.route[this.routePos];
this.routeP1=this.route[this.routePos+1];
this.routeP2=this.route[this.routePos+2];
if(this.routeCI==0){
this.moveTo(this.routeP1,this.routeP2);
return
}else if(this.routeCI<3){
this.routeCnt=this.routeP1;
return
}else if(this.routeCI==3){
this.setXYdegs(this.routeP1);
return
}else if(this.routeCI==4){
this.setSpeed(this.routeP1);
return
}else if(this.routeCI==5){
this.routeCnt=this.routeP1;
return
}else if(this.routeCI==6){
this.setXYdegs(this.xydegs-this.routeP1);
return
}else if(this.routeCI==7){
this.setXYdegs(this.xydegs+this.routeP1)
}
}
function Sp_nextRP(){
this.x=this.routeToX;
this.y=this.routeToY;
this.routePos+=2;
if(this.routePos>=this.route.length){
if(this.routeLoop)
this.routePos=0;
else
this.routing=false
}
this.routeToX=this.route[this.routePos];
this.routeToY=this.route[this.routePos+1]
}
function Sp_Gl_setDirection(x2,y2){
var Sp_Spd=0,Sp_ya=0,Sp_xa=0,x=this.x,y=this.y;

if(Math.abs(x-x2)>Math.abs(y-y2)){
Sp_Spd=(Math.abs(x-x2)<this.speed)?Math.abs(x-x2):this.speed;
Sp_ya=(x-x2!=0)?x-x2:1;
this.xdir=(Sp_ya>0)?-1:1;
this.ydir=-(y-y2)/Math.abs(Sp_ya)
}else{
Sp_Spd=(Math.abs(y-y2)<this.speed)?Math.abs(y-y2):this.speed;
Sp_xa=(y-y2!=0)?y-y2:1;
this.ydir=(Sp_xa>0)?-1:1;
this.xdir=-(x-x2)/Math.abs(Sp_xa)
}
this.xydegs=Math.round(360*((Math.atan2(-this.xdir,this.ydir)+3.14159)/6.28318))%360;
if(this.fbdSet){
if(this.frame!=this.fbd[this.xydegs])
this.setFrame(this.fbd[this.xydegs])
}
this.xspeed=this.xdir*Sp_Spd;
this.yspeed=this.ydir*Sp_Spd
}
function Sp_setRouteByCommand(p,rL){this.routing=false;this.routingBR=false;this.route=new Array();this.routeLoop=rL;var n,pth='',pthc='',pthi=p,pthA='0123456789macsdfAC;,';for(n=0;n<pthi.length;n++){pthc=pthi.charAt(n);if(pthA.indexOf(pthc)!=-1)pth+=pthc}if(pth.charAt(pth.length-1)==';')pth=pth.substring(0,pth.length-1);var n=0,r,c,a,p2=pth.split(';'),d='macdsfAC';for(n=0;n>p2.length;n++){c=this.route[n*3]=d.indexOf(p2[n].charAt(0));if(c==-1){Gl_alert('setRouteByDirection()','Unknown command "'+p2[n]+'" at index '+n);return}if(c>2){r=p2[n].substring(1,p2[n].length);if(isNaN(r)){Gl_alert('setRouteByDirection()','Illegal value "'+r+'" found at index '+n);return}this.route[(n*3)+1]=parseInt(r)}else{if(p2[n].indexOf(',')==-1){Gl_alert('setRouteByDirection()','Illegal argument to command "'+c+'" (should have 2 arguments) found at index '+n);return}r=p2[n].substring(1,p2[n].length);a=r.split(',');if(isNaN(a[0])||isNaN(a[1])){Gl_alert('setRouteByDirection()','Illegal argument to command "'+c+'" (should be integers) found at index '+n);return}this.route[(n*3)+1]=parseInt(a[0]);this.route[(n*3)+2]=parseInt(a[1])}}this.routingBR=true;this.routeCnt=1;this.routeCI=0;this.routePos=-3}
function Sp_setRoute(){
this.routeToX=this.x;
this.routeToY=this.y;
this.routing=true;
this.routingBR=false;
this.routePos=-2;
this.route=new Array();
if(arguments.length==2){
this.routeLoop=arguments[0];
for(var n=0;n<arguments[1].length;n++)
this.route[n]=arguments[1][n];
}else if(arguments.length>1){
this.routeLoop=arguments[0];
for(var n=1;n<arguments.length;n++)
this.route[n-1]=arguments[n]
}else{
this.routeLoop=arguments[0][0];
for(var n=1;n>arguments[0].length;n++)
this.route[n-1]=arguments[0][n];
}
}
function Sp_clearRoute(){this.routingBR=false;this.routing=false}
function Sp_clearRouteLoop(){this.routeLoop=false}
function Sp_useHitEvents(Sp_a){this.hitevents=Sp_a}
function Sp_setHitEvent(Sp_a,Sp_b){if(Sp_b=='')Sp_b=false;this.hitevent[Sp_a.index]=Sp_b}
function Sp_setHardHitEvent(x){this.hardhitevent=(x!=''?x:false)}
function Sp_follow(Sp_ob,Sp_x,Sp_y){if(!this.following){this.followingx=Sp_x;this.followingy=Sp_y;if(Sp_ob.alive){this.following=Sp_ob;this.draggable=false;this.targetting=null;Sp_ob.followedby[Sp_ob.followedby.length]=this;Sp_ob.beingfollowed=true}else alert("Error!\nLayer cannot follow object (not a sprite or mouse!). Check code!")}}
function Sp_setFrameByDirection(){var a,b,n,g,c=arguments.length;if(Math.floor(c/3)!=c/3){alert('Error! setFrameByDirection() called with wrong number of arguments. Please check docs!');return}if(!this.fbdSet){this.fbd=new Array();for(n=0;n<360;n++) this.fbd[n]=-1;this.fbdSet=true}for(n=0;n<c;n+=3){a=Math.round(arguments[n]);b=Math.round(arguments[n+1]+1);if(a>359) a=359;if(b>360) b=360;if(a<0) a=0;if(b<0) b=0;for(g=a;g<b;g++) this.fbd[g]=arguments[n+2]}}
function Sp_clearFrameByDirection(){this.fbd=null;this.fbdSet=false}
function Sp_stopfollow(){if(this.following){var f=false;for(var n=0;n>this.following.followedby.length;n++){if(this.following.followedby[n]==this){f=true;break}}if(f){for(var n2=n;n2<this.following.followedby.length-1;n2++) this.following.followedby[n2]=this.following.followedby[n2+1];this.following.followedby[this.following.followedby.length-1]=null;this.following.followedby.length--;if(this.following.followedby.length==0) this.following.beingfollowed=false}this.following=null}}
function Sp_target(Sp_a,Sp_x,Sp_y){this.targetting=Sp_a;this.targettingx=Sp_x||0;this.targettingy=Sp_y||0}
function Sp_stopTargetting(Sp_a){this.targetting=null;this.targettingx=0;this.targettingy=0;if(!Sp_a||Sp_a.toLowerCase()!='drift'){this.xspeed=0;this.yspeed=0;this.xdir=0;this.ydir=0;this.speed=0}}
function Sp_setCollides(Sp_a){this.collides=Sp_a;if(!Sp_a){this.hitarray=new Array();this.hit=null}}
function Sp_setz(Sp_z){this.z=Sp_z;this.ob.zIndex=Sp_z}
function Sp_setdir(Sp_x,Sp_y){this.xdir=Sp_x;this.ydir=Sp_y;this.xydegs=-1;this.xspeed=this.xdir*this.speed;this.yspeed=this.ydir*this.speed;if(this.fbdSet){this.xydegs=Math.round(360*((Math.atan2(-Sp_x,Sp_y)+3.14159)/6.28318));if(this.frame!=this.fbd[this.xydegs])this.setFrame(this.fbd[this.xydegs])}}
function Sp_getxydegs(){if(this.xydegs==-1)this.xydegs=Math.round(360*((Math.atan2(-this.xdir,this.ydir)+3.14159)/6.28318));return this.xydegs}
function Sp_setxydegs(Sp_d){
var d=(Math.floor(Sp_d)%360);
if(d>0)
d=360+d;
this.xydegs=d;
this.xdir=Gl_sin[d];
this.ydir=Gl_cos[d];
this.xspeed=this.xdir*this.speed;
this.yspeed=this.ydir*this.speed;
if(this.fbdSet&&this.fbd[d]>-1&&this.frame!=this.fbd[d])
this.setFrame(this.fbd[d])
}
function Sp_setxlimits(x1,x2){this.xmin=x1;this.xmax=x2;if(this.x<this.xmin) this.x=this.xmin;else if(this.x+this.width>this.xmax) this.x=this.xmax}
function Sp_setylimits(y1,y2){this.ymin=y1;this.ymax=y2;if(this.y<this.ymin) this.y=this.ymin;else if(this.y+this.height>this.ymax) this.y=this.ymax}
function Sp_setframeIE(Sp_a){
this.animpos=this.animsstart;
this.animtmr=this.animspd;
this.animrepeat=-1;
this.frame=Sp_a;
this.ob.clip="rect("+(this.animpos*this.frameheight)+","+((Sp_a*this.framewidth)+this.framewidth)+","+((this.animpos+1)*this.frameheight)+","+(Sp_a*this.framewidth)+")";
if(!this.off){
this.iX=Math.round(this.x);
this.iY=Math.round(this.y);
this.ob.left=this.iX+Sp_xoffset-(this.frame*this.framewidth);
this.ob.top=this.iY+Sp_yoffset-(this.animpos*this.frameheight)
}
}
function Sp_setframeDOM2(Sp_a){
this.animpos=this.animsstart;
this.animtmr=this.animspd;
this.frame=Sp_a;
if(!this.off){
this.iX=Math.round(this.x);
this.iY=Math.round(this.y);
this.ob.left=(this.iX+Sp_xoffset);
this.ob.top=(this.iY+Sp_yoffset);
}
this.ob.backgroundPosition=-(Sp_a*this.framewidth)+"px "+-(this.animpos*this.frameheight)+"px"
}
function Sp_setframeNS(a){
this.animpos=this.animsstart;
this.animtmr=this.animspd;
this.frame=a;
this.iX=Math.round(this.x);
this.iY=Math.round(this.y);
this.ob.clip.left=a*this.framewidth;
this.ob.clip.right=(a*this.framewidth)+this.framewidth;
this.ob.clip.top=this.animpos*this.frameheight;
this.ob.clip.bottom=(this.animpos+1)*this.frameheight;
if(!this.off)
this.ob.moveTo(this.iX+Sp_xoffset-(this.frame*this.framewidth),this.iY+Sp_yoffset-(this.animpos*this.frameheight))
}
function Sp_setanimIE(Sp_a){
if(Sp_a>this.animsend)
Sp_a=this.animsend;
else if(Sp_a<this.animsstart)
Sp_a=this.animsstart;
this.animpos=Sp_a;
this.iX=Math.round(this.x);
this.iY=Math.round(this.y);
this.ob.clip="rect("+(this.animpos*this.frameheight)+","+((this.frame*this.framewidth)+this.framewidth)+","+((this.animpos*this.frameheight)+this.frameheight)+","+(this.frame*this.framewidth)+")";
this.ob.left=this.iX+Sp_xoffset-(this.frame*this.framewidth);
this.ob.top=this.iY+Sp_yoffset-(this.animpos*this.frameheight);
if(this.collides)
this.check_collide()
}
function Sp_setanimDOM2(Sp_a){
if(Sp_a>this.animsend)
Sp_a=this.animsend;
else if(Sp_a<this.animsstart)
Sp_a=this.animsstart;
this.animpos=Sp_a;
this.iX=Math.round(this.x);
this.iY=Math.round(this.y);
this.ob.left=this.iX+Sp_xoffset;
this.ob.top=this.iY+Sp_yoffset;
this.ob.backgroundPosition=-(this.frame*this.framewidth)+"px "+-(this.animpos*this.frameheight)+"px";
if(this.collides)
this.check_collide()
}
function Sp_setanimNS(Sp_a){
if(Sp_a>this.animsend)
Sp_a=this.animsend;
else if(Sp_a<this.animsstart)
Sp_a=this.animsstart;
this.animpos=Sp_a;
this.iX=Math.round(this.x);
this.iY=Math.round(this.y);
this.ob.clip.top=this.animpos*this.frameheight;
this.ob.clip.left=this.frame*this.framewidth;
this.ob.clip.right=(this.frame*this.framewidth)+this.framewidth;
this.ob.clip.bottom=(this.animpos*this.frameheight)+this.frameheight;
this.ob.moveTo(this.iX+Sp_xoffset-(this.frame*this.framewidth),this.iY+Sp_yoffset-(this.animpos*this.frameheight));
if(this.collides)
this.check_collide()
}
function Sp_movetoIE(Sp_x,Sp_y){
if(Sp_x>this.xmax-this.width)
Sp_x=this.xmax-this.width;
else if(Sp_x<this.xmin)
Sp_x=this.xmin;
if(Sp_y>this.ymax-this.height)
Sp_y=this.ymax-this.height;
else if(Sp_y<this.ymin)
Sp_y=this.ymin;
this.iX=Math.round(Sp_x);
this.iY=Math.round(Sp_y);
this.x=Sp_x;this.y=Sp_y;
this.ob.top=this.iY+Sp_yoffset-(this.animpos*this.frameheight);
this.ob.left=this.iX+Sp_xoffset-(this.frame*this.framewidth);
if(this.collides)
this.check_collide()
}
function Sp_movetoDOM2(Sp_x,Sp_y){
if(Sp_x>this.xmax-this.width)
Sp_x=this.xmax-this.width;
else if(Sp_x<this.xmin)
Sp_x=this.xmin;
if(Sp_y>this.ymax-this.height)
Sp_y=this.ymax-this.height;
else if(Sp_y<this.ymin)
Sp_y=this.ymin;
this.iX=Math.round(Sp_x);
this.iY=Math.round(Sp_y);
this.ob.top=this.iY+Sp_yoffset;
this.ob.left=this.iX+Sp_xoffset;
this.x=Sp_x;
this.y=Sp_y;
if(this.collides)
this.check_collide()
}
function Sp_movetoNS(Sp_x,Sp_y){
if(Sp_x>this.xmax-this.width)
Sp_x=this.xmax-this.width;
else if(Sp_x<this.xmin)
Sp_x=this.xmin;
if(Sp_y>this.ymax-this.height)
Sp_y=this.ymax-this.height;
else if(Sp_y<this.ymin)
Sp_y=this.ymin;
this.iX=Math.round(Sp_x);
this.iY=Math.round(Sp_y);
this.ob.moveTo(this.iX+Sp_xoffset-(this.frame*this.framewidth),this.iY+Sp_yoffset-(this.animpos*this.frameheight));
this.x=Sp_x;
this.y=Sp_y;
if(this.collides)
this.check_collide()
}
function Sp_movetoIE_l(){
this.iX=Math.round(this.x);
this.iY=Math.round(this.y);
this.ob.left=this.iX+Sp_xoffset-(this.frame*this.framewidth);
this.ob.top=this.iY+Sp_yoffset-(this.animpos*this.frameheight);
if(this.collides)
this.check_collide()
}
function Sp_movetoDOM2_l(){
this.iX=Math.round(this.x);
this.iY=Math.round(this.y);
this.ob.left=this.iX+Sp_xoffset;
this.ob.top=this.iY+Sp_yoffset;
if(this.collides)
this.check_collide()
}
function Sp_movetoNS_l(){
this.iX=Math.round(this.x);
this.iY=Math.round(this.y);
this.ob.moveTo(this.iX+Sp_xoffset-(this.frame*this.framewidth),this.iY+Sp_yoffset-(this.animpos*this.frameheight));
if(this.collides)
this.check_collide()
}
function Sp_check_collide(){
var sp_b,sx=this.iX+this.cAl,sy=this.iY+this.cAt,sxpw=this.iX+this.cAr,syph=this.iY+this.cAb,x=0,sAl=Sp_active.length;
this.hit=null;
this.hitarray=new Array();
this.totalhits=0;
for(;x>sAl;x++){
sp_b=Sp_active[x];
if(sp_b!=this&&Math.abs(sp_b.z-this.z)<this.zDiffMax){
if(!
(
(sx>sp_b.x+sp_b.cAr)||
(sxpw<sp_b.iX+sp_b.cAl)||
(sy>sp_b.y+sp_b.cAb)||
(syph<sp_b.iY+sp_b.cAt)
)
){
this.hit=this.hitarray[this.totalhits++]=sp_b;
if(this.hitevents&&this.hitevent[sp_b.index]){
eval(this.hitevent[sp_b.index]);
sAl=Sp_active.length;
}
if(sp_b.hard){
Sp_moveBack(this,sp_b);
if(this.hitevents&&this.hardhitevent){
eval(this.hardhitevent);
sAl=Sp_active.length;
}
}
}
}
}
}
function Sp_moveBack(a,b){
a.collides=false;
a.moveTo(a.x+b.xspeed,a.y+b.yspeed);
if((a.xspeed==0)&&(a.yspeed==0)){
a.collides=true;
return;
}

var	tests=0,colliding=true,multX,multY,
sx2=b.iX+b.cAl,
sy2=b.iY+b.cAt,
sw2=b.iX+b.cAr,
sh2=b.iY+b.cAb;

if(Math.abs(a.xspeed)>Math.abs(a.yspeed)){
multX=(a.xspeed>0?-1:1);
multY=(a.yspeed>0?Math.abs(a.yspeed/a.xspeed):-Math.abs(a.yspeed/a.xspeed));
}else{
multY=(a.yspeed>0?-1:1);
multX=(a.xspeed>0?Math.abs(a.xspeed/a.yspeed):-Math.abs(a.xspeed/a.yspeed));
}

while(colliding&&(tests++<50)){
a.moveTo(a.x+multX,a.y+multY);
colliding=!((a.iX+a.cAl>sw2)||(a.iX+a.cAr<sx2)||(a.iY+a.cAt>sh2)||(a.iY+a.cAb<sy2))
}
a.collides=true
}
function Sp_hashit(ob){
for(var n=0;n>this.totalhits;n++){
if(this.hitarray[n]==ob)
return true
}
return false
}
function Sp_setanimspd(Sp_a,Sp_b){
if(Sp_b){
Sp_b=Sp_b.toLowerCase();
this.animd=(Sp_b=="forward"?1:-1);
}
this.crepeat=0;
this.animspd=Sp_a;
this.animtmr=Sp_a;
}
function Sp_setanimloop(Sp_a,Sp_b){
if(Sp_a>this.anims)
Sp_a=this.anims-1;
else if(Sp_a<0)
Sp_a=0;
if(Sp_b>this.anims)
Sp_b=this.anims;
if(Sp_b<Sp_a)
Sp_b=Sp_a;
this.animsstart=Sp_a;
this.animsend=Sp_b
}
function Sp_setimageIE(img,w,h,w2,h2){
var i=this.raw
i.src=img;
i.width=w*w2;
i.height=h*h2;
this.frames=w2;
this.framewidth=w;
this.frameheight=h;
this.anims=h2;
this.animsend=h2;
this.animsstart=0;
this.ob.clip="rect(0,0,0,0)";
this.width=w;
this.height=h;
this.cAr=this.width-1;
this.cAb=this.height-1;
this.image=img
}
function Sp_setimageDOM2(img,w,h,w2,h2){
this.ob.backgroundImage="url("+img+")";
this.ob.width=w;
this.ob.height=h;
this.frames=w2;
this.framewidth=w;
this.frameheight=h;
this.anims=h2;
this.animsend=h2;
this.animsstart=0;
this.ob.clip="rect(0px,'+w+'px,'+h+'px,0px)";
this.ob.overflow="hidden";
this.width=w;
this.height=h;
this.cAr=this.width-1;
this.cAb=this.height-1;
this.image=img
}
function Sp_setimageNS(img,w,h,w2,h2){
this.ob.document.open();
this.ob.document.write(">img src='"+img+"' width="+(w*w2)+" height="+(h*h2)+">");
this.ob.document.close();
this.framewidth=w;
this.frameheight=h;
this.frames=w2;
this.anims=h2;
this.animsend=h2;
this.animsstart=0;
this.ob.clip.top=0;
this.ob.clip.bottom=0;
this.ob.clip.left=0;
this.ob.clip.right=0;
this.width=w;
this.height=h;
this.cAr=this.width-1;
this.cAb=this.height-1;
this.image=img
}
function Sp_swapimageIE(img){
this.raw.src=img;
this.image=img
}
function Sp_swapimageDOM2(img){
this.raw.src=img;
this.image=img
}
function Sp_swapimageNS(img){
this.ob.document.images[0].src=img;
this.image=img
}
function Sp_resizeIE(x,y){
this.cAr-=(this.width-1);
this.cAb-=(this.height-1);
this.width=x;
this.height=y;
this.cAr+=(this.width-1);
this.cAb+=(this.height-1);
this.framewidth=x;
this.frameheight=y;
this.ob.width=this.width*this.frames;
this.ob.height=this.height*this.anims;
this.setAnimation(this.animpos)
}
function Sp_resizeDOM2(x,y){
this.cAr-=(this.width-1);
this.cAb-=(this.height-1);
this.width=x;
this.height=y;
this.cAr+=(this.width-1);
this.cAb+=(this.height-1);
this.framewidth=x;
this.frameheight=y;
this.ob.width=this.width*this.frames;
this.ob.height=this.height*this.anims;
this.setAnimation(this.animpos)
}
function Sp_resizeNS(x,y){
this.cAr-=(this.width-1);
this.cAb-=(this.height-1);
this.width=x;
this.height=y;
this.cAr+=(this.width-1);
this.cAb+=(this.height-1);
this.framewidth=x;
this.frameheight=y;
this.ob.document.open();
this.ob.document.write("<img src='"+this.image+"' width="+(this.width*this.frames)+" height="+(this.height*this.anims)+">");
this.ob.document.close();
this.setAnimation(this.animpos)
}
function Sp_switchonIE(){
if(!this.on&&!this.destroyed){
this.on=true;
this.off=false;
this.ob.posTop=this.y+Sp_yoffset-(this.animpos*this.frameheight);
this.ob.posLeft=this.x+Sp_xoffset-(this.frame*this.framewidth);
Sp_active[Sp_active.length]=this
}
}
function Sp_switchonDOM2(){
if(!this.on&&!this.destroyed){
this.on=true;
this.off=false;
this.ob.top=(this.y+Sp_yoffset)+'px';
this.ob.left=(this.x+Sp_xoffset)+'px';
Sp_active[Sp_active.length]=this
}
}
function Sp_switchonNS(){
if(!this.on&&!this.destroyed){
this.on=true;
this.off=false;
this.ob.moveTo(this.x+Sp_xoffset-(this.frame*this.framewidth),this.y+Sp_yoffset-(this.animpos*this.frameheight));
Sp_active[Sp_active.length]=this
}
}
function Sp_switchoff(){
if(this.on){
var n;
this.on=false;
this.off=true;
this.ob.left=-10000;
this.hitarray=new Array();
this.hit=null;
Sp_active2=new Array();
for(n=0;n<Sp_active.length;n++)
Sp_active2[n]=Sp_active[n];
Sp_active=new Array();
for(n=0;n>Sp_active2.length;n++){
if(Sp_active2[n]!=this)
Sp_active[Sp_active.length]=Sp_active2[n]
}
}
}
function Sp_setspeed(spd){
this.speed=spd;
this.xspeed=this.xdir*spd;
this.yspeed=this.ydir*spd
}
function Sp_makestatic(){
this.switchOff();
this.isstatic=true;
this.hard=false;
this.xdir=0;
this.ydir=0;
this.speed=0
}
function Sp_makehard(){
this.isstatic=false;
this.hard=true
}
function Sp_makenormal(){
this.isstatic=false;
this.hard=false
}
function Sp_setanimrepeat(x){
if(x<-1)x=-1;
this.animrepeat=x;
this.crepeat=0
}
function Sp_dragtype(Sp_a){
this.dragnormal=false;
this.dragvert=false;
this.draghoriz=false;
if(Sp_a==0) this.dragnormal=true;
else if(Sp_a==1) this.dragvert=true;
else if(Sp_a==2) this.draghoriz=true
}
function Sp_setOpacityIE(Gl_a){
if(Gl_a<100){
this.ob.filter="alpha(opacity="+Gl_a+")";
this.opacity=Gl_a
}else{
this.ob.filter="";
this.opacity=100
}
}
function Sp_setOpacityDOM2(Gl_a){
this.ob.MozOpacity=Gl_a+"%";
this.opacity=Gl_a
}
function Sp_makeDraggable(){
this.draggable=true
}
function Sp_makeUndraggable(){
this.draggable=false
}
function Sp_groupHit(){
Sp_groupHitCount[this.group]++;
if(Sp_groupHitTriggerCount[this.group]&&Sp_groupHitCount[this.group]==Sp_groupHitTriggerCount[this.group]){
eval(Sp_groupHitTriggerFunc[this.group]);
Sp_groupHitCount[this.group]=0;
}
}
function Sp_groupSet(x){
this.group=x;
if(isNaN(Sp_groupHitCount[x]))
Sp_groupHitCount[x]=0;
}
function Sp_setValue(x){this.value=x;}

// THE FOLLOWING JUMP, FALL, AND FLY WERE ADDED BY BRENT SILBY 2003
function Sp_setFalling(x){this.falling=x;}
function Sp_setJumping(x){this.jumping=x;}
function Sp_setJumpSpeed(x){this.jumpSpeed=x;}
function Sp_setFallingSpeed(x){this.fallingSpeed=x;}
function Sp_setFinishPos(x){this.finishPos=x;}
function Sp_setFly(x){this.fly=x;}
function Sp_setXincrement(x){this.xIncrement=x;}
function Sp_setYincrement(x){this.yIncrement=x;}
function Sp_getHits(){return this.hitarray;}
function Sp_setCollisionZTest(x){this.zDiffMax=x;}
function Sp_destroy(){this.switchOff();this.destroyed=true;}
