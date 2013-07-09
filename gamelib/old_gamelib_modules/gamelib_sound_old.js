Sd_obs=new Array();
Sd_not_tried_sound=true;
Sd_NS_ob=new Array();

function Sd_play(){
	if(Gl_browser.ns && Sd_obs[this.index]!=null && Sd_obs[this.index].IsReady){
		Sd_obs[this.index].stop();
		Sd_obs[this.index].play()
	}else if(Gl_browser.ie){
		Sd_obs[this.index].stop();
		Sd_obs[this.index].run()
	}
}

function Sd_stop(){
	if(Gl_browser.ns && Sd_obs[this.index].IsReady){
		Sd_obs[this.index].stop()
	}else if(Gl_browser.ie) Sd_obs[this.index].stop()
}

function Sd_null_func(){}

function Sd_test_sound(){
	if(Gl_browser.ie){
		document.body.insertAdjacentHTML("BeforeEnd",'<OBJECT ID="Sd_dummy" STYLE="visibility: hidden" WIDTH=0 HEIGHT=0 CLASSID="CLSID:05589FA1-C356-11CE-BF01-00AA0055595A"><PARAM NAME="ShowDisplay" VALUE="0"><PARAM NAME="ShowControls" VALUE="0"><PARAM NAME="ShowTracker" VALUE="0"><PARAM NAME="PlayCount" VALUE="1"><PARAM NAME="FileName" VALUE="media/dummy.au"></OBJECT>');
		return Sd_dummy.isSoundCardEnabled()
	}else{
		return navigator.mimeTypes["audio/basic"]
	}
}

function Sd_add_sound(Sd_filename){
	if(Sd_not_tried_sound){
		Sd_sndok=Sd_test_sound();
		Sd_not_tried_sound=false
	}
	if(Sd_sndok){
		this.play=Sd_play;
		this.stop=Sd_stop;
		this.mouse=false;
		Sd_obs[Gl_layer_index]=null;
		if(Gl_browser.ie){
			document.body.insertAdjacentHTML("BeforeEnd",'<OBJECT ID="Sd_snd'+Gl_layer_index+'" STYLE="visibility: hidden" WIDTH=0 HEIGHT=0 CLASSID="CLSID:05589FA1-C356-11CE-BF01-00AA0055595A"><PARAM NAME="ShowDisplay" VALUE="0"><PARAM NAME="ShowControls" VALUE="0"><PARAM NAME="ShowTracker" VALUE="0"><PARAM NAME="PlayCount" VALUE="1"><PARAM NAME="FileName" VALUE="'+Sd_filename+'"></OBJECT>');
			Sd_obs[Gl_layer_index]=document["Sd_snd"+Gl_layer_index];
			if(Sd_obs[Gl_layer_index].AutoRewind) Sd_obs[Gl_layer_index].AutoRewind=true
		}else if(Gl_browser.dom2){

		}else{
			Sd_NS_ob[Gl_layer_index]=document.layers["Snd_layer"+Gl_layer_index]=new Layer(Gl_layer_index);
			document["Sd_sound_div"+Gl_layer_index]=Sd_NS_ob[Gl_layer_index];
			Sd_NS_ob[Gl_layer_index].name="Sd_lname"+Gl_layer_index;
			Sd_NS_ob[Gl_layer_index].height=1;
			Sd_NS_ob[Gl_layer_index].left=0;
			Sd_NS_ob[Gl_layer_index].top=0;
			Sd_NS_ob[Gl_layer_index].visibility="hidden";
			Sd_NS_ob[Gl_layer_index].document.open();
			Sd_NS_ob[Gl_layer_index].document.writeln('<EMBED NAME="Sd_snd'+Gl_layer_index+'" SRC="'+Sd_filename+'" HIDDEN="true" AUTOSTART="false" LOOP="false" MASTERSOUND>');
			Sd_NS_ob[Gl_layer_index].document.close();
			Sd_obs[Gl_layer_index]=Sd_NS_ob[Gl_layer_index].document["Sd_snd"+Gl_layer_index]
		}
		this.index=Gl_layer_index
	}else{
		this.play=Sd_null_func;
		this.stop=Sd_null_func
	}
	Gl_layers[Gl_layer_index]=this;
	Gl_layer_index++
}

function Sd_MakeDOMSndOb(){
	var b=document.getElementsByTagName('BODY');
	var sndOb=document.createElement('bgsound');
	sndOb.loop=1;
	sndOb.autostart=true;
	b[0].appendChild(sndOb);
	sndOb.src=URL;
	return sndOb;
}