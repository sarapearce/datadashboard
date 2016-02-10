
(function ($) {

    var circle = new Circle();
    circle.drawCircle("100", "50", "50");

    var Circle = Class.extend({
	init: function (radius, x, y) {
	    this.radius = radius;
	    this.x_pos = x.getX();
	    this.y_pos = y.getY();
	},
	drawCircle: function () {
	    var self = this;
	    var wrappers = $('.wrapper');
	    wrappers.each(function (wrapper) {
		var re_centered_x = self.getX(wrapper.id);
		var re_centered_y = self.getY(wrapper.id);
		var sampleSVG = d3.select(wrapper.id)
			.append("svg")
			.attr("width", 100)
			.attr("height", 100);

		sampleSVG.append("circle")
			.style("stroke", "gray")
			.style("fill", "white")
			.attr("r", radius)
			.attr("cx", re_centered_x)
			.attr("cy", re_centered_y)
			.on("mouseover", function () {
			    d3.select(this).style("fill", "aliceblue");
			})
			.on("mouseout", function () {
			    d3.select(this).style("fill", "white");
			});
	    });

	},
	getX: function (id) {
	    var self = this;

	    //div wrapper
	    var wrapper = $(id);
	    var parent_cell = wrapper.getParent('td');

	    //get the top coordinate of the cell, its parent td, and passed in x
	    return wrapper.offsetLeft + parent_cell.offsetLeft + self.x_pos;
	},
	getY: function (id) {
	    var self = this;

	    //div wrapper
	    var wrapper = $(id);
	    var parent_cell = wrapper.getParent('td');

	    //get the left coordinate of the cell, its parent td, and passed in x
	    return wrapper.offsetLeft + parent_cell.offsetLeft + self.y_pos;
	}
    });


    /* Simple JavaScript Inheritance
     * By John Resig http://ejohn.org/
     * MIT Licensed.
     */
// Inspired by base2 and Prototype
    (function () {
	var initializing = false, fnTest = /xyz/.test(function () {
	    xyz;
	}) ? /\b_super\b/ : /.*/;

	// The base Class implementation (does nothing)
	this.Class = function () {
	};

	// Create a new Class that inherits from this class
	Class.extend = function (prop) {
	    var _super = this.prototype;

	    // Instantiate a base class (but only create the instance,
	    // don't run the init constructor)
	    initializing = true;
	    var prototype = new this();
	    initializing = false;

	    // Copy the properties over onto the new prototype
	    for (var name in prop) {
		// Check if we're overwriting an existing function
		prototype[name] = typeof prop[name] == "function" &&
			typeof _super[name] == "function" && fnTest.test(prop[name]) ?
			(function (name, fn) {
			    return function () {
				var tmp = this._super;

				// Add a new ._super() method that is the same method
				// but on the super-class
				this._super = _super[name];

				// The method only need to be bound temporarily, so we
				// remove it when we're done executing
				var ret = fn.apply(this, arguments);
				this._super = tmp;

				return ret;
			    };
			})(name, prop[name]) :
			prop[name];
	    }

	    // The dummy class constructor
	    function Class() {
		// All construction is actually done in the init method
		if (!initializing && this.init)
		    this.init.apply(this, arguments);
	    }

	    // Populate our constructed prototype object
	    Class.prototype = prototype;

	    // Enforce the constructor to be what we expect
	    Class.prototype.constructor = Class;

	    // And make this class extendable
	    Class.extend = arguments.callee;

	    return Class;
	};
    })();

})(jQuery);



