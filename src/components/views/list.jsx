import React from 'react';

export default class List extends React.Component {
    render() {
        const {items} = this.props;
        return (
            <div className="rs-list-wrapper">
                <ul className="rs-list">
                {
                    items.map((item, index) => {
                        return (
                        <li key={index}>
                            <div className="rs-list-item">
                            <figure style={{
                                'backgroundImage': `url('${item.path}')`
                            }}>
                            </figure>
                            </div>
                        </li>
                        )
                    })
                    }
                    
                </ul>
            </div> 
        )
    }
}