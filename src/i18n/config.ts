export const i18nConfig = {
    fallbackLng: 'en',
    supportedLngs: ['en', 'ru'],
    defaultNS: 'common',

    detection: {
        order: ['localStorage', 'navigator',  'htmlTag'],
        caches: ['localStorage'],
    },

    backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json ',
    },

    interpolation: {
        escapeValue: false,
    },

    debug: process.env.NODE_ENV === 'development',

    ns: ['common', 'auth', 'profile', 'validation'],
};