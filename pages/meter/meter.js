Page({
  data: {
    iframeUrl: ''
  },

  onLoad(query) {
    const { number } = query;
    this.setData({
      iframeUrl: `https://egauge${number}.egaug.es/5FCE5/classic.html`
    });
  }
});
