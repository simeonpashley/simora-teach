import { getTranslations } from 'next-intl/server';

import { CTA } from '@/templates/CTA';
import { FAQ } from '@/templates/FAQ';
import { Features } from '@/templates/Features';
import { Footer } from '@/templates/Footer';
import { Hero } from '@/templates/Hero';
import { HeroGallery } from '@/templates/HeroGallery';
import { Navbar } from '@/templates/Navbar';
import { Pricing } from '@/templates/Pricing';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  const t = await getTranslations({
    locale: (await props.params).locale,
    namespace: 'Index',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}
// bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent
const IndexPage = () => {
  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-b from-white via-indigo-200 to-purple-200">
        <Hero />
        <HeroGallery />
      </div>
      <Features />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </>
  );
};

export default IndexPage;
