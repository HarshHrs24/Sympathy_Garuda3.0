import React from "react";
import { useParams} from "react-router-dom";
import article_data from "./article_data";

export default function ArticleDetail() {
  let params = useParams();
  console.log(params);
  return (
    <div className="article--detail">
      <div className="article--detail--content">
        <div className="article--detail--title">
          {article_data[params.id].title}
        </div>
        <div
          className="article--detail--image"
          style={{ backgroundImage: `url(${article_data[params.id].img})` }}
        ></div>
        <div className="atricle--detail--content">
          {article_data[params.id].detail}
        </div>
      </div>
    </div>
  );
}
