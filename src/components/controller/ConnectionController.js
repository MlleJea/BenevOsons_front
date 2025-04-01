import React from "react";
import { useContext } from "react";

import { getBackUrl } from "../controller/backUrl";
import ConnectionView from "../view/ConnectionView";
import { myContext } from "../../index";

export default function ConnectionController() {

    const backUrl = `${getBackUrl()}/security`

    const [, setUser] = useContext(myContext)

    function authenticate(login, password) {
        const requestOptions = {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ login: login, password: password })
        }

        fetch(`${backUrl}/authenticate`, requestOptions)
            .then(response => response.ok ? response.json() : Promise.reject(response))
            .then(json => setUser(json))
            .catch(response => {
                console.error(
                    "Une erreur s'est produite lors de l'authentification",
                    `${response.status} ${response.statusText}`);
            });
    }

    return (
        <ConnectionView authenticate={(login,password) => authenticate(login,password)}/>
    );
}