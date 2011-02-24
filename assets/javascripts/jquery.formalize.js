//
// Note: This file depends on the jQuery library.
//

// Module pattern:
// http://yuiblog.com/blog/2007/06/12/module-pattern/
var FORMALIZE = (function($, window, document, undefined) {
		// Private constants.
	var PLACEHOLDER_SUPPORTED = 'placeholder' in document.createElement('input'),
		AUTOFOCUS_SUPPORTED = 'autofocus' in document.createElement('input'),
		WEBKIT = 'webkitAppearance' in document.createElement('select').style,
		IE6 = !!($.browser.msie && parseInt($.browser.version, 10) === 6),
		IE7 = !!($.browser.msie && parseInt($.browser.version, 10) === 7),
		
		// Public functions (exposed via the return statement)
		detect_webkit,
		full_input_size,
		ie6_skin_inputs,
		autofocus,
		add_placeholder,
		placeholder,
		init;
	
	detect_webkit = function () {
		if (!WEBKIT) {
			return;
		}
	
		// Tweaks for Safari + Chrome.
		$('html').addClass('is_webkit');		
	};
	
	full_input_size = function () {
		if (!IE7 || !$('textarea, input.input_full').length) {
			return;
		}

		// This fixes width: 100% on <textarea> and class="input_full".
		// It ensures that form elements don't go wider than container.
		$('textarea, input.input_full').wrap('<span class="input_full_wrap"></span>');	
	};
	
	ie6_skin_inputs = function () {
		var button_regex, type_regex;
	
		// Test for Internet Explorer 6.
		if (!IE6 || !$('input, select, textarea').length) {
			// Exit if the browser is not IE6,
			// or if no form elements exist.
			return;
		}
	
		// For <input type="submit" />, etc.
		button_regex = /button|submit|reset/;
	
		// For <input type="text" />, etc.
		type_regex = /date|datetime|datetime-local|email|month|number|password|range|search|tel|text|time|url|week/;
	
		$('input').each(function () {
			var el = $(this);
	
			// Is it a button?
			if (this.getAttribute('type').match(button_regex)) {
				el.addClass('ie6_button');
	
				/* Is it disabled? */
				if (this.disabled) {
					el.addClass('ie6_button_disabled');
				}
			// Or is it a textual input?
			} else if (this.getAttribute('type').match(type_regex)) {
				el.addClass('ie6_input');
	
				/* Is it disabled? */
				if (this.disabled) {
					el.addClass('ie6_input_disabled');
				}
			}
		});
	
		$('textarea, select').each(function () {
			/* Is it disabled? */
			if (this.disabled) {
				$(this).addClass('ie6_input_disabled');
			}
		});	
	};
	
	autofocus = function () {
		if (AUTOFOCUS_SUPPORTED || !$(':input[autofocus]').length) {
			return;
		}

		$(':input[autofocus]:visible:first').focus();	
	};
	
	add_placeholder = function () {
		if (PLACEHOLDER_SUPPORTED || !$(':input[placeholder]').length) {
			// Exit if placeholder is supported natively,
			// or if page does not have any placeholder.
			return;
		}
	
		$(':input[placeholder]').each(function () {
			var el = $(this),
				text = el.attr('placeholder');
	
			if (!el.val() || el.val() === text) {
				el.val(text).addClass('placeholder_text');
			}
		});
	};	
	
	placeholder = function () {
		if (PLACEHOLDER_SUPPORTED || !$(':input[placeholder]').length) {
			// Exit if placeholder is supported natively,
			// or if page does not have any placeholder.
			return;
		}

		add_placeholder();

		$(':input[placeholder]').each(function () {
			var el = $(this),
				text = el.attr('placeholder');

			el.focus(function () {
				if (el.val() === text) {
					el.val('').removeClass('placeholder_text');
				}
			}).blur(function () {
				add_placeholder();
			});

			// Prevent <form> from accidentally
			// submitting the placeholder text.
			el.closest('form').submit(function () {
				if (el.val() === text) {
					el.val('').removeClass('placeholder_text');
				}
			}).bind('reset', function () {
				window.setTimeout(add_placeholder, 50);
			});
		});	
	};
	
	init = function () {	
		detect_webkit();
		full_input_size();
		ie6_skin_inputs();
		autofocus();
		placeholder();
	};

	// Expose innards of FORMALIZE.
	return {		
		go: init, // FORMALIZE.go
		detect_webkit: detect_webkit, // FORMALIZE.detect_webkit
		full_input_size: full_input_size, // FORMALIZE.full_input_size
		ie6_skin_inputs: ie6_skin_inputs, // FORMALIZE.ie6_skin_inputs
		autofocus: autofocus, // FORMALIZE.autofocus
		placeholder: placeholder, // FORMALIZE.placeholder
		add_placeholder: add_placeholder // FORMALIZE.add_placeholder
	};
// Alias jQuery, window, document.
}(jQuery, this, this.document));

// Automatically calls all functions in FORMALIZE.init
jQuery(document).ready(function () {
	FORMALIZE.go();
});