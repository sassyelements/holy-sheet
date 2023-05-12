# Holy Sheet
Holy Sheet is a vanilla JS plugin for fetching data from Google Sheets simply
from the Sheet link. You only provide your Sheet ID and it'll fetch data as JS
Object or CSV format. NO API setup or anything is required.

## Demo
Clone this repo and run the following commands.

First install npm packages

```bash
npm install
```

Then run

```bash
npm start

# output
> holy-sheet@1.0.0 start
> parcel index.html

Server running at http://localhost:1234
Built in 1.60s
```

Visit `http://localhost:1234` to see the result. Your port may not be `1234`!

## How to Use Holy Sheet

First you need to get the plugin file `HolySheet.js`. Copy it to your JS
directory. You can create a directory called `plugins/` in your JS directory
and put the `HolySheet.js` in it.

In your `index.js` file you want to instantiate the object as shown in example below:

```javascript
import HolySheet from './js/plugins/HolySheet';

const config = {
    sheetId: "1hxrpqGnVjs9efoq-eblYm8M3AHMDY9Q6vOihvHRxdZg",
    sheetName: 'user-data',
    sheetRange: 'A1:D20',
    dataType: 'json'
};

const holySheet = new HolySheet(config);
holySheet.fetchData().then(data => renderData(data));
```

It takes an config object as an argument.

1. `sheetId` is the ID that you get from your sheet URL for example:
    ```
    https://docs.google.com/spreadsheets/d/1hxrpqGnVjs9efoq-eblYm8M3AHMDY9Q6vOihvHRxdZg/edit#gid=1460352599
    ```

    Your `sheetId` is inbetween `/d/<sheetId>/edit#`. In above URL the
    `sheetId` is:
    ```
    1hxrpqGnVjs9efoq-eblYm8M3AHMDY9Q6vOihvHRxdZg
    ```

2. `sheetName` is the name of the sheet/tab.

3. `sheetRange` is the data range you want to fetch. For example from cell `A1`
   until `D20`.
   > **Note:** You must have a header and always start your range from A1
   otherwise you'll not get the desired result!

4. `dataType` specifies in what form data should be retrieved. You can either
   set it to `json` or `csv`. When your `dataType` is set to `json` the
   `fetchData()` method will return a promise with JS object. If it is set to
   `csv` then it will return raw CSV data.
