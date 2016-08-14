'use strict';
(function () {

    class ViewTreatmentController {
        constructor($http, $stateParams, $state, Auth, ngToast) {
            this.id = $stateParams.id;
            this.isAdmin = Auth.isAdmin();
            this.ngToast = ngToast;
            this.collapseActions = (this.isAdmin) ? true : false;
            this.actionsTitle = (this.isAdmin) ? 'Acciones' : 'Historial de Estados';
            $http.get('/api/treatments/' + this.id)
                .then(response => {
                    this.treatment = response.data;
                    this.stateHistoryTable = {
                        tableClass: 'table-condensed',
                        entity: 'treatment-history',
                        field: 'history',
                        type: 'remote',
                        metadataFilters: 'field=history',
                        id: this.treatment._id
                    };
                })
                .catch(err => {
                    this.ngToast.create({
                        className: 'danger',
                        content: err.message
                    });
                });

            $http.get('/api/upload-files/treatment/' + this.id)
                .then(response => {
                    if(response.data.length > 0) {
                        this.uploadedFiles = response.data;
                    }
                })
                .catch(err => {
                    this.ngToast.create({
                        className: 'danger',
                        content: err.message
                    });
                });

            this.drugsTable = {
                entity: 'treatments',
                type: 'local',
                metadataFilters: 'field=drugs'
            };

            this.result= {};
            this.autoformResult = {
                entity: 'treatment-history',
                type: 'local',
                section: 'form',
                template: 'full',
                metadataFilters: 'field=history',
                inputIcons : true,
                object: this.result,
                field: 'history',
                addEvent: (function() {
                    $http.put('/api/treatments/' + this.treatment._id + '/status', this.result.aux.history.state).then(treatment => {
                            $http.put('/api/treatment-history/' + this.treatment._id, this.result.aux.history).then(() => {
                                    this.ngToast.create('Estado seteado con éxito!');
                                    this.collapseActions = true;
                                    this.stateHistoryTable.ngtable.reload();
                                    this.autoformResult.resetForm();
                                })
                                .catch(err => {
                                    this.handleError(err);
                                    this.autoformResult.resetForm();
                                });
                        })
                        .catch(err => {
                            this.handleError(err);
                            this.autoformResult.resetForm();
                        });
                }).bind(this)
            };
        }

        createPdf() {
            html2canvas(document.getElementById('prescription'), {
                onrendered: (function (canvas) {
                    var data = canvas.toDataURL();
                    var docDefinition = {
                        content: [{
                            image: data,
                            width: 500
                        }]
                    };
                    pdfMake.createPdf(docDefinition).download("treatment-" + this.id + ".pdf");
                }).bind({id: this.id})
            });
        }
        handleError(err) {
            var errors = err.data.errors;
            if(errors) {
                this.errors = {};
                // Update validity of form fields that match the mongoose errors
                angular.forEach(errors, (error, field) => {
                    this.autoform.form[field].$setValidity('mongoose', false);
                    this.errors[field] = error.message;
                });
            }
            else {
                this.ngToast.create({
                    className: 'danger',
                    content: (err.message) ? err.message : err.data
                });
            }
        }

    }

    angular.module('sacpApp')
        .component('viewtreatment', {
            templateUrl: 'app/treatments/view/view-treatment.html',
            controller: ViewTreatmentController,
            controllerAs: 'vm'
        });

})();
