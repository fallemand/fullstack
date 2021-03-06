'use strict';
(function () {

    class TreatmentsComponent {
        constructor($http, ngToast, $state, $stateParams, Auth, Upload, $timeout) {
            this.loadedData = false;
            this.action = $stateParams.action;
            this.$http = $http;
            this.$state = $state;
            this.ngToast = ngToast;
            this.showFilters = false;
            this.isAdmin = Auth.isAdmin();

            //Used in fileUpload
            this.imagesToRemove = [];
            this.$timeout = $timeout;
            this.Upload = Upload;
            this.mayorIndex = 1;

            switch (this.action) {
                case 'add' :
                    this.initialize();
                    break;
                case 'update' :
                    this.getEntity($stateParams.id, (function () {
                        this.initialize();
                    }).bind(this));
                    break;
                case 'view' :
                    this.getEntity($stateParams.id, (function () {
                        this.initialize();
                    }).bind(this));
                    break;
            }
        }

        getEntity(id, callback) {
            this.$http.get('/api/treatments/' + id)
                .then(response => {
                    this.object = response.data;
                    if (callback) {
                        callback();
                    }
                })
                .catch(err => {
                    if (err.data && err.data.name == 'CastError') {
                        err.message = 'El parametro no es correcto';
                    }
                    this.ngToast.create({
                        className: 'danger',
                        content: err.message
                    });
                });

            this.$http.get('/api/upload-files/treatment/' + id)
                .then(response => {
                    this.uploadedFiles = response.data;
                    for(var file in this.uploadedFiles) {
                        var index = parseInt(this.uploadedFiles[file].name.substring(this.uploadedFiles[file].name.indexOf('-') + 1, this.uploadedFiles[file].name.indexOf('.')));
                        if(index > this.mayorIndex) {
                            this.mayorIndex = index;
                        }
                    }
                })
                .catch(err => {
                    this.ngToast.create({
                        className: 'danger',
                        content: err.message
                    });
                });
        }

        initialize() {
            this.loadedData = true;
            this.steps = [
                {
                    templateUrl: 'app/treatments/steps/_patient.html',
                    hasForm: true
                },
                {
                    templateUrl: 'app/treatments/steps/_disease.html',
                    hasForm: true
                },
                {
                    templateUrl: 'app/treatments/steps/_treatment.html',
                    hasForm: true
                },
                {
                    templateUrl: 'app/treatments/steps/_drugs-standardized.html',
                    //templateUrl: 'app/treatments/steps/_drugs.html',
                },
                {
                    templateUrl: 'app/treatments/steps/_confirm.html',
                    hasForm: true
                }
            ];

            this.autoformDisease = {
                entity: 'treatments',
                section: 'disease',
                object: this.object,
                disabled: (this.action == 'view'),
                template: 'lite'
            };

            this.autoformPatient = {
                entity: 'treatments',
                object: this.object,
                section: 'patient',
                disabled: (this.action == 'view'),
                template: 'lite'
            };

            this.autoformTreatment = {
                entity: 'treatments',
                section: 'treatment',
                formGroupClass: 'col-md-6',
                object: this.object,
                disabled: (this.action == 'view'),
                template: 'lite'
            };

            this.autoformDrugs = {
                entity: 'treatments',
                field: 'drugs',
                type: 'local',
                disabled: (this.action == 'view'),
                template: 'short',
                metadataFilters: 'field=drugs',
                object: this.object,
                formGroupClass: 'col-md-4',
                inputIcons: true,
                reloadEvent: (function () {
                    if (this.drugsTable.ngtable) {
                        this.drugsTable.ngtable.reload();
                    }
                }).bind(this)
            };

            this.autoformDrugsStandardized = {
                entity: 'treatments',
                field: 'drugsStandardized',
                type: 'local',
                disabled: (this.action == 'view'),
                template: 'short',
                metadataFilters: 'field=drugsStandardized',
                object: this.object,
                formGroupClass: 'col-md-4',
                inputIcons: true,
                reloadEvent: (function () {
                    if (this.drugsTable.ngtable) {
                        this.drugsTable.ngtable.reload();
                    }
                }).bind(this)
            };

            this.autoformConfirm = {
                entity: 'treatments',
                section: 'confirm',
                disabled: (this.action == 'view'),
                object: this.object,
                template: 'lite'
            };

            this.drugsTable = {
                entity: 'treatments',
                type: 'local',
                metadataFilters: 'field=drugs',
                actions: ['modify', 'delete'],
                reloadEvent: (function () {
                    if (this.object.drugs.length > 0) {
                        this.validStep = true;
                    }
                }).bind(this),
                initEvent: (function () {
                    if (this.object.drugs.length > 0) {
                        this.validStep = true;
                    }
                }).bind(this),
                modifyEvent: (function (object) {
                    this.object.aux = {};
                    this.object.aux.drugs = object;
                }).bind(this)
            };

            this.drugsTableStandardized = {
                entity: 'treatments',
                type: 'local',
                metadataFilters: 'field=drugsStandardized',
                actions: ['modify', 'delete'],
                reloadEvent: (function () {
                    if (this.object.drugsStandardized.length > 0) {
                        this.validStep = true;
                    }
                }).bind(this),
                initEvent: (function () {
                    if (this.object.drugsStandardized.length > 0) {
                        this.validStep = true;
                    }
                }).bind(this),
                modifyEvent: (function (object) {
                    this.object.aux = {};
                    this.object.aux.drugsStandardized = object;
                }).bind(this)
            };

            if (this.action !== 'add') {
                this.stateHistoryTable = {
                    entity: 'treatment-history',
                    field: 'history',
                    type: 'remote',
                    metadataFilters: 'field=history',
                    id: this.object._id
                };
            }
        }

        stepChange(activeIndex, hasForm) {
            this.progressBarWidth = (100 / this.steps.length) * activeIndex + '%';
            if (!hasForm) {
                this.validStep = false;
            }
            else {
                this.validStep = true;
            }
        }

        removeImage(index, object, event, type, name) {
            if(type === 'server') {
                this.imagesToRemove.push({file: name})
                object.splice(index, 1);
            }
            else {
                object.splice(index, 1);
            }
            event.preventDefault();
            event.stopPropagation();
        }

        cancel() {
            this.progressBarWidth = (100 / this.wizard.getSteps().length) + '%';
        }

        finish() {
            this.submitted = true;
            if (this.autoformConfirm.form.$valid) {
                this.isSaving = true;
                if (this.object._id) {
                    //Fix sub-object changes
                    for (var attribute in this.object) {
                        if (this.object[attribute].hasOwnProperty('_id')) {
                            this.object[attribute] = this.object[attribute]._id;
                        }
                    }
                    this.$http.put('/api/treatments/' + this.object._id, this.object).then(treatment => {
                            this.deleteFiles();
                            if (this.files && this.files.length > 0) {
                                this.uploadFiles(treatment.data._id);
                            }
                            else {
                                this.ngToast.create('Tratamiento modificado con éxito!');
                                this.$state.go('treatments');
                            }
                            //this.object = angular.copy({});
                        })
                        .catch(err => {
                            this.isSaving = false;
                            this.handleError(err);
                        });
                }
                else {
                    this.$http.post('/api/treatments', this.object).then(treatment => {
                            //this.object = angular.copy({});
                            if (this.files && this.files.length > 0) {
                                this.uploadFiles(treatment.data._id);
                            }
                            else {
                                this.ngToast.create('Tratamiento agregado con éxito!');
                                this.$state.go('treatments');
                            }

                        })
                        .catch(err => {
                            this.isSaving = false;
                            this.handleError(err);
                        });
                }

            }
        }

        uploadFiles(id) {
            if (this.files && this.files.length) {
                for (var i = 0; i < this.files.length; i++) {
                    var file = this.files[i];
                    if (!file.$error) {
                        this.mayorIndex += 1;
                        if (i === (this.files.length - 1)) {
                            this.lastImageName = id + '/' + this.mayorIndex;

                        }
                        this.Upload.upload({
                            url: '/api/upload-files/treatment/' + id + '/' + this.mayorIndex,
                            data: {
                                file: file
                            }
                        }).then((function (resp) {
                            if (resp.config.url.indexOf(this.lastImageName) > -1 ) {
                                this.ngToast.create('Tratamiento agregado con éxito!');
                                this.$state.go('treatments');
                            }
                            this.$timeout((function () {
                                this.log = 'file: ' +
                                    resp.config.data.file.name +
                                    ', Response: ' + JSON.stringify(resp.data) +
                                    '\n' + this.log;
                            }).bind(this));
                        }).bind(this), null, (function (evt) {
                            var progressPercentage = parseInt(100.0 *
                                evt.loaded / evt.total);
                            this.log = 'progress: ' + progressPercentage +
                                '% ' + evt.config.data.file.name + '\n' +
                                this.log;
                        }).bind(this));
                    }
                }
            }
        };

        deleteFiles() {
            if (this.imagesToRemove.length > 0) {
                for (var i = 0; i <this.imagesToRemove.length; i++) {
                    var file = this.imagesToRemove[i];
                        this.$http.delete('/api/upload-files/treatment/' + file.file + '/');
                }
            }
        };

        handleError(err) {
            var errors = err.data.errors;
            if (errors) {
                this.errors = {};
                this.ngToast.create({
                    className: 'danger',
                    content: 'Faltan campos por completar. Revisa el formulario.'
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
        .component('treatments', {
            templateUrl: 'app/treatments/treatments.html',
            controller: TreatmentsComponent,
            controllerAs: 'vm'
        });

})();
