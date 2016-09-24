/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/reports              ->  index
 * POST    /api/reports              ->  create
 * GET     /api/reports/:id          ->  show
 * PUT     /api/reports/:id          ->  upsert
 * PATCH   /api/reports/:id          ->  patch
 * DELETE  /api/reports/:id          ->  destroy
 */

import Treatment from '../treatment/treatment.model';

'use strict';

// Gets a single Report from the DB
export function getReport(req, res) {
    Treatment.findById(req.params.id)
        .populate('doctor')
        .populate('patient')
        .populate({
            path: 'patient',
            populate: { path: 'agreementType' }
        })
        .populate('drugs.type')
        .exec(function (err, object) {
            if (err || !object) {
                var error = err || 'Verifique los parámetros';
                return res.status(500).send(error);
            }
            var fs = require('fs');
            var pdf = require('html-pdf');
            var template = fs.readFileSync('./client/reports/prescription.html', 'utf8');
            var serverUrl = req.protocol + '://' + req.get('host');
            object.serverUrl = serverUrl;

            var Handlebars = require('handlebars');
            template = Handlebars.compile(template);

            Handlebars.registerHelper('formatDate', function(date) {
                return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
            });
            var html = template(object);




            var options = { format: 'A4' };
            pdf.create(html, options).toStream(function(err, stream) {
                res.set({
                    "Content-Disposition":"attachment; filename=" + req.params.report + "-" + req.params.id + ".pdf",
                    "Content-Type": 'application/pdf',
                    'Access-Control-Allow-Origin': '*'
                });
                res.status(200);
                stream.pipe(res);

            });
    });
}
