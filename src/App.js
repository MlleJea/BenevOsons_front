import React, { useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import heartIcon from "/public/pictures/heart-icon.png";
import LogoutButton from "@components/LogoutButton";

import { myContext } from "./index";

import Welcome from "@components/Welcome";
import ConnectionController from "@controller/ConnectionController";
import SpaceController from "@controller/SpaceController";
import RegisterController from "@controller/RegisterController";
import MissionController from "@controller/MissionController";
import SearchController from "@controller/SearchController";

export default function App() {
  const [user, setUser] = useState(null);

  function userName() {
    return user !== null ? `${user.name}` : "";
  }

  return (
    <>
      <myContext.Provider value={[user, setUser]}>
        <div className="app-wrapper">
        <header className="d-flex justify-content-center align-items-center">
          <h1>Benev</h1>
          <h1 className="pink">O</h1>
          <h1>sons</h1>
          <h1 className="p-2"></h1>
          <img src={heartIcon} alt="heart" className="heart-icon" />
        </header>

        <Navbar
          className="navbar mb-5"
          collapseOnSelect="true"
          bg="light"
          variant="light"
          sticky="top"
          expand="md"
        >
          <Container>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav>
                <Nav.Link as={Link} eventKey="1" to="/welcome">
                  <i className="fa fa-home me-2 navbar-icon"></i>
                  Accueil
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  eventKey="2"
                  to="/space"
                  hidden={user === null}
                >
                  <i className="fa fa-user me-2  navbar-icon"></i>
                  Mon espace
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  eventKey="3"
                  to="/connection"
                  hidden={user !== null}
                >
                  <i className="fa fa-key me-2 navbar-icon"></i>
                  Connexion
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  eventKey="4"
                  to="/register"
                  hidden={user !== null}
                >
                  <i className="fa fa-user-plus me-2 navbar-icon"></i>
                  Inscription
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  eventKey="4"
                  to="/mission"
                  hidden={user === null}

                >
                  <i className="fa fa-crosshairs me-2 navbar-icon"></i>
                  Missions
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  eventKey="5"
                  to={"/search"}
                  hidden={user === null || user.role !== "VOLUNTEER"}

                >
                  <i className="fa fa-search me-2 navbar-icon"></i>
                  Recherche
                </Nav.Link>

                {user !== null && <LogoutButton />}

              </Nav>
            </Navbar.Collapse>
            <Navbar.Brand className="fst-italic">{userName()}</Navbar.Brand>
          </Container>
        </Navbar>

        <article>
          <Container>
            <Routes>
              <Route exact path="/" element={<Welcome />} />
              <Route exact path="/welcome" element={<Welcome />} />
              <Route exact path="/connection" element={<ConnectionController />} />
              <Route exact path="/register" element={<RegisterController />} />
              <Route exact path="/space" element={<SpaceController />} />
              <Route exact path="/mission" element={<MissionController />} />
              <Route exact path="/search" element={<SearchController />} />
            </Routes>
          </Container>
        </article>

        <footer className="d-flex justify-content-center align-items-center">
          <h6>BenevOsons - 2025</h6>
        </footer>
        </div>
      </myContext.Provider>
    </>
  );
}
