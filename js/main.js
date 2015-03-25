if(typeof plugSimple !== "undefined"){plugSimple.init.stop(1);}
plugSimple = {
	AUTHOR: "R0CK",
	VERSION: "0.03.4",
	PREFIX: "[PlugSimple]",
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
	img: {
		AUTOWOOT_ON: "https://raw.githubusercontent.com/itotallyrock/PlugSimple/master/img/autowoot-on.png",
		AUTOWOOT_OFF: "https://raw.githubusercontent.com/itotallyrock/PlugSimple/master/img/autowoot-dis.png"
	},
	tickRate: 1,//Ticks per second
	tickNum: 0,
	tick: "",
	settings: {
		autowoot: false,
		autodj: false,
		debug: false,
		chatLog: false,
		tickLog: false
	},
	logging: {
		log: function(msg,debug){
			if(debug && plugSimple.settings.debug){
				console.log("%c"+plugSimple.PREFIX,"color: #"+plugSimple.colors.DEFAULT+"; font-weight:700",msg);
			}else if(!debug){
				console.log("%c"+plugSimple.PREFIX,"color: #"+plugSimple.colors.DEFAULT+"; font-weight:700",msg);
			}
		},
		warn: function(msg,debug){
			if(debug && plugSimple.settings.debug){
				console.warn("%c"+plugSimple.PREFIX,"color: #"+plugSimple.colors.WARN+"; font-weight:700",msg);
			}else if(!debug){
				console.warn("%c"+plugSimple.PREFIX,"color: #"+plugSimple.colors.WARN+"; font-weight:700",msg);
			}
		},
		error: function(msg,debug){
			if(debug && plugSimple.settings.debug){
				console.error("%c"+plugSimple.PREFIX,"color: #"+plugSimple.colors.ERROR+"; font-weight:700",msg);
			}else if(!debug){
				console.error("%c"+plugSimple.PREFIX,"color: #"+plugSimple.colors.ERROR+"; font-weight:700",msg);
			}
		},
		info: function(msg,debug){
			if(debug && plugSimple.settings.debug){
				console.info("%c"+plugSimple.PREFIX,"color: #"+plugSimple.colors.INFO+"; font-weight:700",msg);
			}else if(!debug){
				console.info("%c"+plugSimple.PREFIX,"color: #"+plugSimple.colors.INFO+"; font-weight:700",msg);
			}
		},
		success: function(msg,debug){
			if(debug && plugSimple.settings.debug){
				console.log("%c"+plugSimple.PREFIX,"color: #"+plugSimple.colors.SUCCESS+"; font-weight:700",msg);
			}else if(!debug){
				console.log("%c"+plugSimple.PREFIX,"color: #"+plugSimple.colors.SUCCESS+"; font-weight:700",msg);
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
		clearSettings: function(){
			localStorage.removeItem("plugSimple");
			plugSimple.logging.info("Cleared Settings",true);
			plugSimple.core.getSettings();
		},
		getTick: function(){
			return plugSimple.tickNum;
		},
		getETA: function(){
			if(API.getDJ() !== null && API.getDJ().id === API.getUser().id){
				return "00:00:00";
			}
			var history = API.getHistory(),histlength = 0, avg = 0;
			for(var i in history){
				histlength += history[i].media.duration;
			}
			avg = histlength/history.length;
			
			var sn = parseInt((API.getWaitListPosition() == -1 ? API.getWaitList().length : API.getWaitListPosition())*avg+API.getTimeRemaining(), 10);
			var h = Math.floor(sn / 3600);
			var m = Math.floor((sn - (h * 3600)) / 60);
			var s = sn - (h * 3600) - (m * 60);
			
			return (h < 10 ? "0"+h : h)+':'+(m < 10 ? "0"+m : m)+':'+(s < 10 ? "0"+s : s);
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
		chatStatus: function(){
			API.on(API.CHAT, function(e){
				if(plugSimple.settings.debug && plugSimple.settings.chatLog){
					console.log("%c"+plugSimple.PREFIX,"color: #"+plugSimple.colors.DEFAULT+"; font-weight:700","ChatEvent",[e]);
				}
				var color = plugSimple.colors.status[API.getUser(e.uid).status];
				if(e.uid == API.getUser().id){
					color = "ffdd6f";
				}else if(API.getUser(e.uid).friends){
					color = "00b5e6";
				}else if(API.getUser(e.uid).role > 0){
					color = plugSimple.colors.DEFAULT;
				}else if($(".cm[data-cid=\""+e.cid+"\"] > .badge-box > i").hasClass("bdg-ba")){
					color = "90ad2f";
				}else{
					color = "777f92";
				}
				plugSimple.logging.info("chat msg color = #"+color, true);
				$(".cm[data-cid=\""+e.cid+"\"] > .badge-box").css("border","2px solid #"+color);
			});
		}
	},
	init: {
		main: function(){
			var s = new Date().getMilliseconds();
			
			plugSimple.PREFIX = "[PlugSimple v"+plugSimple.VERSION+"]";
			
			//LOAD EXTERNAL SCRIPTS
			//if(typeof plugInterface == "undefined"){plugSimple.logging.log("Loaded plugInterfaceAPI status "+$.getScript("https://rawgit.com/itotallyrock/PlugInterfaceAPI/master/plugInterfaceAPI.js").readyState,true);}
			if(typeof Command == "undefined"){
				var readyState = $.getScript("https://rawgit.com/itotallyrock/PlugCommandAPI/master/plugCommandAPI.js").readyState;
				plugSimple.logging.log("Loaded plugCommandAPI status "+readyState,true);
				if(readyState > -1){
					plugSimple.init.cmd();
				}
			}else{
				plugSimple.logging.info("plugCommandAPI already loaded continuing",true);
			}
			
			if(localStorage.getItem("plugSimple") !== null){
				plugSimple.core.getSettings();
			}else{
				plugSimple.core.getSettings();
				plugSimple.core.saveSettings();
			}
			
			if(plugSimple.settings.autowoot){plugSimple.core.autoWoot();}
			if(plugSimple.settings.autodj){plugSimple.core.autoDJ();}
			
			$("#dj-button").html($("#dj-button").html()+"<div class=\"bottom\"><span class=\"plugSimple-eta\"></span></div>");
			$("#dj-button > .bottom").css("margin-top","-40px");
			
			plugSimple.core.chatStatus();
			
			plugSimple.tick = setInterval(function(){plugSimple.init.tick();plugSimple.tickNum++;},(1/plugSimple.tickRate)*1000);
			
			plugSimple.logging.info("Started in "+(new Date().getMilliseconds() - s)+"ms");
		},
		tick: function(){//WILL RUN EVERY TICKRATE
			var s = new Date().getMilliseconds();
			if(plugSimple.tickNum%10 === 0 && plugSimple.settings.tickLog){
				plugSimple.logging.log("TICK #"+plugSimple.tickNum,true);
			}
			$(".plugSimple-eta").text(plugSimple.core.getETA());
			if(new Date().getMilliseconds() - s > (1/plugSimple.tickRate)*1000){
				plugSimple.logging.info("Tick took longer than tickRate: "+(new Date().getMilliseconds() - s)+"ms",true);
			}
		},
		cmd: function(){//Initialize commands
			new Command("settings",["type"]).callback = function(a){
				a[0] = a[0].toLowerCase();
				console.log("typeof setting = "+typeof plugSimple.settings[a[0]]);
				if(typeof plugSimple.settings[a[0]] == "undefined"){throw new SyntaxError("Unknown Setting "+a[0]);}
				plugSimple.settings[a] = !plugSimple.settings[a[0]];
				plugInterface.chat("info",(plugSimple.settings[a[0]] ? "Enabled" : "Disabled")+" "+a[0]);
				plugSimple.logging.info((plugSimple.settings[a[0]] ? "Enabled" : "Disabled")+" "+a);
			};
			plugSimple.logging.log("Created settings Command",true);
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
			
			clearInterval(plugSimple.tick);
			plugSimple.tick = setInterval(function(){plugSimple.init.tick();plugSimple.tickNum++;},(1/plugSimple.tickRate)*1000);
			
			if(plugSimple.settings.autowoot){plugSimple.core.autoWoot();}
			if(plugSimple.settings.autodj){plugSimple.core.autoDJ();}
			
			API.on(API.CHAT, function(e){
				$(".cm[data-cid=\""+e.cid+"\"] > .badge-box").css("border","2px solid #"+plugSimple.colors.status[API.getUser(e.uid).status]);
			});
			
			plugSimple.logging.info("Ran update in "+(new Date().getMilliseconds() - s)+"ms",true);
		},
		stop: function(e){
			var s = new Date().getMilliseconds(),q,errCodes = ["undefined","Relaunching","Unknown Crash","Syntax Crash","Stuck in loop"];
			plugSimple.core.saveSettings();
			
			for(q in API){
				if(typeof API[q] === "string"){
					API.off(API[q]);
				}
			}
			clearInterval(plugSimple.tick);
			if(e > 1){
				plugSimple.logging.error("plugSimple has stopped ("+(new Date().getMilliseconds() - s)+"ms) ["+errCodes[e]+"].");
			}else{
				plugSimple.logging.warn("plugSimple has stopped ("+(new Date().getMilliseconds() - s)+"ms) ["+errCodes[e]+"].");
			}
			delete plugSimple;
		}
	}
};
plugSimple.init.main();