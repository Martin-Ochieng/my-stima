const Toastify = require('../../utils/toast');  // Adjust path based on your folder structure

Page({
  data: {
    meter: {},
    amount: '',
    tariff: '',
    billAmount: '',
    unitsBought: '',
    showBuyButton: true  // <-- Add this flag
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
    this.setData({ showBuyButton: false });
  
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      Toastify({
        text: 'Please enter a valid amount',
        duration: 3000,
        gravity: "top",
        position: "center",
        type: "error",
        backgroundColor: "#FF6347"
      });

      // Only show the button again if not navigating away
      setTimeout(() => {
        this.setData({ showBuyButton: true });
      }, 3100);  // wait for second toast to end
      return;
    }
  
    try {
      my.call(
        'payBill',
        {
          businessID: '1112223',
          billReference: '92110090880',
          amount,
          currency: 'KES',
          reason: `Electricity bill for ${unitsBought} units`,
        },
        (res) => {
          // Check that success response has transactionId
          if (res.transactionId) {
            console.log('Payment success:', res);
            
            Toastify({
              text: 'Payment successful!',
              duration: 3000,
              gravity: "top",
              position: "center",
              type: "success",
              backgroundColor: "#4CAF50"
            });

            setTimeout(() => {
              Toastify({
                text: res.transactionId || '',
                duration: 3000,
                gravity: "top",
                position: "center",
                type: "success",
                backgroundColor: "#FF6347"
              });



            }, 2200);
  
            // Update units and store
            const rawUnits = Number(this.data.meter.units) + Number(unitsBought);
            const roundedUnits = Math.ceil(rawUnits * 100) / 100;
  
            const updatedMeter = {
              id: this.data.meter.id,
              units: roundedUnits
            };
  
            const storedMeters = my.getStorageSync({ key: 'meters' }).data || [];
            const updatedMeters = storedMeters.map(meter => {
              if (String(meter.id) === String(updatedMeter.id)) {
                return { ...meter, units: updatedMeter.units };
              }
              return meter;
            });
  
            my.setStorageSync({ key: 'meters', data: updatedMeters });
  
            setTimeout(() => {
              my.navigateBack();
            }, 3000);
          } else {
            console.log('Unexpected response format:', res);
          
            // First toast
            Toastify({
              text: 'Payment failed',
              duration: 2000,
              gravity: "top",
              position: "center",
              type: "error",
              backgroundColor: "#FF6347"
            });
          
            // Second toast (with delay)
            setTimeout(() => {
              Toastify({
                text: res.errorMessage || 'Unknown error occurred',
                duration: 3000,
                gravity: "top",
                position: "center",
                type: "error",
                backgroundColor: "#FF6347"
              });

              // Only show the button again if not navigating away
              setTimeout(() => {
                this.setData({ showBuyButton: true });
              }, 3100);  // wait for second toast to end

            }, 2200);
          }
          
        },
        (res) => {
          console.log('Payment error:', res);
          Toastify({
            text: res.errorMessage || 'Payment failed',
            duration: 3000,
            gravity: "top",
            position: "center",
            type: "error",
            backgroundColor: "#FF6347"
          });

            // Only show the button again if not navigating away
            setTimeout(() => {
              this.setData({ showBuyButton: true });
            }, 3100);  // wait for second toast to end

        }
      );
    } catch (error) {
      console.log('Error:', error);
      Toastify({
        text: 'An error occurred',
        duration: 3000,
        gravity: "top",
        position: "center",
        type: "error",
        backgroundColor: "#FF6347"
      });

      // Only show the button again if not navigating away
      setTimeout(() => {
        this.setData({ showBuyButton: true });
      }, 3100);  // wait for second toast to end

    }
  }
  
});
