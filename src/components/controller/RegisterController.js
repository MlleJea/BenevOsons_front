import React, { useContext } from "react";

import { useNavigate } from "react-router-dom";
import { getBackUrl } from "../controller/backUrl";
import RegisterView from "../view/RegisterView";
import { myContext } from "../../index";

export default function RegisterController() {
    const backUrl = `${getBackUrl()}/api`; 
    const [, setUser] = useContext(myContext);
    const navigate = useNavigate();

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
                navigate("/welcome"); 
            })
            .catch(response => {
                console.error(
                    "Une erreur s'est produite lors de l'inscription",
                    `${response.status} ${response.statusText}`
                );
            });
    }

    return <RegisterView register={register} />;
}
