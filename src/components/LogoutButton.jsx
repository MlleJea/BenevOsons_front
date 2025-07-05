import React, { useContext, useState } from "react";
import { Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { myContext } from "../index";
import PopupModal from "./PopupModal";

export default function LogoutButton() {
  const [, setUser] = useContext(myContext);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const logout = (e) => {
    e.preventDefault();
    navigate("/welcome");
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setTimeout(() => {
      localStorage.clear();
      setUser(null);
    }, 0);
  };

  return (
    <>
      <Nav.Link href="#" onClick={logout}>
        <i className="fa fa-unlock me-2 navbar-icon"></i> Déconnexion
      </Nav.Link>

      {showModal && (
        <PopupModal
          message="Vous êtes bien déconnecté, à bientôt sur BénévOsons !"
          onClose={handleClose}
        />
      )}
    </>
  );
}
