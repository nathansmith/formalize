//
// Automatically calls all functions in FRM.init
//
jQuery(document).ready(function() {
	FRM.go();
});

//
// Module pattern:
// http://yuiblog.com/blog/2007/06/12/module-pattern/
//
var FRM = (function($, window, undefined) {
	// Private constants.
	var PLACEHOLDER_SUPPORTED = 'placeholder' in document.createElement('input');
	var AUTOFOCUS_SUPPORTED = 'autofocus' in document.createElement('input');

	// Expose contents of FRM.
	return {
		go: function() {
			for (var i in FRM.init) {
				FRM.init[i]();
			}
		},
		init: {
			full_input_size: function() {
				if (!$('textarea, input.input_full').length) {
					return;
				}

				// This fixes width: 100% on <textarea> and class="input_full".
				// It ensures that form elements don't go wider than container.
				$('textarea, input.input_full').wrap('<span class="input_full_wrap"></span>');
			},
			ie_skin_inputs: function() {
				// Test for Internet Explorer 6.
				if ((typeof document.addEventListener === 'function' && window.XMLHttpRequest) || !$(':input').length) {
					return;
				}

				var type_regex = /^(date|datetime|email|month|number|password|range|search|tel|text|time|url|week)/;

				$(':input').each(function() {
					var el = $(this);

					if (this.type === 'button' || this.type === 'submit' || this.type === 'reset') {
						el.addClass('ie_button');

						/* Is it disabled? */
						if (this.disabled) {
							el.addClass('ie_button_disabled');
						}
					}
					else if (this.type.match(type_regex)) {
						el.addClass('ie_input');

						/* Is it disabled? */
						if (this.disabled) {
							el.addClass('ie_input_disabled');
						}
					}
				});
			},
			placeholder: function() {
				if (PLACEHOLDER_SUPPORTED || !$(':input[placeholder]').length) {
					return;
				}

				$(':input[placeholder]').each(function() {
					var el = $(this);
					var text = el.attr('placeholder');

					function add_placeholder() {
						if (!el.val() || el.val() === text) {
							el.val(text).addClass('placeholder_text');
						}
					}
					add_placeholder();

					el.focus(function() {
						if (el.val() === text) {
							el.val('').removeClass('placeholder_text');;
						}
					}).blur(function() {
						if (!el.val()) {
							el.val(text).addClass('placeholder_text');;
						}
					});

					el.closest('form').submit(function() {
						if (el.val() === text) {
							el.val('');
						}
					}).bind('reset', function() {
						setTimeout(add_placeholder, 50);
					});
				});
			},
			autofocus: function() {
				if (AUTOFOCUS_SUPPORTED || !$(':input[autofocus]').length) {
					return;
				}

				$(':input[autofocus]:visible:first').select();
			}
		}
	};
// Pass in jQuery ref.
})(jQuery, this);