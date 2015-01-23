
plugSimple = {
	AUTHOR: "R0CK",
	VERSION: "v0.00.1-Beta",
	PREFIX: "PlugSimple » ",
	colors: {
		ERROR: "bb0000",
		WARN: "ddbb00",
		SUCCESS: "4bbd00",
		INFO: "009cdd",
		DEFAULT: "ac76ff"
	},
	settings: {
		autoWoot: false,
		autoDJ: false,
	},
	logging: {
		log: function(msg,debug){
			if(debug){
				if(plugSimple.settings.debug){
					console.log("%c"+plugSimple.PREFIX+msg,'color: #'+plugSimple.colors.DEFAULT+'; font-weight:700;');
				}
			}else{
				console.log("%c"+plugSimple.PREFIX+msg,'color: #'+plugSimple.colors.DEFAULT+'; font-weight:700;');
			}
		},

		warn: function(msg,debug){
			if(debug){
				if(plugSimple.settings.debug){
					console.warn("%c"+plugSimple.PREFIX+msg,'color: #'+plugSimple.colors.ALERT+'; font-weight:700;');
				}
			}else{
				console.warn("%c"+plugSimple.PREFIX+msg,'color: #'+plugSimple.colors.ALERT+'; font-weight:700;');
			}
		},

		error: function(msg,debug){
			if(debug){
				if(plugSimple.settings.debug){
					console.error("%c"+plugSimple.PREFIX+msg,'color: #'+plugSimple.colors.WARN+'; font-weight:700;');
				}
			}else{
				console.error("%c"+plugSimple.PREFIX+msg,'color: #'+plugSimple.colors.WARN+'; font-weight:700;');
			}
		},

		info: function(msg,debug){
			if(debug){
				if(plugSimple.settings.debug){
					console.info("%c"+plugSimple.PREFIX+msg,'color: #'+plugSimple.colors.INFO+'; font-weight:700;');
				}
			}else{
				console.info("%c"+plugSimple.PREFIX+msg,'color: #'+plugSimple.colors.INFO+'; font-weight:700;');
			}
		}
	},
	core: {
		createSettings: function(){
			
		},
		saveSettings: function(){
			localStorage.setItem("simplePlug",JSON.stringify(simplePlug.settings));
			simplePlug.logging.info("Settings have been saved.",true);
		}
		getSettings: function(){
			var c = JSON.parse(localStorage.getItem("simplePlug"));
			simplePlug.settings = c;
		}
	},
	init: {
		main: function(){
			
		},
		update: function(){
			
		}
	},
	gui: {
		sendChat: function(m,c,b){
			if(typeof m == "undefined"){
				simplePlug.logging.error("InvalidUsage: simplePlug.gui.sendChat(message,color,badge)");
			}else{
				
			}
		},
	}
};