import React, { Component } from 'react';
import axios from 'axios';

export default class ImageUploadControl extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedFile: null,
    };
    this.onFileChange = this.onFileChange.bind(this);
    this.onFileUpload = this.onFileUpload.bind(this);
  }

  onFileChange(event) {
    const MAX_IMAGE_SIZE = 1000000;
    const reader = new FileReader();
    reader.onload = (e) => {
      console.log('length: ', e.target.result.includes('data:image/jpeg'));
      if (!e.target.result.includes('data:image/jpeg')) {
        return alert('Wrong file type - JPG only.');
      }
      if (e.target.result.length > MAX_IMAGE_SIZE) {
        return alert('Image is loo large - 1Mb maximum');
      }
      this.setState({ selectedFile: e.target.result });
    };
    reader.readAsDataURL(event.target.files[0]);
  }

  async onFileUpload() {
    console.log('Upload clicked');
    const response = await axios({
      method: 'GET',
      url:
        'https://dbfqlf8cvh.execute-api.us-west-1.amazonaws.com/default/getPresignedURL',
    });
    console.log('Response: ', response.data);
    const binary = atob(this.state.selectedFile.split(',')[1]);
    const array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    const blobData = new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
    console.log('Uploading to: ', response.data.uploadURL);
    const result = await fetch(response.data.uploadURL, {
      method: 'PUT',
      body: blobData,
    });
    console.log('Result: ', result);
  }

  render() {
    return (
      <div>
        <input type="file" onChange={this.onFileChange} />
        <button onClick={this.onFileUpload} type="submit">
          Upload
        </button>
        <img src={this.state.selectedFile} alt="uploaded" />
      </div>
    );
  }
}
