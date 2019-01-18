import React from 'react'
import PropTypes from 'prop-types'
import _get from 'lodash/get'

import Header from './Header/Header'
import Resume from './Resume/Resume'
import Experiences from './Experiences/Experiences'
import Formations from './Formations/Formations'
import Passions from './Passions/Passions'
import Links from './Links/Links'
import Competences from './Competences/Competences'
import References from './References/References'

const Layout = ({ children }) => (
  <div className="app">
    {children}
    <Header />

    <section className="leftSection">
      <Resume />
      <Experiences />
      <Formations />
      <Passions />
    </section>

    <section className="righSection">
      <div className="content">
        <Links />
        <Competences />
        <References />
      </div>
    </section>
    <div className="clear" />
  </div>
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
