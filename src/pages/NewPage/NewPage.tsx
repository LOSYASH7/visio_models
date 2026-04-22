import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { SEO } from '../../components/SEO';

interface Article {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
}

const NewsPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.get('/external/news')
      .then(res => {
        setArticles(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Загрузка новостей...</div>;
  if (error) return <div>Новости временно недоступны</div>;

  return (
    <>
      <SEO title="Новости | VISIO" description="Актуальные новости" />
      <div>
        <h1>Новости</h1>
        {articles.map((article, idx) => (
          <div key={idx}>
            <h2>{article.title}</h2>
            <p>{article.description}</p>
            <a href={article.url} target="_blank">Читать</a>
          </div>
        ))}
      </div>
    </>
  );
};

export default NewsPage;