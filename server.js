#!/usr/bin/env node
'use strict';

var port = 8080;

var http = require('http');
var express = require('express');
var WebSocketServer = require('ws').Server;
//var reqjs = require('requirejs');

// This module is shared between server and client, using require.js
//var User = reqjs('static/js/User');
var User = require(__dirname + '/static/js/User.js');

var app = express();
app.use(express.static(__dirname + '/static'));
var server = http.createServer(app);
var wss = new WebSocketServer({server: server});
server.listen(port, function () {
	console.log("Chat server started on port "+port);
});

var users = [];

function sendPacket(ws, obj) {
	ws.send(JSON.stringify(obj));
}
function sendError(ws, message) {
	sendPacket(ws, {error: message});
	ws.close();
}
function sendConsole(ws, message) {
	sendPacket(ws, {console: message});
}

// Only broadcast to "authenticated" users (user.ready === true)
function broadcastPacket(obj, except) {
	var data = JSON.stringify(obj);
	for (var i = 0; i < users.length; i++) {
		if (users[i].socket !== except && users[i].ready) {
			users[i].socket.send(data);
		}
	}
}

function nickExists(nick) {
	for (var i = 0; i < users.length; i++) {
		if (nick === users[i].nick) {
			return true;
		}
	}
	return false;
}
function fixNick(nick) {
	return nick.trim();
}

wss.on('connection', function (ws) {

	var user = new User({socket: ws});

	users.push(user);

	function handleData(data) {
		if (typeof data.nick !== 'undefined' && data.nick.length > 0) {

			// Remove surrounding whitewpace.. might add more limitations later on
			var nick = fixNick(data.nick);

			if (!user.ready) { // New user

				if (nickExists(nick)) {

					// sendError closes socket
					sendError(ws, "Nick is in use");
					return;

				} else {
					
					// Save nick
					user.update({nick: nick, ready: true});

					// Send userlist and new nick to joining user
					sendPacket(ws, {
						nick: user.nick,
						userlist: users
					});

					// Send join notification to all other users
					broadcastPacket({
						join: user
					}, ws);
				}

			} else { // User changed nick

				if (!nickExists(nick)) { // No other user with this nick

					user.update({nick: nick});

					// Notify other users
					broadcastPacket({
						update: {
							nick: nick
						},
						index: users.indexOf(user)
					});


				} else { // Nick exists

					sendConsole(ws, "Nick is in use");

				}

			}
		}

		if (user.ready) {
			if (typeof data.chat !== 'undefined') {
				var message = data.chat;
				broadcastPacket({
					chat: message,
					timestamp: new Date(),
					index: users.indexOf(user)
				});
			}
		}
	}

	// Got a packet from client
	ws.on('message', function (message, flags) {

		var data;

		// Invalid JSON will not crash the server
		try {
			data = JSON.parse(message);
		} catch (e) {
			var err = "JSON error "+message+" "+e.toString();
			console.log(err);

			sendError(ws, err);
		}

		// Try-catch statements deoptimizes, handle data in other function
		if (data) {
			handleData(data);
		}
		

	});

	// Client got disconnected
	ws.on('close', function () {

		var index = users.indexOf(user);

		broadcastPacket({
			leave: index
		}, ws);

		// Remove user from array
		users.splice(index, 1);
	});
});