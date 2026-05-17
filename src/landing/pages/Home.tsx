import React from 'react';
import Hero from '../components/sections/Hero';
import Partners from '../components/sections/Partners';
import Methodology from '../components/sections/Methodology';

const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <Partners />
      <Methodology />
    </>
  );
};

export default Home;
