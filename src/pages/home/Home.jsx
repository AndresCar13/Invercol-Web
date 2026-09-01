import Header from '../../components/layout/Header.jsx';
import Footer from '../../components/layout/Footer.jsx';

import Hero from '../../components/home/Hero.jsx';
import PropertySearch from '../../components/home/PropertySearch.jsx';
import FeaturedProperties from '../../components/home/FeaturedProperties.jsx';
import Services from '../../components/home/Services.jsx';

function Home() {
  return (
    <>
      <Header />

      <main>
        <Hero />

        <PropertySearch />

        <FeaturedProperties />

        <Services />
      </main>

      <Footer />
    </>
  );
}

export default Home;
