define(['widgets/modeling/KBModeling'], (KBModeling) => {
    function KBaseBiochem_Media(tabwidget) {
        const self = this;
        this.tabwidget = tabwidget;

        this.setMetadata = function (data) {
            this.overview = {
                wsid: `${data[7]}/${data[1]}`,
                objecttype: data[2],
                owner: data[5],
                instance: data[4],
                moddate: data[3],
                name: data[10]['Name'],
                source: data[10]['Source ID'],
                minimal: data[10]['Is Minimal'],
                defined: data[10]['Is Defined'],
                numcompounds: data[10]['Number compounds']
            };
        };

        this.setData = function (data) {
            this.data = data;
            this.mediacompounds = this.data.mediacompounds;
            this.reagents = this.data.reagents;
            this.cpdhash = {};
            const cpdarray = [];

            for (let i = 0; i < this.mediacompounds.length; i++) {
                const cpd = this.mediacompounds[i];
                cpd.id = cpd.compound_ref.split('/').pop();

                this.cpdhash[cpd.id] = cpd;
                cpdarray.push(cpd.id);
            }

            return this.tabwidget.getBiochemCompounds(cpdarray)
                .then((cpds) => {
                    for (let i = 0; i < self.mediacompounds.length; i++) {
                        const cpd = self.mediacompounds[i];
                        if (cpds[i]) {
                            cpd.name = cpds[i].name;
                            cpd.formula = cpds[i].formula;
                            cpd.charge = cpds[i].charge;
                            cpd.deltaG = cpds[i].deltaG;
                            cpd.deltaGErr = cpds[i].deltaGErr;
                            cpd.abbrev = cpds[i].abbrev;
                        }
                    }
                })
                .catch((err) => {
                    console.error('Error getting biochem compounds', err);
                });
        };

        this.CompoundTab = function (info) {
            const cpd = this.cpdhash[info.id];
            return [
                {
                    label: 'Compound',
                    data: cpd.id
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
                    label: 'Charge',
                    data: cpd.charge
                },
                {
                    label: 'deltaG',
                    data: cpd.deltaG
                },
                {
                    label: 'Max flux',
                    data: cpd.maxFlux
                },
                {
                    label: 'Min flux',
                    data: cpd.minFlux
                },
                {
                    label: 'Concentration',
                    data: cpd.concentration
                }
            ];
        };

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
                        label: 'Name',
                        key: 'name'
                    },
                    {
                        label: 'Source',
                        key: 'source'
                    },
                    {
                        label: 'Is minimal',
                        key: 'minimal'
                    },
                    {
                        label: 'Is defined',
                        key: 'defined'
                    },
                    {
                        label: 'Number compounds',
                        key: 'numcompounds'
                    }
                ]
            },
            {
                key: 'mediacompounds',
                name: 'Media compounds',
                type: 'dataTable',
                columns: [
                    {
                        label: 'Compound',
                        key: 'id',
                        type: 'tabLink',
                        linkformat: 'dispID',
                        method: 'CompoundTab'
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
                        label: 'Min uptake<br>(mol/g CDW hr)',
                        key: 'minFlux'
                    },
                    {
                        label: 'Max uptake<br>(mol/g CDW hr)',
                        key: 'maxFlux'
                    }
                ]
            }
        ];
    }

    // make method of base class
    KBModeling.prototype.KBaseBiochem_Media = KBaseBiochem_Media;
});
