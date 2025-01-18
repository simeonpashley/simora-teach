import fs from 'node:fs';
import path from 'node:path';

// Helper function to check if a file uses client-side features
function requiresClientDirective(content: string): boolean {
  const clientFeatures = [
    'useTranslations',
    'useState',
    'useEffect',
    'useCallback',
    'useMemo',
    'useRef',
    'onClick=',
    'onChange=',
    'onSubmit=',
  ];

  return clientFeatures.some(feature => content.includes(feature));
}

describe('Client/Server Component Boundaries', () => {
  const componentsDir = path.join(process.cwd(), 'src/features');

  it('components using client features have "use client" directive', () => {
    const checkDirectory = (dir: string) => {
      const files = fs.readdirSync(dir);

      files.forEach((file) => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
          checkDirectory(filePath);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
          const content = fs.readFileSync(filePath, 'utf8');

          if (requiresClientDirective(content)) {
            expect(
              content.includes('\'use client\'') || content.includes('"use client"'),
            ).toBe(true, `${filePath} uses client features but is missing 'use client' directive`);
          }
        }
      });
    };

    checkDirectory(componentsDir);
  });
});
