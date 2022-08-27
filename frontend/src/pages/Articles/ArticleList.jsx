import React from "react";
import { NavLink } from "react-router-dom";
import article_data from "./article_data";
import ArticleCard from "./ArticleCard";

export default function ArticleList() {
  let card_list = article_data.map((item) => {
    console.log(item.id)
    return (
      <NavLink
        to={`/article/${item.id}`}
        key={item.id}
        style={{ textDecoration: "none" }}
      >
        <ArticleCard title={item.title} desc={item.desc} img={item.img} />
      </NavLink>
    );
  });

  return (
    <div className="article--list">
      <div className="article--list--nav">
        <div
          style={{
            fontStyle: "normal",
            fontWeight: "600",
            fontSize: "30px",
            color: "#a858ff",
          }}
        >
          Article
        </div>
      </div>
      {card_list}
    </div>
  );
}
