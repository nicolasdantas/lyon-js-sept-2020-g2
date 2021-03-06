import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './style/News.scss';
import axios from 'axios';

const News = () => {
  const [arrayOfNews, setArrayOfNews] = useState([]);

  useEffect(() => {
    const source = axios.CancelToken.source();
    const url = `https://newsapi.org/v2/everything?sources=le-monde&pageSize=7&qInTitle=covid&sortBy=publishedAt&apiKey=f545ace02057431081cf6684cc135a79`;
    axios
      .get(url, { cancelToken: source.token })
      .then((response) => response.data)
      .then((data) => setArrayOfNews(data.articles))
      .catch((err) => console.log(err.message));
    return () => {
      source.cancel('API News request canceled by user');
    };
  }, []);

  return (
    <div className="carousel-container" id="news">
      <h1 className="title">Dernières actualités</h1>
      <Carousel
        className="carousel"
        autoPlay
        showThumbs={false}
        showStatus={false}
        infiniteLoop
      >
        {arrayOfNews
          .filter((article) => article.urlToImage !== null)
          .map((article) => (
            <a
              href={article.url}
              key={article.title}
              target="_blank"
              rel="noreferrer noopener "
            >
              <div className="container">
                <img className="picture" alt="" src={article.urlToImage} />
                <p className="legend">{article.title}</p>
              </div>
            </a>
          ))}
      </Carousel>
    </div>
  );
};

export default News;
