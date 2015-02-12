
plugSimple = {
	AUTHOR: "R0CK",
	VERSION: "v0.00.2-Beta",
	PREFIX: "PlugSimple » ",
	colors: {
		ERROR: "bb0000",
		WARN: "ddbb00",
		SUCCESS: "4bbd00",
		INFO: "009cdd",
		DEFAULT: "ac76ff",
		status: [
			"89be6c",//Avail
			"ffdd6f",//Away
			"f04f30",//Working
			"ac76ff" //Gaming
		]
	},
	settings: {
		autowoot: false,
		autodj: false,
		debug: false
	},
	logging: {
		log: function(msg,debug){
			if(debug && plugSimple.settings.debug){
				console.log("%c"+plugSimple.PREFIX+msg,"color: #"+plugSimple.colors.DEFAULT+"; font-weight:700;");
			}else if(!debug){
				console.log("%c"+plugSimple.PREFIX+msg,"color: #"+plugSimple.colors.DEFAULT+"; font-weight:700;");
			}
		},
		warn: function(msg,debug){
			if(debug && plugSimple.settings.debug){
				console.warn("%c"+plugSimple.PREFIX+msg,"color: #"+plugSimple.colors.ERROR+"; font-weight:700;");
			}else if(!debug){
				console.warn("%c"+plugSimple.PREFIX+msg,"color: #"+plugSimple.colors.ERROR+"; font-weight:700;");
			}
		},
		error: function(msg,debug){
			if(debug && plugSimple.settings.debug){
				console.error("%c"+plugSimple.PREFIX+msg,"color: #"+plugSimple.colors.WARN+"; font-weight:700;");
			}else if(!debug){
				console.error("%c"+plugSimple.PREFIX+msg,"color: #"+plugSimple.colors.WARN+"; font-weight:700;");
			}
		},
		info: function(msg,debug){
			if(debug && plugSimple.settings.debug){
				console.info("%c"+plugSimple.PREFIX+msg,"color: #"+plugSimple.colors.INFO+"; font-weight:700;");
			}else if(!debug){
				console.info("%c"+plugSimple.PREFIX+msg,"color: #"+plugSimple.colors.INFO+"; font-weight:700;");
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
			if(API.getWaitListPosition() === -1 && API.getDJ().id !== API.getUser().id){$("#dj-button").click();}
			API.on(API.ADVANCE,function(){
				if(API.getWaitListPosition() === -1 && API.getDJ().id !== API.getUser().id){
					$("#dj-button").click();
					plugSimple.logging.info("Running AutoDJ",true);
				}
			});
		},
	},
	init: {
		main: function(){
			var s = new Date().getMilliseconds();
			//LOAD EXTERNAL SCRIPTS
			$.getScript("https://rawgit.com/itotallyrock/PlugInterfaceAPI/master/plugInterfaceAPI.js");
			$.getScript("https://rawgit.com/itotallyrock/PlugCommandAPI/master/plugCommandAPI.js");
			
			if(localStorage.getItem("plugSimple") !== null){
				plugSimple.core.getSettings();
			}else{
				plugSimple.core.saveSettings();
			}
			
			if(plugSimple.settings.autowoot){plugSimple.core.autoWoot();}
			if(plugSimple.settings.autodj){plugSimple.core.autoDJ();}
			
			var settingsCommand = new Command("settings",["type"]);
			settingsCommand.callback = function(a){
				plugSimple.settings[a[0]] = !plugSimple.settings[a[0]];
				//plugInterface.chat("",(plugSimple.settings[a[0]] ? "Enabled" : "Disabled")+" AutoWoot"){}
				plugSimple.logging.info((plugSimple.settings[a[0]] ? "Enabled" : "Disabled")+" "+a);
			};
			
			API.on(API.CHAT, function(e){
				$(".cm[data-cid=\""+e.cid+"\"] > .badge-box").css("border","2px solid #"+plugSimple.colors.status[API.getUser(e.uid).status]);
			});
			
			plugSimple.logging.info("Started in "+(new Date().getMilliseconds() - s)+"ms");
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
			
			if(plugSimple.settings.autowoot){plugSimple.core.autoWoot();}
			if(plugSimple.settings.autodj){plugSimple.core.autoDJ();}
			
			API.on(API.CHAT, function(e){
				$(".cm[data-cid=\""+e.cid+"\"] > .badge-box").css("border","2px solid #"+plugSimple.colors.status[API.getUser(e.uid).status]);
			});
			
			plugSimple.logging.info("Ran update in "+(new Date().getMilliseconds() - s)+"ms",true);
		},
		stop: function(e){
			plugSimple.core.saveSettings();
			var q;
			
			for(q in API){
				if(typeof API[q] === "string"){
					API.off(API[q]);
				}
			}
			
			plugSimple.logging.warn("plugSimple has stopped ["+e+"].");
			delete plugSimple;
		}
	}
};

plugSimple.init.main();