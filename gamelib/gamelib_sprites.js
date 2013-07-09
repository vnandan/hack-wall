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
	t.shootDelay=0;
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
	t.setShootDelay=Sp_setShootDelay;
	t.getHits=Sp_getHits;
	t.setCollisionZTest=Sp_setCollisionZTest;
	t.destroy=Sp_destroy;
	if(Gl_browser.ie){
		document.body.insertAdjacentHTML("BeforeEnd",'<img src="" id="Sp_i'+Gl_layer_index+'" name="Sp_i'+Gl_layer_index+'" style="position: absolute; left:-1000; top:0">');
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
function Sp_setCollides(Sp_a){this.collides=Sp_a;if(!Sp_a){this.hitarray=new Array();this.hit=null}}
function Sp_setz(Sp_z){this.z=Sp_z;this.ob.zIndex=Sp_z}
function Sp_setdir(Sp_x,Sp_y){this.xdir=Sp_x;this.ydir=Sp_y;this.xydegs=-1;this.xspeed=this.xdir*this.speed;this.yspeed=this.ydir*this.speed;if(this.fbdSet){this.xydegs=Math.round(360*((Math.atan2(-Sp_x,Sp_y)+3.14159)/6.28318));if(this.frame!=this.fbd[this.xydegs])this.setFrame(this.fbd[this.xydegs])}}
function Sp_getxydegs(){if(this.xydegs==-1)this.xydegs=Math.round(360*((Math.atan2(-this.xdir,this.ydir)+3.14159)/6.28318));return this.xydegs}

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
	for(;x<sAl;x++){
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
	for(var n=0;n<this.totalhits;n++){
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
function Sp_setFalling(x){this.falling=x;}
function Sp_setJumping(x){this.jumping=x;}
function Sp_setJumpSpeed(x){this.jumpSpeed=x;}
function Sp_setFallingSpeed(x){this.fallingSpeed=x;}
function Sp_setFinishPos(x){this.finishPos=x;}
function Sp_setFly(x){this.fly=x;}
function Sp_setShootDelay(x){this.shootDelay=x;}
function Sp_getHits(){
	return this.hitarray;
}

function Sp_setCollisionZTest(x){
	this.zDiffMax=x;
}

function Sp_destroy(){
	this.switchOff();
	this.destroyed=true;
}
