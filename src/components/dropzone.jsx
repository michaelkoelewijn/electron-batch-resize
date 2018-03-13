import React from 'react';

export default class Dropzone extends React.Component {

  constructor() {
    super();
    this.state = {
      droppedActive: false,
      dragActive: false
    }
  }

  componentDidMount() {
    const dropzone = document.getElementById('rs-dropzone');
    dropzone.ondragover = () => {
      if(!this.state.dragActive) {
        this.setState({
          dragActive: true
        })
      }
      return false;
    };

    dropzone.ondragleave = () => {
      if(this.state.dragActive) {
        this.setState({
          dragActive: false
        })
      }
      return false;
    };

    dropzone.ondragend = () => {
      return false;
    };
    dropzone.ondrop = (e) => {
      e.preventDefault();
      
      if(this.state.dragActive) {
        this.setState({
          dragActive: false
        })
      }

      var droppedFiles = [];
      
      for (let f of e.dataTransfer.files) {
        droppedFiles.push({
          name: f.name,
          path: f.path,
          size: f.size,
          type: f.type,
          finished: false
        })
      }

      this.props.handleFileDrop(droppedFiles)

      return false;
    };
  }

  render() {

    var dropzoneClass = this.state.dragActive ? "rs-dropzone rs-dropzone--active" : "rs-dropzone";

    return (
      <div id="rs-dropzone" className={dropzoneClass}>
        <figure>
          <img className="rs-dropzone-icon" src="./assets/download.svg" />    
          <figcaption>Drop your files here</figcaption>
        </figure>
      </div>
    );
  }
}
