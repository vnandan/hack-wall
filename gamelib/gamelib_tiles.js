var Tl_totaltiles=0;
Tl_tile=new Array();
Tl_xoffset=0,
Tl_yoffset=0,
Tl_cxoffset=0,
Tl_cyoffset=0,
Tl_linuxcompatible=false;
function Tl_Tile(){
var usingOld=false;
var t=Tl_getDeadTile();
if(t)
usingOld=true;
else
t=this;
t.on=false;
t.off=false;
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
t.frame=0;
t.framewidth=0;
t.frameheight=0;
t.animframes=0;
t.stage=0;
t.anims=0;
t.animsstart=0;
t.animsend=0;
t.animd=1;
t.animspd=0;
t.animtmr=0;
t.animrepeat=-1;
t.crepeat=0;
t.width=0;
t.height=0;
t.owidth=0;
t.oheight=0;
t.cAl=0;
t.cAt=0;
t.cAr=0;
t.cAb=0;
t.image="";
t.alive=true;
if(!usingOld){
t.index=Gl_layer_index;
}
if(usingOld)
return t;

t.setZ=Tl_setz;
t.setXlimits=Tl_setxlimits;
t.setYlimits=Tl_setylimits;
t.switchOff=Tl_switchoff;
t.destroy=Sp_destroy;
if(Gl_browser.ie){
document.body.insertAdjacentHTML("BeforeEnd",'<img src="" id="Tl_i'+Gl_layer_index+'" name="Tl_i'+Gl_layer_index+'" style="position: absolute; left:-1000; top:0">');
t.raw=document.images["Tl_i"+Gl_layer_index];
t.ob=document.images["Tl_i"+Gl_layer_index].style;
t.moveto=Tl_movetoIE;
t.moveTo=Tl_movetoIE;
t.moveTo_l=Tl_movetoIE_l;
t.setImage=Tl_setimageIE;
t.swapImage=Tl_swapimageIE;
t.setFrame=Tl_setframeIE;
t.setStage=Tl_setanimIE;
t.switchOn=Tl_switchonIE;
t.setOpacity=Tl_setOpacityIE;
}else if(Gl_browser.dom2){
if(Tl_linuxcompatible){
t.raw=document.createElement('DIV');
t.moveto=Tl_movetoDOM2;
t.moveTo=Tl_movetoDOM2;
t.moveTo_l=Tl_movetoDOM2_l;
t.setFrame=Tl_setframeDOM2;
t.setStage=Tl_setanimDOM2;
t.setImage=Tl_setimageDOM2;
t.resize=Gl_null;
}else{
t.raw=document.createElement('IMG');
t.moveto=Tl_movetoIE;
t.moveTo=Tl_movetoIE;
t.moveTo_l=Tl_movetoIE_l;
t.setFrame=Tl_setframeIE;
t.setStage=Tl_setanimIE;
t.setImage=Tl_setimageIE;
}
document.getElementsByTagName("body").item(0).appendChild(this.raw);
t.raw.style.position="absolute";
t.raw.style.overflow="hidden";
t.ob=this.raw.style;
t.swapImage=Tl_swapimageDOM2;
t.switchOn=Tl_switchonDOM2;
t.setOpacity=Tl_setOpacityDOM2;
}else if(Gl_browser.ns4){
// Netscape 4 not supported
}
Gl_layers[Gl_layers.length]=t;
Tl_tile[Tl_totaltiles]=t;
Tl_totaltiles++;
Gl_layer_index++;
return t
}
function Tl_setz(Tl_z){this.z=Tl_z;this.ob.zIndex=Tl_z}
function Tl_setxlimits(x1,x2){this.xmin=x1;this.xmax=x2;if(this.x<this.xmin) this.x=this.xmin;else if(this.x+this.width>this.xmax) this.x=this.xmax}
function Tl_setylimits(y1,y2){this.ymin=y1;this.ymax=y2;if(this.y<this.ymin) this.y=this.ymin;else if(this.y+this.height>this.ymax) this.y=this.ymax}
function Tl_setframeIE(Tl_a){
this.stage=this.animsstart;
this.animtmr=this.animspd;
this.animrepeat=-1;
this.frame=Tl_a;
this.ob.clip="rect("+(this.stage*this.frameheight)+","+((Tl_a*this.framewidth)+this.framewidth)+","+((this.stage+1)*this.frameheight)+","+(Tl_a*this.framewidth)+")";
if(!this.off){
this.iX=Math.round(this.x);
this.iY=Math.round(this.y);
this.ob.left=this.iX+Tl_xoffset-(this.frame*this.framewidth);
this.ob.top=this.iY+Tl_yoffset-(this.stage*this.frameheight)
}
}
function Tl_setframeDOM2(Tl_a){
this.stage=this.animsstart;
this.animtmr=this.animspd;
this.frame=Tl_a;
if(!this.off){
this.iX=Math.round(this.x);
this.iY=Math.round(this.y);
this.ob.left=(this.iX+Tl_xoffset);
this.ob.top=(this.iY+Tl_yoffset);
}
this.ob.backgroundPosition=-(Tl_a*this.framewidth)+"px "+-(this.stage*this.frameheight)+"px"
}
function Tl_setframeNS(a){
this.stage=this.animsstart;
this.animtmr=this.animspd;
this.frame=a;
this.iX=Math.round(this.x);
this.iY=Math.round(this.y);
this.ob.clip.left=a*this.framewidth;
this.ob.clip.right=(a*this.framewidth)+this.framewidth;
this.ob.clip.top=this.stage*this.frameheight;
this.ob.clip.bottom=(this.stage+1)*this.frameheight;
if(!this.off)
this.ob.moveTo(this.iX+Tl_xoffset-(this.frame*this.framewidth),this.iY+Tl_yoffset-(this.stage*this.frameheight))
}
function Tl_setanimIE(Tl_a){
if(Tl_a>this.animsend)
Tl_a=this.animsend;
else if(Tl_a<this.animsstart)
Tl_a=this.animsstart;
this.stage=Tl_a;
this.iX=Math.round(this.x);
this.iY=Math.round(this.y);
this.ob.clip="rect("+(this.stage*this.frameheight)+","+((this.frame*this.framewidth)+this.framewidth)+","+((this.stage*this.frameheight)+this.frameheight)+","+(this.frame*this.framewidth)+")";
this.ob.left=this.iX+Tl_xoffset-(this.frame*this.framewidth);
this.ob.top=this.iY+Tl_yoffset-(this.stage*this.frameheight);
}
function Tl_setanimDOM2(Tl_a){
if(Tl_a>this.animsend)
Tl_a=this.animsend;
else if(Tl_a<this.animsstart)
Tl_a=this.animsstart;
this.stage=Tl_a;
this.iX=Math.round(this.x);
this.iY=Math.round(this.y);
this.ob.left=this.iX+Tl_xoffset;
this.ob.top=this.iY+Tl_yoffset;
this.ob.backgroundPosition=-(this.frame*this.framewidth)+"px "+-(this.stage*this.frameheight)+"px";
}
function Tl_setanimNS(Tl_a){
if(Tl_a>this.animsend)
Tl_a=this.animsend;
else if(Tl_a<this.animsstart)
Tl_a=this.animsstart;
this.stage=Tl_a;
this.iX=Math.round(this.x);
this.iY=Math.round(this.y);
this.ob.clip.top=this.stage*this.frameheight;
this.ob.clip.left=this.frame*this.framewidth;
this.ob.clip.right=(this.frame*this.framewidth)+this.framewidth;
this.ob.clip.bottom=(this.stage*this.frameheight)+this.frameheight;
this.ob.moveTo(this.iX+Tl_xoffset-(this.frame*this.framewidth),this.iY+Tl_yoffset-(this.stage*this.frameheight));
}
function Tl_movetoIE(Tl_x,Tl_y){
if(Tl_x>this.xmax-this.width)
Tl_x=this.xmax-this.width;
else if(Tl_x<this.xmin)
Tl_x=this.xmin;
if(Tl_y>this.ymax-this.height)
Tl_y=this.ymax-this.height;
else if(Tl_y<this.ymin)
Tl_y=this.ymin;
this.iX=Math.round(Tl_x);
this.iY=Math.round(Tl_y);
this.x=Tl_x;this.y=Tl_y;
this.ob.top=this.iY+Tl_yoffset-(this.stage*this.frameheight);
this.ob.left=this.iX+Tl_xoffset-(this.frame*this.framewidth);
}
function Tl_movetoDOM2(Tl_x,Tl_y){
if(Tl_x>this.xmax-this.width)
Tl_x=this.xmax-this.width;
else if(Tl_x<this.xmin)
Tl_x=this.xmin;
if(Tl_y>this.ymax-this.height)
Tl_y=this.ymax-this.height;
else if(Tl_y<this.ymin)
Tl_y=this.ymin;
this.iX=Math.round(Tl_x);
this.iY=Math.round(Tl_y);
this.ob.top=this.iY+Tl_yoffset;
this.ob.left=this.iX+Tl_xoffset;
this.x=Tl_x;
this.y=Tl_y;
}
function Tl_movetoNS(Tl_x,Tl_y){
if(Tl_x>this.xmax-this.width)
Tl_x=this.xmax-this.width;
else if(Tl_x<this.xmin)
Tl_x=this.xmin;
if(Tl_y>this.ymax-this.height)
Tl_y=this.ymax-this.height;
else if(Tl_y<this.ymin)
Tl_y=this.ymin;
this.iX=Math.round(Tl_x);
this.iY=Math.round(Tl_y);
this.ob.moveTo(this.iX+Tl_xoffset-(this.frame*this.framewidth),this.iY+Tl_yoffset-(this.stage*this.frameheight));
this.x=Tl_x;
this.y=Tl_y;
}
function Tl_movetoIE_l(){
this.iX=Math.round(this.x);
this.iY=Math.round(this.y);
this.ob.left=this.iX+Tl_xoffset-(this.frame*this.framewidth);
this.ob.top=this.iY+Tl_yoffset-(this.stage*this.frameheight);
}
function Tl_movetoDOM2_l(){
this.iX=Math.round(this.x);
this.iY=Math.round(this.y);
this.ob.left=this.iX+Tl_xoffset;
this.ob.top=this.iY+Tl_yoffset;
}
function Tl_movetoNS_l(){
this.iX=Math.round(this.x);
this.iY=Math.round(this.y);
this.ob.moveTo(this.iX+Tl_xoffset-(this.frame*this.framewidth),this.iY+Tl_yoffset-(this.stage*this.frameheight));
}
function Tl_setimageIE(img,w,h,w2,h2){
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
function Tl_setimageDOM2(img,w,h,w2,h2){
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
function Tl_setimageNS(img,w,h,w2,h2){
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
function Tl_swapimageIE(img){
this.raw.src=img;
this.image=img
}
function Tl_swapimageDOM2(img){
this.raw.src=img;
this.image=img
}
function Tl_swapimageNS(img){
this.ob.document.images[0].src=img;
this.image=img
}

function Tl_switchonIE(){
if(!this.on&&!this.destroyed){
this.on=true;
this.off=false;
this.ob.posTop=this.y+Tl_yoffset-(this.stage*this.frameheight);
this.ob.posLeft=this.x+Tl_xoffset-(this.frame*this.framewidth);

}
}
function Tl_switchonDOM2(){
if(!this.on&&!this.destroyed){
this.on=true;
this.off=false;
this.ob.top=(this.y+Tl_yoffset)+'px';
this.ob.left=(this.x+Tl_xoffset)+'px';

}
}
function Tl_switchonNS(){
if(!this.on&&!this.destroyed){
this.on=true;
this.off=false;
this.ob.moveTo(this.x+Tl_xoffset-(this.frame*this.framewidth),this.y+Tl_yoffset-(this.stage*this.frameheight));

}
}
function Tl_switchoff(){
if(this.on){
var n;
this.on=false;
this.off=true;
this.ob.left=-10000;
this.hitarray=new Array();
this.hit=null;
}
}
function Tl_setOpacityIE(Gl_a){
if(Gl_a<100){
this.ob.filter="alpha(opacity="+Gl_a+")";
this.opacity=Gl_a
}else{
this.ob.filter="";
this.opacity=100
}
}
function Tl_setOpacityDOM2(Gl_a){
this.ob.MozOpacity=Gl_a+"%";
this.opacity=Gl_a
}
function Tl_getDeadTile(){
for(var n=0;n<Tl_tile.length;n++){
if(Tl_tile[n].destroyed)
return Tl_tile[n];
}
return false;
}>