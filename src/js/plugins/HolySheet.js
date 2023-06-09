export default class HolySheet {

    #options;
    #sheetURL;
    #sheetBaseURL;
    #sheetDataType;

    constructor(config) {
        this.#options = {
            sheetId: "",
            sheetName: "",
            sheetRange: "",
            dataType: 'json',
        }

        if (typeof config === 'object') {
            this.#options = { ...this.#options, ...config };
        }

        if (this.#options.sheetId.length === 0) {
            throw new Error('Google Sheet ID is missing!');
        }

        this.init();
    }

    init() {
        this.setSheetURL();
    }

    /**
     * Sets the correct URL based on user input
     */
    setSheetURL() {
        this.#sheetBaseURL = 'https://docs.google.com/spreadsheets/d/';
        this.#sheetDataType = `/gviz/tq?tqx=out:${this.#options.dataType}&headers=1`;

        if (this.#options.sheetName.length !== 0 &&
            this.#options.sheetRange.length === 0) {
            this.#sheetURL  = this.#sheetBaseURL
                            + this.#options.sheetId
                            + this.#sheetDataType
                            + '&sheet='
                            + encodeURIComponent(this.#options.sheetName);
        } else if (this.#options.sheetName.length !== 0 &&
            this.#options.sheetRange.length !== 0) {
            this.#sheetURL  = this.#sheetBaseURL
                            + this.#options.sheetId
                            + this.#sheetDataType
                            + '&sheet='
                            + encodeURIComponent(this.#options.sheetName)
                            + '&range='
                            + this.#options.sheetRange;
        } else {
            this.#sheetURL  = this.#sheetBaseURL
                            + this.#options.sheetId
                            + this.#sheetDataType;
        }
    }

    /**
     * Fetches data from Google Sheets
     *
     * @return {Promise} data
     */
    async fetchData() {
        const timeout = function(seconds) {
            return new Promise(function(_, reject) {
                setTimeout(() => {
                    reject(`Request took too long! Timeout after ${seconds} seconds.`);
                }, seconds * 1000)
            });
        }

        try {
            const fetchRequest = fetch(this.#sheetURL);
            const response = await Promise.race([
                fetchRequest,
                timeout(10)
            ]);
            const dataText = await response.text();
            // const data = JSON.parse(dataText.slice(47, -2));
            if (this.#options.dataType === 'csv') {
                return dataText;
            } else {
                const dataJSON = JSON.parse(dataText.match(/(?<=.*\().*(?=\);)/s));
                return  this.#parseObject(dataJSON);
            }
        } catch(err) {
            throw err;
        }
    }

    /**
     * Parser for converting raw JSON into readable Object
     *
     * @param {Object} data
     * @return {Array} dataObjectsArray
     */
    #parseObject(data) {
        let cellData, propName, dataObject;
        const dataObjectsArray = [];
        const cols = data.table.cols;
        const rows = data.table.rows;
        const propNames = this.#convertPropNames(cols);

        for (let i = 0; i < rows.length; i++) {
            dataObject = {};

            for (let j = 0; j < propNames.length; j++) {
                propName = propNames[j];
                cellData = rows[i]["c"][j];

                if (cellData === null) {
                    dataObject[propName] = "";
                } else if (typeof cellData["v"] == "string" && cellData["v"].startsWith("Date")) {
                    // dataObject[propName] = new Date(cellData["f"]);
                    dataObject[propName] = cellData["f"];
                } else {
                    dataObject[propName] = cellData["v"];
                }
            }

            dataObjectsArray.push(dataObject);
        }

        return dataObjectsArray;
    }

    /**
     * Converts property names into valid object keys
     *
     * @param {Array} props
     * @return {Array} propsArray
     */
    #convertPropNames(props) {
        let propsArray = [];
        let prop, propPieces;

        for (let i = 0; i < props.length; i++) {
            prop = props[i].label;

            if (prop.includes(" ") || prop.includes("-")) {
                prop = props[i].label.toLowerCase();
                propPieces = prop.split(/[- ]+/);

                propPieces = propPieces.map((prop, i) => {
                    return (i > 0) ? prop.charAt(0).toUpperCase() + prop.slice(1) : prop;
                });

                propsArray.push(propPieces.join(''));
            } else if (Boolean(prop.match(/\b([A-Z])/))) {
                propsArray.push(prop.toLowerCase());
            } else {
                propsArray.push(prop);
            }
        }

        return propsArray;
    }

}
