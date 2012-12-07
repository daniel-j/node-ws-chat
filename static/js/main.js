
//require(     ['ViewManager', 'LoginManager', 'UserManager', 'ChatManager'], function ( ViewManager,   LoginManager,   UserManager,   ChatManager ) {

(function () {
	'use strict';
	
	var wsHost = 'ws://'+document.location.host+'/';
	var wsProtocol = 'chat';

	var ws = null;
	var myNick = '';

	var views        = new ViewManager();
	var loginManager = new LoginManager();
	var userlist     = new UserManager();
	var chat         = new ChatManager();

	function hideConnect() {
		views.addStateFor('connect', 'top');
		views.removeStateFor('chat', 'behind');
	}
	function showConnect() {
		views.removeStateFor('connect', 'top');
		views.addStateFor('chat', 'behind');
	}

	function sendPacket(obj) {
		if (ws && ws.readyState === 1) {
			ws.send(JSON.stringify(obj));
		} else {
			throw "Unable to write on socket "+(ws && ws.readyState);
		}
	}

	function wsOpen(e) {
		sendPacket({nick: myNick});
	}
	function wsMessage(e) {
		var data = JSON.parse(e.data);
		
		if (typeof data.nick !== 'undefined') {
			if (typeof data.index === 'undefined') { // Your nick/welcome
				
				hideConnect();

			} else {

			}
		}
		if (typeof data.userlist !== 'undefined') {
			userlist.clear();
			data.userlist.forEach(function (info) {
				userlist.addUser(info);
			});
			userlist.update();
		}
		if (typeof data.join !== 'undefined') {
			userlist.addUser(data.join);
			userlist.update();
		}
		if (typeof data.leave !== 'undefined') {
			userlist.removeUser(data.leave);
		}
		if (typeof data.error !== 'undefined') {
			alert(data.error);
			loginManager.logout();
			showConnect();
		}
	}
	function wsClose(e) {
		ws.removeEventListener('open', 		wsOpen);
		ws.removeEventListener('message', 	wsMessage);
		ws.removeEventListener('close', 	wsClose);
		ws.removeEventListener('error', 	wsError);
		ws = null;
	}
	function wsError(e) {
		alert("WebSocket error");
		console.log(e);
	}

	loginManager.loginAttemptCallback = function (nick) {
		myNick = nick;
		
		ws = new WebSocket(wsHost, wsProtocol);
		ws.addEventListener('open', 	wsOpen);
		ws.addEventListener('message', 	wsMessage);
		ws.addEventListener('close', 	wsClose);
		ws.addEventListener('error', 	wsError);
	}
}());
//});