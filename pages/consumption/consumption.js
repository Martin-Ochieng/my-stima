Page({
  data: {
    amount: ''  // To store the amount entered by the user
  },

  // Update the amount when the user enters a value
  updateAmount(event) {
    console.log('Input Changed:', event.detail.value);  // Debugging the input
    this.setData({
      amount: event.detail.value  // Set the amount to the input value
    });
  },

  makePayBillPayment() {
    const { amount } = this.data;

    console.log('Amount entered:', amount);  // Log the amount entered

    // Check if the amount is provided and valid
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      my.showToast({
        title: 'Please enter a valid amount',
        icon: 'none',  // Error toast
        type: 'none',
        content: 'Please enter a valid amount'
      });
      return;
    }

    // Proceed with payment logic
    try {
      my.call(
        'payBill',
        {
          businessID: '5043441',
          billReference: '123456789',
          amount: amount,
          currency: 'KES',
          reason: 'Electricity bill',
        },
        (res) => {
          // Handle success response
          console.log('Payment success:', res);
          my.showToast({
            title: 'Payment successful!',
            icon: 'success',  // Success toast
            type: 'none',
            content: 'Payment successful!'
          });
        },
        (res) => {
          // Handle error response
          console.log('Payment error:', res);
          my.showToast({
            title: 'Payment failed',
            icon: 'none',  // Error toast
            type: 'none',
            content: 'Payment failed'
          });
          
        }
      );
    } catch (error) {
      console.log('Error:', error);
      my.showToast({
        title: 'An error occurred',
        icon: 'none',  // Error toast
        type: 'none',
        content: 'An error occurred'
      });
    }
  }
});
