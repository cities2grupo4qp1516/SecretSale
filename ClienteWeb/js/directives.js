secretSale.directive('inputtext', function ($timeout) {
    return {
        restrict: 'E',
        replace: true,
        template: '<input type="text"/>',
        scope: {
            //if there were attributes it would be shown here
        },
        link: function (scope, element, attrs, ctrl) {
            // DOM manipulation may happen here.      
        }
    }
})

.directive('version', function (version) {
    return function (scope, elm, attrs) {
        elm.text(version);
    };
})

.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);;