import React from 'react';
import Dropzone from './components/dropzone';
import List from './components/list';

export default class App extends React.Component {

  constructor() {
    super();
    this.state = {
      itemsAdded: false,
      items: []
    }
  }

  handleFileDrop(files) {
    this.setState({
      itemsAdded: true,
      items: files
    })
  }

  render() {

    var renderedComponent = 
    this.state.itemsAdded 
    ? <List handleFileDrop={this.handleFileDrop.bind(this)} items={this.state.items} />
    : <Dropzone handleFileDrop={this.handleFileDrop.bind(this)} />

    return (
      <div className="rs-wrapper">
        { renderedComponent }
      </div>
    );
  }
}
