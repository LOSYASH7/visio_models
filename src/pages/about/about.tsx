import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './about.module.css';
import { Layout } from '../../components/Layout/layout';

export const About: React.FC = () => {

  const { t } = useTranslation(['common']);

  return (
    <Layout>
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Visio Security</h1>
          <p className={styles.subtitle}>
            {t('hero.subtitle')}
          </p>
        </div>
      </section>

      <section className={styles.content}>
        <div className={styles.grid}>
          <div className={styles.textSection}>
            <h2 className={styles.sectionTitle}>
              {t('hero.sectionTitle')}
              </h2>
            <p className={styles.paragraph}>
              Добавлю текст..   
            </p>
            <p className={styles.paragraph}>
              Добвлю текст..
            </p>
          </div>

          <div className={styles.imageSection}>
            <div className={styles.placeholderImage}>
              {/* Здесь может быть ваше изображение */}
              <span>Изображение прототипа</span>
            </div>
          </div>
        </div>

        <div className={styles.features}>
          <h2 className={styles.sectionTitle}>Наши ценности</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <h3>Качество</h3>
              <p>Мы стремимся к высочайшему качеству во всем, что делаем</p>
            </div>
            <div className={styles.featureCard}>
              <h3>Инновации</h3>
              <p>Постоянно развиваемся и внедряем новые технологии</p>
            </div>
            <div className={styles.featureCard}>
              <h3>Клиентоориентированность</h3>
              <p>Наши клиенты - наш главный приоритет</p>
            </div>
          </div>
        </div>

        <div className={styles.team}>
          <h2 className={styles.sectionTitle}>Разработчик</h2>
          <p className={styles.paragraph}>

          </p>
        </div>
      </section>
    </div>
    </Layout>
  );
};

export default About;