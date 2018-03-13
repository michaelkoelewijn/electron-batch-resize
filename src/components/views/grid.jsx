import React from 'react';

export default class Grid extends React.Component {
    
    formatBytes(bytes,decimals) {
        if(bytes == 0) return '0 Bytes';
        var k = 1024,
            dm = decimals || 2,
            sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    render() {
        const {items} = this.props;
        return (
            <div className="rs-table-wrapper">
                <table className="rs-table">

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
                        <tr key={index}>
                            <td>{item.name}</td>
                            <td>{this.formatBytes(item.size)}</td>
                        </tr>
                        )
                    })
                    }
                    </tbody>
                </table>
            </div>
        )
    }
}