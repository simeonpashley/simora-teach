import { getTranslations } from 'next-intl/server';

import { CTA } from '@/templates/CTA';
import { DemoBanner } from '@/templates/DemoBanner';
import { FAQ } from '@/templates/FAQ';
import { Features } from '@/templates/Features';
import { Footer } from '@/templates/Footer';
import { Hero } from '@/templates/Hero';
import { Navbar } from '@/templates/Navbar';
import { Pricing } from '@/templates/Pricing';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'Index',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

const IndexPage = () => {
  return (
    <>
      <h1>Hello</h1>
      {false ? null : <DemoBanner />}
      {false ? null : <Navbar />}
      {false ? null : <Hero />}
      {false ? null : <Features />}
      {false ? null : <Pricing />}
      {false ? null : <FAQ />}
      {false ? null : <CTA />}
      {false ? null : <Footer />}
    </>
  );
};

export default IndexPage;
