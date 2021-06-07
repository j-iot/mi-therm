const mi = require('./signal.js');

module.exports = (api) => {
  api.registerAccessory('ExampleAccessoryName', ExampleAccessoryName);
}

class ExampleAccessoryName {
  constructor(log, config, api) {
    log.debug('Example Platform Plugin Loaded');

    this.temp = 50;
    this.hum = 50;
    this.batt = 50;

    mi.signal = this.onSignal.bind(this);

    this.api = api;
    this.Service = this.api.hap.Service;
    this.Characteristic = this.api.hap.Characteristic;
    this.name = config.name;

    this.tempService = new this.Service.TemperatureSensor('Temperature');
    this.tempService.getCharacteristic(this.Characteristic.CurrentTemperature).onGet(() => this.temp);

    this.humService = new this.Service.HumiditySensor('Humidity');
    this.humService.getCharacteristic(this.Characteristic.CurrentRelativeHumidity).onGet(() => this.hum);

    this.battService = new this.Service.Battery('Battery');
    this.battService.getCharacteristic(this.Characteristic.StatusLowBattery)
      .onGet(() => this.Characteristic.StatusLowBattery[this.batt > 10 ? 'BATTERY_LEVEL_NORMAL' : 'BATTERY_LEVEL_LOW']);
    this.battService.getCharacteristic(this.Characteristic.BatteryLevel).onGet(() => this.batt);
  }

  getServices() {
    return [this.tempService, this.humService, this.battService];
  }

  onSignal(t, h, b) {
    this.temp = t;
    this.hum = h;
    this.batt = b;
  }
}
