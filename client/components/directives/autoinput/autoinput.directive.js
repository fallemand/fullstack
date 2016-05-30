'use strict';

angular.module('sacpApp')
    .directive('autoinput', [ "$compile", function ($compile) {
        return {
            restrict: 'A',
            terminal: true,
            priority: 599,
            require: "^form",
            link: function (scope, element, attrs, formController) {
                var newElement = element.clone();
                newElement
                    .addClass('form-control')
                    .attr('name', scope.field.field)
                    .removeAttr('autoinput');
                switch (scope.field.controlType) {
                    case 'input' :
                        newElement.attr('placeholder', scope.field.title);
                        newElement.attr('type', scope.field.type);
                        break;
                    case 'object' :
                        if(scope.field.type == 'select') {
                            newElement
                                .attr('ng-init', 'vm.loadData(field.field, field.remoteApi)')
                                .attr('ng-options', 'item[field.descField] for item in vm[field.field] track by item._id');
                            break;
                        }
                        else {
                            if(scope.field.type == 'typeahead') {
                                newElement
                                    .attr('uib-typeahead', 'item as item[field.descField] for item in vm.loadTypeAhead(field.remoteApi, $viewValue, field.searchField)')
                                    .attr('typeahead-loading', 'vm.typeahead.loading')
                                    .attr('typeahead-no-results', 'vm.typeahead.noresults')
                                    .attr('typeahead-min-length', 2)
                                    .attr('typeahead-editable', 'false');
                                var noResults = angular.element('<div />')
                                    .addClass('effect-fade')
                                    .attr('ng-show','vm.typeahead.noresults')
                                    .html('<i class="glyphicon glyphicon-remove"></i> Sin resultados');
                                // var loading = angular.element('<i />')
                                //     .attr('ng-show','vm.typeahead.loading')
                                //     .addClass('glyphicon glyphicon-refresh effect-fade');
                                break;
                            }
                        }

                }

                angular.forEach(scope.field.attributes, (value, attribute) => {
                    newElement.attr(attribute, value);
                });

                newElement.removeAttr("autoinput");
                newElement.insertBefore(element);
                if(noResults) {
                    noResults.insertAfter(newElement);
                    $compile(noResults)(scope)
                }
                // if(loading) {
                //     loading.insertAfter(newElement);
                //     $compile(loading)(scope)
                // }
                element.remove();

                $compile(newElement)(scope);
            }
        };
    }]);