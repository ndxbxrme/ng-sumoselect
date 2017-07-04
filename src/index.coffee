'use strict'

angular.module 'ng-sumoselect', []
.value 'sumoselectConfig', {}
.directive 'sumoselect', (sumoselectConfig, $timeout) ->
  options = {}
  if sumoselectConfig
    angular.extend options, sumoselectConfig
  restrict: 'A'
  require: 'ngModel'
  priority: 1
  compile: (tElem, tAttrs) ->
    repeatAttr = null
    watch = null
    watchDeref = null
    repeatOption = tElem.find 'option[ng-repeat], option[data-ng-repeat]'
    sumo = null
    if repeatOption.length
      repeatAttr = repeatOption.attr('ng-repeat') or repeatOption.attr('data-ng-repeat')
      watch = jQuery.trim(repeatAttr.split('|')[0]).split(' ').pop()
    (scope, elem, attrs, controller) ->
      opts = angular.extend {}, options, scope.$eval(attrs.sumoselect)
      render = ->
        if sumo and controller and controller.$viewValue
          sumo.selectItem controller.$viewValue
      if watch
        watchDeref = scope.$watch watch, (n, o, scope) ->
          if angular.equals n, o
            return
          $timeout ->
            sumo.unload()
            $(elem).SumoSelect scope.sumoselect
            sumo = $(elem)[0].sumo
            if sumo and controller and controller.$viewValue
              sumo.selectItem controller.$viewValue
            if n and not o and controller.$setPristine
              controller.$setPristine true
        , true
      controller.$parsers.push (value) ->
        div = elem.prev()
        div
        .toggleClass('ng-invalid', !controller.$valid)
        .toggleClass('ng-valid', controller.$valid)
        .toggleClass('ng-invalid-required', !controller.$valid)
        .toggleClass('ng-valid-required', controller.$valid)
        .toggleClass('ng-dirty', controller.$dirty)
        .toggleClass('ng-pristine', controller.$pristine)
        value
      controller.$formatters.push (value) ->
        $timeout ->
          render()
        value
      scope.$on '$destroy', ->
        sumo.unload()
        watchDeref?()
      $timeout ->
        $(elem).SumoSelect opts
        sumo = $(elem)[0].sumo