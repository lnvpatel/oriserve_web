import React, { Fragment } from 'react';
import './Restaurants.css';

const RestaurantsDisplay = (props) => {
    console.log("Props is>>>>>", props);

    const renderList = ({ datalist }) => {
        if (datalist && datalist.length > 0) {
            return datalist.map((item, index) => {
                return (
                    <div className="card col-md-2" key={index}>
                        <div className="row">
                            <img className="card-img-top" src={item.thumb} alt={`Thumbnail of ${item.name}`} />
                            <span className="topTemp">{item.name}</span>
                        </div>
                        <div className="card-body">
                            <span className="max">{item.city}</span>   /
                            <span className="min">{item.locality}</span>
                            <h4 className="card-title">2 Person = ₹{item.min_price}</h4>
                        </div>
                    </div>
                );
            });
        } else {
            return (
                <div>
                    <center>
                        <img src="/loading.gif" alt="Loading..." />
                    </center>
                </div>
            );
        }
    };

    return (
        <Fragment>
            {renderList(props)}
        </Fragment>
    );
};

export default RestaurantsDisplay;
