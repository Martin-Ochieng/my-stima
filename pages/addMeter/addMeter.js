const Toastify = require('../../utils/toast');
const { fetchEnergyForMeter } = require('../../utils/meterHelper'); // Adjust path as needed

Page({
  data: {
    meterName: '',
    meterNumber: '',
    meterType: 'Prepaid',
    meterTypes: 'Prepaid'
  },

  updateMeterName(event) {
    this.setData({ meterName: event.detail.value });
  },

  updateMeterNumber(event) {
    this.setData({ meterNumber: event.detail.value });
  },

  saveMeter() {
    const { meterName, meterNumber, meterType } = this.data;

    if (!meterName || !meterNumber || !meterType) {
      Toastify({
        text: 'Please fill in all fields',
        duration: 3000,
        gravity: "top",
        position: "center",
        type: "error",
        backgroundColor: "#FF6347"
      });
      return;
    }

    const baseMeter = {
      id: Date.now(),
      name: meterName,
      number: meterNumber,
      type: meterType
    };

    // Fetch energy and then save
    fetchEnergyForMeter(baseMeter).then(newMeter => {
      const res = my.getStorageSync({ key: 'meters' });
      const storedMeters = res.data || [];
      storedMeters.push(newMeter);
      my.setStorageSync({ key: 'meters', data: storedMeters });

      Toastify({
        text: `Meter: ${meterName} added`,
        duration: 3000,
        gravity: "top",
        position: "center",
        type: "success",
        backgroundColor: "#4CAF50"
      });

      setTimeout(() => {
        my.navigateBack();
      }, 3000);
    });
  }
});
