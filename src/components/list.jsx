import React from 'react';
const { dialog } = require('electron').remote;
var sharp = require('sharp');
var path = require('path');

export default class List extends React.Component {

  constructor(props) {
    super();
    this.state = {
      items: props.items,
      exportPath: '',
      isProcessingResize: false,
      isProcessingComplete: false
    }
  }

  componentDidMount() {
    this.handleDrop();
  }

  async handleResize(e) {
    e.preventDefault();
    var path = await dialog.showOpenDialog({
      properties: ['openDirectory','createDirectory']
    });

    
    await this.setState({
      isProcessingResize: true,
      exportPath: path[0]
    })


    var imageName, updatedImages = [];
    for(let [index, image] of this.state.items.entries()) {
      
      imageName = `${this.state.exportPath}/resized-${image.name}`
      await sharp(image.path).resize(parseInt(this.maximumWidth.value)).toFile(imageName, (err, info) => {
        if(err) {
          console.log(err)
        } 
      });
    
    }

    this.setState({
      isProcessingResize: false,
      isProcessingComplete: true
    })
    
  }

  handleDrop() {
    const dropzone = document.getElementById('rs-dropzone');
    
    dropzone.ondragover = () => { return false; };
    dropzone.ondragleave = () => { return false; };
    dropzone.ondragend = () => { return false; };
    dropzone.ondrop = (e) => { 
      e.preventDefault();
      var { items } = this.props;
      for (let f of e.dataTransfer.files) {
        items.push({
          name: f.name,
          path: f.path,
          size: f.size,
          type: f.type,
          finished: false
        })
      }

      this.props.handleFileDrop(items)

      return false; 
    };
  }

  render() {
    
    var { items } = this.props;
    var numItems = items.length;
    var numItemsText = numItems > 1 ? 'items' : 'item'


    return (
      <div id="rs-dropzone" className="rs-dropzone rs-dropzone--top">
        
        <div className="rs-table-wrapper">
          <table className={ this.state.isProcessingResize ? "rs-table--processing rs-table" : "rs-table" }>

            <thead>
              <tr>
                <th>File</th>
                <th>Size</th>
              </tr>
            </thead>

            <tbody>
            {
              items.map((item, index) => {
                return (
                  <tr key={index} className={ this.state.isProcessingComplete ? "rs-table-processing-complete" : "" }>
                    <td>{item.name}</td>
                    <td>{this.formatBytes(item.size)}</td>
                  </tr>
                )
              })
            }
            </tbody>
          </table>
        </div>

        <div className="rs-toolbar">
            <span className="rs-item-qty">{ numItems } {numItemsText} </span>
            <div>
              <input defaultValue="768" ref={ (width) => this.maximumWidth = width } className="rs-input" type="text" placeholder="Maximum width of images" />
              <button disabled={this.state.isProcessingResize} onClick={this.handleResize.bind(this)} className="osxbutton">Resize</button>
            </div>
        </div>

      </div>
    );
  }

  formatBytes(bytes,decimals) {
    if(bytes == 0) return '0 Bytes';
    var k = 1024,
        dm = decimals || 2,
        sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}
