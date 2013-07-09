function Sd_play(){
	this.sndOb.src=this.URL;
}

function Sd_stop(){
	this.sndOb.src='';
}

function Sd_setBalance(x){
	if(x<-10000) x=-10000;
	else if(x>10000) x=10000;
	this.sndOb.balance=x;
}

function Sd_setVolume(x){
	if(x<0) x=0;
	else if(x>100) x=100;
	this.sndOb.volume=-((100-x)*100);
}

function Sd_setLoop(x){
	this.sndOb.loop=x;
}

function Sd_add_sound(URL){
	this.URL=URL;
	if(Gl_browser.dom2){
		var b=document.getElementsByTagName('BODY');
		this.sndOb=document.createElement('bgsound');
		if(this.sndOb){
			this.sndOb.loop=1;
			this.sndOb.autostart=true;
			b[0].appendChild(this.sndOb);
			this.play=Sd_play;
			this.stop=Sd_stop;
			this.setBalance=Sd_setBalance;
			this.setVolume=Sd_setVolume;
			this.setLoop=Sd_setLoop;
			return this;
		}
	}
	this.play=nullFunc;
	this.stop=nullFunc;
	this.setBalance=nullFunc;
	this.setVolume=nullFunc;
	this.setLoop=nullFunc;
	return this;
}

function nullFunc(){return}