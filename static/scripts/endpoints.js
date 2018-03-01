const endPoints = {
  encode: (dataURI, callback) => { // image to ndarray
    const request = new XMLHttpRequest();
    request.open('POST', '/encode', true);
    request.setRequestHeader('Content-Type', 'text/plain; charset=UTF-8');
    request.send(dataURI);
    request.onreadystatechange = function() {
      if (request.readyState > 3 && request.status == 200) {
        const encoded = JSON.parse(request.responseText);
        console.log(encoded);
        callback(encoded);
      }
    };
  },
}
