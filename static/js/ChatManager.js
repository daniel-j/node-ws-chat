
define(['ChatItem'], function (ChatItem) {

	function ChatManager() {
		var self = this;

		this.chatContainer = document.querySelector('#chatContainer');
		this.log = [];
		this.chatForm = document.querySelector('#chatForm');
		this.inputChat = this.chatForm.querySelector('#inputChat');

		this.canChat = false;

		this.chatForm.addEventListener('submit', function (e) {
			e.preventDefault();
			if (self.canChat) {

			}
		}, false);
	}

	ChatManager.prototype.addChat = function (user, message) {
		var item = new ChatItem({type: ChatItem.TYPE_CHAT, user: user, message: message});
		this.addItem(item);
	}

	ChatManager.prototype.addConsole = function (message) {
		var item = new ChatItem({type: ChatItem.TYPE_CONSOLE, message: message});
		this.addItem(item);
	}

	ChatManager.prototype.addItem = function (item) {
		this.log.push(item);
		this.chatContainer.appendChild(item.node);
	}

	ChatManager.prototype.disable = function (doDisable) {
		if (typeof doDisable === 'undefined') {
			doDisable = true;
		}
		
	}

	return ChatManager;
});