define([
    'kb_lib/jsonRpc/genericClient',
    'kb_service/utils',
    'lib/utils',
], (
    GenericClient,
    APIUtils,
    {objectInfoToObject2},
) => {



    const MAX_OUTGOING_REFS = 100;
    const MAX_INCOMING_REFS = 100;

    class Model {
        constructor({workspaceURL, authToken}) {
              this.wsClient = new GenericClient({
                    module: 'Workspace',
                    url: workspaceURL,
                    token: authToken
                });
        }

        async getObjectInfo(ref) {
            const [result] = await this.wsClient.callFunc('get_object_info3', [{
                objects: [{
                    ref
                }],
                ignoreErrors: 1,
                includeMetadata: 1
            }]);

            return result.infos
                .map((info) => {
                    if (info) {
                        return APIUtils.objectInfoToObject(info);
                    }
                    return null;
                })[0];
        }

        async getWorkspaceInfo(id) {
            const [result] = await this.wsClient.callFunc('get_workspace_info', [{
                id
            }]);
            return APIUtils.workspaceInfoToObject(result);
        }

        async getObjectHistory(ref) {
            const [result] = await this.wsClient.callFunc('get_object_history', [{
                ref
            }]);

            return result.map((version) => {
                return APIUtils.objectInfoToObject(version);
            })
                .sort((a, b) => {
                    return a.version - b.version;
                });
        }

         async getReferencingObjects(ref) {
            // const params = refs.map((ref) => {
            //     return {ref}
            // });
            const counts = await this.wsClient.callFunc('list_referencing_object_counts', [[{
                ref
            }]]);
            // TODO: all counts??
            if (counts[0] > MAX_INCOMING_REFS) {
                return null;
            }
            const [results] = await this.wsClient.callFunc('list_referencing_objects', [[{ref}]]);
            const referencingObjects = results[0];
            return referencingObjects.map((info) => {
                return objectInfoToObject2(info);
            })
                .sort((a, b) => {
                    return a.name.localeCompare(b.name);
                });
        }

         async getIncomingReferences(ref) {
            const counts = await this.wsClient.callFunc('list_referencing_object_counts', [[{
                ref
            }]]);
            if (counts[0] > MAX_INCOMING_REFS) {
                return [true, null];
            }
            const [result] = await this.wsClient.callFunc('list_referencing_objects', [[{ref}]]);
            const references = result[0].map((reference) => {
                return APIUtils.objectInfoToObject(reference);
            })
                .sort((a, b) => {
                    return a.name.localeCompare(b.name);
                });

            return [false, references];
        }

        async getOutgoingReferences(subjectRef) {
            // Get all outgoing reference objects.
            const [dataObjectsResult] = await this.wsClient.callFunc('get_objects2', [{
                objects: [{ref: subjectRef}],
                no_data: 1
            }]);

            // Collects all refs so we can just fetch unique refs.
            // const allOutgoingRefs = new Set();
           
            // First we collect all outgoing direct and provenance references, in order to
            // be able to get the object info just for each unique ref.
            const dataObject = dataObjectsResult.data[0];

            // Direct references from the subject object to other objects.
            const outgoingRefs = dataObject.refs.reduce((outgoingRefs, ref) => {
                outgoingRefs.add(ref);
                return outgoingRefs;
            }, new Set())

            // Provenance references to other objects.
            // There may be multiple provenance records, we gather them all
            // together, though.
            const provenanceRefs = dataObject.provenance.reduce((provenanceRefs, entry) => {
                entry.resolved_ws_objects.forEach((ref) => {
                    provenanceRefs.add(ref);
                });
                return provenanceRefs;
            }, new Set());

            // We gather all refs, adding the relation for outgoing refs, provenance refs, and 
            // copy, if it exists.
            const combinedOutgoingRefs = {}

            // Okay, this is a cheat :(
            outgoingRefs.forEach((ref) => {
                if (ref in combinedOutgoingRefs) {
                    combinedOutgoingRefs[ref].relation.push('references');
                } else {
                    combinedOutgoingRefs[ref] = {
                        relation: ['references']
                    }
                }
            })
            provenanceRefs.forEach((ref) => {
                if (ref in combinedOutgoingRefs) {
                    combinedOutgoingRefs[ref].relation.push('used');
                } else {
                    combinedOutgoingRefs[ref] = {
                        relation: ['used']
                    }
                }
            });

            const objectInfos = await this.getOutgoingObjectInfos(subjectRef, Object.keys(combinedOutgoingRefs));

            const objectInfosMap = objectInfos.reduce((map, {ref, info}) => {
                map[ref] = info;
                return map;
            }, {});

            // We turn the outgoing refs map into an array, since we might not have a ref
            // for each entry.
            // Note info to be filled in later.
            const outgoingReferences =  Object.entries(combinedOutgoingRefs).map(([ref, {relation}]) => {
                return {
                    ref,
                    relation,
                    info: null
                };
            });
            
            for (const outgoingReference of outgoingReferences) {
                if (outgoingReference.ref) {
                    outgoingReference.info = objectInfosMap[outgoingReference.ref];
                }
            }

            // If copied, well, we just add it separately.
            // It is not a normal case for a copy to also be a reference, afaik.
            if (dataObject.copied) {
                const info = await this.getObjectInfo(dataObject.copied);
                outgoingReferences.push({
                    ref: dataObject.copied,
                    relation: ['copiedFrom'],
                    info
                })
            } 

            // If copy source is not accessible, unlike for references, we cannot follow
            // the ref chain to get to it, so we create an entry without a ref.
            if (dataObject.copy_source_inaccessible) {
                outgoingReferences.push({
                    ref: null,
                    relation: ['copiedFrom'],
                    info: null
                });
            } 

            outgoingReferences
                .sort(({relation: relationA, info: a}, {relation: relationB, info: b}) => {
                    // disabled since relations are now arrays; this can be done, just
                    // needs more work.
                    // if (relationA !== relationB) {
                    //     return relationA.localeCompare(relationB);
                    // }

                    if (a === null) {
                        if (b === null) {
                            return 0;
                        }
                        return -1;
                    } else if (b === null) {
                        return 1;
                    }
                    return a.name.localeCompare(b.name);
                });

            return [false, outgoingReferences];
        }

        async getOutgoingObjectInfos(subjectRef, outgoingRefs) {
            if (outgoingRefs.length === 0) {
                return [];
            }
            const [result] = await this.wsClient.callFunc('get_object_info3', [{
                objects: outgoingRefs.map((ref) => {
                    return {
                        ref,
                        to_obj_ref_path: [subjectRef]
                    };
                }),
                ignoreErrors: 1,
                includeMetadata: 1
            }]);

            return result.infos
                .map((info, index) => {
                    const ref = outgoingRefs[index];
                    if (info) {
                        return {
                            ref,
                            info: APIUtils.objectInfoToObject(info)
                        };
                    }
                    return {
                        ref,
                        info: null
                    };
                });
        }

         async getOutgoingObjectInfos_old(subjectRef, outgoingRefs) {
            if (outgoingRefs.length === 0) {
                return [];
            }
            const [result] = await this.wsClient.callFunc('get_object_info3', [{
                objects: outgoingRefs.map((ref) => {
                    return {
                        ref,
                        to_obj_ref_path: [subjectRef]

                    };
                }),
                ignoreErrors: 1,
                includeMetadata: 1
            }]);

            return result.infos
                .map((info, index) => {
                    const ref = outgoingRefs[index];
                    if (info) {
                        return {
                            ref,
                            info: APIUtils.objectInfoToObject(info)
                        };
                    }
                    return {
                        ref,
                        info: null
                    };
                });

        }

        async getWritableNarratives(workspaceId) {
            const [workspaceInfos] = await this.wsClient.callFunc('list_workspace_info', [{
                perm: 'w'
            }]);
            return workspaceInfos.map((workspaceInfo) => {
                return APIUtils.workspaceInfoToObject(workspaceInfo);
            })
                .filter((workspaceInfo) => {
                    return (workspaceInfo.metadata.narrative &&
                        !isNaN(parseInt(workspaceInfo.metadata.narrative, 10)) &&
                        workspaceInfo.id !== this.workspaceId &&
                        workspaceInfo.metadata.narrative_nice_nice &&
                        workspaceInfo.metadata.is_temporary &&
                        workspaceInfo.metadata.is_temporary !== 'true');
                });
        }

    }

    return Model;
});