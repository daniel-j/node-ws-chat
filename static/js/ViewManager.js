
define(['View'], function (View) {
	'use strict';

	function ViewManager() {
		this.views = {};
		this.viewList = [];

		var viewElements = document.querySelectorAll('.view');
		
		for (var i = 0; i < viewElements.length; i++) {
			var view = new View(viewElements[i]);
			this.views[view.name] = view;
			this.viewList.push(view);
		}
	}

	ViewManager.prototype.addStateFor = function (name) {
		View.prototype.addState.apply(this.views[name], Array.prototype.slice.call(arguments, 1));
	}
	ViewManager.prototype.removeStateFor = function (name) {
		View.prototype.removeState.apply(this.views[name], Array.prototype.slice.call(arguments, 1));
	}

	return ViewManager;

});


