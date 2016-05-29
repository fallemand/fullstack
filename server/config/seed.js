/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import Thing from '../api/thing/thing.model';
import User from '../api/user/user.model';
import Patient from '../api/patient/patient.model';
import AgreementType from '../api/agreement-type/agreement-type.model';
import Cie10Disease from '../api/cie10-disease/cie10-disease.model';
import TreatmentType from '../api/treatment-type/treatment-type.model';
import DrugType from '../api/drug-type/drug-type.model';


Thing.find({}).remove()
    .then(() => {
        Thing.create({
            name: 'Development Tools',
            info: 'Integration with popular tools such as Bower, Grunt, Babel, Karma, ' +
            'Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, ' +
            'Stylus, Sass, and Less.'
        }, {
            name: 'Server and Client integration',
            info: 'Built with a powerful and fun stack: MongoDB, Express, ' +
            'AngularJS, and Node.'
        }, {
            name: 'Smart Build System',
            info: 'Build system ignores `spec` files, allowing you to keep ' +
            'tests alongside code. Automatic injection of scripts and ' +
            'styles into your index.html'
        }, {
            name: 'Modular Structure',
            info: 'Best practice client and server structures allow for more ' +
            'code reusability and maximum scalability'
        }, {
            name: 'Optimized Build',
            info: 'Build process packs up your templates as a single JavaScript ' +
            'payload, minifies your scripts/css/images, and rewrites asset ' +
            'names for caching.'
        }, {
            name: 'Deployment Ready',
            info: 'Easily deploy your app to Heroku or Openshift with the heroku ' +
            'and openshift subgenerators'
        });
    });


TreatmentType.find({}).remove()
    .then(() => {
        TreatmentType.create({
            name: 'Adyuvante'
        }, {
            name: 'Neo-Adyuvante'
        }, {
            name: 'Avanzado'
        })
    });
DrugType.find({}).remove()
    .then(() => {
        DrugType.create({
            name: 'Ampolla'
        }, {
            name: 'Comprimido'
        })
    });

User.find({}).remove()
    .then(() => {
        User.create({
                provider: 'local',
                name: 'Test User',
                email: 'test@example.com',
                password: 'test',
                mn: '1',
                mp: '1',
                active: true

            }, {
                provider: 'local',
                role: 'admin',
                name: 'Admin',
                email: 'admin@example.com',
                password: 'admin',
                mn: '1',
                mp: '1',
                active: true
            }, {
                provider: 'local',
                name: 'Admin',
                email: 'admin1@example.com',
                password: 'admin',
                mn: '1',
                mp: '1',
                active: true
            }, {
                provider: 'local',
                name: 'Admin',
                email: 'adm2@example.com',
                password: 'admin',
                mn: '1',
                mp: '1',
                active: true
            }, {
                provider: 'local',
                name: 'Admin',
                email: 'ad3n@example.com',
                password: 'admin',
                mn: '1',
                mp: '1',
                active: false
            }, {
                provider: 'local',
                name: 'Admin',
                email: 'ad4n@example.com',
                password: 'admin',
                mn: '1',
                mp: '1',
                active: false
            }, {
                provider: 'local',
                name: 'Admin',
                email: 'adm5@example.com',
                password: 'admin',
                mn: '1',
                mp: '1',
                active: false
            }, {
                provider: 'local',
                name: 'Admin',
                email: 'ad6n@example.com',
                password: 'admin',
                mn: '1',
                mp: '1',
                active: false
            }, {
                provider: 'local',
                name: 'Admin',
                email: 'adm7@example.com',
                password: 'admin',
                mn: '1',
                mp: '1',
                active: false
            }, {
                provider: 'local',
                name: 'Admin',
                email: 'ad8n@example.com',
                password: 'admin',
                mn: '1',
                mp: '1',
                active: false
            }, {
                provider: 'local',
                name: 'Admin',
                email: 'ad9n@example.com',
                password: 'admin',
                mn: '1',
                mp: '1',
                active: false
            }, {
                provider: 'local',
                name: 'Admin',
                email: 'ad0n@example.com',
                password: 'admin',
                mn: '1',
                mp: '1',
                active: false
            }, {
                provider: 'local',
                name: 'Admin',
                email: 'ad55n@example.com',
                password: 'admin',
                mn: '1',
                mp: '1',
                active: false
            })
            .then(() => {
                console.log('finished populating users');
            });
    });

AgreementType.find({}).remove()
    .then(() => {
        AgreementType.create({
            name: 'PROFE'
        }, {
            name: 'Carenciado'
        }, {
            name: 'DOSEP'
        }).then(() => {
            console.log('finished populating agreement types');
            Patient.find({}).remove()
                .then(() => {
                    AgreementType.findOne({name: 'DOSEP'}, function (err, doc) {
                        Patient.create({
                            name: 'Fran Carvallo',
                            email: 'bgbgyu@hotmail.com',
                            dni: '12589698',
                            socialInsuranceNumber: '23425456',
                            address: 'Hidalgo Palacios 7542',
                            phone: '+43532656565',
                            cellphone: '3513160678',
                            agreementType: doc._id
                        }).then(() => {
                            console.log('finished populating patients');
                        });
                    });
                    AgreementType.findOne({name: 'Carenciado'}, function (err, doc) {
                        Patient.create({
                            name: 'Manuel Sanchez',
                            email: 'asdasd@hotmail.com',
                            dni: '36142871',
                            socialInsuranceNumber: '23425456',
                            address: 'Hidalgo Palacios 7542',
                            phone: '+43532656565',
                            cellphone: '3513160678',
                            agreementType: doc._id
                        }).then(() => {
                            console.log('finished populating patients');
                        });
                    });
                    AgreementType.findOne({name: 'PROFE'}, function (err, doc) {
                        Patient.create({
                            name: 'Juan Carlos',
                            email: 'juancarlos@hotmail.com',
                            dni: '13658987',
                            socialInsuranceNumber: '23425456',
                            address: 'Hidalgo Palacios 7542',
                            phone: '+43532656565',
                            cellphone: '3513160678',
                            agreementType: doc._id
                        }).then(() => {
                            console.log('finished populating patients');
                        });
                    });
                });
        });
    });
