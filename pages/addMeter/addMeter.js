Page({
  data: {
    meterName: '',
    meterNumber: '',
    meterType: 'Prepaid',
    meterTypes: 'Prepaid'
  },

  updateMeterName(event) {
    console.log('Input Changed:', event.detail.value);
    this.setData({
      meterName: event.detail.value
    });
  },

  updateMeterNumber(event) {
    console.log('Input Changed:', event.detail.value);
    this.setData({
      meterNumber: event.detail.value
    });
  },



  saveMeter() {
    const { meterName, meterNumber, meterType } = this.data;

    if (!meterName || !meterNumber || !meterType) {
      my.showToast({
        title: 'Please fill in all fields',
        icon: 'none',
        content: 'Please fill in all fields'
      });
      return;
    }

    const newMeter = { id: Date.now(), name: meterName, number: meterNumber, type: meterType };

    // Save meter to storage
    const res = my.getStorageSync({ key: 'meters' });
    const storedMeters = res.data || [];
    storedMeters.push(newMeter);
    my.setStorageSync({ key: 'meters', data: storedMeters });

    my.showToast({
      title: 'Meter added successfully',
      icon: 'success',
      content: 'Meter added successfully'
    });

    my.navigateBack();
  }
});
