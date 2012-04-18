/*
  Formalize - version 1.2

  Note: This file depends on the Dojo library.
*/

// Module pattern:
// http://yuiblog.com/blog/2007/06/12/module-pattern
var FORMALIZE = (function(window, document, undefined) {
  // Internet Explorer detection.
  function IE(version) {
    var b = document.createElement('b');
    b.innerHTML = '<!--[if IE ' + version + ']><br><![endif]-->';
    return !!b.getElementsByTagName('br').length;
  }

  // Private constants.
  var PLACEHOLDER_SUPPORTED = 'placeholder' in document.createElement('input');
  var AUTOFOCUS_SUPPORTED = 'autofocus' in document.createElement('input');
  var IE6 = IE(6);
  var IE7 = IE(7);

  var dojoQuery;
  var dojoConnect;
  var dojoDomClass;

  require( [ "dojo/query", "dojo/on", "dojo/dom-class", "dojo/domReady!" ],
	  function( query, 
		    on,
		    domClass )
	  {
		  dojoQuery = query;
		  dojoConnect = on;
		  dojoDomClass = domClass;
	  }
	 );

  // Expose innards of FORMALIZE.
  return {
    // FORMALIZE.go
    go: function() {
      var i, j = this.init;

      for (i in j) {
        j.hasOwnProperty(i) && j[i]();
      }
    },
    // FORMALIZE.init
    init: {
      // FORMALIZE.init.full_input_size
      full_input_size: function() {
        if (!IE7 || !dojoQuery('textarea, input.input_full').length) {
          return;
        }

        // This fixes width: 100% on <textarea> and class="input_full".
        // It ensures that form elements don't go wider than container.
        dojoQuery('textarea, input.input_full').forEach(function(el) {
          var new_el = el.cloneNode(false);
          var span = document.createElement('span');

          span.className = 'input_full_wrap';
          span.appendChild(new_el);
          el.parentNode.replaceChild(span, el);
        });
      },
      // FORMALIZE.init.ie6_skin_inputs
      ie6_skin_inputs: function() {
        // Test for Internet Explorer 6.
        if (!IE6 || !dojoQuery('input, select, textarea').length) {
          // Exit if the browser is not IE6,
          // or if no form elements exist.
          return;
        }

        // For <input type="submit" />, etc.
        var button_regex = /button|submit|reset/;

        // For <input type="text" />, etc.
        var type_regex = /date|datetime|datetime-local|email|month|number|password|range|search|tel|text|time|url|week/;

        dojoQuery('input').forEach(function(el) {
          // Is it a button?
          if (el.getAttribute('type').match(button_regex)) {
            dojoDomClass.add(el, 'ie6_button');

            /* Is it disabled? */
            if (el.disabled) {
              dojoDomClass.add(el, 'ie6_button_disabled');
            }
          }
          // Or is it a textual input?
          else if (el.getAttribute('type').match(type_regex)) {
            dojoDomClass.add(el, 'ie6_input');

            /* Is it disabled? */
            if (el.disabled) {
              dojoDomClass.add(el, 'ie6_input_disabled');
            }
          }
        });

        dojoQuery('textarea, select').forEach(function(el) {
          /* Is it disabled? */
          if (el.disabled) {
            dojoDomClass.add(el, 'ie6_input_disabled');
          }
        });
      },
      // FORMALIZE.init.autofocus
      autofocus: function() {
        if (AUTOFOCUS_SUPPORTED || !dojoQuery('[autofocus]').length) {
          return;
        }

        dojoQuery('[autofocus]')[0].focus();
      },
      // FORMALIZE.init.placeholder
      placeholder: function() {
        if (PLACEHOLDER_SUPPORTED || !dojoQuery('[placeholder]').length) {
          // Exit if placeholder is supported natively,
          // or if page does not have any placeholder.
          return;
        }

        FORMALIZE.misc.add_placeholder();

        dojoQuery('[placeholder]').forEach(function(el) {
          // Placeholder obscured in older browsers,
          // so there's no point adding to password.
          if (el.type === 'password') {
            return;
          }

          dojoConnect(el, 'onfocus', function() {
            var text = el.getAttribute('placeholder');

            if (el.value === text) {
              el.value = '';
              dojoDomClass.remove(el, 'placeholder_text');
            }
          });

          dojoConnect(el, 'onblur', function() {
            FORMALIZE.misc.add_placeholder();
          });
        });

        // Prevent <form> from accidentally
        // submitting the placeholder text.
        dojoQuery('form').forEach(function(form) {
          dojoConnect(form, 'onsubmit', function() {
            dojoQuery('[placeholder]', form).forEach(function(el) {
              var text = el.getAttribute('placeholder');

              if (el.value === text) {
                el.value = '';
                dojoDomClass.remove(el, 'placeholder_text');
              }
            });
          });

          dojoConnect(form, 'onreset', function() {
            setTimeout(FORMALIZE.misc.add_placeholder, 50);
          });
        });
      }
    },
    // FORMALIZE.misc
    misc: {
      // FORMALIZE.misc.add_placeholder
      add_placeholder: function() {
        if (PLACEHOLDER_SUPPORTED || !dojoQuery('[placeholder]').length) {
          // Exit if placeholder is supported natively,
          // or if page does not have any placeholder.
          return;
        }

        dojoQuery('[placeholder]').forEach(function(el) {
          // Placeholder obscured in older browsers,
          // so there's no point adding to password.
          if (el.type === 'password') {
            return;
          }

          var text = el.getAttribute('placeholder');

          if (!el.value || el.value === text) {
            el.value = text;
            dojoDomClass.add(el, 'placeholder_text');
          }
        });
      }
    }
  };
// Alias window, document.
})(this, this.document);

// Automatically calls all functions in FORMALIZE.init
require( ["dojo/domReady!"], function() {
  FORMALIZE.go();
});
