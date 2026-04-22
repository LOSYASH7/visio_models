import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getDocuments, deleteDocument, uploadFile, getDownloadUrl, Document, DocumentFilter } from '../../api/documents';
import { useAuth } from '../../hooks/useAuth';
import { SEO } from '../../components/SEO';

const DocumentsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingId, setUploadingId] = useState<number | null>(null);
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const filters: DocumentFilter = {
    status: searchParams.get('status') || '',
    search: searchParams.get('search') || '',
    dateFrom: searchParams.get('dateFrom') || '',
    dateTo: searchParams.get('dateTo') || '',
    page: parseInt(searchParams.get('page') || '0'),
    size: parseInt(searchParams.get('size') || '10'),
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortDir: (searchParams.get('sortDir') as 'asc' | 'desc') || 'desc',
  };

  const setFilter = (key: keyof DocumentFilter, value: any) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== '') newParams.set(key, String(value));
    else newParams.delete(key);
    if (key !== 'page') newParams.set('page', '0');
    setSearchParams(newParams);
  };

  useEffect(() => {
    setLoading(true);
    getDocuments(filters)
      .then((res) => {
        setDocuments(res.data.content);
        setTotal(res.data.totalElements);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [searchParams]);

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить документ?')) return;
    await deleteDocument(id);
    setFilter('page', 0);
  };

  const handleFileChange = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setUploadingId(id);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || uploadingId === null) return;
    await uploadFile(uploadingId, selectedFile);
    setSelectedFile(null);
    setUploadingId(null);
    setFilter('page', filters.page);
  };

  const handleDownload = async (id: number) => {
    const res = await getDownloadUrl(id);
    window.open(res.data.url, '_blank');
  };

  const totalPages = Math.ceil(total / filters.size);

  return (
    <>
      <SEO title="Документы | VISIO" description="Управление документами" noindex />
      <div style={{ padding: '20px' }}>
        <h1>Документы</h1>
        {/* фильтры, таблица, пагинация – остаётся без изменений */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <input type="text" placeholder="Поиск" value={filters.search} onChange={(e) => setFilter('search', e.target.value)} />
          <select value={filters.status} onChange={(e) => setFilter('status', e.target.value)}>
            <option value="">Все статусы</option>
            <option value="draft">Черновик</option>
            <option value="published">Опубликован</option>
            <option value="archived">Архив</option>
          </select>
          <input type="date" value={filters.dateFrom} onChange={(e) => setFilter('dateFrom', e.target.value)} />
          <input type="date" value={filters.dateTo} onChange={(e) => setFilter('dateTo', e.target.value)} />
          <select value={filters.sortBy} onChange={(e) => setFilter('sortBy', e.target.value)}>
            <option value="createdAt">По дате</option>
            <option value="title">По названию</option>
          </select>
          <select value={filters.sortDir} onChange={(e) => setFilter('sortDir', e.target.value)}>
            <option value="desc">По убыванию</option>
            <option value="asc">По возрастанию</option>
          </select>
          <select value={filters.size} onChange={(e) => setFilter('size', Number(e.target.value))}>
            <option value="5">5 на стр</option>
            <option value="10">10 на стр</option>
            <option value="20">20 на стр</option>
          </select>
        </div>
        {loading && <div>Загрузка...</div>}
        <table border={1} cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr><th>ID</th><th>Название</th><th>Описание</th><th>Статус</th><th>Дата</th><th>Владелец</th><th>Файл</th><th>Действия</th></tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id}>
                <td>{doc.id}</td><td>{doc.title}</td><td>{doc.description}</td><td>{doc.status}</td>
                <td>{new Date(doc.createdAt).toLocaleString()}</td><td>{doc.owner.fio}</td>
                <td>
                  {doc.fileKey ? (
                    <button onClick={() => handleDownload(doc.id)}>Скачать</button>
                  ) : (
                    <div>
                      <input type="file" onChange={(e) => handleFileChange(doc.id, e)} />
                      {uploadingId === doc.id && selectedFile && <button onClick={handleUpload}>Загрузить</button>}
                    </div>
                  )}
                </td>
                <td>{(isAdmin || doc.owner.id === user?.id) && <button onClick={() => handleDelete(doc.id)}>Удалить</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: 20, display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button disabled={filters.page === 0} onClick={() => setFilter('page', filters.page - 1)}>Предыдущая</button>
          <span>Страница {filters.page + 1} из {totalPages}</span>
          <button disabled={filters.page + 1 >= totalPages} onClick={() => setFilter('page', filters.page + 1)}>Следующая</button>
        </div>
      </div>
    </>
  );
};

export default DocumentsPage;