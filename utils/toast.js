const Toastify = function(options) {
  const {
    text = '', // Toast text
    duration = 3000, // Duration for the toast (in milliseconds)
    gravity = 'top', // Position (top or bottom)
    position = 'center', // Position (left, center, or right)
    type = 'success', // Type of toast (success, error, etc.)
  } = options;

  // Define background colors for different types
  let backgroundColor;
  switch (type) {
    case 'success':
      backgroundColor = '#4CAF50'; // Green for success
      break;
    case 'error':
      backgroundColor = '#F44336'; // Red for error
      break;
    case 'info':
      backgroundColor = '#2196F3'; // Blue for info
      break;
    default:
      backgroundColor = '#4CAF50'; // Default to green if no type is provided
  }

  // Using Alipay's native toast instead of DOM manipulation
  my.showToast({
    type: 'success',  // type of toast
    content: text,
    duration: duration, // Duration of the toast
    backgroundColor: backgroundColor, // Dynamic background color based on type
    success: function() {
      console.log('Toast shown successfully');
    }
  });
};

export default Toastify;
