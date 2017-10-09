(function() {
  'use strict';
  angular.module('ng-sumoselect', []).value('sumoselectConfig', {}).directive('sumoselect', function(sumoselectConfig, $timeout) {
    var options;
    options = {};
    if (sumoselectConfig) {
      angular.extend(options, sumoselectConfig);
    }
    return {
      restrict: 'A',
      require: 'ngModel',
      priority: 1,
      compile: function(tElem, tAttrs) {
        var i, len, loaded, opt, option, repeatAttr, repeatOption, sumo, viewValue, watch, watchDeref;
        repeatAttr = null;
        watch = null;
        watchDeref = null;
        repeatOption = tElem.find('option');
        loaded = false;
        viewValue = null;
        for (i = 0, len = repeatOption.length; i < len; i++) {
          option = repeatOption[i];
          opt = angular.element(option);
          if (repeatAttr = opt.attr('ng-repeat') || opt.attr('data-ng-repeat')) {
            break;
          }
        }
        sumo = null;
        if (repeatOption.length) {
          watch = jQuery.trim(repeatAttr.split('|')[0]).split(' ').pop();
        }
        return function(scope, elem, attrs, controller) {
          var opts, render;
          opts = angular.extend({}, options, scope.$eval(attrs.sumoselect));
          render = function() {
            if (sumo) {
              if (!controller.$viewValue && viewValue) {
                controller.$viewValue = viewValue;
              }
              if (controller && controller.$viewValue && loaded) {
                viewValue = controller.$viewValue;
                sumo.selectItem(controller.$viewValue);
                sumo.callChange();
                sumo.setPstate();
                sumo.setText();
                return sumo.selAllState();
              } else {
                viewValue = null;
                return sumo.setText();
              }
            }
          };
          if (watch) {
            watchDeref = scope.$watch(watch, function(n, o, scope) {
              if (!n || angular.equals(n, o)) {
                return;
              }
              return $timeout(function() {
                loaded = true;
                if (sumo && !sumo.is_opened) {
                  sumo.unload();
                  $(elem).SumoSelect(opts);
                  sumo = $(elem)[0].sumo;
                  return $timeout(function() {
                    return render();
                  });
                }
              });
            }, true);
          }
          controller.$parsers.push(function(value) {
            var div;
            div = elem.prev();
            div.toggleClass('ng-invalid', !controller.$valid).toggleClass('ng-valid', controller.$valid).toggleClass('ng-invalid-required', !controller.$valid).toggleClass('ng-valid-required', controller.$valid).toggleClass('ng-dirty', controller.$dirty).toggleClass('ng-pristine', controller.$pristine);
            return value;
          });
          controller.$formatters.push(function(value) {
            $timeout(function() {
              return render();
            });
            return value;
          });
          scope.$on('$destroy', function() {
            if (sumo != null) {
              sumo.unload();
            }
            return typeof watchDeref === "function" ? watchDeref() : void 0;
          });
          return $timeout(function() {
            $(elem).SumoSelect(opts);
            return sumo = $(elem)[0].sumo;
          });
        };
      }
    };
  });

}).call(this);

//# sourceMappingURL=index.js.map
