/*
  Formalize - version 1.1

  Note: This file depends on the MooTools library.
*/

// Module pattern:
// http://yuiblog.com/blog/2007/06/12/module-pattern
var FORMALIZE = (function(window, document, undefined) {
  // Private constants.
  var PLACEHOLDER_SUPPORTED = 'placeholder' in document.createElement('input');
  var AUTOFOCUS_SUPPORTED = 'autofocus' in document.createElement('input');
  var IE6 = Browser.ie6;
  var IE7 = Browser.ie7;

  // Expose innards of FORMALIZE.
  return {
    // FORMALIZE.go
    go: function() {
      for (var i in FORMALIZE.init) {
        FORMALIZE.init[i]();
      }
    },
    // FORMALIZE.init
    init: {
      // FORMALIZE.init.full_input_size
      full_input_size: function() {
        if (!IE7 || !$$('textarea, input.input_full').length) {
          return;
        }

        // This fixes width: 100% on <textarea> and class="input_full".
        // It ensures that form elements don't go wider than container.
        $$('textarea, input.input_full').each(function(el) {
          new Element('span.input_full_wrap').wraps(el);
        });

      },
      // FORMALIZE.init.ie6_skin_inputs
      ie6_skin_inputs: function() {
        // Test for Internet Explorer 6.
        if (!IE6 || !$$('input, select, textarea').length) {
          // Exit if the browser is not IE6,
          // or if no form elements exist.
          return;
        }

        // For <input type="submit" />, etc.
        var button_regex = /button|submit|reset/;

        // For <input type="text" />, etc.
        var type_regex = /date|datetime|datetime-local|email|month|number|password|range|search|tel|text|time|url|week/;

        $$('input').each(function(el) {
          // Is it a button?
          if (el.getAttribute('type').match(button_regex)) {
            el.addClass('ie6_button');

            /* Is it disabled? */
            if (el.disabled) {
              el.addClass('ie6_button_disabled');
            }
          }
          // Or is it a textual input?
          else if (el.getAttribute('type').match(type_regex)) {
            el.addClass('ie6_input');

            /* Is it disabled? */
            if (el.disabled) {
              el.addClass('ie6_input_disabled');
            }
          }
        });

        $$('textarea, select').each(function(el) {
          /* Is it disabled? */
          if (el.disabled) {
            el.addClass('ie6_input_disabled');
          }
        });
      },
      // FORMALIZE.init.autofocus
      autofocus: function() {
        if (AUTOFOCUS_SUPPORTED || !$$('[autofocus]').length) {
          return;
        }

        $$('[autofocus]')[0].focus();
      },
      // FORMALIZE.init.placeholder
      placeholder: function() {
        if (PLACEHOLDER_SUPPORTED || !$$('[placeholder]').length) {
          // Exit if placeholder is supported natively,
          // or if page does not have any placeholder.
          return;
        }

        FORMALIZE.misc.add_placeholder();

        $$('[placeholder]').each(function(el) {
          var text = el.get('placeholder');

          el.addEvents({
            focus: function() {
              if (el.value === text) {
                el.set('value', '').removeClass('placeholder_text');
              }
            },
            blur: function() {
              FORMALIZE.misc.add_placeholder();
            }
          });

          // Prevent <form> from accidentally
          // submitting the placeholder text.
          
          // note that some input elements might not have a parent form
          // in older browsers addEvents() on a null object with throw an error
          // check to ensure that the form exists before running addEvents on it
          
          var elementForm = el.getParent('form');
          if(elementForm) {
            el.getParent('form').addEvents({
              'submit': function() {
                if (el.value === text) {
                  el.set('value', '').removeClass('placeholder_text');
                }
              },
              'reset': function() {
                setTimeout(FORMALIZE.misc.add_placeholder, 50);
              }
            });
          }
        });
      }
    },
    // FORMALIZE.misc
    misc: {
      // FORMALIZE.misc.add_placeholder
      add_placeholder: function() {
        if (PLACEHOLDER_SUPPORTED || !$$('[placeholder]').length) {
          // Exit if placeholder is supported natively,
          // or if page does not have any placeholder.
          return;
        }

        $$('[placeholder]').each(function(el) {
          var text = el.get('placeholder');

          if (!el.value || el.value === text) {
            el.set('value', text).addClass('placeholder_text');
          }
        });
      }
    }
  };
// Alias window, document.
})(this, this.document);

// Automatically calls all functions in FORMALIZE.init
$(document).addEvent('domready', function() {
  FORMALIZE.go();
});