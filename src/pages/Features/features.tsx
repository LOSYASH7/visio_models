import React from 'react';
import styles from './features.module.css';
import { useTranslation } from 'react-i18next';
import { Layout } from '../../components/Layout/layout';

export const Features: React.FC = () => {

  const { t } = useTranslation(['common']);

  return (
    <Layout>
    <div className={styles.container}>
      {/* Герой секция */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            {t('hero.heroTitle')}
          </h1>
        </div>
      </section>

      {/* Секция для видео */}
      <section className={styles.videoSection}>
        <div className={styles.videoContainer}>
          <div className={styles.videoPlaceholder}>
            <span>{t('heroFuatures.videoPlaceholder')}</span>
          </div>
        </div>
      </section>
    </div>
    </Layout>
  );
};

export default Features;