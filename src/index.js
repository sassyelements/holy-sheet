import HolySheet from './js/plugins/HolySheet';

const holySheet = new HolySheet();
// console.log(holySheet.getData());
const jsonData = [];
holySheet.fetchData().then(data => {
    const cols = data.table.cols;
    const rows = data.table.rows;

    let start = performance.now();
    console.log(data);

    for (i = 0; i < rows.length; i++) {
        let dataObject = {};
        for (j = 0; j < cols.length; j++) {
            // console.log(rows[i]["c"][j]);
            let cellData = rows[i]["c"][j];
            jsonData.push(cellData);
        }
    }

    console.log(jsonData);
    let end = performance.now();
    console.log("Time taken: ", end - start);
});
