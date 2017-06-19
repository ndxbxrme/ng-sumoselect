# ng-sumoselect
===============

An angular wrapper for [jquery.sumoselect](http://hemantnegi.github.io/jquery.sumoselect/)
------------------------------------------------------------------------------------------

A directive that progressively enhances an HTML Select Box into a Single/Multiple option dropdown list. The dropdown list can be fully customizable using simple css.
It can adapt itself according to any device, keeping in mind that the User Experience is not broken. 

## Usage

Install with bower  
```bash
bower install --save ng-sumoselect
```

Include a reference to `ng-sumoselect` in your angular app declaration  
```javascript
angular.module('myApp', [
  'ng-sumoselect'
]);
```  

Add the directive to any select element in your view  
```jade
  select(sumoselect='{placeholder:"Select Me", search:true}', multiple='true', ng-model='selected')
    option(ng-repeat='d in data', value='{{d.id}}') {{d.name}}
```