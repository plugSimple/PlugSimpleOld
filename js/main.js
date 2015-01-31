
plugSimple = {
	AUTHOR: "R0CK",
	VERSION: "v0.00.2-Beta",
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
			if(debug && plugSimple.settings.debug){
				console.log("%c"+plugSimple.PREFIX+msg,"color: #"+plugSimple.colors.DEFAULT+"; font-weight:700;");
			}else{
				console.log("%c"+plugSimple.PREFIX+msg,"color: #"+plugSimple.colors.DEFAULT+"; font-weight:700;");
			}
		},
		warn: function(msg,debug){
			if(debug && plugSimple.settings.debug){
				console.warn("%c"+plugSimple.PREFIX+msg,"color: #"+plugSimple.colors.ERROR+"; font-weight:700;");
			}else{
				console.warn("%c"+plugSimple.PREFIX+msg,"color: #"+plugSimple.colors.ERROR+"; font-weight:700;");
			}
		},
		error: function(msg,debug){
			if(debug && plugSimple.settings.debug){
				console.error("%c"+plugSimple.PREFIX+msg,"color: #"+plugSimple.colors.WARN+"; font-weight:700;");
			}else{
				console.error("%c"+plugSimple.PREFIX+msg,"color: #"+plugSimple.colors.WARN+"; font-weight:700;");
			}
		},
		info: function(msg,debug){
			if(debug && plugSimple.settings.debug){
				console.info("%c"+plugSimple.PREFIX+msg,"color: #"+plugSimple.colors.INFO+"; font-weight:700;");
			}else{
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
			API.on(API.ADVANCE,function(){
				if(API.getWaitListPosition() === -1 && API.getDJ().id !== API.getUser().id){
					$("#dj-button").click();
					plugSimple.logging.info("Running AutoDJ",true);
				}
			});
		},
		
		cleanHTMLMessage: function(input, disallow, extra_allow) {
			if (input == null) return "";
			var allowed, tags, disallowed = [];
			if ($.isArray(disallow)) disallowed = disallow;
			if (!extra_allow || !$.isArray(extra_allow)) extra_allow = [];
			allowed = $(["span", "div", "table", "tr", "td", "br", "br/", "strong", "em", "a"].concat(extra_allow)).not(disallowed).get();
			if (disallow === "*") allowed = [];
			tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
			input = input.split("&#8237;").join("&amp;#8237;").split("&#8238;").join("&amp;#8238;");
			return input.replace(tags, function(a, b) {
				return allowed.indexOf(b.toLowerCase()) > -1 ? a : "";
			});
		}
	},
	init: {
		main: function(){
			var s = new Date().getMilliseconds();
			if(localStorage.getItem("plugSimple") !== null){
				plugSimple.core.getSettings();
			}else{
				plugSimple.core.saveSettings();
			}
			
			if(plugSimple.settings.autoWoot){plugSimple.core.autoWoot();}
			if(plugSimple.settings.autoDJ){plugSimple.core.autoDJ();}
			
			plugSimple.logging.info("Started in "+(new Date().getMilliseconds() - s)+"ms",true);
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
			
			if(plugSimple.settings.autoWoot){plugSimple.core.autoWoot();}
			if(plugSimple.settings.autoDJ){plugSimple.core.autoDJ();}
			
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
	},
	gui: {
		chatLog: function(type, message, color, fromID, fromName) {
            var $chat, b, $message, $box, $msg, $text, $msgSpan, $from, from;

            if (!message) return;
            if (typeof message !== "string") message = message.html();

            message = plugSimple.core.cleanHTMLMessage(message);
            $msgSpan = $("<span>").html(message);

            $chat = $("#chat-messages");
            b = $chat.scrollTop() > $chat[0].scrollHeight - $chat.height() - 20;

            $message = $("<div>").addClass(type ? type : "message");
            $box = $("<div>").addClass("badge-box").data("uid", fromID ? fromID : "p3");
            $from = $("<div>").addClass("from").append($("<span>").addClass("un"));
            $msg = $("<div>").addClass("msg").append($from);
            $text = $("<span>").addClass("text").append($msgSpan);

            if(type == "system"){
                $box.append("<i class=\"icon icon-chat-system\"></i>");
            }else if(type == "info"){
				
			}else{
                $box.append("<i class=\"icon icon-plugcubed\"></i>");
                $msgSpan.css("color", color ? "#"+color : "#d1d1d1");
            }

            if(fromID){
                from = API.getUser(fromID);
                var lastMessageContainer = $("#chat-messages").find(".message").last();
                var lastSender = lastMessageContainer.children(".badge-box").data("uid");

                if (from != null && from.username != null) {
                    if (lastSender == from.id) {
                        lastMessageContainer.find(".text").append("<br>").append($msgSpan);
                        if ($chat.scrollTop() > $chat[0].scrollHeight - $chat.height() - lastMessageContainer.find(".text").height())
                            $chat.scrollTop($chat[0].scrollHeight);
                        return;
                    }

                    $from.find(".un").html(plugSimple.core.cleanHTMLMessage(from.username));

                    if (API.hasPermission(from.id, API.ROLE.HOST, true)) {
                        $message.addClass("from-admin");
                        $from.addClass("admin").append("<i class=\"icon icon-chat-admin\"></i>");
                    } else if (API.hasPermission(from.id, API.ROLE.BOUNCER, true)) {
                        $message.addClass("from-ambassador");
                        $from.addClass("ambassador").append("<i class=\"icon icon-chat-ambassador\"></i>");
                    } else if (API.hasPermission(from.id, API.ROLE.BOUNCER)) {
                        $from.addClass("staff");
                        if (API.hasPermission(from.id, API.ROLE.HOST))
                            $message.addClass("from-host");
                        if (API.hasPermission(from.id, API.ROLE.COHOST)) {
                            $message.addClass("from-cohost");
                            $from.append("<i class=\"icon icon-chat-host\"></i>");
                        } else if (API.hasPermission(from.id, API.ROLE.MANAGER)) {
                            $message.addClass("from-manager");
                            $from.append("<i class=\"icon icon-chat-manager\"></i>");
                        } else if (API.hasPermission(from.id, API.ROLE.BOUNCER)) {
                            $message.addClass("from-bouncer");
                            $from.append("<i class=\"icon icon-chat-bouncer\"></i>");
                        }
                    } else if (API.hasPermission(from.id, API.ROLE.DJ)) {
                        $message.addClass("from-dj");
                        $from.addClass("dj").append("<i class=\"icon icon-chat-dj\"></i>");
                    } else if (from.id == API.getUser().id) {
                        $message.addClass("from-you");
                        $from.addClass("you");
                    }
                }else if (fromID < 0){
                    $from.find(".un").html("PlugSimple");
                    if (lastSender == fromID) {
                        lastMessageContainer.find(".text").append("<br>").append($msgSpan);
                        if ($chat.scrollTop() > $chat[0].scrollHeight - $chat.height() - lastMessageContainer.find(".text").height())
                            $chat.scrollTop($chat[0].scrollHeight);
                        return;
                    }
                }else{
                    $from.find(".un").html(fromName ? plugSimple.core.cleanHTMLMessage(fromName) : "Unknown");
                }
            }else{
                $from.find(".un").html("PlugSimple");
            }

            $chat.append($message.append($box).append($msg.append($text)));
            if(b){
                $chat.scrollTop($chat[0].scrollHeight);
            }
        },
	}
};

plugSimple.init.main();