Page({
  data: {
    meters: []
  },

  onShow() {
    // Load meters from storage
    const res = my.getStorageSync({ key: 'meters' });
    const storedMeters = res.data;

    if (storedMeters && storedMeters.length > 0) {
      this.setData({ meters: storedMeters });
    } else {
      const defaultMeters = [
        { id: 1, name: 'Main Board', number: '15539', type: 'Prepaid' },
        { id: 2, name: 'Top Farm', number: '60349', type: 'Postpaid' }
      ];
      this.setData({ meters: defaultMeters });
      my.setStorageSync({ key: 'meters', data: defaultMeters });
    }
  },

  goToMeter(event) {
    const { number } = event.currentTarget.dataset;
    my.navigateTo({
      url: `/pages/meter/meter?number=${number}`
    });
  },

  goToConsumption(event) {
    const { number } = event.currentTarget.dataset;
    my.navigateTo({
      url: `/pages/consumption/consumption?number=${number}`
    });
  },

  addMeter() {
    my.navigateTo({
      url: '/pages/addMeter/addMeter'
    });
  },

  // Delete meter logic
  deleteMeter(event) {
    const meterId = event.currentTarget.dataset.id;
    
    // Filter out the meter with the given id
    const updatedMeters = this.data.meters.filter(meter => meter.id !== meterId);
    
    // Update the meters in data and storage
    this.setData({
      meters: updatedMeters
    });
    my.setStorageSync({ key: 'meters', data: updatedMeters });
    
    my.showToast({
      title: 'Meter deleted successfully',
      icon: 'success',
      content: 'Meter Deleted'
    });
  }
});
