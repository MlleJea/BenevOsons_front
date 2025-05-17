import React, { useContext, useState } from "react";

import ConnectionView from "@view/ConnectionView";
import { myContext } from "../../index";
import PopupModal from "@components/PopupModal";
import { getBackUrl } from "@utils/backUrl";

export default function ConnectionController() {
    const backUrl = `${getBackUrl()}/security`;
    const [, setUser] = useContext(myContext);

    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState("");

    function authenticate(email, password) {
        const requestOptions = {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ email, password })
        };

        fetch(`${backUrl}/authenticate`, requestOptions)
            .then(response => response.ok ? response.json() : Promise.reject(response))
            .then(json => {
                setUser(json);
                console.log("Connexion réussie :", json);
                setMessage("Connexion réussie !");
                setShowModal(true);
            })
            .catch(response => {
                console.error("Erreur d'authentification :", `${response.status} ${response.statusText}`);
                setMessage("Email ou mot de passe incorrect.");
                setShowModal(true);
            });
    }

    return (
        <>
            <ConnectionView authenticate={authenticate} />
            {showModal && (
                <PopupModal message={message} onClose={() => setShowModal(false)} />
            )}
        </>
    );
}
