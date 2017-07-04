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
        var repeatAttr, repeatOption, sumo, watch, watchDeref;
        repeatAttr = null;
        watch = null;
        watchDeref = null;
        repeatOption = tElem.find('option[ng-repeat], option[data-ng-repeat]');
        sumo = null;
        if (repeatOption.length) {
          repeatAttr = repeatOption.attr('ng-repeat') || repeatOption.attr('data-ng-repeat');
          watch = jQuery.trim(repeatAttr.split('|')[0]).split(' ').pop();
        }
        return function(scope, elem, attrs, controller) {
          var opts, render;
          opts = angular.extend({}, options, scope.$eval(attrs.sumoselect));
          render = function() {
            if (sumo && controller && controller.$viewValue) {
              return sumo.selectItem(controller.$viewValue);
            }
          };
          if (watch) {
            watchDeref = scope.$watch(watch, function(n, o, scope) {
              if (angular.equals(n, o)) {
                return;
              }
              return $timeout(function() {
                sumo.unload();
                $(elem).SumoSelect(scope.sumoselect);
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
            return sumo = $(elem)[0].sumo;
          });
        };
      }
    };
  });

}).call(this);

//# sourceMappingURL=index.js.map
