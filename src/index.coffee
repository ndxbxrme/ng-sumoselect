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
    repeatOption = tElem.find 'option'
    loaded = false
    for option in repeatOption
      opt = angular.element(option)
      if repeatAttr = opt.attr('ng-repeat') or opt.attr('data-ng-repeat')
        break
    sumo = null
    if repeatOption.length
      watch = jQuery.trim(repeatAttr.split('|')[0]).split(' ').pop()
    (scope, elem, attrs, controller) ->
      opts = angular.extend {}, options, scope.$eval(attrs.sumoselect)
      render = ->
        if sumo 
          if controller and controller.$viewValue and loaded
            sumo.selectItem controller.$viewValue
            sumo.callChange()
            sumo.setPstate()
            sumo.setText()
            sumo.selAllState()
          else
            sumo.setText()
      if watch
        watchDeref = scope.$watch watch, (n, o, scope) ->
          if not n or angular.equals n, o
            return
          $timeout ->
            loaded = true
            sumo.unload()
            $(elem).SumoSelect opts
            $timeout ->
              render()
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
      $(elem).SumoSelect opts
      sumo = $(elem)[0].sumo