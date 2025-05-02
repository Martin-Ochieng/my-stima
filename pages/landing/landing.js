import { initializeMeters } from '../../utils/meterHelper';

Page({
  onShow() {
    // Optionally set up meters here too
    initializeMeters(() => {});
  },

  goToMeters() {
    my.navigateTo({
      url: '/pages/meters/meters'
    });
  }
});
