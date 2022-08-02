define(['lib/domUtils'], ({domSafeText}) => {
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

    return {objectInfoToObject2};
});