
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
		debug: false
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
		saveSettings: function(){
			localStorage.setItem("plugSimple",JSON.stringify(plugSimple.settings));
			plugSimple.logging.info("Settings have been saved.",true);
		},
		getSettings: function(){
			plugSimple.settings = JSON.parse(localStorage.getItem("plugSimple"));
			plugSimple.logging.info("Retrieved Settings",true);
		},	
		autoWoot: function(){
			$("#woot").click();
			API.on(API.ADVANCE,function(){
				$("#woot").click();
				plugSimple.logging.info("Running AutoWoot",true);
			});
		},
		autoDJ: function(){
			API.on(API.ADVANCE,function(){
				if(API.getWaitListPosition() === -1 && API.getDJ().id !== API.getUser().id){
					$("#dj-button").click();
					plugSimple.logging.info("Running AutoDJ",true);
				}
			});
		}
	},
	init: {
		main: function(){
			var s = new Date().getMilliseconds();
			if(localStorage.getItem("pluggedIn") !== null){
				plugSimple.core.getSettings();
			}else{
				plugSimple.core.saveSettings();
			}
			pluggedIn.core.info("Started in "+(new Date().getMilliseconds() - start)+"ms",true);
		},
		update: function(){
			plugSimple.core.saveSettings();
			var q,
				s = new Date().getMilliseconds();
			
			for(q in API){
				if(typeof API[q] === "string"){
					API.off(API[q]);
				}
			}
			
			pluggedIn.core.info("Ran update in "+(new Date().getMilliseconds() - s)+"ms",true);
		},
		stop: function(){
			plugSimple.core.saveSettings();
			var q;
			
			for(q in API){
				if(typeof API[q] === "string"){
					API.off(API[q]);
				}
			}
			
			plugSimple.logging.warn("plugSimple has stopped.");
			delete plugSimple;
		}
	},
	gui: {
		sendChat: function(m,c,b,f){
			if(typeof m == "undefined"){
				plugSimple.logging.error("InvalidUsage: plugSimple.gui.sendChat(message,color,badge)");
			}else{
				API.chatLog((typeof f === "undefined" ? "": f+" - ")+m,c)//Temporary
			}
		},
	}
};

plugSimple.init.main();