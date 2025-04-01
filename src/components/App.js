import React, { useState, useContext } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import { myContext } from "../index";

import Welcome from "./Welcome";
import ConnectionController from "./controller/ConnectionController";
import SpaceController from "./controller/SpaceController";

export default function App() {
  const [user, setuser] = useState(null);

  function userName() {
    return user !== null ? `${user.name} ${user.surname}` : "";
  }

  return (
    <myContext.Provider value={[user, setuser]}>
      <header className="d-flex justify-content-center align-items-center">
        <h1>Benev <i></i> sons</h1>
      </header>

      <BrowserRouter>

        <Navbar
          className='mb-5'
          collapseOnSelect="true"
          bg='black'
          variant='dark'
          sticky='top'
          expand='md'
        >
          <Container>
            <Navbar.Toggle aria-controls='responsive-navbar-nav' />
            <Navbar.Collapse id='responsive-navbar-nav'>
              <Nav>
                <Nav.Link as={Link} eventKey='1' to="/welcome">
                  <i className='fa fa-home me-2'></i>
                  Accueil
                </Nav.Link>
                <Nav.Link as={Link} eventKey='2' to="/space" hidden={user === null}>
                  <i className='fa fa-user me-2'></i>
                  Mon espace
                </Nav.Link>
                <Nav.Link as={Link} eventKey='5' to="/connection" hidden={user !== null}>
                  <i className='fa fa-key me-2'></i>
                  Connexion
                </Nav.Link>
                <Nav.Link as={Link} eventKey='6' to="/welcome" hidden={user === null} onClick={() => {
                  setuser(null);
                }}>
                  <i className='fa fa-unlock me-2'></i>
                  Déconnexion
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
            <Navbar.Brand className='fst-italic'>{userName()}</Navbar.Brand>

          </Container>
        </Navbar>

        <article>
          <Container>
            <Routes>
              <Route exact path="/" element={<Welcome />} />
              <Route exact path="/welcome" element={<Welcome />} />
              <Route exact path="/connection" element={<ConnectionController />} />
              <Route exact path="/space" element={<SpaceController/>} />
            </Routes>
          </Container>
        </article>
      </BrowserRouter>

      <footer className="d-flex justify-content-center align-items-center">
        <h6>BenevOsons - 2025</h6>
      </footer>

    </myContext.Provider>
  );
}