
define(function () {
	
	function zeroFill(v) {
		if (v <= 9) {
			v = "0"+v;
		}
		return v;
	}

	function ChatItem(config) {
		this.type = config.type;
		this.user = config.user || null;
		this.node = document.createElement('div');
		this.timestamp = config.timestamp;

		this.node.classList.add('post');

		this.timestampNode = document.createElement('span');
		this.timestampNode.classList.add('timestamp');
		this.timestampNode.textContent = zeroFill(this.timestamp.getHours())+':'+zeroFill(this.timestamp.getMinutes());

		this.nickNode = document.createElement('span');
		this.nickNode.classList.add('nick');

		this.messageNode = document.createElement('span');
		this.messageNode.classList.add('message');

		if (this.type === ChatItem.TYPE_CHAT) {
			this.node.appendChild(this.timestampNode);
			this.node.appendChild(this.nickNode);
			this.node.appendChild(this.messageNode);
		} else if (config.type === ChatItem.TYPE_CONSOLE) {
			this.node.appendChild(this.timestampNode);
			this.node.appendChild(this.messageNode);
		} else {
			throw "Invalid type "+config.type;
		}

		this.update(config);
	}
	ChatItem.TYPE_CHAT = 0;
	ChatItem.TYPE_CONSOLE = 1;

	ChatItem.prototype.update = function (config) {
		if ('nick' in config.type === ChatItem.TYPE_CHAT) {
			this.nickNode.textContent = this.nick;
		}
		if ('message' in config) {
			this.messageNode.textContent = this.nick;
		}
	}


	return ChatItem;
});
