const Toastify = require('../../utils/toast');
const { fetchEnergyForMeter } = require('../../utils/meterHelper'); // Adjust path as needed

Page({
  data: {
    meterName: '',
    meterNumber: '',
    meterType: 'Prepaid',
    meterTypes: 'Prepaid',
    showSaveButton: true  // Controls visibility of Save button
  },

  updateMeterName(event) {
    this.setData({ meterName: event.detail.value });
  },

  updateMeterNumber(event) {
    this.setData({ meterNumber: event.detail.value });
  },

  saveMeter() {
    const { meterName, meterNumber, meterType } = this.data;
  
    this.setData({ showSaveButton: false });
  
    if (!meterName || !meterNumber || !meterType) {
      Toastify({
        text: 'Please fill in all fields',
        duration: 3000,
        gravity: "top",
        position: "center",
        type: "error",
        backgroundColor: "#FF6347"
      });
  
      setTimeout(() => {
        this.setData({ showSaveButton: true });
      }, 3100);
      return;
    }
  
    const baseMeter = {
      id: Date.now(),
      name: meterName,
      number: meterNumber,
      type: meterType
    };
  
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
    }).catch(err => {
      console.error('Error fetching meter energy:', err);
      Toastify({
        text: 'Failed to add meter',
        duration: 3000,
        gravity: "top",
        position: "center",
        type: "error",
        backgroundColor: "#FF6347"
      });
  
      setTimeout(() => {
        this.setData({ showSaveButton: true });
      }, 3100);
    });
  }
  
});
