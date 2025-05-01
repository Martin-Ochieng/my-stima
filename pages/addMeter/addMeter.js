const Toastify = require('../../utils/toast');  // Adjust path based on your folder structure

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
      // Use Toastify for missing fields error
      Toastify({
        text: 'Please fill in all fields', // Error message
        duration: 3000,
        gravity: "top", // Positioning of the toast
        position: "center", // Alignment of the toast (center)
        type: "error", // Type set to 'error'
        backgroundColor: "#FF6347" // Red background for error
      });
      return; // Early exit if fields are not filled
    }
  
    const newMeter = {
      id: Date.now(),
      name: meterName,
      number: meterNumber,
      type: meterType,
      units: 0  // Set units to zero initially
    };
  
    // Save meter to storage
    const res = my.getStorageSync({ key: 'meters' });
    const storedMeters = res.data || [];
    storedMeters.push(newMeter);
    my.setStorageSync({ key: 'meters', data: storedMeters });
  
    // Use Toastify for success message after adding meter
    Toastify({
      text: `Meter: ${meterName} added`, // Success message
      duration: 3000,
      gravity: "top", // Positioning of the toast
      position: "center", // Alignment of the toast (center)
      type: "success", // Type set to 'success'
      backgroundColor: "#4CAF50" // Green background for success
    });


    
    // Delay navigation to allow the toast to show
    setTimeout(() => {
      my.navigateBack();
    }, 3000); // 3000 ms (same duration as toast) to allow toast to fully show
  }
});
