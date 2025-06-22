import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import ConnectionView from "@view/ConnectionView";
import { myContext } from "../../index";
import PopupModal from "@components/PopupModal";
import { getBackUrl } from "@utils/backUrl";

export default function ConnectionController() {
    const backUrl = `${getBackUrl()}/security`;
    const [, setUser] = useContext(myContext);
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState("");

    async function authenticate(email, password) {
        console.log(email,password);
        try {
            const response = await fetch(`${backUrl}/authenticate`, {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.message || "Email ou mot de passe incorrect.");
            }

            setUser(data);
            navigate("/welcome");
        } catch (err) {
            console.error("Erreur d'authentification :", err.message);
            setMessage(err.message);
            setShowModal(true);
        }
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
