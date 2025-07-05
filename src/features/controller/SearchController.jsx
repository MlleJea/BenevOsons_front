import React, { useContext, useEffect, useState } from "react";
import { getBackUrl } from "@utils/backUrl";
import SearchView from "@view/SearchView";  
import { myContext } from "../../index";
import { fetchSkillTypes } from "./ReferentielController";
export default function SearchController() {
    const [contextUser] = useContext(myContext);
    
    if (!contextUser || !contextUser.token) {
        return <div>Chargement...</div>;
    }

    const backUrl = getBackUrl();
    const id = contextUser.id;
    const token = contextUser.token;
    const role = contextUser.role;

    // States existants + nouveau state pour les adresses
    const [allMissions, setAllMissions] = useState([]);
    const [skillTypes, setSkillTypes] = useState([]);
    const [userAddresses, setUserAddresses] = useState([]);

    // Récupération des données au chargement
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                // Utilisation du référentiel controller pour les skill types
                const skills = await fetchSkillTypes(token);
                setSkillTypes(skills);

                // Récupération des adresses utilisateur
                const addressResponse = await fetch(`${backUrl}/search/address/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (addressResponse.ok) {
                    const addresses = await addressResponse.json();
                    setUserAddresses(addresses);
                } else {
                    console.warn("Impossible de récupérer les adresses utilisateur");
                    setUserAddresses([]);
                }

            } catch (error) {
                console.error("Erreur lors du chargement des données:", error);
                setUserAddresses([]);
            }
        };

        fetchAllData();
    }, [backUrl, token, id]);

    // Fonction de recherche
    const onSearch = async (searchCriteria) => {

        try {
            const response = await fetch(`${backUrl}/search/filter`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(searchCriteria),
            });

            if (response.ok) {
                const missions = await response.json();
                setAllMissions(missions);
            } else {
                console.error("Erreur de recherche");
                setAllMissions([]);
            }
        } catch (error) {
            console.error("Erreur lors de la recherche:", error);
            setAllMissions([]);
        }
    };

    const getMissionStatus = (startDate, endDate) => {
        const now = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (now < start) return { label: "À venir", color: "success" };
        if (now >= start && now <= end) return { label: "En cours", color: "warning" };
        if (now > end) return { label: "Terminée", color: "danger" };
        return { label: "Inconnu", color: "secondary" };
    };

    return (
        <SearchView
            allMissions={allMissions}
            skillTypes={skillTypes}
            userAddresses={userAddresses}
            getMissionStatus={getMissionStatus}
            onSearch={onSearch}
        />
    );
}