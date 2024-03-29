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
            // TODO: disabled count detection and limitation. I'm not sure that we actually have
            // any cases where this is an issue, and we should handle it in a more sophisticated manner.
            // For instance, the 
            // if (counts[0] > MAX_INCOMING_REFS) {
            //     return null;
            // }
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
            // const counts = await this.wsClient.callFunc('list_referencing_object_counts', [[{
            //     ref
            // }]]);
            // if (counts[0] > MAX_INCOMING_REFS) {
            //     return [true, counts[0], null];
            // }
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
            // Note, info to be filled in later.
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

        /**
         * Determines if the genome object has incomplete CDS support (as in v8.2 in prod).
         * Uses a "sentinel property", "protein_md5", which does not exist in the incomplete
         * CDS support, but does in the complete.
         * @param {} param0 
         * @returns 
         */
        async isCDSCompatible({ref}) {
            let included = [
                '/cdss/0'
            ];
            const [[result]] = await this.wsClient.callFunc('get_object_subset', [[{
                ref,
                included
            }]])


            if (!('cdss' in result.data)) {
                return false;
            }

            if (result.data.cdss.length === 0) {
                return false;
            }

            const cds = result.data.cdss[0];

            if (!('protein_md5' in cds)) {
                return false;
            }

            return true;
        }

        async getCDS({ref, cdsId}) {
            let included = [
                '/cdss/[*]/id'
            ];
            const [[result]] = await this.wsClient.callFunc('get_object_subset', [[{
                ref,
                included
            }]])


            if (!('cdss' in result.data)) {
                throw new Error(`This Genome object is an older version that does not support CDSs`)
            }

            const cdsIndex = result.data.cdss.findIndex(({id}) => {
                return id === cdsId;
            });

            if (cdsIndex === -1) {
                throw new Error(`CDS "${cdsId}" not found`);
            }

            included = [
                '/dna_size',
                '/scientific_name', 
                '/id',
                '/source',
                '/source_id',
                `/cdss/${cdsIndex}`
            ]

            const [[{data}]] = await this.wsClient.callFunc('get_object_subset', [[{
                ref,
                included
            }]])

            const cds = data.cdss[0]

            if (!('protein_md5' in cds)) {
                throw new Error('This object is an older version that has an unsupported CDS structure');
            }

            return {
                dnaSize: data.dna_size,
                scientificName: data.scientific_name,
                genomeId: data.id,
                source: data.source,
                sourceId: data.source_id,
                cds: data.cdss[0]
            }
        }

        async getFeature({ref, featureId}) {
            let included = [
                '/features/[*]/id'
            ];
            const [[result]] = await this.wsClient.callFunc('get_object_subset', [[{
                ref,
                included
            }]])


            if (!('features' in result.data)) {
                throw new Error(`This Genome is an older version that does not support Features`)
            }

            const featureIndex = result.data.features.findIndex(({id}) => {
                return id === featureId;
            });

            if (featureIndex === -1) {
                throw new Error(`Feature "${featureId}" not found`);
            }

            included = [
                '/dna_size',
                '/scientific_name', 
                '/id',
                '/source',
                '/source_id',
                '/protein_translation',
                '/function',
                '/annotations',
                '/subsystem_data',
                `/features/${featureIndex}`
            ]

            const [[{data}]] = await this.wsClient.callFunc('get_object_subset', [[{
                ref,
                included
            }]])

            const feature = data.features[0];

            return {
                dnaSize: data.dna_size,
                scientificName: data.scientific_name,
                genomeId: data.id,
                source: data.source,
                sourceId: data.source_id,
                feature
            }
        }

    }

    return Model;
});