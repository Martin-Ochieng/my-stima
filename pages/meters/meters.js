const Toastify = require('../../utils/toast');

Page({
  data: {
    meters: []
  },

  onShow() {
    // Just fetch the initialized meters from storage
    const res = my.getStorageSync({ key: 'meters' });
    const storedMeters = res.data || [];
    this.setData({ meters: storedMeters });
  },

  goToMeter(event) {
    const { number } = event.currentTarget.dataset;
    my.navigateTo({
      url: `/pages/meter/meter?number=${number}`
    });
  },

  goToConsumption(event) {
    const { number, id, name, type, units } = event.currentTarget.dataset;
    my.navigateTo({
      url: `/pages/consumption/consumption?number=${number}&id=${id}&name=${name}&type=${type}&units=${units}`
    });
  },

  addMeter() {
    my.navigateTo({
      url: '/pages/addMeter/addMeter'
    });
  },

  deleteMeter(event) {
    const meterId = event.currentTarget.dataset.id;

    const meterToDelete = this.data.meters.find(meter => meter.id === meterId);

    if (!meterToDelete) {
      Toastify({
        text: "Meter not found!",
        duration: 3000,
        gravity: "top",
        position: "center",
        type: "error",
        backgroundColor: "#FF6347"
      });
      return;
    }

    const updatedMeters = this.data.meters.filter(meter => meter.id !== meterId);
    this.setData({ meters: updatedMeters });
    my.setStorageSync({ key: 'meters', data: updatedMeters });

    Toastify({
      text: `Meter: ${meterToDelete.name} - deleted`,
      duration: 3000,
      gravity: "top",
      position: "center",
      type: "success"
    });
  }
});
