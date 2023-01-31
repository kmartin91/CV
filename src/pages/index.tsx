import { Script } from 'gatsby'
import React from 'react'

import Layout from '../components/layout'
import SEO from '../components/seo'
import Header from '../components/Header/Header'
import Resume from '../components/Resume/Resume'
import Experiences from '../components/Experiences/Experiences'
import Formations from '../components/Formations/Formations'
import Passions from '../components/Passions/Passions'
import Links from '../components/Links/Links'
import Competences from '../components/Competences/Competences'
import References from '../components/References/References'

const IndexPage = () => (
  <Layout>
    <Script src="https://analytics.ckoisa.net/js/plausible.js" data-domain="kevinmartin.dev" />
    <SEO title="Kevin Martin" keywords={[`fullstack`, `js`, `react`]} />
    <Header />
    <section className="main">
      <Resume />
      <Experiences />
      <Formations />
      <Passions />
    </section>

    <section className="aside">
      <div className="content">
        <Links />
        <Competences />
        <References />
      </div>
    </section>
  </Layout>
)

export default IndexPage
