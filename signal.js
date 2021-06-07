const noble = require('@abandonware/noble');

noble.startScanning([], true);

module.exports = {
  signal: (t, h, b) => console.log(`T=${t}°C, H=${h}%, B=${b}%`)
};

noble.on('discover', p => {
  for (let sData of p.advertisement.serviceData) {
    if (sData.uuid !== '181a') next;
    const t = sData.data.readIntLE(6, 2) / 100;
    const h = sData.data.readUIntLE(8, 2) / 100;
    const b = sData.data.readIntLE(12, 1);
    module.exports.signal(t, h, b);
    break;
  }
});
