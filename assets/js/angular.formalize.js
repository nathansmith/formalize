/*
  Formalize - version 1.2

  Note: This file depends on the AngularJS library.
*/

angular.module('formalize', [])
  .directive('fmzDisabled', [
    function() {
      'use strict';

      return {
        link: function(scope, element) {
          element.bind('click', function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            return false;
          });
        }
      };
    }
  ])
  .directive('fmzPlaceholder', [
    '$timeout', '$window',
    function($timeout, $window) {
      'use strict';

      var doc = $window.document,
          isInputSupported = 'placeholder' in doc.createElement('input'),
          isTextareaSupported = 'placeholder' in doc.createElement('textarea');

      return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
          var domElement = element[0],
              form = angular.element(domElement.form);

          if (domElement.nodeName !== 'TEXTAREA' &&
              domElement.nodeName !== 'INPUT') {
            return;
          }

          if (isInputSupported && isTextareaSupported) {
            // If supported, create native placeholder attribute and exit
            $timeout(function() {
              element.attr('placeholder', attrs.fmzPlaceholder);
            });
            return;
          }

          if (attrs.type === 'password') {
            // Placeholder obscured in older browsers,
            // so there's no point adding to password.
            return;
          }

          function init(value) {
            if (doc.activeElement === domElement) {
              return;
            }

            if (value === '' || value === attrs.fmzPlaceholder) {
              domElement.value = attrs.fmzPlaceholder;
              element.addClass('placeholder_text');
            }
          }

          function remove() {
            if (domElement.value == attrs.fmzPlaceholder) {
              domElement.value = '';
              element.removeClass('placeholder_text');
            }
          }

          function restore() {
            if (domElement.value === '') {
              domElement.value = attrs.fmzPlaceholder;
              element.addClass('placeholder_text');
            }
          }

          function reset() {
            $timeout(function() {
              init('');
            });
          }

          $timeout(function() {
            init(domElement.value);
          });

          scope.$watch(function() {
            return ngModel.$modelValue;
          }, function(newValue) {
            init(newValue);
          });

          element.bind('focus', remove);
          element.bind('blur', restore);

          // Prevent <form> from accidentally
          // submitting the placeholder text.
          form.bind('submit', remove);
          form.bind('reset', reset);

          /*
           * destroy
           */

          scope.$on('$destroy', function() {
            element.unbind('focus', focus);
            element.unbind('blur', blur);
            form.unbind('submit', remove);
            form.unbind('reset', reset);
          });
        }
      };
    }
  ])
  .run([
    '$window',
    function($window) {
      var doc = $window.document;

      if (!('autofocus' in doc.createElement('input'))) {
        angular.element($window).bind('DOMContentLoaded', function() {
          var focusInputs = doc.querySelectorAll('[autofocus]');

          for (var i = 0, len = focusInputs.length; i < len; i++) {
            var focusInput = focusInputs[i];

            if (!focusInput.disabled &&
                focusInput.offsetWidth > 0 &&
                focusInput.offsetHeight > 0) {
              focusInput.focus();
              break;
            }
          }
        });
      }
    }
  ]);
