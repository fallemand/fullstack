'use strict';

angular.module('sacpApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('treatments.action', {
                url: '/treatments/:action/:id',
                template: '<treatments></treatments>',
                parent: 'private',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Agregar'
                }
            });
    });
