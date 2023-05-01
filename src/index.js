import HolySheet from './js/plugins/HolySheet';

const holySheet = new HolySheet({
    sheetId: "1hxrpqGnVjs9efoq-eblYm8M3AHMDY9Q6vOihvHRxdZg",
});
holySheet.fetchData().then(data => console.log(data));
