import { TwitterLogoIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { badgeVariants } from '@/components/ui/badgeVariants';
import { buttonVariants } from '@/components/ui/buttonVariants';
import { CenteredHero } from '@/features/landing/CenteredHero';
import { Section } from '@/features/landing/Section';

export const Hero = () => {
  const t = useTranslations('Hero');

  return (
    <Section className="py-16">
      <div className="grid items-center gap-8 lg:grid-cols-2">
        <div className="flex justify-center lg:order-2">
          <Image
            src="/assets/images/eyfs_bot1.jpeg"
            alt="The hero inside the classroom"
            width={800}
            height={300}
            className="rounded-lg"
          />
        </div>

        <div className="lg:order-1">
          <CenteredHero
            banner={(
              <a
                className={badgeVariants()}
                href="https://x.com/simora_uk"
                target="_blank"
                rel="noopener noreferrer"
              >
                <TwitterLogoIcon className="mr-1 size-5" />
                {' '}
                {t('follow_twitter')}
              </a>
            )}
            title={t.rich('title', {
              important: chunks => (
                <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  {chunks}
                </span>
              ),
            })}
            description={t('description')}
            buttons={(
              <a
                className={buttonVariants({ size: 'lg' })}
                href="https://github.com/simora-uk"
              >
                {t('primary_button')}
              </a>
            )}
          />
        </div>
      </div>
    </Section>
  );
};
