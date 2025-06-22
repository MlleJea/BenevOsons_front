import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import RegisterView from "@view/RegisterView";
import { myContext } from "../../index";
import PopupModal from "@components/PopupModal";
import { getBackUrl } from "@utils/backUrl";

export default function RegisterController() {
    const backUrl = `${getBackUrl()}/security`;
    const [, setUser] = useContext(myContext);
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);

    async function register(fields) {
        console.log(fields);
        try {
            const response = await fetch(`${backUrl}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(fields),
            });

            let data;
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                data = await response.json();
            } else {
                data = await response.text();
            }

            if (!response.ok) {
                const errorMsg =
                    typeof data === "object"
                        ? data?.message || `Erreur lors de l'inscription : ${data.message}`
                        : data || "Erreur lors de l'inscription.";
                throw new Error(errorMsg);
            }

            setUser(data);
            setMessage("Inscription réussie, bienvenue sur BenevOsons !");
            setSuccess(true);
            setShowModal(true);
        } catch (err) {
            console.error("Erreur lors de l'inscription :", err.message);
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
            <RegisterView register={register} />
            {showModal && (
                <PopupModal message={message} onClose={handleCloseModal} />
            )}
        </>
    );
}
