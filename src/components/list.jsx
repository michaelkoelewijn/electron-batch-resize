import React from 'react';
import ViewList from './views/list';
import ViewGrid from './views/grid';

const { dialog } = require('electron').remote;
var sharp = require('sharp');
var path = require('path');

export default class List extends React.Component {

  constructor(props) {
    super();
    this.state = {
      view: 'list', //List || grid
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

  changeLayout(layout) {
    this.setState({
      view: layout
    })
  }

  render() {
    
    var { items } = this.props;
    var numItems = items.length;
    var numItemsText = numItems > 1 ? 'items' : 'item'
    var preview;


    var view = this.state.view == 'grid' ? <ViewList items={items} /> : <ViewGrid items={items} />


    return (
      <div id="rs-dropzone" className="rs-dropzone rs-dropzone--top">

      { view }
        
        <div className="rs-toolbar">
          <div>
            <span className="rs-item-qty">{ numItems } {numItemsText} </span>
            <button onClick={this.changeLayout.bind(this, 'list')}>List</button>
            <button onClick={this.changeLayout.bind(this, 'grid')}>Grid</button>
          </div>  
            <div>
              <input defaultValue="768" ref={ (width) => this.maximumWidth = width } className="rs-input" type="text" placeholder="Maximum width of images" />
              <button disabled={this.state.isProcessingResize} onClick={this.handleResize.bind(this)} className="osxbutton">Resize</button>
            </div>
        </div>

      </div>
    );
  }

  
}
