function initializeMeters(setMetersCallback) {
  const res = my.getStorageSync({ key: 'meters' });
  let storedMeters = res.data || [];

  if (storedMeters.length > 0) {
    // Fetch updated energy values
    Promise.all(
      storedMeters.map(meter => fetchEnergyForMeter(meter))
    ).then(updatedMeters => {
      setMetersCallback(updatedMeters);
      my.setStorageSync({ key: 'meters', data: updatedMeters }); // <-- Save updated data
    });
  } else {
    const defaultMeters = [
      { id: 1, name: 'Main Board', number: '15539', type: 'Prepaid' },
      { id: 2, name: 'Top Farm', number: '60349', type: 'Postpaid' }
    ];

    Promise.all(
      defaultMeters.map(meter => fetchEnergyForMeter(meter))
    ).then(updatedMeters => {
      setMetersCallback(updatedMeters);
      my.setStorageSync({ key: 'meters', data: updatedMeters }); // Save initialized meters
    });
  }
}


function fetchEnergyForMeter(meter) {
  return new Promise(resolve => {
    my.request({
      url: 'https://run.mocky.io/v3/a5b3270e-d983-4adb-84f3-853b976a36ea',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },

      data: {
        meterNumber: meter.number
      },
      success: res => {
        const energy = res.data.energy !== undefined && res.data.energy !== null ? res.data.energy : 0;


        resolve({
          ...meter,
          units: energy
        });
      },
      fail: () => {
        // In case of error, default to 0
        resolve({
          ...meter,
          units: 0
        });
      }
    });
  });
}

export default {
  initializeMeters,
  fetchEnergyForMeter
};
