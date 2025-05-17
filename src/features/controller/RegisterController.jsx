import React, { useContext, useState } from "react";

import { useNavigate } from "react-router-dom";
import { getBackUrl } from "@utils/backUrl";
import RegisterView from "@view/RegisterView";
import { myContext } from "../../index";

import PopupModal from "@components/PopupModal";


export default function RegisterController() {

    const backUrl = `${getBackUrl()}/security`; 

    const [, setUser] = useContext(myContext);
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState("");

    function register(fields) {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(fields),
        };

        fetch(`${backUrl}/register`, requestOptions)
            .then(response => response.ok ? response.json() : Promise.reject(response))
            .then(json => {
                setUser(json); 
                console.log("Inscription réussie :", json);
                setMessage("Inscription réussie, bienvenue sur BenevOsons !");
                setShowModal(true);
                console.log(showModal);
            })
            .catch(response => {
                console.error(
                    "Une erreur s'est produite lors de l'inscription",
                    `${response.status} ${response.statusText}`
                );
                setMessage(`${response.statusText}`);
                setShowModal(true);
            });
    }
    const handleCloseModal = () => {
        setShowModal(false);
        navigate("/welcome")
    }

    return(
        <>
            <RegisterView register={register} />
            {showModal && (
                <PopupModal message={message} onClose={handleCloseModal} />
            )}
        </>
    );
}
