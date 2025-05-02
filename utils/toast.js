const Toastify = function(options) {
  const {
    text = '',
    duration = 3000,
    gravity = 'top',
    position = 'center',
    type = 'success',
  } = options;

  let toastType = 'success'; // Alipay icon type
  switch (type) {
    case 'success':
      toastType = 'success'; // ✅
      break;
    case 'error':
      toastType = 'fail';    // ❌
      break;
    case 'info':
      toastType = 'none';    // ℹ️ (text only)
      break;
    default:
      toastType = 'success';
  }

  my.showToast({
    type: toastType,
    content: text,
    duration: duration,
    success: function () {
      console.log('Toast shown successfully');
    }
  });
};

export default Toastify;
