import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getBackUrl } from "../controller/backUrl";
import SpaceView from "../view/SpaceView";
import { myContext } from "../../index";

export default function SpaceController() {
    const backUrl = `${getBackUrl()}`;
    const [user, setUser] = useContext(myContext);
    const [userToDisplay, setUserToDisplay] = useState(null);
    const navigate = useNavigate();

    const id = user.id;
    const token = user.token;

    useEffect(() => {
        fetch(`${backUrl}/space/display/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => response.ok ? response.json() : Promise.reject(response))
        .then(json => {
            setUserToDisplay(json);
            console.log(json);
        })
        .catch((error) => console.error("Erreur lors de la récupération des données : ", error));
    }, []);

    const updateUser = (updatedFields) => {
        setUserToDisplay(prev => ({ ...prev, ...updatedFields }));

        const requestOptionsUpdate = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatedFields),
        };

        fetch(`${backUrl}/space/update/${id}`, requestOptionsUpdate)
            .then(response => response.ok ? response.json() : Promise.reject(response))
            .then(json => {
                setUser(json);
                console.log("Modification(s) réussie :", json);
                navigate("/space");
            })
            .catch(response => {
                console.error(
                    "Une erreur s'est produite lors de la modification",
                    `${response.status} ${response.statusText}`
                );
            });
    };

    if (!userToDisplay) return <div>Chargement...</div>;

    return (
        <SpaceView user={userToDisplay} updateUser={updateUser} />
    );
}
