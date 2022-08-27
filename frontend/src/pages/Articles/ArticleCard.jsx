import React from "react";

export default function ArticleCard(props) {
  return (
    <div>
      <div className="article--card">
        <div className="article--card--content">
          <div className="article--card--title">
          {props.title}
          </div>
          <div className="article--card--desc">
          {props.desc}
          </div>
        </div>
        <div className="article--card--image" style={{"backgroundImage": `url(${props.img})`}}>
        </div>
      </div>
    </div>
  );
}
