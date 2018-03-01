const helpers = {
  getData: function(url) { // function to get data from server
    return new Promise((resolve, reject) => {
      var req = new XMLHttpRequest();
      req.open('GET', url);
      req.onload = function() {
        if (req.status == 200) {
          resolve(req.response);
        } else {
          reject(Error(`Network Error: ${req.status}`));
        }
      }
      req.send();
    });
  },
}
