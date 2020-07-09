define([
    'jquery',
    'kb_service/client/workspace',
    'widgets/modeling/KBModeling',

    // For effect
    'widgets/modeling/kbasePathways',
    'kbaseUI/widget/visWidgets/plants/pmiBarchart'
], function (
    $,
    Workspace,
    KBModeling
) {
    'use strict';

    function KBaseFBA_FBA(modeltabs) {
        var self = this;
        this.modeltabs = modeltabs;
        this.runtime = modeltabs.runtime;

        this.workspaceClient = new Workspace(this.runtime.config('services.workspace.url'), {
            token: this.runtime.service('session').getAuthToken()
        });

        this.tabList = [
            {
                key: 'overview',
                name: 'Overview',
                type: 'verticaltbl',
                rows: [
                    {
                        label: 'ID',
                        key: 'wsid'
                    },
                    {
                        label: 'Object type',
                        key: 'objecttype',
                        type: 'typelink'
                    },
                    {
                        label: 'Owner',
                        key: 'owner'
                    },
                    {
                        label: 'Version',
                        key: 'instance'
                    },
                    {
                        label: 'Mod-date',
                        key: 'moddate'
                    },
                    {
                        label: 'Objective value',
                        key: 'objective'
                    },
                    {
                        label: 'Objective function',
                        key: 'objectivefunction'
                    },
                    {
                        label: 'Model',
                        key: 'model',
                        type: 'wstype'
                    },
                    {
                        label: 'Media',
                        key: 'media',
                        type: 'wstype'
                    },
                    {
                        label: 'Regulome',
                        key: 'regulome',
                        type: 'wstype'
                    },
                    {
                        label: 'Prom Constraint',
                        key: 'promconstraint',
                        type: 'wstype'
                    },
                    {
                        label: 'Expression',
                        key: 'expression',
                        type: 'wstype'
                    },
                    {
                        label: 'Expression condition',
                        key: 'expressioncolumn'
                    },
                    {
                        label: 'Single KO',
                        key: 'singleko'
                    },
                    {
                        label: 'Number reactions',
                        key: 'numreactions'
                    },
                    {
                        label: 'Number compounds',
                        key: 'numcompounds'
                    },
                    {
                        label: 'Gene KO',
                        key: 'numgeneko'
                    },
                    {
                        label: 'Reaction KO',
                        key: 'numrxnko'
                    },
                    {
                        label: 'Custom bounds',
                        key: 'numcpdbounds'
                    },
                    {
                        label: 'Custom constraints',
                        key: 'numconstraints'
                    },
                    {
                        label: 'Media supplements',
                        key: 'numaddnlcpds'
                    },
                    {
                        label: 'Uptake limits',
                        key: 'uptakelimits'
                    },
                    {
                        label: 'Uptake limits',
                        key: 'uptakelimits'
                    },
                    {
                        label: 'Minimize fluxes?',
                        key: 'minfluxes',
                        type: 'boolean'
                    },
                    {
                        label: 'Find minimal media?',
                        key: 'findminmedia',
                        type: 'boolean'
                    },
                    {
                        label: 'Minimize reactions?',
                        key: 'minimizerxn',
                        type: 'boolean'
                    },
                    {
                        label: 'All reactions reversible?',
                        key: 'allreversible',
                        type: 'boolean'
                    },
                    {
                        label: 'Thermodynamic constraints?',
                        key: 'simplethermo',
                        type: 'boolean'
                    },
                    {
                        label: 'Objective fraction',
                        key: 'objfraction'
                    }
                ]
            },
            {
                key: 'modelreactions',
                name: 'Reaction fluxes',
                type: 'dataTable',
                columns: [
                    {
                        label: 'Reaction',
                        type: 'tabLink',
                        linkformat: 'dispIDCompart',
                        key: 'id',
                        method: 'ReactionTab',
                        width: '15%'
                    },
                    {
                        label: 'Flux',
                        key: 'flux',
                        visible: 1
                    },
                    {
                        label: 'Min flux<br>(Lower bound)',
                        key: 'disp_low_flux',
                        visible: 1
                    },
                    {
                        label: 'Max flux<br>(Upper bound)',
                        key: 'disp_high_flux',
                        visible: 1
                    },
                    {
                        label: 'Class',
                        key: 'fluxClass',
                        visible: 1
                    },
                    {
                        label: 'Equation',
                        key: 'equation',
                        type: 'tabLink',
                        linkformat: 'linkequation'
                    },
                    {
                        label: 'Genes',
                        key: 'genes',
                        type: 'tabLinkArray',
                        method: 'GeneTab'
                    }
                ]
            },
            {
                key: 'compoundFluxes',
                name: 'Exchange fluxes',
                type: 'dataTable',
                columns: [
                    {
                        label: 'Compound',
                        key: 'id',
                        type: 'tabLink',
                        linkformat: 'dispIDCompart',
                        method: 'CompoundTab',
                        width: '15%'
                    },
                    {
                        label: 'Exchange reaction',
                        key: 'exchangerxn',
                        visible: 1
                    },
                    {
                        label: 'Exchange flux',
                        key: 'uptake',
                        visible: 1
                    },
                    {
                        label: 'Min exchange flux<br>(Lower bound)',
                        key: 'disp_low_flux',
                        visible: 1
                    },
                    {
                        label: 'Max exchange flux<br>(Upper bound)',
                        key: 'disp_high_flux',
                        visible: 1
                    },
                    {
                        label: 'Class',
                        key: 'fluxClass',
                        visible: 1
                    },
                    {
                        label: 'Formula',
                        key: 'formula'
                    },
                    {
                        label: 'Charge',
                        key: 'charge'
                    },
                    {
                        label: 'Compartment',
                        key: 'cmpkbid',
                        type: 'tabLink',
                        method: 'CompartmentTab',
                        linkformat: 'dispID'
                    }
                ]
            },
            {
                key: 'modelgenes',
                name: 'Genes',
                visible: 1,
                columns: [
                    {
                        label: 'Gene',
                        key: 'id',
                        type: 'tabLink',
                        method: 'GeneTab',
                        linkformat: 'dispID',
                        visible: 1
                    },
                    {
                        label: 'Gene knocked out',
                        key: 'ko',
                        visible: 1
                    },
                    {
                        label: 'Fraction of growth with KO',
                        key: 'growthFraction',
                        visible: 0
                    }
                ]
            },
            {
                key: 'biomasscpds',
                name: 'Biomass',
                type: 'dataTable',
                columns: [
                    {
                        label: 'Biomass',
                        key: 'biomass',
                        type: 'tabLink',
                        method: 'BiomassTab',
                        linkformat: 'dispID'
                    },
                    {
                        label: 'Biomass flux',
                        key: 'bioflux'
                    },
                    {
                        label: 'Name',
                        key: 'name'
                    },
                    {
                        label: 'Coefficient',
                        key: 'coefficient'
                    },
                    {
                        label: 'Compartment',
                        key: 'cmpkbid',
                        type: 'tabLink',
                        linkformat: 'dispID',
                        method: 'CompartmentTab'
                    },
                    {
                        label: 'Max production',
                        key: 'maxprod',
                        visible: 0
                    }
                ]
            },
            {
                name: 'Pathways',
                widget: 'kbasePathways',
                getParams: function () {
                    return {
                        runtime: self.runtime,
                        models: [self.model],
                        fbas: [self.data]
                    };
                }
            }
        ];

        this.setMetadata = function (indata) {
            /*
            <obj_id objid, obj_name name, type_string type,
		timestamp save_date, int version, username saved_by,
		ws_id wsid, ws_name workspace, string chsum, int size, usermeta meta
            */
            const [
                objectId, objectName, workspaceType,
                saveDate, version, savedBy, workspaceId,
                workspaceName, , , metadata
            ] = indata;

            this.workspace = workspaceName;
            this.objName = objectName;
            this.overview = {
                wsid: workspaceName + '/' + objectName, // TODO: terrible mixup of wsid, which usually means the workspace id!!!!
                ref: [workspaceId, objectId, version].join('/'),
                ws: workspaceName,
                obj_name: objectName,
                objecttype: workspaceType,
                owner: savedBy, // TODO: not really owner
                instance: version, // TODO sb called "version"!
                moddate: saveDate
            };

            this.usermeta = {};
            // if there is user metadata, add it
            if ('Model' in metadata) {
                this.usermeta = {
                    objective: metadata['Objective'],
                    model: metadata['Model'],
                    media: metadata['Media'],
                    singleko: metadata['Combination deletions'],
                    numreactions: metadata['Number reaction variables'],
                    numcompounds: metadata['Number compound variables'],
                    numgeneko: metadata['Number gene KO'],
                    numrxnko: metadata['Number reaction KO'],
                    numcpdbounds: metadata['Number compound bounds'],
                    numconstraints: metadata['Number constraints'],
                    numaddnlcpds: metadata['Number additional compounds']
                };
                if ('ExpressionMatrix' in metadata) {
                    this.usermeta['expression'] = metadata['ExpressionMatrix'];
                }
                if ('PromConstraint' in metadata) {
                    this.usermeta['promconstraint'] = metadata['PromConstraint'];
                }
                if ('ExpressionMatrixColumn' in metadata) {
                    this.usermeta['expressioncolumn'] = metadata['ExpressionMatrixColumn'];
                }
                $.extend(this.overview, this.usermeta);
            }
        };

        this.formatObject = function () {
            this.usermeta.model = self.data.fbamodel_ref;

            this.usermeta.media = self.data.media_ref;
            this.usermeta.objective = self.data.objectiveValue;
            this.usermeta.minfluxes = self.data.fluxMinimization;
            this.usermeta.findminmedia = self.data.findMinimalMedia;
            this.usermeta.minimizerxn = self.data.minimize_reactions;
            this.usermeta.allreversible = self.data.allReversible;
            this.usermeta.simplethermo = self.data.simpleThermoConstraints;
            this.usermeta.objfraction = self.data.objectiveConstraintFraction;
            this.usermeta.regulome = self.data.regulome_ref;
            this.usermeta.promconstraint = self.data.promconstraint_ref;
            this.usermeta.expression = self.data.tintlesample_ref;
            this.usermeta.phenotypeset = self.data.phenotypeset_ref;
            this.usermeta.phenotypesimulationset = self.data.phenotypesimulationset_ref;
            this.usermeta.singleko = self.data.comboDeletions;
            this.usermeta.defaultmaxflux = self.data.defaultMaxFlux;
            this.usermeta.defaultmaxdrain = self.data.defaultMaxDrainFlux;
            this.usermeta.defaultmindrain = self.data.defaultMinDrainFlux;
            this.usermeta.phenotypesimulationset = self.data.phenotypesimulationset_ref;
            this.usermeta.uptakelimits = '';

            for (var key in self.data.uptakelimits) {
                if (this.usermeta.uptakelimits.length > 0) {
                    this.usermeta.uptakelimits += '<br>';
                }
                this.usermeta.uptakelimits += key + ':' + this.uptakelimits[key];
            }

            this.usermeta.objectivefunction = 'Minimize{';
            if (self.data.maximizeObjective === 1) {
                this.usermeta.objectivefunction = 'Maximize{';
            }
            for (const key in self.data.compoundflux_objterms) {
                this.usermeta.objectivefunction += ' (' + self.data.compoundflux_objterms[key] + ') ' + key;
            }
            for (const key in self.data.reactionflux_objterms) {
                this.usermeta.objectivefunction += ' (' + self.data.reactionflux_objterms[key] + ') ' + key;
            }
            for (const key in self.data.biomassflux_objterms) {
                this.usermeta.objectivefunction += ' (' + self.data.biomassflux_objterms[key] + ') ' + key;
            }
            this.usermeta.objectivefunction += '}';

            this.modelreactions = this.model.modelreactions;
            this.modelcompounds = this.model.modelcompounds;
            this.biomasses = this.model.biomasses;
            this.biomasscpds = this.model.biomasscpds;
            this.modelgenes = this.model.modelgenes;
            this.FBAConstraints = self.data.FBAConstraints;
            this.FBAMinimalMediaResults = self.data.FBAMinimalMediaResults;
            this.FBAMinimalReactionsResults = self.data.FBAMinimalReactionsResults;
            this.FBAMetaboliteProductionResults = self.data.FBAMetaboliteProductionResults;

            this.rxnhash = {};
            for (let i = 0; i < self.data.FBAReactionVariables.length; i++) {
                const rxnid = self.data.FBAReactionVariables[i].modelreaction_ref.split('/').pop();
                self.data.FBAReactionVariables[i].ko = 0;
                this.rxnhash[rxnid] = self.data.FBAReactionVariables[i];
            }
            for (let i = 0; i < self.data.reactionKO_refs.length; i++) {
                const rxnid = self.data.reactionKO_refs[i].split('/').pop();
                this.rxnhash[rxnid].ko = 1;
            }

            this.cpdhash = {};
            for (let i = 0; i < self.data.FBACompoundVariables.length; i++) {
                const cpdid = self.data.FBACompoundVariables[i].modelcompound_ref.split('/').pop();
                self.data.FBACompoundVariables[i].additionalcpd = 0;
                this.cpdhash[cpdid] = self.data.FBACompoundVariables[i];
            }
            for (let i = 0; i < self.data.additionalCpd_refs.length; i++) {
                const cpdid = self.data.additionalCpd_refs[i].split('/').pop();
                this.cpdhash[cpdid].additionalcpd = 1;
            }

            this.biohash = {};
            for (let i = 0; i < self.data.FBABiomassVariables.length; i++) {
                const bioid = self.data.FBABiomassVariables[i].biomass_ref.split('/').pop();
                this.biohash[bioid] = self.data.FBABiomassVariables[i];
            }

            this.maxpod = 0;
            this.metprodhash = {};
            for (let i = 0; i < this.FBAMetaboliteProductionResults.length; i++) {
                this.tabList[4].columns[5].visible = 1;
                const metprod = self.data.FBAMetaboliteProductionResults[i];
                const cpdid = metprod.modelcompound_ref.split('/').pop();
                this.metprodhash[cpdid] = metprod;
            }

            this.genehash = {};
            for (let i = 0; i < this.modelgenes.length; i++) {
                this.genehash[this.modelgenes[i].id] = this.modelgenes[i];
                this.genehash[this.modelgenes[i].id].ko = 0;
            }

            /*
             for (var i=0; i < self.data.geneKO_refs.length; i++) {
             var geneid = self.data.geneKO_refs[i].split("/").pop();
             this.genehash[geneid].ko = 1;
             }*/
            this.delhash = {};
            for (let i = 0; i < self.data.FBADeletionResults.length; i++) {
                const geneid = self.data.FBADeletionResults[i].feature_refs[0].split('/').pop();
                this.delhash[geneid] = self.data.FBADeletionResults[i];
            }

            this.cpdboundhash = {};
            for (let i = 0; i < self.data.FBACompoundBounds.length; i++) {
                const cpdid = self.data.FBACompoundBounds[i].modelcompound_ref.split('/').pop();
                this.cpdboundhash[cpdid] = self.data.FBACompoundBounds[i];
            }

            this.rxnboundhash = {};
            for (let i = 0; i < self.data.FBAReactionBounds.length; i++) {
                const rxnid = self.data.FBAReactionBounds[i].modelreaction_ref.split('/').pop();
                this.rxnboundhash[rxnid] = self.data.FBAReactionBounds[i];
            }

            for (let i = 0; i < this.modelgenes.length; i++) {
                const mdlgene = this.modelgenes[i];
                if (this.genehash[mdlgene.id]) {
                    mdlgene.ko = this.genehash[mdlgene.id].ko;
                }
                if (this.delhash[mdlgene.id]) {
                    mdlgene.growthFraction = this.delhash[mdlgene.id].growthFraction;
                }
            }

            let exp_state = 0;
            let exp_value = 0;
            for (let i = 0; i < this.modelreactions.length; i++) {
                const mdlrxn = this.modelreactions[i];
                if (this.rxnhash[mdlrxn.id]) {
                    if ('exp_state' in this.rxnhash[mdlrxn.id]) {
                        mdlrxn.exp_state = this.rxnhash[mdlrxn.id].exp_state;
                    }
                    if ('expression' in this.rxnhash[mdlrxn.id]) {
                        mdlrxn.expression = this.rxnhash[mdlrxn.id].expression;
                    }
                    if ('scaled_exp' in this.rxnhash[mdlrxn.id]) {
                        mdlrxn.scaled_exp = this.rxnhash[mdlrxn.id].scaled_exp;
                    }
                    mdlrxn.upperFluxBound = this.rxnhash[mdlrxn.id].upperBound;
                    mdlrxn.lowerFluxBound = this.rxnhash[mdlrxn.id].lowerBound;
                    mdlrxn.fluxMin = this.rxnhash[mdlrxn.id].min;
                    mdlrxn.fluxMax = this.rxnhash[mdlrxn.id].max;
                    mdlrxn.flux = this.rxnhash[mdlrxn.id].value;
                    mdlrxn.fluxClass = this.rxnhash[mdlrxn.id].class;
                    mdlrxn.disp_low_flux = mdlrxn.fluxMin + '<br>(' + mdlrxn.lowerFluxBound + ')';
                    mdlrxn.disp_high_flux = mdlrxn.fluxMax + '<br>(' + mdlrxn.upperFluxBound + ')';
                }
                if (this.rxnboundhash[mdlrxn.id]) {
                    mdlrxn.customUpperBound = this.rxnboundhash[mdlrxn.id].upperBound;
                    mdlrxn.customLowerBound = this.rxnboundhash[mdlrxn.id].lowerBound;
                }
                if ('exp_state' in mdlrxn) {
                    exp_state = 1;
                }
                if ('expression' in mdlrxn) {
                    exp_value = 1;
                    mdlrxn.scaled_exp = Math.round(100 * mdlrxn.scaled_exp) / 100;
                    mdlrxn.expression = Math.round(100 * mdlrxn.expression) / 100;
                    mdlrxn.exp_value = mdlrxn.scaled_exp + '<br>(' + mdlrxn.expression + ')';
                }
            }

            if (exp_value === 1) {
                this.tabList[1].columns.splice(2, 0, {
                    label: 'Scaled expression (unscaled value)',
                    key: 'exp_value'
                });
            }

            if (exp_state === 1) {
                this.tabList[1].columns.splice(2, 0, {
                    label: 'Expression state',
                    key: 'exp_state'
                });
            }
            this.compoundFluxes = [];
            this.cpdfluxhash = {};
            for (let i = 0; i < this.modelcompounds.length; i++) {
                const mdlcpd = this.modelcompounds[i];
                if (this.cpdhash[mdlcpd.id]) {
                    mdlcpd.exchangerxn = ' => ' + mdlcpd.name + '[e]';
                    mdlcpd.upperFluxBound = this.cpdhash[mdlcpd.id].upperBound;
                    mdlcpd.lowerFluxBound = this.cpdhash[mdlcpd.id].lowerBound;
                    mdlcpd.fluxMin = this.cpdhash[mdlcpd.id].min;
                    mdlcpd.fluxMax = this.cpdhash[mdlcpd.id].max;
                    mdlcpd.uptake = this.cpdhash[mdlcpd.id].value;
                    mdlcpd.fluxClass = this.cpdhash[mdlcpd.id].class;
                    mdlcpd.disp_low_flux = mdlcpd.fluxMin + '<br>(' + mdlcpd.lowerFluxBound + ')';
                    mdlcpd.disp_high_flux = mdlcpd.fluxMax + '<br>(' + mdlcpd.upperFluxBound + ')';
                    this.cpdfluxhash[mdlcpd.id] = mdlcpd;
                    this.compoundFluxes.push(mdlcpd);
                }
                if (this.metprodhash[mdlcpd.id]) {
                    mdlcpd.maxProd = this.metprodhash[mdlcpd.id].maximumProduction;
                    //if (!this.cpdfluxhash[mdlcpd.id]) {
                    //  this.compoundFluxes.push(mdlcpd);
                    //}
                }
                if (this.cpdboundhash[mdlcpd.id]) {
                    mdlcpd.customUpperBound = this.cpdboundhash[mdlcpd.id].upperBound;
                    mdlcpd.customLowerBound = this.cpdboundhash[mdlcpd.id].lowerBound;
                    if (!this.cpdfluxhash[mdlcpd.id]) {
                        this.compoundFluxes.push(mdlcpd);
                    }
                }
            }
            for (let i = 0; i < this.biomasses.length; i++) {
                const bio = this.biomasses[i];
                if (this.biohash[bio.id]) {
                    bio.upperFluxBound = this.biohash[bio.id].upperBound;
                    bio.lowerFluxBound = this.biohash[bio.id].lowerBound;
                    bio.fluxMin = this.biohash[bio.id].min;
                    bio.fluxMax = this.biohash[bio.id].max;
                    bio.flux = this.biohash[bio.id].value;
                    bio.fluxClass = this.biohash[bio.id].class;
                    this.modelreactions.push(bio);
                } else {
                    this.biohash[bio.id] = bio;
                    bio.upperFluxBound = 1000;
                    bio.lowerFluxBound = 0;
                    bio.fluxMin = 0;
                    bio.fluxMax = 1000;
                    bio.flux = 0;
                    bio.fluxClass = 'Blocked';
                    this.modelreactions.push(bio);
                }
                bio.disp_low_flux = bio.fluxMin + '<br>(' + bio.lowerFluxBound + ')';
                bio.disp_high_flux = bio.fluxMax + '<br>(' + bio.upperFluxBound + ')';
            }
            for (let i = 0; i < this.biomasscpds.length; i++) {
                const biocpd = this.biomasscpds[i];
                if (this.biohash[biocpd.biomass]) {
                    biocpd.bioflux = this.biohash[biocpd.biomass].flux;
                }
                if (this.metprodhash[biocpd.id]) {
                    biocpd.maxprod = this.metprodhash[biocpd.id].maximumProduction;
                }
            }
        };

        this.setData = function (indata, tabs) {
            // this is a mess
            self.data = indata;

            // here we set an fba model on this object. We do this by
            // fetching the referenced model, then instantiating an
            // fba model object, then manually setting the metadata and data
            // on it.
            return self.workspaceClient.get_objects([{ ref: indata.fbamodel_ref }])
                .then(([result]) => {
                    const model = result.data;

                    //this is a godawful hack. When we setData, lookup the PlantModelTemplate, and if it's there, then add a barchart
                    //otherwise, do nothing. Assume we'll attempt this if we've been given tabs.
                    if (tabs !== undefined) {
                        self.workspaceClient
                            .get_objects([{
                                ref: model.template_ref
                            }])
                            .then(function ([result]) {
                                const $usePlantModel = result.info[1] === 'PlantModelTemplate' ? 1 : 0;
                                const $barchartElem = $.jqElem('div');
                                $barchartElem.kbasePMIBarchart({
                                    runtime: self.runtime,
                                    fba_workspace: self.workspace,
                                    fba_object: self.objName,
                                    subsystem_annotation_object: $usePlantModel
                                        ? 'PlantSEED_Subsystems'
                                        : 'default-kegg-subsystems',
                                    subsystem_annotation_workspace: $usePlantModel ? 'PlantSEED' : 'kbase',
                                    selected_subsystems: $usePlantModel
                                        ? ['Central Carbon: Glycolysis_and_Gluconeogenesis_in_plants']
                                        : ['Carbohydrate metabolism: Glycolysis / Gluconeogenesis']
                                });

                                tabs.addTab({
                                    name: 'Bar charts',
                                    content: $barchartElem
                                });
                                return null;
                            })
                            .catch(function (err) {
                                console.error(err);
                            });
                    }

                    // Note that the "kbModeling" is the blank object
                    // that is populated with all the fba widgets when
                    // they their respective modules are loaded.
                    var kbModeling = new KBModeling(); // this is a mess
                    self.model = new kbModeling.KBaseFBA_FBAModel(self.modeltabs);

                    self.model.setMetadata(result.info);
                    self.model.setData(result.data);
                    self.formatObject();
                    return null;
                });
        };

        this.ReactionTab = function (info) {
            var rxn = self.rxnhash[info.id];
            if (typeof rxn === 'undefined') {
                rxn = self.biohash[info.id];
                if (typeof rxn !== 'undefined') {
                    return self.BiomassTab(info);
                }
            }
            var output = self.model.ReactionTab(info);
            if (output && 'done' in output) {
                return output.then(function (data) {
                    return self.ExtendReactionTab(info, data);
                });
            }
            return self.ExtendReactionTab(info, output);
        };

        this.ExtendReactionTab = function (info, data) {
            var rxn = self.rxnhash[info.id];
            data.push({
                label: 'Flux',
                data: rxn.flux
            });
            data.push({
                label: 'Min flux<br>(Lower bound)',
                data: rxn.disp_low_flux
            });
            data.push({
                label: 'Max flux<br>(Upper bound)',
                data: rxn.disp_high_flux
            });
            data.push({
                label: 'Class',
                data: rxn.fluxClass
            });
            return data;
        };

        this.CompoundTab = function (info) {
            const output = self.model.CompoundTab(info);
            if (output && 'done' in output) {
                return output.then(function (data) {
                    return self.ExtendCompoundTab(info, data);
                });
            }
            return self.ExtendCompoundTab(info, output);
        };

        this.ExtendCompoundTab = (info, table) => {
            const cpd = this.cpdhash[info.id];

            // TODO: should we really show this, or just
            // bail here?
            if (!cpd) {
                table.push({
                    label: 'Not Found',
                    data: `Compound not found in FBA: ${info.id}`
                });
                return table;
            }

            table.push({
                label: 'Exchange reaction',
                data: cpd.exchangerxn
            });
            table.push({
                label: 'Exchange flux',
                data: cpd.uptake
            });
            table.push({
                label: 'Min flux<br>(Lower bound)',
                data: cpd.disp_low_flux
            });
            table.push({
                label: 'Max flux<br>(Upper bound)',
                data: cpd.disp_high_flux
            });
            table.push({
                label: 'Class',
                data: cpd.fluxclass
            });
            return table;
        };

        this.GeneTab = function (info) {
            const output = self.model.GeneTab(info);
            if (output && 'done' in output) {
                return output.then((data) => {
                    return self.ExtendGeneTab(info, data);
                });
            }
            return self.ExtendGeneTab(info, output);
        };

        this.ExtendGeneTab = function (info, data) {
            const gene = self.genehash[info.id];
            data.push({
                label: 'Gene knocked OUT',
                data: gene.ko
            });
            data.push({
                label: 'Fraction of growth with KO',
                data: gene.growthFraction
            });
            return data;
        };

        this.BiomassTab = function (info) {
            var output = self.model.BiomassTab(info);
            if (output && 'done' in output) {
                return output.then(function (data) {
                    return self.ExtendBiomassTab(info, data);
                });
            }
            return self.ExtendBiomassTab(info, output);
        };

        this.ExtendBiomassTab = function (info, data) {
            var bio = self.biohash[info.id];
            data.push({
                label: 'Flux',
                data: bio.flux
            });
            data.push({
                label: 'Min flux<br>(Lower bound)',
                data: bio.disp_low_flux,
                visible: 1
            });
            data.push({
                label: 'Max flux<br>(Upper bound)',
                data: bio.disp_high_flux,
                visible: 1
            });
            data.push({
                label: 'Class',
                data: bio.fluxClass,
                visible: 1
            });
            return data;
        };

        this.CompartmentTab = function (info) {
            return self.model.CompartmentTab(info);
        };
    }

    // make method of base class
    KBModeling.prototype.KBaseFBA_FBA = KBaseFBA_FBA;
});
