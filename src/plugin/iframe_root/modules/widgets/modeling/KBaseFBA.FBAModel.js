define([
    'jquery',
    'kb_service/client/workspace',
    'kb_service/client/fba',
    'kb_common/jsonRpc/dynamicServiceClient',
    'widgets/modeling/KBModeling',

    // For effect
    'widgets/modeling/kbasePathways'
], (
    $,
    Workspace,
    FBA,
    DynamicServiceClient,
    KBModeling
) => {
    const COMPOUND_IMAGE_URL_BASE = 'https://minedatabase.mcs.anl.gov/compound_images/ModelSEED/';

    function KBaseFBA_FBAModel(modeltabs) {
        const self = this;
        this.modeltabs = modeltabs;
        this.runtime = modeltabs.runtime;

        this.workspaceClient = new Workspace(this.runtime.config('services.workspace.url'), {
            token: this.runtime.service('session').getAuthToken()
        });

        this.setMetadata = function (indata) {
            const [
                objectId, objectName, workspaceType,
                saveDate, version, savedBy, workspaceId,
                workspaceName, , , metadata
            ] = indata;
            this.workspace = workspaceName;
            this.objName = objectName;
            this.overview = {
                wsid: `${workspaceName  }/${  objectName}`, // TODO: terrible mixup of wsid, which usually means the workspace id!!!!
                ref: [workspaceId, objectId, version].join('/'),
                ws: workspaceName,
                obj_name: objectName,
                objecttype: workspaceType,
                owner: savedBy, // TODO: not really owner
                instance: version, // TODO sb called "version"!
                moddate: saveDate
            };

            // if there is user metadata, add it
            if ('Name' in metadata) {
                this.usermeta = {
                    name: metadata['Name'],
                    source: `${metadata['Source']  }/${  metadata['Source ID']}`,
                    genome: metadata['Genome'],
                    modeltype: metadata['Type'],
                    numreactions: metadata['Number reactions'],
                    numcompounds: metadata['Number compounds'],
                    numcompartments: metadata['Number compartments'],
                    numbiomass: metadata['Number biomasses'],
                    numgapfills: metadata['Number gapfills']
                };
                $.extend(this.overview, this.usermeta);
            } else {
                this.usermeta = {};
            }
        };

        this.cmpnamehash = {
            c: 'Cytosol',
            p: 'Periplasm',
            g: 'Golgi apparatus',
            e: 'Extracellular',
            r: 'Endoplasmic reticulum',
            l: 'Lysosome',
            n: 'Nucleus',
            d: 'Plastid',
            m: 'Mitochondria',
            x: 'Peroxisome',
            v: 'Vacuole',
            w: 'Cell wall'
        };

        this.tabList = [
            {
                key: 'overview',
                name: 'Overview',
                type: 'verticaltbl',
                rows: [
                    {
                        label: 'Name',
                        key: 'name'
                    },
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
                        label: 'Source',
                        key: 'source'
                    },
                    {
                        label: 'Genome',
                        key: 'genome',
                        type: 'wstype'
                    },
                    {
                        label: 'Model type',
                        key: 'modeltype'
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
                        label: 'Number compartments',
                        key: 'numcompartments'
                    },
                    {
                        label: 'Number biomass',
                        key: 'numbiomass'
                    },
                    {
                        label: 'Number gapfills',
                        key: 'numgapfills'
                    }
                ]
            },
            {
                key: 'modelreactions',
                name: 'Reactions',
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
                        label: 'Name',
                        key: 'name'
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
                    },
                    {
                        label: 'Gapfilling',
                        key: 'gapfillingstring'
                    }
                ]
            },
            {
                key: 'modelcompounds',
                name: 'Compounds',
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
                        label: 'Name',
                        key: 'name'
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
                type: 'dataTable',
                columns: [
                    {
                        label: 'Gene',
                        key: 'id',
                        type: 'tabLink',
                        method: 'GeneTab'
                    },
                    {
                        label: 'Reactions',
                        key: 'reactions',
                        type: 'tabLinkArray',
                        method: 'ReactionTab'
                    }
                ]
            },
            {
                key: 'modelcompartments',
                name: 'Compartments',
                type: 'dataTable',
                columns: [
                    {
                        label: 'Compartment',
                        key: 'id',
                        type: 'tabLink',
                        method: 'CompartmentTab',
                        linkformat: 'dispID'
                    },
                    {
                        label: 'Name',
                        key: 'name'
                    },
                    {
                        label: 'pH',
                        key: 'pH'
                    },
                    {
                        label: 'Potential',
                        key: 'potential'
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
                        label: 'Compound',
                        key: 'id',
                        type: 'tabLink',
                        linkformat: 'dispIDCompart',
                        method: 'CompoundTab'
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
                    }
                ]
            },
            {
                key: 'gapfillings',
                name: 'Gapfilling',
                type: 'dataTable',
                columns: [
                    {
                        label: 'Gapfill',
                        key: 'simpid'
                    },
                    {
                        label: 'Integrated',
                        key: 'integrated'
                    },
                    {
                        label: 'Media',
                        key: 'media_ref',
                        linkformat: 'dispWSRef',
                        type: 'wstype',
                        wstype: 'KBaseFBA.Media'
                    }
                ]
            },
            {
                name: 'Pathways',
                widget: 'kbasePathways',
                getParams() {
                    return {
                        runtime: self.runtime,
                        models: [self.data]
                    };
                }
            }
        ];

        this.ReactionTab = function (info) {
            const rxn = self.rxnhash[info.id];
            const output = [
                {
                    label: 'Reaction',
                    data: rxn.dispid
                },
                {
                    label: 'Name',
                    data: rxn.name
                }
            ];
            if ('pathway' in rxn) {
                output.push({
                    label: 'Pathway',
                    data: rxn.pathway
                });
            }
            if ('reference' in rxn) {
                output.push({
                    label: 'Reference',
                    data: rxn.reference
                });
            }
            output.push(
                {
                    label: 'Compartment',
                    data: `${self.cmphash[rxn.cmpkbid].name  } ${  self.cmphash[rxn.cmpkbid].compartmentIndex}`
                },
                {
                    label: 'Equation',
                    data: rxn.equation,
                    type: 'pictureEquation'
                },
                {
                    label: 'GPR',
                    data: rxn.gpr
                }
            );

            if (rxn.rxnkbid !== 'rxn00000') {
                const client = new DynamicServiceClient({
                    url: this.runtime.config('services.service_wizard.url'),
                    token: this.runtime.service('session').getAuthToken(),
                    module: 'BiochemistryAPI'
                });
                return client
                    .callFunc('get_reactions', [
                        {
                            reactions: [rxn.rxnkbid],
                            biochemistry: self.biochem,
                            biochemistry_workspace: 'kbase'
                        }
                    ])
                    .spread((data) => {
                        if ('deltaG' in data[0]) {
                            output.push({
                                label: 'Delta G',
                                data: `${data[0].deltaG  } (${  data[0].deltaGErr  }) kcal/mol`
                            });
                        }
                        if (data[0].enzymes) {
                            output.push({
                                label: 'Enzymes',
                                data: data[0].enzymes.join(', ')
                            });
                        }
                        const aliashash = {};
                        const finalaliases = [];
                        for (let i = 0; i < data[0].aliases.length; i++) {
                            if (!(data[0].aliases[i] in aliashash)) {
                                finalaliases.push(data[0].aliases[i]);
                                aliashash[data[0].aliases[i]] = 1;
                            }
                        }
                        output.push({
                            label: 'Aliases',
                            data: finalaliases.join(', ')
                        });
                        return output;
                    });
            }
            return output;
        };

        this.GeneTab = function (info) {
            // var gene = this.genehash[id];
            // doing this instead of creating hash
            let data;
            self.modelgenes.forEach((gene) => {
                if (gene.id === info.id)
                    data = [
                        {
                            label: 'ID',
                            data: gene.id
                        },
                        {
                            label: 'Reactions',
                            data: gene.reactions,
                            type: 'tabLinkArray',
                            method: 'ReactionTab'
                        }
                    ];
            });
            return data;
        };

        this.CompoundTab = function (info) {
            const cpd = self.cpdhash[info.id];
            const compoundId = cpd.id.split('_')[0];
            const output = [
                {
                    label: 'Compound',
                    data: cpd.dispid
                },
                {
                    label: 'Image',
                    data: `<img src="${COMPOUND_IMAGE_URL_BASE}/${compoundId}.png" style="height:300px !important;">`
                },
                {
                    label: 'Name',
                    data: cpd.name
                },
                {
                    label: 'Formula',
                    data: cpd.formula
                },
                {
                    label: 'InChIKey',
                    data: cpd.inchikey
                },
                {
                    label: 'SMILES',
                    data: cpd.smiles
                },
                {
                    label: 'Charge',
                    data: cpd.charge
                },
                {
                    label: 'Compartment',
                    data: `${self.cmphash[cpd.cmpkbid].name  } ${  self.cmphash[cpd.cmpkbid].compartmentIndex}`
                }
            ];
            const client = new DynamicServiceClient({
                url: this.runtime.config('services.service_wizard.url'),
                token: this.runtime.service('session').getAuthToken(),
                module: 'BiochemistryAPI'
            });
            if (cpd.smiles && cpd.cpdkbid == 'cpd00000') {
                const p = client
                    .callFunc('depict_compounds', [
                        {
                            structures: [cpd.smiles]
                        }
                    ])
                    .then((data) => {
                        output[1] = {
                            label: 'Image',
                            data: data[0]
                        };
                        return output;
                    });
                return p;
            }
            if (cpd.cpdkbid !== 'cpd00000') {
                return client
                    .callFunc('get_compounds', [
                        {
                            compounds: [cpd.cpdkbid],
                            biochemistry: self.biochem,
                            biochemistry_workspace: 'kbase'
                        }
                    ])
                    .spread((data) => {
                        if ('deltaG' in data[0]) {
                            output.push({
                                label: 'Delta G',
                                data: `${data[0].deltaG  } (${  data[0].deltaGErr  }) kcal/mol`
                            });
                        }
                        const aliashash = {};
                        const finalaliases = [];
                        for (let i = 0; i < data[0].aliases.length; i++) {
                            if (!(data[0].aliases[i] in aliashash)) {
                                finalaliases.push(data[0].aliases[i]);
                                aliashash[data[0].aliases[i]] = 1;
                            }
                        }
                        output.push({
                            label: 'Aliases',
                            data: finalaliases.join(', ')
                        });
                        return output;
                    });
            }
            return output;
        };

        this.CompartmentTab = function (info) {
            const cmp = self.cmphash[info.id];
            const output = [
                {
                    label: 'Compartment',
                    data: cmp.id
                },
                {
                    label: 'Name',
                    data: cmp.name
                },
                {
                    label: 'pH',
                    data: cmp.pH
                },
                {
                    label: 'potential',
                    data: cmp.potential
                }
            ];
            return output;
        };

        this.BiomassTab = function (info) {
            const bio = self.biohash[info.id];
            const output = [
                {
                    label: 'Biomass',
                    data: bio.id
                },
                {
                    label: 'Name',
                    data: bio.name
                },
                {
                    label: 'DNA fraction',
                    data: bio.dna
                },
                {
                    label: 'RNA fraction',
                    data: bio.RNA
                },
                {
                    label: 'Protein fraction',
                    data: bio.protein
                },
                {
                    label: 'Cell wall fraction',
                    data: bio.cellwall
                },
                {
                    label: 'Lipid fraction',
                    data: bio.lipid
                },
                {
                    label: 'Cofactor fraction',
                    data: bio.cofactor
                },
                {
                    label: 'Other fraction',
                    data: bio.other
                },
                {
                    label: 'Energy mols',
                    data: bio.energy
                },
                {
                    label: 'Equation',
                    data: bio.equation
                }
            ];
            return output;
        };

        this.setData = function (fbaModel) {
            this.data = fbaModel;
            this.modelreactions = fbaModel.modelreactions;
            this.modelcompounds = fbaModel.modelcompounds;
            this.modelcompartments = fbaModel.modelcompartments;
            this.biomasses = fbaModel.biomasses;
            this.gapfillings = fbaModel.gapfillings;
            this.biochemws = 'kbase';
            this.biochem = 'default';

            const gfobjects = [];
            this.gfhash = {};
            for (let i = 0; i < this.gapfillings.length; i++) {
                this.gapfillings[i].simpid = `gf.${  i + 1}`;
                if ('fba_ref' in this.gapfillings[i] && this.gapfillings[i].fba_ref.length > 0) {
                    gfobjects.push({ref: this.gapfillings[i].fba_ref});
                } else if ('gapfill_ref' in this.gapfillings[i] && this.gapfillings[i].gapfill_ref.length > 0) {
                    gfobjects.push({ref: this.gapfillings[i].gapfill_ref});
                }
                this.gfhash[this.gapfillings[i].simpid] = this.gapfillings[i];
            }

            this.cmphash = {};
            for (let i = 0; i < this.modelcompartments.length; i++) {
                const cmp = this.modelcompartments[i];
                cmp.cmpkbid = cmp.compartment_ref.split('/').pop();
                if (cmp.cmpkbid === 'd') {
                    this.biochem = 'plantdefault';
                }
                cmp.name = self.cmpnamehash[cmp.cmpkbid];
                this.cmphash[cmp.id] = cmp;
            }

            this.cpdhash = {};
            for (let i = 0; i < this.modelcompounds.length; i++) {
                const cpd = this.modelcompounds[i];
                const idarray = cpd.id.split('_');
                // TODO: this the id does not always have the _ separator,
                //       so the part in brackets shows "undefined"
                cpd.dispid = `${idarray[0]}[${idarray[1]}]`;
                cpd.cmpkbid = cpd.modelcompartment_ref.split('/').pop();
                cpd.cpdkbid = cpd.compound_ref.split('/').pop();
                if (cpd.name === undefined) {
                    cpd.name = cpd.dispid;
                }
                cpd.name = cpd.name.replace(/_[a-zA-z]\d+$/, '');
                this.cpdhash[cpd.id] = cpd;
                if (cpd.cpdkbid !== 'cpd00000') {
                    // const array = cpd.compound_ref.split('/');
                    this.cpdhash[`${cpd.cpdkbid}_${cpd.cmpkbid}`] = cpd;
                    if (idarray[0] !== cpd.cpdkbid) {
                        cpd.dispid += `<br>(${cpd.cpdkbid})`;
                    }
                }
            }

            this.biomasscpds = [];
            this.biohash = {};
            for (let i = 0; i < this.biomasses.length; i++) {
                const biomass = this.biomasses[i];
                this.biohash[biomass.id] = biomass;
                biomass.dispid = biomass.id;
                let reactants = '';
                let products = '';
                for (let j = 0; j < biomass.biomasscompounds.length; j++) {
                    const biocpd = biomass.biomasscompounds[j];
                    biocpd.id = biocpd.modelcompound_ref.split('/').pop();

                    // TODO: this the id does not always have the _ separator,
                    //       so the part in brackets shows "undefined"
                    const idarray = biocpd.id.split('_');
                    biocpd.dispid = `${idarray[0]}[${idarray[1]}]`;

                    const CPD = this.cpdhash[biocpd.id];
                    biocpd.name = CPD.name;
                    biocpd.formula = CPD.formula;
                    biocpd.charge = CPD.charge;
                    biocpd.cmpkbid = CPD.cmpkbid;
                    biocpd.biomass = biomass.id;
                    this.biomasscpds.push(biocpd);
                    if (biocpd.coefficient < 0) {
                        if (reactants.length > 0) {
                            reactants += ' + ';
                        }
                        if (biocpd.coefficient !== -1) {
                            const abscoef = Math.round(-1 * 100 * biocpd.coefficient) / 100;
                            reactants += `(${abscoef}) `;
                        }

                        reactants += `<a 
                            class="id-click" 
                            data-id="${CPD.id}"
                            data-method="CompoundTab">
                            ${CPD.name}[${CPD.cmpkbid}]
                        </a>`;
                    } else {
                        if (products.length > 0) {
                            products += ' + ';
                        }
                        if (biocpd.coefficient !== 1) {
                            const abscoef = Math.round(100 * biocpd.coefficient) / 100;
                            products += `(${abscoef}) `;
                        }
                        products +=`<a 
                            class="id-click" 
                            data-id="${CPD.id}"
                            data-method="CompoundTab">
                            ${CPD.name}[${CPD.cmpkbid}]
                        </a>`;
                    }
                }
                biomass.equation = `${reactants  }<div style="font-weight: bold;">=></div>${  products}`;
            }

            this.modelgenes = [];
            this.rxnhash = {};
            for (let i = 0; i < this.modelreactions.length; i++) {
                const rxn = this.modelreactions[i];
                const idarray = rxn.id.split('_');
                rxn.dispid = `${idarray[0]  }[${  idarray[1]  }]`;
                rxn.rxnkbid = rxn.reaction_ref.split('/').pop();
                rxn.rxnkbid = rxn.rxnkbid.replace(/_[a-zA-z]/, '');
                rxn.cmpkbid = rxn.modelcompartment_ref.split('/').pop();
                rxn.name = rxn.name.replace(/_[a-zA-z]\d+$/, '');
                rxn.gpr = '';
                if (rxn.name === 'CustomReaction') {
                    rxn.name = rxn.dispid;
                }
                self.rxnhash[rxn.id] = rxn;
                if (rxn.rxnkbid !== 'rxn00000') {
                    this.rxnhash[`${rxn.rxnkbid  }_${  rxn.cmpkbid}`] = rxn;
                    if (rxn.rxnkbid !== idarray[0]) {
                        rxn.dispid += `<br>(${  rxn.rxnkbid  })`;
                    }
                }

                let sign = '<=>';
                if (rxn.direction === '>') {
                    sign = '=>';
                } else if (rxn.direction === '<') {
                    sign = '<=';
                }
                if (rxn.modelReactionProteins > 0) {
                    rxn.gpr = '';
                }

                let reactants = '';
                let products = '';
                for (let j = 0; j < rxn.modelReactionReagents.length; j++) {
                    const rgt = rxn.modelReactionReagents[j];
                    rgt.cpdkbid = rgt.modelcompound_ref.split('/').pop();
                    const CPD = this.cpdhash[rgt.cpdkbid];
                    if (rgt.coefficient < 0) {
                        if (reactants.length > 0) {
                            reactants += ' + ';
                        }
                        if (rgt.coefficient !== -1) {
                            const abscoef = Math.round(-1 * 100 * rgt.coefficient) / 100;
                            reactants += `(${  abscoef  }) `;
                        }
                        // reactants += this.cpdhash[rgt.cpdkbid].name + '[' + this.cpdhash[rgt.cpdkbid].cmpkbid + ']';
                        reactants += `<a 
                            class="id-click" 
                            data-id="${CPD.id}"
                            data-method="CompoundTab">
                            ${CPD.name}[${CPD.cmpkbid}]
                        </a>`;
                    } else {
                        if (products.length > 0) {
                            products += ' + ';
                        }
                        if (rgt.coefficient !== 1) {
                            const abscoef = Math.round(100 * rgt.coefficient) / 100;
                            products += `(${  abscoef  }) `;
                        }
                        // products += this.cpdhash[rgt.cpdkbid].name + '[' + this.cpdhash[rgt.cpdkbid].cmpkbid + ']';
                        products += `<a 
                            class="id-click" 
                            data-id="${CPD.id}"
                            data-method="CompoundTab">
                            ${CPD.name}[${CPD.cmpkbid}]
                        </a>`;
                    }
                }

                rxn.ftrhash = {};
                for (let j = 0; j < rxn.modelReactionProteins.length; j++) {
                    const prot = rxn.modelReactionProteins[j];
                    if (j > 0) {
                        rxn.gpr += ' or ';
                    }
                    rxn.gpr += '(';
                    for (let k = 0; k < prot.modelReactionProteinSubunits.length; k++) {
                        const subunit = prot.modelReactionProteinSubunits[k];
                        if (k > 0) {
                            rxn.gpr += ' and ';
                        }
                        rxn.gpr += '(';
                        if (subunit.feature_refs.length === 0) {
                            rxn.gpr += 'Unknown';
                        }
                        for (let m = 0; m < subunit.feature_refs.length; m++) {
                            const ftrid = subunit.feature_refs[m].split('/').pop();
                            rxn.ftrhash[ftrid] = 1;
                            if (m > 0) {
                                rxn.gpr += ' or ';
                            }
                            rxn.gpr += ftrid;
                        }
                        rxn.gpr += ')';
                    }
                    rxn.gpr += ')';
                }

                rxn.gapfilling = [];
                for (const gf in rxn.gapfill_data) {
                    if (rxn.gapfill_data[gf][0][0] === '<') {
                        rxn.gapfilling.push(`${gf  }: reverse`);
                    } else {
                        rxn.gapfilling.push(`${gf  }: forward`);
                    }
                }
                rxn.gapfillingstring = rxn.gapfilling.join('<br>');

                rxn.dispfeatures = '';
                rxn.genes = [];
                for (const gene in rxn.ftrhash) {
                    rxn.genes.push({id: gene});

                    const genes = [];
                    this.modelgenes.forEach((item) => {
                        genes.push(item.id);
                    });

                    if (genes.indexOf(gene) === -1)
                        this.modelgenes.push({id: gene, reactions: [{id: rxn.id, dispid: rxn.dispid}]});
                    else this.modelgenes[genes.indexOf(gene)].reactions.push({id: rxn.id, dispid: rxn.dispid});
                }

                rxn.equation = `${reactants  }<div style="font-weight: bold;">${  sign  }</div>${  products}`;
            }
            if (gfobjects.length > 0) {
                this.workspaceClient
                    .get_objects(gfobjects)
                    .then((data) => {
                        for (let i = 0; i < data.length; i++) {
                            const solrxns = data[i].data.gapfillingSolutions[0].gapfillingSolutionReactions;
                            for (let j = 0; j < solrxns.length; j++) {
                                const array = solrxns[j].reaction_ref.split('/');
                                let id = array.pop();
                                let rxnobj;
                                if (id in self.rxnhash) {
                                    rxnobj = self.rxnhash[id];
                                } else {
                                    const cmparray = solrxns[j].compartment_ref.split('/');
                                    const cmp = cmparray.pop();
                                    id = `${id  }_${  cmp  }${solrxns[j].compartmentIndex}`;
                                    rxnobj = self.rxnhash[id];
                                }
                                if (typeof rxnobj !== 'undefined') {
                                    if (solrxns[j].direction === '<') {
                                        rxnobj.gapfilling.push(`gf.${  i + 1  }: reverse`);
                                    } else {
                                        rxnobj.gapfilling.push(`gf.${  i + 1  }: forward`);
                                    }
                                    rxnobj.gapfillingstring = rxnobj.gapfilling.join('<br>');
                                }
                            }
                        }
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            }
        };
    }

    // make method of base class
    KBModeling.prototype.KBaseFBA_FBAModel = KBaseFBA_FBAModel;
});
