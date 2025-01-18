module.exports = {
  // ... existing config ...
  rules: {
    // ... existing rules ...
    '@next/next/no-missing-client-directive': [
      'error',
      {
        clientImports: [
          'next-intl',
          { name: 'useTranslations', from: 'next-intl' },
          { name: 'useRouter', from: 'next/navigation' },
          // Add other client-side imports that should trigger the rule
        ],
      },
    ],
  },
};
