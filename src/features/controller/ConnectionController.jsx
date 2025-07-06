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
    const [success, setSuccess] = useState(false);

    async function authenticate(email, password) {
        try {
            const response = await fetch(`${backUrl}/authenticate`, {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                let errorMessage = "Erreur lors de la connexion.";
                
                try {
                    const contentType = response.headers.get("content-type");
                    if (contentType && contentType.includes("application/json")) {
                        const errorData = await response.json();
                        errorMessage = errorData?.message || errorData || errorMessage;
                    } else {
                        const errorText = await response.text();
                        errorMessage = errorText || errorMessage;
                    }
                } catch (parseError) {
                    console.error("Erreur lors du parsing de l'erreur:", parseError);
                }
                
                throw new Error(errorMessage);
            }

            const data = await response.json();
            setUser(data);
            setMessage("Connexion réussie, bienvenue sur BénévOsons !");
            setSuccess(true);
            setShowModal(true);
            
        } catch (err) {
            console.error("Erreur d'authentification :", err.message);
            setMessage(err.message);
            setSuccess(false);
            setShowModal(true);
        }
    }

    const handleCloseModal = () => {
        setShowModal(false);
        if (success) {
            navigate("/welcome");
        }
    };

    return (
        <>
            <ConnectionView authenticate={authenticate} />
            {showModal && (
                <PopupModal 
                    message={message} 
                    onClose={handleCloseModal} 
                />
            )}
        </>
    );
}