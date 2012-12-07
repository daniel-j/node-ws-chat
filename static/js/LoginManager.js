
//define(function () {
var LoginManager = (function () {
	'use strict';

	function LoginManager() {
		var self = this;
		this.loginForm = document.querySelector('#loginForm');
		this.inputNick = loginForm.querySelector('#inputNick');
		this.submitLogin = loginForm.querySelector('#submitLogin');

		this.canLogin = true;
		this.loginAttemptCallback = null;
		this.disableElements = [this.inputNick, this.submitLogin];

		loginForm.addEventListener('submit', function (e) {
			e.preventDefault();
			var nick = self.inputNick.value.trim();
			if (self.canLogin && nick.length > 0) {
				
				self.disableElements.forEach(function (elem) {
					elem.disabled = true;
				});

				self.canLogin = false;
				self.loginAttemptCallback(nick);
			}
		}, false);
	}

	LoginManager.prototype.disable = function (doDisable) {
		if (typeof doDisable === 'undefined') {
			doDisable = true;
		}
		this.disableElements.forEach(function (elem) {
			elem.disabled = doDisable;
		});
	}

	LoginManager.prototype.loginFailed = function (reason) {
		this.disable(false);
		this.inputNick.focus();
		this.canLogin = true;
	}

	LoginManager.prototype.logout = function (clearForm) {
		this.disable(false);
		if (clearForm) {
			this.inputNick.value = "";
		}
		this.inputNick.focus();
		this.canLogin = true;
	}

	
	
	return LoginManager;
}());
//});