import HolySheet from './js/plugins/HolySheet';

const config = {
    sheetId: "1hxrpqGnVjs9efoq-eblYm8M3AHMDY9Q6vOihvHRxdZg",
    sheetName: 'user-data',
    sheetRange: 'A1:D20',
    dataType: 'json'
};

const holySheet = new HolySheet(config);
holySheet.fetchData().then(data => renderData(data));

// Renders data to webpage as a table or CSV.
// This function is for testing purposes only.
function renderData(data) {
    const dataContainer = document.querySelector('.show-data');
    const tableHeaders = Object.keys(data[0]);
    let markup;

    if ((config.sheetName.length === 0 ||
        config.sheetName === "user-data") &&
        config.dataType === "json") {
        markup = `
            <h2 class="container-heading heading-bold heading-2" style="margin-bottom: 3rem;">
                JSON data retrieved from Google Sheets ${config.sheetRange.length !== 0 ? 'Ranging ' + config.sheetRange : ''}
            </h2>
            <div class="data-table">
                <table style="width:100%;">
                    <tr>
                        ${tableHeaders.map(header => '<th>' + header + '</th>').join("")}
                    </tr>
                    ${data.map(obj => {
                        return `<tr><td>${obj.firstName}</td>` +
                        `<td>${obj.lastName}</td>` +
                        `<td>${obj.birthDate}</td>` +
                        `<td>${obj.email}</td></tr>`;
                    }).join("")}
                </table>
            </div>
        `;
    } else if (config.sheetName.length > 0 &&
        config.sheetName === "proper-data" &&
        config.dataType === "json") {
        markup = `
            <h2 class="container-heading heading-bold heading-2" style="margin-bottom: 3rem;">
                JSON data retrieved from Google Sheets ${config.sheetRange.length !== 0 ? 'Ranging ' + config.sheetRange : ''}
            </h2>
            <div class="data-table">
                <table style="width:100%;">
                    <tr>
                        ${tableHeaders.map(header => '<th>' + header + '</th>').join("")}
                    </tr>
                    ${data.map(obj => {
                        return `<tr><td>${obj.firstName}</td>` +
                        `<td>${obj.lastName}</td>` +
                        `<td>${obj.dob}</td>` +
                        `<td>${obj.type}</td>` +
                        `<td>${obj.tall}</td>` +
                        `<td>${obj.short}</td></tr>`;
                    }).join("")}
                </table>
            </div>
        `;
    } else {
        markup = `
            <h2 class="container-heading heading-bold heading-2" style="margin-bottom: 3rem;">
                JSON data retrieved from Google Sheets ${config.sheetRange.length !== 0 ? 'Ranging ' + config.sheetRange : ''}
            </h2>
            <div style="width:100%; border:1px solid #333; padding: 2rem;">
                ${data}
            </div>
        `;
    }

    dataContainer.insertAdjacentHTML('afterbegin', markup);
}
