define([
    './domUtils'
], (
    {domSafeText}
) => {
    function isEqual(v1, v2) {
        const path = [];
        function iseq(v1, v2) {
            const t1 = typeof v1;
            const t2 = typeof v2;
            if (t1 !== t2) {
                return false;
            }
            switch (t1) {
            case 'string':
            case 'number':
            case 'boolean':
                if (v1 !== v2) {
                    return false;
                }
                break;
            case 'undefined':
                if (t2 !== 'undefined') {
                    return false;
                }
                break;
            case 'object':
                if (v1 instanceof Array) {
                    if (v1.length !== v2.length) {
                        return false;
                    }
                    for (let i = 0; i < v1.length; i++) {
                        path.push(i);
                        if (!iseq(v1[i], v2[i])) {
                            return false;
                        }
                        path.pop();
                    }
                } else if (v1 === null) {
                    if (v2 !== null) {
                        return false;
                    }
                } else if (v2 === null) {
                    return false;
                } else {
                    console.log('err', v1, v2);
                    const k1 = Object.keys(v1).sort();
                    const k2 = Object.keys(v2).sort();
                    if (k1.length !== k2.length) {
                        return false;
                    }
                    for (let i = 0; i < k1.length; i++) {
                        path.push(k1[i]);
                        if (!iseq(v1[k1[i]], v2[k1[i]])) {
                            return false;
                        }
                        path.pop();
                    }
                }
            }
            return true;
        }
        return iseq(v1, v2);
    }
    
    function iso8601ToTime(dateString) {
        if (!dateString) {
            return null;
        }
        const isoRE = /(\d\d\d\d)-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)([\+\-])(\d\d)(:?[\:]*)(\d\d)/;
        const dateParts = isoRE.exec(dateString);
        if (!dateParts) {
            throw new TypeError(`Invalid Date Format for ${  dateString}`);
        }
        // This is why we do this -- JS insists on the colon in the tz offset.
        const offset = `${dateParts[7] + dateParts[8]  }:${  dateParts[10]}`;
        const newDateString = `${dateParts[1]  }-${  dateParts[2]  }-${  dateParts[3]  }T${  dateParts[4]  }:${  dateParts[5]  }:${  dateParts[6]  }${offset}`;
        return new Date(newDateString).getTime();
    }

    function objectInfoToObject2(rawObjectInfo) {
        const data = rawObjectInfo.map((value) => {
            if (typeof value === 'string') {
                return domSafeText(value);
            } else if (typeof value === 'object' && value !== null) {
                return Object.entries(value).reduce((metadata, [key, value]) => {
                    if (typeof value === 'string') {
                        value = domSafeText(value);
                    }
                    metadata[key] = value;
                    return metadata;
                }, {});
            }
            return value;
        });

        const type = data[2].split(/[-\.]/);

        return {
            id: data[0],
            name: data[1],
            type: data[2],
            save_date: data[3],
            version: data[4],
            saved_by: data[5],
            wsid: data[6],
            ws: data[7],
            checksum: data[8],
            size: data[9],
            metadata: data[10],
            ref: `${data[6]}/${data[0]}/${data[4]}`,
            obj_id: `ws.${data[6]}.obj.${data[0]}`,
            typeModule: type[0],
            typeName: type[1],
            typeMajorVersion: type[2],
            typeMinorVersion: type[3],
            saveDate: iso8601ToTime(data[3]),
            raw: rawObjectInfo
        };
    }
    return {isEqual, objectInfoToObject2, iso8601ToTime};
});