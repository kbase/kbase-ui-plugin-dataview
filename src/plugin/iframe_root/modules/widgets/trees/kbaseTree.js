/**
 * @author Bill Riehl <wjriehl@lbl.gov>, Roman Sutormin <rsutormin@lbl.gov>
 * @public
 */
define([
    'jquery',
    'uuid',
    'kb_common/html',
    'kb_service/client/workspace',
    'kb_service/client/userAndJobState',
    'lib/easyTree',
    'lib/domUtils',

    'kbaseUI/widget/legacy/authenticatedWidget'
], ($, Uuid, html, Workspace, UserAndJobState, EasyTree, {domSafeText, errorMessage}) => {
    $.KBWidget({
        name: 'kbaseTree',
        parent: 'kbaseAuthenticatedWidget',
        version: '0.0.1',
        options: {
            treeID: null,
            workspaceID: null,
            treeObjVer: null,
            jobID: null,
            token: null,
            width: 1045,
            height: 600
        },
        treeWsRef: null,
        pref: null,
        timer: null,
        init(options) {
            this._super(options);
            this.pref = new Uuid(4).format();

            if (!this.options.treeID) {
                this.renderError('No tree to render!');
                return this;
            }

            if (!this.options.workspaceID) {
                this.renderError('No workspace given!');
                return this;
            }

            this.wsClient = new Workspace(this.runtime.getConfig('services.workspace.url'), {
                token: this.runtime.service('session').getAuthToken()
            });
            this.$messagePane = $('<div/>').addClass('kbwidget-message-pane kbwidget-hide-message');
            this.$elem.append(this.$messagePane);

            this.render();

            return this;
        },
        render() {
            this.loading(false);
            if (this.treeWsRef || this.options.jobID === null) {
                this.loadTree();
            } else {
                const self = this;
                const jobSrv = new UserAndJobState(this.runtime.getConfig('services.ujs.url'), {
                    token: this.runtime.service('session').getAuthToken()
                });
                self.$elem.empty();

                const panel = $('<div class="loader-table"/>');
                self.$elem.append(panel);
                const table = $(
                    '<table class="table table-striped table-bordered" ' +
                        `style="margin-left: auto; margin-right: auto;" id="${
                            self.pref
                        }overview-table"/>`
                );
                panel.append(table);
                table.append(`<tr><td>Job was created with id</td><td>${  self.options.jobID  }</td></tr>`);
                table.append(`<tr><td>Output result will be stored as</td><td>${  self.options.treeID  }</td></tr>`);
                table.append(`<tr><td>Current job state is</td><td id="${  self.pref  }job"></td></tr>`);
                const timeLst = function () {
                    jobSrv
                        .get_job_status(self.options.jobID)
                        .then(function (data) {
                            const status = data[2];
                            const complete = data[5];
                            const wasError = data[6];
                            const tdElem = $(`#${  self.pref  }job`);
                            if (status === 'running') {
                                // safe
                                tdElem.html(html.loading(domSafeText(status)));
                            } else {
                                tdElem.text(status);
                            }
                            if (complete === 1) {
                                clearInterval(self.timer);
                                if (this.treeWsRef) {
                                    // Just skip all this cause data was already showed through setState()
                                } else if (wasError === 0) {
                                    self.loadTree();
                                }
                            }
                        })
                        .catch(function (err) {
                            clearInterval(self.timer);
                            if (this.treeWsRef) {
                                // Just skip all this cause data was already showed through setState()
                            } else {
                                const tdElem = $(`#${self.pref}job`);
                                // safe
                                tdElem.text(`Error accessing job status: ${errorMessage(err)}`);
                            }
                        });
                };
                timeLst();
                self.timer = setInterval(timeLst, 5000);
            }
        },
        loadTree() {
            const objId = this.buildObjectIdentity(
                this.options.workspaceID,
                this.options.treeID,
                this.options.treeObjVer,
                this.treeWsRef
            );
            const self = this;
            this.wsClient
                .get_objects([objId])
                .then((objArr) => {
                    self.$elem.empty();

                    const canvasDivId = `knhx-canvas-div-${  self.pref}`;
                    self.canvasId = `knhx-canvas-${  self.pref}`;
                    self.$canvas = $(`<div id="${  canvasDivId  }">`).append($(`<canvas id="${  self.canvasId  }">`));

                    if (self.options.height) {
                        self.$canvas.css({'max-height': self.options.height - 85, overflow: 'scroll'});
                    }
                    self.$elem.append(self.$canvas);

                    // SKIP FOR NOW
                    //watchForWidgetMaxWidthCorrection(canvasDivId);

                    if (!self.treeWsRef) {
                        const info = objArr[0].info;
                        self.treeWsRef = `${info[6]  }/${  info[0]  }/${  info[4]}`;
                    }
                    const tree = objArr[0].data;

                    const refToInfoMap = {};
                    const objIdentityList = [];
                    if (tree.ws_refs) {
                        let key;
                        for (key in tree.ws_refs) {
                            if (tree.ws_refs[key]['g'] && tree.ws_refs[key]['g'].length > 0)
                                objIdentityList.push({ref: tree.ws_refs[key]['g'][0]});
                        }
                    }

                    if (objIdentityList.length > 0) {
                        return self.wsClient.get_object_info_new({objects: objIdentityList}).then((data) => {
                            let i;
                            for (i in data) {
                                const objInfo = data[i];
                                refToInfoMap[objIdentityList[i].ref] = objInfo;
                            }
                            return [tree, refToInfoMap];
                        });
                    }
                    return [tree, refToInfoMap];

                })
                .spread((tree, refToInfoMap) => {
                    let url;
                    new EasyTree(
                        self.canvasId,
                        tree.tree,
                        tree.default_node_labels,
                        ((node) => {
                            if (!tree.ws_refs || !tree.ws_refs[node.id]) {
                                const node_name = tree.default_node_labels[node.id];
                                if (node_name.indexOf('/') > 0) {
                                    // Gene label
                                    /* TODO: reroute #genes to #dataview */
                                    url = `#genes/${  self.options.workspaceID  }/${  node_name}`;
                                    window.open(url, '_blank');
                                }
                                return;
                            }
                            const ref = tree.ws_refs[node.id]['g'][0];
                            const objInfo = refToInfoMap[ref];
                            if (objInfo) {
                                url = `/#dataview/${  objInfo[7]  }/${  objInfo[1]}`;
                                window.open(url, '_blank');
                            }
                        }),
                        ((node) => {
                            if (node.id && node.id.indexOf('user') === 0) {
                                return '#0000ff';
                            }
                            return null;
                        })
                    );
                    self.loading(true);
                    return true;
                })
                .catch((error) => {
                    self.renderError(error);
                });
        },
        renderError(error) {
            let errString = 'Sorry, an unknown error occurred';
            if (typeof error === 'string') {
                errString = error;
            } else if (error.error && error.error.message) {
                errString = error.error.message;
            }

            const $errorDiv = $('<div>')
                .addClass('alert alert-danger')
                .append('<b>Error:</b>')
                .append(`<br>${  errString}`);
            this.$elem.empty();
            this.$elem.append($errorDiv);
        },
        getData() {
            return {
                type: 'Tree',
                id: this.options.treeID,
                workspace: this.options.workspaceID,
                title: 'Tree'
            };
        },
        buildObjectIdentity(workspaceID, objectID, objectVer, wsRef) {
            const obj = {};
            if (wsRef) {
                obj['ref'] = wsRef;
            } else {
                if (/^\d+$/.exec(workspaceID)) {
                    obj['wsid'] = workspaceID;
                } else {
                    obj['workspace'] = workspaceID;
                }

                // same for the id
                if (/^\d+$/.exec(objectID)) {
                    obj['objid'] = objectID;
                } else {
                    obj['name'] = objectID;
                }

                if (objectVer) {
                    obj['ver'] = objectVer;
                }
            }
            return obj;
        },
        loading(doneLoading) {
            if (doneLoading) {
                this.hideMessage();
            } else {
                this.showMessage(html.loading());
            }
        },
        showMessage(message) {
            const span = $('<span/>').append(message);

            this.$messagePane.append(span);
            this.$messagePane.show();
        },
        hideMessage() {
            this.$messagePane.hide();
            this.$messagePane.empty();
        },
        getState() {
            const self = this;
            const state = {
                treeWsRef: self.treeWsRef
            };
            return state;
        },
        loadState(state) {
            const self = this;
            if (state && state.treeWsRef) {
                self.treeWsRef = state.treeWsRef;
                self.render();
            }
        }
    });
});
