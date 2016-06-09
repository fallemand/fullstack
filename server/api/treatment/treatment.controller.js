/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/treatments              ->  index
 * POST    /api/treatments              ->  create
 * GET     /api/treatments/:id          ->  show
 * PUT     /api/treatments/:id          ->  update
 * DELETE  /api/treatments/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Treatment from './treatment.model';
import TreatmentState from '../treatment-state/treatment-state.model';
import Patient from '../patient/patient.model';
import AgreementType from '../agreement-type/agreement-type.model';

function respondWithResult(res, statusCode) {
    statusCode = statusCode || 200;
    return function (entity) {
        if (entity) {
            res.status(statusCode).json(entity);
        }
    };
}

function saveUpdates(updates) {
    return function (entity) {
        var updated = _.merge(entity, updates);
        return updated.save()
            .then(updated => {
                return updated;
            });
    };
}

function removeEntity(res) {
    return function (entity) {
        if (entity) {
            return entity.remove()
                .then(() => {
                    res.status(204).end();
                });
        }
    };
}

function handleEntityNotFound(res) {
    return function (entity) {
        if (!entity) {
            res.status(404).end();
            return null;
        }
        return entity;
    };
}

function handleError(res, statusCode) {
    statusCode = statusCode || 500;
    return function (err) {
        res.status(statusCode).send(err);
    };
}

// Gets a list of Treatments
export function index(req, res) {
    return Treatment.find()
        .populate('patient')
        .populate('diseaseTopographicDiagnosis')
        .populate('treatmentType')
        .populate('drugsType')
        .populate('state')
        .exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Gets a single Treatment from the DB
export function show(req, res) {
    return Treatment.findById(req.params.id)
        .populate('patient')
        .populate('diseaseTopographicDiagnosis')
        .populate('treatmentType')
        .populate('drugsType')
        .populate('state')
        .exec(function (err, treatment) {
            AgreementType.populate(treatment, {
                path: 'patient.agreementType',
                select: 'name'
            },function (err) {
                if(err) {
                    res.status(500).send(err);
                }
                else {
                    res.status(200).send(treatment);
                }
            });
        });
}

// Creates a new Treatment in the DB
export function create(req, res) {
    if(!req.body.state) {
        TreatmentState.findOne({name: 'En Auditoria'})
            .exec()
            .then(state => {
                req.body.state = state._id;
                return Treatment.create(req.body)
                    .then(respondWithResult(res, 201))
                    .catch(handleError(res));
            })
    }
    else {
        return Treatment.create(req.body)
            .then(respondWithResult(res, 201))
            .catch(handleError(res));
    }
}

// Updates an existing Treatment in the DB
export function update(req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    return Treatment.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(saveUpdates(req.body))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Deletes a Treatment from the DB
export function destroy(req, res) {
    return Treatment.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(removeEntity(res))
        .catch(handleError(res));
}


function saveUpdates(updates) {
    return function (entity) {
        var updated = _.merge(entity, updates);
        return updated.save()
            .then(updated => {
                return updated;
            });
    };
}

// Get metadata
export function metadata(req, res) {
    var metadata = {
        name: 'tratamiento',
        pluralName: 'Tratamientos',
        sections: {
            patient: {
                title: 'Paciente',
                fields: ['patient']
            },
            disease: {
                title: 'Enfermedad',
                fields: ['diseaseTopographicDiagnosis', 'diseaseHistologicalDiagnosis', 'diseaseStage']
            },
            treatment: {
                title: 'Tratamiento',
                fields: ['treatmentType', 'treatmentSchema', 'treatmentExpectedDate', 'treatmentHeight', 'treatmentWeight', 'treatmentBodySurface', 'treatmentActualCicle', 'treatmentCyclesQuantity']
            },
            drugs: {
                title: 'Drogas',
                fields: ['drugs']
            },
            confirm: {
                title: 'Confirmar',
                fields: ['observation']
            }
        },
        fields: [
            {
                'title': 'Paciente',
                'field': 'patient',
                'type': 'typeahead',
                'descField': 'desc',
                'remoteApi': 'patients',
                'searchField': 'name',
                'show': true,
                'controlType': 'object',
                'icon': 'fa fa-user-md',
                'attributes': {
                    required: true
                },
                'validations': {
                    'required': '',
                    'editable': ''
                }
            },
            {
                'title': 'Diagnóstico Topográfico',
                'field': 'diseaseTopographicDiagnosis',
                'type': 'typeahead',
                'descField': 'desc',
                'searchField': 'code',
                'remoteApi': 'cie10-diseases',
                'show': true,
                'controlType': 'object',
                'icon': 'fa fa-user-md',
                'attributes': {
                    required: true
                },
                'validations': {
                    'required': '',
                    'editable': ''
                }
            },
            {
                'title': 'Diagnóstico Histológico',
                'field': 'diseaseHistologicalDiagnosis',
                'controlType': 'input',
                'type': 'text',
                'show': true,
                'iconText': 'TC',
                'hideInList' : true,
                'attributes': {
                    required: true
                },
                'validations': {
                    'required': ''
                }
            },
            {
                'title': 'Estadío',
                'field': 'diseaseStage',
                'type': 'number',
                'show': true,
                'iconText': 'DNI',
                'controlType': 'input',
                'attributes': {
                    required: true,
                    'max': '5',
                    'min': 0
                },
                'validations': {
                    'required': '',
                    'number': '',
                    'max': '5',
                    'min': 0
                }
            },
            {
                'title': 'Tipo de Tratamiento',
                'field': 'treatmentType',
                'type': 'select',
                'show': true,
                'descField': 'name',
                'remoteApi': 'treatment-types',
                'icon': 'fa fa-credit-card',
                'controlType': 'object',
                'attributes': {
                    required: true
                },
                'validations': {
                    'required': '',
                    'number': ''
                }
            },
            {
                'title': 'Esquema',
                'field': 'treatmentSchema',
                'hideInList' : true,
                'type': 'text',
                'show': true,
                'controlType': 'input',
                'icon': 'fa fa-home',
                'attributes': {
                    required: true
                },
                'validations': {
                    'required': ''
                }
            },
            {
                'title': 'Fecha probable de tratamiento',
                'field': 'treatmentExpectedDate',
                'type': 'date',
                'show': true,
                'controlType': 'input',
                'icon': 'fa fa-home',
                'attributes': {
                    required: true
                },
                'validations': {
                    'required': ''
                }
            },
            {
                'title': 'Altura',
                'field': 'treatmentHeight',
                'type': 'text',
                'show': true,
                'controlType': 'input',
                'hideInList' : true,
                'icon': 'fa fa-home',
                'attributes': {
                    required: true
                },
                'validations': {
                    'required': ''
                }
            },
            {
                'title': 'Peso',
                'field': 'treatmentWeight',
                'type': 'text',
                'show': true,
                'controlType': 'input',
                'hideInList' : true,
                'icon': 'fa fa-home',
                'attributes': {
                    required: true
                },
                'validations': {
                    'required': ''
                }
            },
            {
                'title': 'Superficie Corporal',
                'field': 'treatmentBodySurface',
                'type': 'text',
                'show': true,
                'controlType': 'input',
                'hideInList' : true,
                'icon': 'fa fa-home',
                'attributes': {
                    required: true
                },
                'validations': {
                    'required': ''
                }
            },
            {
                'title': 'Ciclo Actual',
                'field': 'treatmentActualCicle',
                'type': 'text',
                'show': true,
                'controlType': 'input',
                'icon': 'fa fa-home',
                'attributes': {
                    required: true
                },
                'validations': {
                    'required': ''
                }
            },
            {
                'title': 'Cantidad de Ciclos',
                'field': 'treatmentCyclesQuantity',
                'type': 'text',
                'show': true,
                'controlType': 'input',
                'icon': 'fa fa-home',
                'attributes': {
                    required: true
                },
                'validations': {
                    'required': ''
                }
            },
            {
                'title': 'Drogas',
                'field': 'drugs',
                'hideInList' : true,
                'controlType': 'list',
                fields: [
                    {
                        'title': 'Droga',
                        'field': 'name',
                        'type': 'text',
                        'show': true,
                        'controlType': 'input',
                        'icon': 'flaticon-chemistry-lab-instrument-1',
                        'attributes': {
                            required: true
                        },
                        'validations': {
                            'required': ''
                        }
                    },
                    {
                        'title': 'Nombre Comercial',
                        'field': 'tradeName',
                        'type': 'text',
                        'show': true,
                        'controlType': 'input',
                        'icon': 'flaticon-medicine-bottle',
                        'attributes': {
                            required: true
                        },
                        'validations': {
                            'required': ''
                        }
                    },
                    {
                        'title': 'Tipo',
                        'field': 'type',
                        'type': 'select',
                        'show': true,
                        'descField': 'name',
                        'remoteApi': 'drug-types',
                        'icon': 'flaticon-open-pill',
                        'controlType': 'object',
                        'attributes': {
                            required: true
                        },
                        'validations': {
                            'required': ''
                        }
                    },
                    {
                        'title': 'Presentación',
                        'field': 'presentation',
                        'type': 'text',
                        'show': true,
                        'controlType': 'input',
                        'icon': 'flaticon-bottle-of-chemical-elements',
                        'attributes': {
                            required: true
                        },
                        'validations': {
                            'required': ''
                        }
                    },
                    {
                        'title': 'Cantidad',
                        'field': 'quantity',
                        'type': 'number',
                        'show': true,
                        'icon': 'fa fa-sort-numeric-asc',
                        'controlType': 'input',
                        'attributes': {
                            required: true
                        },
                        'validations': {
                            'required': ''
                        }
                    }
                ]
            },
            {
                'title': 'Observaciones',
                'field': 'observation',
                'hideInList' : true,
                'type': 'text',
                'show': true,
                'controlType': 'textarea',
                'icon': 'fa fa-phone',
                'attributes': {
                    required: true,
                    rows: 4
                },
                'validations': {
                    'required': ''
                }
            },
            {
                'title': 'Estado',
                'field': 'state',
                'type': 'select',
                'show': true,
                'descField': 'name',
                'remoteApi': 'treatment-states',
                'controlType': 'object',
                'attributes': {
                    required: true
                },
                'validations': {
                    'required': '',
                    'number': ''
                },
                'decorator' : {
                    type: 'label',
                    class: {
                        'En Auditoria' : 'label-warning'
                    }
                }
            }
        ]

    };
    if (Object.keys(req.query).length > 0) {
        for (var attribute in req.query) {
            if (attribute == 'field') {
                for (var field in metadata.fields) {
                    if (metadata.fields[field].field == req.query[attribute]) {
                        res.json(metadata.fields[field]);
                    }
                }
            }
        }
    }
    else {
        res.json(metadata);
    }
}
