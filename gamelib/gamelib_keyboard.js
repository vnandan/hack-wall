var 	Kb_keys=new Array(),
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