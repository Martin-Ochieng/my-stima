const Toastify = require('../../utils/toast');  

Page({
  data: {
    meters: []  // Store the meters data
  },

  onShow() {
    const res = my.getStorageSync({ key: 'meters' });
    let storedMeters = res.data || [];

    if (storedMeters.length > 0) {
      storedMeters = storedMeters.map(meter => ({
        ...meter,
        units: meter.units || 0
      }));

      this.setData({ meters: storedMeters });
    } else {
      const defaultMeters = [
        { id: 1, name: 'Main Board', number: '15539', type: 'Prepaid', units: 0 },
        { id: 2, name: 'Top Farm', number: '60349', type: 'Postpaid', units: 0 }
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
    const { number, id, name, type, units } = event.currentTarget.dataset;
    console.log(event.currentTarget.dataset);
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
  
    // Find the meter by ID before deleting
    const meterToDelete = this.data.meters.find(meter => meter.id === meterId);
  
    // Check if the meter exists (in case of an unexpected error)
    if (!meterToDelete) {
      // Use Toastify for the error case (Meter not found)
      Toastify({
        text: "Meter not found!", // Error message
        duration: 3000,
        gravity: "top", // Positioning of the toast
        position: "center", // Alignment of the toast (center)
        type: "error", // Type set to 'error'
        backgroundColor: "#FF6347" // Red background for error
      });
      return; // Early exit if meter is not found
    }
  
    // Filter out the deleted meter from the meters array
    const updatedMeters = this.data.meters.filter(meter => meter.id !== meterId);
  
    this.setData({ meters: updatedMeters });
    my.setStorageSync({ key: 'meters', data: updatedMeters });
  
    // Create a custom toast message using the meter's name
    const toastMessage = `Meter: ${meterToDelete.name} - deleted`; 
  
    // Using the custom Toastify function with dynamic background color
    Toastify({
      text: toastMessage, // Include the meter name in the message
      duration: 3000,
      gravity: "top", // top or bottom
      position: "center", // left, center, or right
      type: "success" // Type can be 'success', 'error', or 'info'
    });
  }
  
});
