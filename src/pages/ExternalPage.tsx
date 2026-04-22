import { useEffect, useState } from 'react';
import api from '../api/axios';
import { SEO } from '../components/SEO';

const ExternalPage = () => {
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.get('/external/hello')
      .then(res => setData(res.data.message))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <SEO title="Внешний API | VISIO" description="Интеграция со сторонним сервисом" />
      <div style={{ padding: '20px' }}>
        <h1>Интеграция со сторонним API</h1>
        {loading && <p>Загрузка...</p>}
        {error && <p style={{ color: 'red' }}>Ошибка, но приложение продолжает работать (graceful degradation)</p>}
        {data && <p>Ответ от API: <strong>{data}</strong></p>}
      </div>
    </>
  );
};

export default ExternalPage;