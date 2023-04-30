export default class HolySheet {

    #data = {};
    #options;
    #sheetURL;
    #sheetBaseURL = 'https://docs.google.com/spreadsheets/d/';
    // #sheetDataTypeJSON = '/gviz/tq?';
    #sheetDataTypeJSON = '/gviz/tq?tqx=out:json&headers=1';

    constructor(config) {
        this.#options = {
            sheetId: "1tdRaVMG9BSry5SpJCH09VkslR1Sc7tPYH4b5m-RJn9c",
            // sheetId: "1hxrpqGnVjs9efoq-eblYm8M3AHMDY9Q6vOihvHRxdZg",
            sheetTitle: "",
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

    setSheetURL() {
        if (this.#options.sheetTitle.length !== 0 &&
            this.#options.sheetRange.length === 0) {
            this.#sheetURL  = this.#sheetBaseURL
                            + this.#options.sheetId
                            + this.#sheetDataTypeJSON
                            + 'sheet='
                            + this.#options.sheetTitle;
        } else if (this.#options.sheetTitle.length !== 0 &&
            this.#options.sheetRange.length !== 0) {
            this.#sheetURL  = this.#sheetBaseURL
                            + this.#options.sheetId
                            + this.#sheetDataTypeJSON
                            + 'sheet='
                            + this.#options.sheetTitle
                            + '&range='
                            + this.#options.sheetRange;
        } else {
            this.#sheetURL  = this.#sheetBaseURL
                            + this.#options.sheetId
                            + this.#sheetDataTypeJSON;
        }
    }

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
            // const data = JSON.parse(dataText.substr(47).slice(0, -2));
            // const data = JSON.parse(dataText.slice(47, -2));
            const data = JSON.parse(dataText.match(/(?<=.*\().*(?=\);)/s));
            return data;
        } catch(err) {
            throw err;
        }
    }

    getData() {
        return this.#data;
    }

}
