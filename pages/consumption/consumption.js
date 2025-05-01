const Toastify = require('../../utils/toast');  // Adjust path based on your folder structure

Page({
  data: {
    meter: {},  // Store the full meter object
    amount: '',
    tariff: '',  // Store the tariff value
    billAmount: '',
    unitsBought: '',  // Store the number of units bought
  },

  onLoad(options) {
    const { number, id, name, type, units } = options;  // Get all passed meter data from options
    this.setData({
      meter: { 
        id, 
        name, 
        type, 
        units: units || 0,  // Set current units
        number: number || '0'  // Include meterNumber here
      }
    });

    // Fetch tariff data from API
    my.request({
      url: 'https://run.mocky.io/v3/a5b3270e-d983-4adb-84f3-853b976a36ea',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        meterNumber: this.data.meter.number  // Use the meter number for the API call
      },
      success: (res) => {
        const { responseCode, tariff } = res.data;

        if (responseCode === '0') {
          this.setData({
            tariff: tariff  // Set the fetched tariff value
          });
        } else {
          // Use Toastify for the failed tariff fetch
          Toastify({
            text: 'Failed to fetch tariff', // Error message
            duration: 3000,
            gravity: "top", // Positioning of the toast
            position: "center", // Alignment of the toast (center)
            type: "error", // Type set to 'error'
            backgroundColor: "#FF6347" // Red background for error
          });
        }
      },
      fail: (err) => {
        console.error('Request failed', err);
        // Use Toastify for the failed request
        Toastify({
          text: 'Request failed', // Error message
          duration: 3000,
          gravity: "top", // Positioning of the toast
          position: "center", // Alignment of the toast (center)
          type: "error", // Type set to 'error'
          backgroundColor: "#FF6347" // Red background for error
        });
      }
    });
  },

  updateAmount(event) {
    const amount = event.detail.value;

    if (this.data.tariff && amount) {
      // Calculate the number of units bought based on the entered amount and tariff
      const unitsBought = (amount / this.data.tariff).toFixed(2);

      this.setData({
        amount: amount,
        unitsBought: unitsBought  // Set the calculated units bought
      });
    }
  },

  makePayBillPayment() {
    const { amount, unitsBought } = this.data;
  
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      // Use Toastify for the validation error
      Toastify({
        text: 'Please enter a valid amount', // Error message
        duration: 3000,
        gravity: "top", // Positioning of the toast
        position: "center", // Alignment of the toast (center)
        type: "error", // Type set to 'error'
        backgroundColor: "#FF6347" // Red background for error
      });
      return;
    }
  
    // Simulating payment
    try {
      my.call(
        'payBill',
        {
          businessID: '888880',
          billReference: '92110090880',
          amount,
          currency: 'KES',
          reason: `Electricity bill for ${unitsBought} units`,
        },
        (res) => {
          console.log('Payment success:', res);
          // Use Toastify for the success message after payment
          Toastify({
            text: 'Payment successful!', // Success message
            duration: 3000,
            gravity: "top", // Positioning of the toast
            position: "center", // Alignment of the toast (center)
            type: "success", // Type set to 'success'
            backgroundColor: "#4CAF50" // Green background for success
          });
  
          // Update meter units after payment and store it
          const rawUnits = Number(this.data.meter.units) + Number(unitsBought);
          const roundedUnits = Math.ceil(rawUnits * 100) / 100;

          const updatedMeter = {
            id: this.data.meter.id,
            units: roundedUnits  // Rounded up to 2 decimal places
          };

          console.log("New units:", updatedMeter.units); // Log to confirm
          console.log("Saving updated meter:", updatedMeter); // Log to confirm
  
          // Get the existing meters from storage
          const storedMeters = my.getStorageSync({ key: 'meters' }).data || [];
          console.log('Stored Meters:', storedMeters);  // Log to see what's in storage
  
          console.log(updatedMeter.id)
  
          // Find the meter in the stored list and update it
          const updatedMeters = storedMeters.map(meter => {
            if (String(meter.id) === String(updatedMeter.id)) {  // Ensure both IDs are strings for comparison
              console.log(`Updating meter with id ${updatedMeter.id}`);  // Log when a meter is found
              return { ...meter, units: updatedMeter.units };  // Update the units
            }
            return meter;
          });
  
          // Log the updated list
          console.log('Updated Meters:', updatedMeters);
  
          // Save the updated meters list back to storage
          my.setStorageSync({ key: 'meters', data: updatedMeters });
  
          // Verify if the storage update was successful
          const updatedStoredMeters = my.getStorageSync({ key: 'meters' }).data || [];
          console.log('Updated Meters from Storage:', updatedStoredMeters);  // Log to check the updated meters
          
          // Delay navigation to allow the toast to show
          setTimeout(() => {
            my.navigateBack();
          }, 3000); // 3000 ms (same duration as toast) to allow toast to fully show
        },
        (res) => {
          console.log('Payment error:', res);
          // Use Toastify for the payment failure
          Toastify({
            text: 'Payment failed', // Error message
            duration: 3000,
            gravity: "top", // Positioning of the toast
            position: "center", // Alignment of the toast (center)
            type: "error", // Type set to 'error'
            backgroundColor: "#FF6347" // Red background for error
          });
        }
      );
    } catch (error) {
      console.log('Error:', error);
      // Use Toastify for the unexpected error
      Toastify({
        text: 'An error occurred', // Error message
        duration: 3000,
        gravity: "top", // Positioning of the toast
        position: "center", // Alignment of the toast (center)
        type: "error", // Type set to 'error'
        backgroundColor: "#FF6347" // Red background for error
      });
    }
  }
});
