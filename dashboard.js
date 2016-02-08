/* 
 *   jQuery Pie-Loader Plugin 0.1
 *
 *   Based on jQuery Boilerplate by Zeno Rocha with the help of Addy Osmani
 *   http://jqueryboilerplate.com
 
 *   https://github.com/acezard/jquery-pie-loader
 *
 *   Licensed under the MIT license:
 *   http://www.opensource.org/licenses/MIT
 */


(function ($, window, document, undefined) {

    "use strict";

    // Create the defaults once
    var pluginName = "pieLoader",
	    defaults = {
		easing: "easeOutCubic",
		dimension: 200,
		percentage: 50,
		duration: 2000,
		onStart: function () {
		},
		onComplete: function () {
		}
	    };

    // The actual plugin constructor
    function Plugin(element, options) {
	this.element = element;
	this.settings = $.extend({}, defaults, options);
	this._defaults = defaults;
	this._name = pluginName;
	this.init();
    }

    // Custom easing function borrowed from jQuery-UI  
    $.extend($.easing, {
	easeOutCubic: function (x, t, b, c, d) {
	    return c * ((t = t / d - 1) * t * t + 1) + b;
	}
    });

    // Avoid Plugin.prototype conflicts
    $.extend(Plugin.prototype, {
	// Initialization logic
	init: function () {
	    $(this.element).css({
		'width': this.settings.dimension + 'px',
		'height': this.settings.dimension + 'px'
	    })
	    this.createSvg();
	    this.animateNumber();
	    this.animateStrokeDasharray();
	    $(this.element).addClass('rendered');
	},
	// SVG pie markup rendering
	createSvg: function () {
	    var half = this.settings.dimension / 2;
	    var quarter = this.settings.dimension / 4;
	    var area = Math.PI * 2 * quarter;
	    var svg =
		    '<svg xmlns:svg="http://www.w3.org/2000/svg"' +
		    'xmlns="http://www.w3.org/2000/svg"' +
		    '>' +
		    '<circle r="' + half +
		    '" cx="' + half +
		    '" cy="' + half +
		    '"/>' +
		    '<circle r="' + (quarter + 0.5) + // +0.5 to debug non-webkit based browsers
		    '" cx="' + half +
		    '" cy="' + half + '"' +
		    'style="stroke-width:' + half + 'px;' +
		    'stroke-dasharray:' + '0px' + ' ' + area + ';' +
		    '"/>' +
		    '</svg>' +
		    '<div class="percentage"' +
		    '></div>';

	    $(this.element).prepend(svg);
	},
	// Number animation
	animateNumber: function () {
	    var $target = $(this.element).find('.percentage');

	    $({
		percentageValue: 0
	    }).animate({
		percentageValue: this.settings.percentage
	    }, {
		duration: this.settings.duration,
		easing: this.settings.easing,
		start: this.settings.onStart,
		step: function () {
		    // Update the element's text with rounded-up value:
		    $target.text(commaSeparateNumber(Math.round(this.percentageValue)) + '%');
		},
		complete: this.settings.onComplete
	    });

	    // Rounding output
	    function commaSeparateNumber(val) {
		while (/(\d+)(\d{3})/.test(val.toString())) {
		    val = val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
		}
		return val;
	    }
	},
	// Pie animation
	animateStrokeDasharray: function () {
	    var debug = [100].indexOf(this.settings.percentage) > -1 ? 1 : 0; // needed to offset the bigger radius 
	    var area = 2 * Math.PI * ((this.settings.dimension / 4) + 0.4);
	    var strokeEndValue = (this.settings.percentage + debug) * area / 100;
	    var $target = $(this.element).find('svg circle:nth-child(2)');

	    $({
		strokeValue: 0
	    }).animate({
		strokeValue: strokeEndValue
	    }, {
		duration: this.settings.duration,
		easing: this.settings.easing,
		step: function () {
		    $target.css('stroke-dasharray', this.strokeValue + 'px' + ' ' + area + 'px');
		}
	    });

	}

    });

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function (options) {
	return this.each(function () {
	    if (!$.data(this, "plugin_" + pluginName)) {
		$.data(this, "plugin_" + pluginName, new Plugin(this, options));
	    }
	});
    };

})(jQuery, window, document);

// Codepen specifics
$(document).ready(function () {
    var rand = function () {
	return Math.floor((Math.random() * 100) + 1)
    }
    $('*[data-behavior="pie-chart"]').each(function () {
	$(this).pieLoader({
	    percentage: rand()
	});

    });
});
