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
        var i, len, opt, option, repeatAttr, repeatOption, sumo, watch, watchDeref;
        repeatAttr = null;
        watch = null;
        watchDeref = null;
        repeatOption = tElem.find('option');
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
              if (controller && controller.$viewValue) {
                return $timeout(function() {
                  sumo.selectItem(controller.$viewValue);
                  sumo.callChange();
                  sumo.setPstate();
                  sumo.setText();
                  return sumo.selAllState();
                });
              } else {
                return sumo.setText();
              }
            }
          };
          if (watch) {
            watchDeref = scope.$watch(watch, function(n, o, scope) {
              if (angular.equals(n, o)) {
                return;
              }
              return $timeout(function() {
                sumo.unload();
                $(elem).SumoSelect(opts);
                sumo = $(elem)[0].sumo;
                if (sumo && controller && controller.$viewValue) {
                  sumo.selectItem(controller.$viewValue);
                }
                if (n && !o && controller.$setPristine) {
                  return controller.$setPristine(true);
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
            sumo.unload();
            return typeof watchDeref === "function" ? watchDeref() : void 0;
          });
          return $timeout(function() {
            $(elem).SumoSelect(opts);
            sumo = $(elem)[0].sumo;
            if (sumo && controller && controller.$viewValue) {
              return sumo.selectItem(controller.$viewValue);
            }
          });
        };
      }
    };
  });

}).call(this);

//# sourceMappingURL=index.js.map
