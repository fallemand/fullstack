'use strict';

(function () {

    class DatatableController {
        constructor($scope, $http, NgTableParams, sweet) {
            this.sweet = sweet;
            this.$scope = $scope;
            this.parameters = $scope.parameters;
            this.$http = $http;
            $http.get('/api/' + this.parameters.entity + '/metadata').then(response => {
                this.metadata = response.data;
                this.cols = this.generateColsList(this.metadata, this.parameters);
                this.loadedData = true;
            });
            this.tableParams = new NgTableParams({}, {
                getData: (function ($defer, params) {
                    $http.get('/api/' + this.parameters.entity + '?' + this.parameters.filters).then(response => {
                        $defer.resolve(response.data);
                    });
                }).bind(this)
            });
            if(this.parameters.initEvent) {
                this.parameters.initEvent(this.tableParams);
            }
        }

        generateColsList(metadata, parameters) {
            var cols = [];
            var actionsCol = {
                field: '_id',
                title: 'Acciones',
                show: 'true',
                filter: { 'name' : "text" },
                getValue: this.actionsCol,
                actions: parameters.actions
            };
            cols.push(actionsCol);
            angular.forEach(metadata.fields, (value, field) => {
                var col = {
                    field: value.field,
                    title: value.title,
                    show: value.show,
                    filter: { 'name' : "text" }
                };
                switch(value.type) {
                    case 'text' : col.getValue = this.htmlValue; break;
                    case 'number' : col.getValue = this.htmlValue; break;
                    case 'object': col.getValue = this.objectValue; break;
                    default: col.getValue = this.htmlValue; break;
                }
                cols.push(col);
            });
            return cols;
        }

        htmlValue($scope, row) {
            var value = row[this.field];
            return value;
        }

        objectValue($scope, row) {
            var value = row[this.field].name;
            return value;
        }

        actionsCol($scope, row) {
            var html = '<div class="btn-group">';
            angular.forEach(this.actions, (value, index) => {
                switch(value) {
                    case 'view' :
                        html += '<a class="btn btn-xs btn-default" ng-click="vm.view(row)" uib-tooltip="Ver" tooltip-placement="top" tooltip-append-to-body="true"><i class="fa fa-eye"></i></a>'; break;
                    case 'modify' :
                        html += '<a class="btn btn-xs btn-default" ng-click="vm.update(row)" uib-tooltip="Modificar" tooltip-placement="top" tooltip-append-to-body="true"><i class="fa fa-pencil"></i></a>'; break;
                    case 'delete' :
                        html += '<a class="btn btn-xs btn-default" ng-click="vm.cancel(row)" uib-tooltip="Eliminar" tooltip-placement="top" tooltip-append-to-body="true"><i class="fa fa-times"></i></a>'; break;
                    case 'activate' :
                        html += '<a class="btn btn-xs btn-success" ng-click="vm.activate(row)" ><i class="fa fa-check-square"></i> Activar</a>'; break;
                    case 'cancel' :
                        html += '<a class="btn btn-xs btn-danger" ng-click="vm.cancel(row)"><i class="fa fa-times"></i>Cancelar</a>'; break;
                }
            });
            html += '</div>';
            return html;
        }

        cancel(user) {
            this.sweet.show({
                title: '¿Está Seguro?',
                text: 'Eliminará el ' + this.metadata.name + ' ' + user.name,
                type: 'error',
                showCancelButton: true,
                confirmButtonClass: 'btn-danger',
                confirmButtonText: 'Sí, eliminarlo!',
                closeOnConfirm: false,
                allowEscapeKey: true,
                allowOutsideClick: true
            }, (function() {
                this.$http.delete('/api/users/' + user._id).then(response => {
                    if(this.parameters.reloadEvent) {
                        this.parameters.reloadEvent();
                    }
                    this.sweet.show({title: 'Eliminado!', text: 'El ' + this.metadata.name + ' ha sido eliminado.', type: 'success', timer: '1300', allowOutsideClick: true, allowEscapeKey: true, showConfirmButton: false});
                });
            }).bind(this));
        }

        activate(user) {
            this.sweet.show({
                title: '¿Está Seguro?',
                text: 'Activará el ' + this.metadata.name + ' ' + user.name,
                type: 'info',
                showCancelButton: true,
                confirmButtonClass: 'btn-success',
                confirmButtonText: 'Sí, activarlo!',
                closeOnConfirm: false,
                allowEscapeKey: true,
                allowOutsideClick: true
            }, (function() {
                this.$http.put('/api/users/' + user._id + '/activate').then(response => {
                    if(this.parameters.reloadEvent) {
                        this.parameters.reloadEvent();
                    }
                    this.sweet.show({title: 'Activado!', text: 'El ' + this.metadata.name + ' ha sido activado.', type: 'success', timer: '1300', allowOutsideClick: true, allowEscapeKey: true, showConfirmButton: false});
                });
            }).bind(this));
        }
    }

    angular.module('sacpApp.admin')
        .controller('DatatableController', DatatableController);

})();