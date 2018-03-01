class EncodingBox {
  constructor(containerEl) {
    // Creating elements
    this.el = containerEl;
    this.el.classList.add('encoding-container');

    this.imageContainer = document.createElement('div');
    this.imageContainer.classList.add('encoding-image-container');

    this.clearButton = document.createElement('button');
    this.clearButton.classList.add('encoding-clear-button');
    this.clearButton.appendChild(document.createTextNode('Clear'));

    this.el.appendChild(this.imageContainer);
    this.el.appendChild(this.clearButton);

    // Bind this
    this.renderImageContainerPlaceholder = this.renderImageContainerPlaceholder.bind(this);
    this.handleDrop = this.handleDrop.bind(this);

    this.renderImageContainerPlaceholder();
    // Clear event defaults
    this.el.addEventListener('dragover', this.clearEventDefaults, false);
    this.imageContainer.addEventListener('dragover', this.clearEventDefaults, false);
    this.clearButton.addEventListener('dragover', this.clearEventDefaults, false);
    // Add event handlers
    this.imageContainer.addEventListener('drop', this.handleDrop, false);
    this.clearButton.addEventListener('click', this.renderImageContainerPlaceholder, false);
  }
  clearEventDefaults(e) {
    e.stopPropagation();
    e.preventDefault();
  }
  handleDrop(e) {
    e.stopPropagation();
    e.preventDefault();
    const file = e.dataTransfer.files[0]; // only support single images
    if (file && file.type.match('image.*')) {
      const reader = new FileReader();
      reader.onload = (file => {
        const dataURI = file.target.result;
        const img = document.createElement('img');
        img.src = dataURI;
        this.imageContainer.innerHTML = '';
        this.imageContainer.appendChild(img);
        // hit encoding endpoint
        this.el.dispatchEvent(new CustomEvent('encoding'));
        endPoints.encode(dataURI, (encodedData) => {
          let encodedEvent = new CustomEvent('encoded');
          encodedEvent.encodedData = encodedData;
          this.el.dispatchEvent(encodedEvent);
        });
      });
      reader.readAsDataURL(file);
    }
  }
  renderImageContainerPlaceholder() {
    this.imageContainer.innerHTML = '';
    this.imageContainer.appendChild(document.createTextNode('Drop an image to encode it.'));
    this.el.dispatchEvent(new CustomEvent('clearImage'));
  }
}

class DecodingBox {
  constructor(containerEl) {
    this.state = 'empty';
    // Creating elements
    this.el = containerEl;
    this.el.classList.add('decoding-container');
    this.dataContainer = document.createElement('div');
    this.dataContainer.classList.add('decoding-data-container');

    this.el.appendChild(this.dataContainer);

    this.render = this.render.bind(this);
  }
  render(encodedData) {
    if (this.state === 'empty') {
      this.dataContainer.innerHTML = '';
    } else if (this.state === 'encoding') {
      this.dataContainer.innerHTML = 'Encoding...';
    } else if (this.state === 'encoded') {
      this.dataContainer.innerHTML = "";
      encodedData.forEach(row => {
        var rowEl = document.createElement('span');
        rowEl.classList.add('image-data-row');
        rowEl.style.height = `${100/encodedData.length}%`;
        row.forEach(val => {
          var valEl = document.createElement('span');
          valEl.appendChild(document.createTextNode(val));
          valEl.classList.add('image-data-value');
          valEl.style.backgroundColor = `rgb(${val}, ${val}, ${val})`;
          valEl.style.color = val < 127 ? 'white' : 'black';
          valEl.style.width = `${100/row.length}%`;

          rowEl.appendChild(valEl);
        });
        this.dataContainer.appendChild(rowEl);
      });
    }
  }
}

(() => {
  const encodingBox = new EncodingBox(document.getElementById("encoding-container"));
  const decodingBox = new DecodingBox(document.getElementById("decoding-box"));

  encodingBox.el.addEventListener('clearImage', (e) => {
    decodingBox.state = 'empty';
    decodingBox.render();
  });
  encodingBox.el.addEventListener('encoding', (e) => {
    decodingBox.state = 'encoding';
    decodingBox.render();
  });
  encodingBox.el.addEventListener('encoded', (e) => {
    decodingBox.state = 'encoded';
    decodingBox.render(e.encodedData);
  });
})();
