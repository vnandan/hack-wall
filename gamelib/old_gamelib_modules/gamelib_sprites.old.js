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
	Sp_cyoffset=0;

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
	this.on=false;
	this.off=false;
	this.state=0;
	this.x=0;
	this.y=-1000;
	this.iX=0;
	this.iY=-1000;
	this.cx=0;
	this.cy=0;
	this.z=Gl_layer_index;
	this.xmin=0;
	this.xmax=100;
	this.ymin=0;
	this.ymax=100;
	this.bounces=false;
	this.frame=0;
	this.framewidth=0;
	this.frameheight=0;
	this.animframes=0;
	this.animpos=0;
	this.anims=0;
	this.animsstart=0;
	this.animsend=0;
	this.animdir="forward";
	this.animd=1;
	this.animspd=0;
	this.animtmr=0;
	this.animrepeat=-1;
	this.crepeat=0;
	this.width=0;
	this.height=0;
	this.owidth=0;
	this.oheight=0;
	this.xdir=0;
	this.ydir=0;
	this.xydegs=-1;
	this.speed=0;
	this.xspeed=0;
	this.yspeed=0;
	this.cAl=0;
	this.cAt=0;
	this.cAr=0;
	this.cAb=0;
	this.usingCollisionArea=false;
	this.mouse=true;
	this.onmouseover="";
	this.onmouseout="";
	this.onclickdown="";
	this.onclickup="";
	this.draggable=false;
	this.dragnormal=true;
	this.dragvert=false;
	this.draghoriz=false;
	this.collides=false;
	this.group=0;
	this.value=0;
	this.shieldPower=0;
	this.hit=null;
	this.totalhits=0;
	this.hitarray=new Array();
	this.image="";
	this.isstatic=false;
	this.hard=false;
	this.alive=true;
	this.index=Gl_layer_index;

	this.targetting=null;
	this.targettingx=0;
	this.targettingy=0;

	this.routing=false;
	this.routingBR=false;
	this.routeLoop=false;
	this.routeCnt=0;
	this.routeCI='';
	this.routePos=0;
	this.routeP1=0;
	this.routeP2=0;
	this.route=new Array();
	this.routeToX=0;
	this.routeToY=0;

	this.hitevents=false;
	this.hitevent=new Array();
	this.hardhitevent='';

	this.following=null;
	this.followingx=0;
	this.followingy=0;
	this.isfollowing=null;
	this.followedby=new Array();
	this.beingfollowed=false

	this.setZ=Sp_setz;
	this.setDir=Sp_setdir;
	this.hasHit=Sp_hashit;
	this.setXlimits=Sp_setxlimits;
	this.setYlimits=Sp_setylimits;
	this.setSpeed=Sp_setspeed;
	this.setXYdegs=Sp_setxydegs;
	this.getXYdegs=Sp_getxydegs;
	this.switchOff=Sp_switchoff;
	this.makeHard=Sp_makehard;
	this.makeStatic=Sp_makestatic;
	this.makeNormal=Sp_makenormal;
	this.dragType=Sp_dragtype;
	this.setAnimationSpeed=Sp_setanimspd;
	this.setAnimationLoop=Sp_setanimloop;
	this.setAnimationRepeat=Sp_setanimrepeat;
	this.check_collide=Sp_check_collide;
	this.useHitEvents=Sp_useHitEvents;
	this.setHitEvent=Sp_setHitEvent;
	this.setHardHitEvent=Sp_setHardHitEvent;
	this.follow=Sp_follow;
	this.stopFollowing=Sp_stopfollow;
	this.target=Sp_target;
	this.stopTargetting=Sp_stopTargetting;
	this.setCollides=Sp_setCollides;
	this.setCollide=Sp_setCollides;
	this.makeDraggable=Sp_makeDraggable;
	this.makeUndraggable=Sp_makeUndraggable;
	this.setFrameByDirection=Sp_setFrameByDirection;
	this.clearFrameByDirection=Sp_clearFrameByDirection;
	this.setRoute=Sp_setRoute;
	this.setRouteByCommand=Sp_setRouteByCommand;
	this.clearRoute=Sp_clearRoute;
	this.clearRouteLoop=Sp_clearRouteLoop;
	this.setCollisionArea=Sp_setCollisionArea;
	this.nextRP=Sp_nextRP;
	this.gl_setDirection=Sp_Gl_setDirection;
	this.gl_setNextRBD=Sp_Gl_setNextRBD;
	this.groupHit=Sp_groupHit;
	this.groupSet=Sp_groupSet;
	this.setValue=Sp_setValue;
	this.getHits=Sp_getHits;

	if(Gl_browser.ie){
		document.body.insertAdjacentHTML("BeforeEnd",'<img src="" id="Sp_i'+Gl_layer_index+'" name="Sp_i'+Gl_layer_index+'" style="position: absolute; left:-1000; top:0">');
		this.raw=document.images["Sp_i"+Gl_layer_index];
		this.ob=document.images["Sp_i"+Gl_layer_index].style;
		this.moveto=Sp_movetoIE;
		this.moveTo=Sp_movetoIE;
		this.moveTo_l=Sp_movetoIE_l;
		this.setImage=Sp_setimageIE;
		this.swapImage=Sp_swapimageIE;
		this.setFrame=Sp_setframeIE;
		this.setAnimation=Sp_setanimIE;
		this.resize=Sp_resizeIE;
		this.switchOn=Sp_switchonIE;
		this.setOpacity=Sp_setOpacityIE;
	}else if(Gl_browser.dom2){
		this.raw=genDiv(-1000,0,20,"Sp_i",Gl_layer_index,'');
		this.ob=this.raw.style;
		this.moveto=Sp_movetoDOM2;
		this.moveTo=Sp_movetoDOM2;
		this.moveTo_l=Sp_movetoDOM2_l;
		this.setImage=Sp_setimageDOM2;
		this.swapImage=Sp_swapimageDOM2;
		this.setFrame=Sp_setframeDOM2;
		this.setAnimation=Sp_setanimDOM2;
		this.resize=Sp_resizeDOM2;
		this.switchOn=Sp_switchonDOM2;
		this.setOpacity=Sp_setOpacityDOM2;
	}else if(Gl_browser.ns4){
		this.ob=genDiv(-1000,0,this.width,"Sp_i",Gl_layer_index,'');
		this.ob.height=this.height;
		this.ob.clip.height=this.height;
		this.moveto=Sp_movetoNS;
		this.moveTo=Sp_movetoNS;
		this.moveTo_l=Sp_movetoNS_l;
		this.setImage=Sp_setimageNS;
		this.swapImage=Sp_swapimageNS;
		this.setFrame=Sp_setframeNS;
		this.setAnimation=Sp_setanimNS;
		this.resize=Sp_resizeNS;
		this.switchOn=Sp_switchonNS;
		this.setOpacity=Gl_null;
	}
	Gl_layers[Gl_layers.length]=this;
	Sp_sprite[Sp_totalsprites]=this;
	Sp_totalsprites++;
	Gl_layer_index++;
	return this
}

function Sp_setCollisionArea(l,r,t,b){
	this.usingCollisionArea=true;
	this.cAl=l;
	this.cAt=t;
	this.cAr=this.width-r;
	this.cAb=this.height-b;
}

function Sp_clearCollisionArea(){
	this.usingCollisionArea=false;
	this.cAl=this.cAt=this.cAr=this.cAb=0;
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

function Sp_setRouteByCommand(p,rL){this.routing=false;this.routingBR=false;this.route=new Array();this.routeLoop=rL;var n,pth='',pthc='',pthi=p,pthA='0123456789macsdfAC;,';for(n=0;n<pthi.length;n++){pthc=pthi.charAt(n);if(pthA.indexOf(pthc)!=-1)pth+=pthc}if(pth.charAt(pth.length-1)==';')pth=pth.substring(0,pth.length-1);var n=0,r,c,a,p2=pth.split(';'),d='macdsfAC';for(n=0;n<p2.length;n++){c=this.route[n*3]=d.indexOf(p2[n].charAt(0));if(c==-1){Gl_alert('setRouteByDirection()','Unknown command "'+p2[n]+'" at index '+n);return}if(c>2){r=p2[n].substring(1,p2[n].length);if(isNaN(r)){Gl_alert('setRouteByDirection()','Illegal value "'+r+'" found at index '+n);return}this.route[(n*3)+1]=parseInt(r)}else{if(p2[n].indexOf(',')==-1){Gl_alert('setRouteByDirection()','Illegal argument to command "'+c+'" (should have 2 arguments) found at index '+n);return}r=p2[n].substring(1,p2[n].length);a=r.split(',');if(isNaN(a[0])||isNaN(a[1])){Gl_alert('setRouteByDirection()','Illegal argument to command "'+c+'" (should be integers) found at index '+n);return}this.route[(n*3)+1]=parseInt(a[0]);this.route[(n*3)+2]=parseInt(a[1])}}this.routingBR=true;this.routeCnt=1;this.routeCI=0;this.routePos=-3}

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
		for(var n=1;n<arguments[0].length;n++)
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
function Sp_stopfollow(){if(this.following){var f=false;for(var n=0;n<this.following.followedby.length;n++){if(this.following.followedby[n]==this){f=true;break}}if(f){for(var n2=n;n2<this.following.followedby.length-1;n2++) this.following.followedby[n2]=this.following.followedby[n2+1];this.following.followedby[this.following.followedby.length-1]=null;this.following.followedby.length--;if(this.following.followedby.length==0) this.following.beingfollowed=false}this.following=null}}
function Sp_target(Sp_a,Sp_x,Sp_y){this.targetting=Sp_a;this.targettingx=Sp_x||0;this.targettingy=Sp_y||0}
function Sp_stopTargetting(Sp_a){this.targetting=null;this.targettingx=0;this.targettingy=0;if(!Sp_a||Sp_a.toLowerCase()!='drift'){this.xspeed=0;this.yspeed=0;this.xdir=0;this.ydir=0;this.speed=0}}
function Sp_setCollides(Sp_a){this.collides=Sp_a}
function Sp_setz(Sp_z){this.z=Sp_z;this.ob.zIndex=Sp_z}
function Sp_setdir(Sp_x,Sp_y){this.xdir=Sp_x;this.ydir=Sp_y;this.xydegs=-1;this.xspeed=this.xdir*this.speed;this.yspeed=this.ydir*this.speed;if(this.fbdSet){this.xydegs=Math.round(360*((Math.atan2(-Sp_x,Sp_y)+3.14159)/6.28318));if(this.frame!=this.fbd[this.xydegs])this.setFrame(this.fbd[this.xydegs])}}

function Sp_getxydegs(){
	if(this.xydegs==-1)
		this.xydegs=Math.round(360*((Math.atan2(-this.xdir,this.ydir)+3.14159)/6.28318));
	return this.xydegs
}

function Sp_setxydegs(Sp_d){
	var d=(Math.floor(Sp_d)%360);
	if(d<0)
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
		this.ob.left=this.x+Sp_xoffset-(this.frame*this.framewidth);
		this.ob.top=this.y+Sp_yoffset-(this.animpos*this.frameheight)
	}
}

function Sp_setframeDOM2(Sp_a){
	this.animpos=this.animsstart;
	this.animtmr=this.animspd;
	this.frame=Sp_a;
	if(!this.off){
		this.ob.left=(this.x+Sp_xoffset)+'px';
		this.ob.top=(this.y+Sp_yoffset)+'px';
	}
	this.ob.backgroundPosition=-(Sp_a*this.framewidth)+"px "+-(this.animpos*this.frameheight)+"px"
}

function Sp_setframeNS(a){
	this.animpos=this.animsstart;
	this.animtmr=this.animspd;
	this.frame=a;
	this.ob.clip.left=a*this.framewidth;
	this.ob.clip.right=(a*this.framewidth)+this.framewidth;
	this.ob.clip.top=this.animpos*this.frameheight;
	this.ob.clip.bottom=(this.animpos+1)*this.frameheight;
	if(!this.off)
		this.ob.moveTo(this.x+Sp_xoffset-(this.frame*this.framewidth),this.y+Sp_yoffset-(this.animpos*this.frameheight))
}

function Sp_setanimIE(Sp_a){
	if(Sp_a>this.animsend)
		Sp_a=this.animsend;
	else if(Sp_a<this.animsstart)
		Sp_a=this.animsstart;
	this.animpos=Sp_a;
	this.ob.clip="rect("+(this.animpos*this.frameheight)+","+((this.frame*this.framewidth)+this.framewidth)+","+((this.animpos*this.frameheight)+this.frameheight)+","+(this.frame*this.framewidth)+")";
	this.moveTo_l()
}

function Sp_setanimDOM2(Sp_a){
	if(Sp_a>this.animsend)
		Sp_a=this.animsend;
	else if(Sp_a<this.animsstart)
		Sp_a=this.animsstart;
	this.animpos=Sp_a;
	this.ob.top=this.y+Sp_yoffset;
	this.ob.left=this.x+Sp_xoffset;
	this.ob.backgroundPosition=-(this.frame*this.framewidth)+"px "+-(this.animpos*this.frameheight)+"px";
	this.moveTo_l()
}

function Sp_setanimNS(Sp_a){
	if(Sp_a>this.animsend)
		Sp_a=this.animsend;
	else if(Sp_a<this.animsstart)
		Sp_a=this.animsstart;
	this.animpos=Sp_a;
	this.ob.clip.top=this.animpos*this.frameheight;
	this.ob.clip.left=this.frame*this.framewidth;
	this.ob.clip.right=(this.frame*this.framewidth)+this.framewidth;
	this.ob.clip.bottom=(this.animpos*this.frameheight)+this.frameheight;
	this.moveTo_l()
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

// cAl,cAr,cAt,cAb

function Sp_check_collide(){
	var sx2,sy2,sx,sy,sxpw,syph,x=0;
	sx=this.iX+this.cAl;
	sy=this.iY+this.cAt;
	sxpw=this.iX+(this.width-1)-this.cAr;
	syph=this.iY+(this.height-1)-this.cAb;
	this.hit=null;
	this.totalhits=0;
	for(;x<Sp_totalsprites;x++){
		sp_b=Sp_sprite[x];
		if(sp_b.on&&(sp_b!=this)){
			sx2=sp_b.iX+sp_b.cAl;
			sy2=sp_b.iY+sp_b.cAt;
			if(!((sx>sx2+sp_b.width-sp_b.cAr)||(sxpw<sx2)||(sy>sy2+sp_b.height-sp_b.cAb)||(syph<sy2))){
				this.hit=this.hitarray[this.totalhits++]=sp_b;
				if(this.hitevents&&this.hitevent[sp_b.index])
					eval(this.hitevent[sp_b.index]);
				if(sp_b.hard){
					Sp_moveBack(this,sp_b);
					if(this.hitevents&&this.hardhitevent)
						eval(this.hardhitevent)
				}
			}
		}
	}
}

function Sp_moveBack(a,b){
	a.collides=false;
	if((a.ydir==0)&&(a.xdir==0))
		a.moveTo(a.x+b.xspeed,a.y+b.yspeed);
	else if(Math.abs(a.xdir)>Math.abs(a.ydir)){
		if(a.xdir>0){
			var amt=(a.iX+a.width)-b.iX;
			var amt2=Math.round(Math.abs(a.ydir/a.xdir)*amt);
			if(a.ydir>0)
				amt2=-amt2;
			a.moveTo(a.iX-amt,a.iY+amt2)
		}else{
			var amt=(b.iX+b.width)-a.iX;
			var amt2=Math.round(Math.abs(a.ydir/a.xdir)*amt);
			if(a.ydir>0)
				amt2=-amt2;
			a.moveTo(a.iX+amt,a.iY+amt2);
		}
	}else{
		if(a.ydir>0){
			var amt=(a.iY+a.height)-b.iY;
			var amt2=Math.round(Math.abs(a.xdir/a.ydir)*amt);
			if(a.xdir>0)
				amt2=-amt2;
			a.moveTo(a.iX+amt2,a.iY-amt)
		}else{
			var amt=(b.iY+b.height)-a.iY;
			var amt2=Math.round(Math.abs(a.xdir/a.ydir)*amt);
			if(a.xdir>0)
				amt2=-amt2;
			a.moveTo(a.iX+amt2,a.iY+amt)
		}
	}
	a.collides=true
}

function Sp_hashit(ob){
	for(var n=0;n<this.totalhits;n++){
		if(this.hitarray[n]==ob)
			return true
	}
	return false
}

function Sp_setanimspd(Sp_a,Sp_b){
	Sp_b=Sp_b.toLowerCase();
	this.crepeat=0;
	this.animspd=Sp_a;
	this.animtmr=Sp_a;
	this.animd=(Sp_b=="forward"?1:-1);
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
	var i=document.images["Sp_i"+this.index];
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
	this.image=img
}

function Sp_setimageNS(img,w,h,w2,h2){
	this.ob.document.open();
	this.ob.document.write("<img src='"+img+"' width="+(w*w2)+" height="+(h*h2)+">");
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
	this.image=img
}

function Sp_swapimageIE(img){
	document.images["Sp_i"+this.index].src=img;
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
	this.width=x;
	this.height=y;
	this.framewidth=x;
	this.frameheight=y;
	this.ob.width=this.width*this.frames;
	this.ob.height=this.height*this.anims;
	this.setAnimation(this.animpos)
}

function Sp_resizeDOM2(x,y){
	this.width=x;
	this.height=y;
	this.framewidth=x;
	this.frameheight=y;
	this.ob.width=this.width*this.frames;
	this.ob.height=this.height*this.anims;
	this.setAnimation(this.animpos)
}

function Sp_resizeNS(x,y){
	this.width=x;
	this.height=y;
	this.framewidth=x;
	this.frameheight=y;
	this.ob.document.open();
	this.ob.document.write("<img src='"+this.image+"' width="+(this.width*this.frames)+" height="+(this.height*this.anims)+">");
	this.ob.document.close();
	this.setAnimation(this.animpos)
}

function Sp_switchonIE(){
	if(!this.on){
		this.on=true;
		this.off=false;
		this.ob.posTop=this.y+Sp_yoffset-(this.animpos*this.frameheight);
		this.ob.posLeft=this.x+Sp_xoffset-(this.frame*this.framewidth);
		Sp_active[Sp_active.length]=this
	}
}

function Sp_switchonDOM2(){
	if(!this.on){
		this.on=true;
		this.off=false;
		this.ob.top=(this.y+Sp_yoffset)+'px';
		this.ob.left=(this.x+Sp_xoffset)+'px';
		Sp_active[Sp_active.length]=this
	}
}

function Sp_switchonNS(){
	if(!this.on){
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
		for(n=0;n<Sp_active2.length;n++){
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

function Sp_setValue(x){
	this.value=x;
}

function Sp_getHits(){
	return this.hitarray;
}