import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

export default class ImageUploadControl extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedImage: null,
      uploadStatus: '',
    };

    this.inputRef = React.createRef();
    this.onImageChange = this.onImageChange.bind(this);
    this.onImageUpload = this.onImageUpload.bind(this);
    this.onImageRemove = this.onImageRemove.bind(this);
  }

  onImageChange(event) {
    if (this.inputRef.current.value.length === 0) {
      this.setState({ selectedImage: null });
    } else {
      const MAX_IMAGE_SIZE = 1000000;
      const reader = new FileReader();
      this.setState({ uploadStatus: '' });
      reader.onload = (e) => {
        if (e.target.result.length > MAX_IMAGE_SIZE) {
          this.setState({ uploadStatus: 'Image is loo large - 1Mb maximum' });
          return;
        }

        if (
          !e.target.result.includes('data:image/jpeg') &&
          !e.target.result.includes('data:image/png')
        ) {
          this.setState({
            uploadStatus: 'Wrong file type - JPG and PNG only.',
          });
          return;
        }

        this.setState({ selectedImage: e.target.result });
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  onImageRemove() {
    this.setState({
      selectedImage: null,
      uploadStatus: '',
    });
    this.inputRef.current.value = null;
    this.props.onChange('');
  }

  async onImageUpload() {
    const { selectedImage } = this.state;
    const API_ENDPOINT = process.env.GATSBY_PRESIGNED_API_ENDPOINT;
    const contentType = selectedImage.substring(5, selectedImage.indexOf(';'));
    try {
      const response = await axios.post(API_ENDPOINT, {
        contentType,
      });

      const binary = atob(selectedImage.split(',')[1]);
      const array = [];
      for (let i = 0; i < binary.length; i += 1) {
        array.push(binary.charCodeAt(i));
      }
      const blobData = new Blob([new Uint8Array(array)], { type: contentType });

      try {
        await fetch(response.data.uploadURL, {
          method: 'PUT',
          body: blobData,
        });
        const responseUploadedImageURL = response.data.uploadURL.split('?')[0];
        this.setState({ uploadStatus: 'Image successfully loaded!' });
        this.props.onChange(responseUploadedImageURL);
      } catch (err) {
        this.setState({
          uploadStatus: 'Error loading image. Please try again.',
        });
      }
    } catch (err) {
      console.log('err: ', err);
    }
  }

  render() {
    const { selectedImage, uploadStatus } = this.state;
    return (
      <div
        style={{
          width: '100%',
          padding: '16px 20px',
          border: '2px solid rgb(223, 223, 227)',
          borderRadius: '0px 5px 5px',
          outline: '0px',
          boxShadow: 'none',
          backgroundColor: 'rgb(255, 255, 255)',
          color: 'rgb(68, 74, 87)',
          transition: 'border-color 0.2s ease 0s',
          position: 'relative',
          fontSize: '15px',
          lineHeight: '1.5',
          margin: 'auto',
          display: 'block',
        }}
      >
        {uploadStatus && (
          <h3
            style={
              uploadStatus.includes('Error')
                ? { color: '#C54E4B' }
                : { color: '#01A982' }
            }
          >
            {uploadStatus}
          </h3>
        )}
        <input type="file" onChange={this.onImageChange} ref={this.inputRef} />
        <img
          style={{
            width: '200px',
            height: 'auto',
            margin: 'auto',
            display: 'block',
            paddingTop: '1rem',
          }}
          src={selectedImage || this.props.value}
          alt=""
        />
        {selectedImage && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              paddingTop: '1rem',
            }}
          >
            <button
              style={{
                marginRight: '.2rem',
              }}
              type="button"
              onClick={this.onImageRemove}
            >
              Remove Image
            </button>
            <button
              style={{
                marginLeft: '.2rem',
              }}
              type="button"
              onClick={this.onImageUpload}
            >
              Upload Image
            </button>
          </div>
        )}
      </div>
    );
  }
}

ImageUploadControl.propTypes = {
  onChange: PropTypes.string,
  value: PropTypes.string,
};
