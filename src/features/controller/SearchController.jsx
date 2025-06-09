import React, { useState, useEffect, useContext } from "react";
import SearchView from "@view/SearchView";
import { fetchSkillTypes } from "@controller/ReferentielController";
import PopupModal from "@components/PopupModal";
import { myContext } from "../../index";

export default function SearchController() {
    const [allMissions, setAllMissions] = useState([]);
    const [skillTypes, setSkillTypes] = useState([]);
    const [modalMessage, setModalMessage] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [user] = useContext(myContext);
    const token = user.token;

    useEffect(() => {
        const fetchData = async () => {
            const types = await fetchSkillTypes();
            setSkillTypes(types);
        };
        fetchData();
    }, []);

    const handleSearch = async (searchCriteria) => {
        console.log("Critères reçus dans SearchController:", searchCriteria);
        
        // Vérification qu'au moins un critère est renseigné
        const hasSkillType = searchCriteria.skillTypeIds && searchCriteria.skillTypeIds.length > 0;
        const hasCity = searchCriteria.city && searchCriteria.city.trim() !== "";
        const hasAddress = searchCriteria.referenceAddress && searchCriteria.referenceAddress.trim() !== "";
        const hasStartDate = searchCriteria.startDate && searchCriteria.startDate !== "";
        const hasEndDate = searchCriteria.endDate && searchCriteria.endDate !== "";
        const hasDistance = searchCriteria.distanceKm && searchCriteria.distanceKm > 0;

        if (!hasSkillType && !hasCity && !hasAddress && !hasStartDate && !hasEndDate && !hasDistance) {
            setAllMissions([]);
            setModalMessage("Veuillez remplir au moins un critère de recherche.");
            setShowModal(true);
            return;
        }

        // Préparation du payload pour l'API backend
        const payload = {
            city: searchCriteria.city || null,
            skillTypeIds: searchCriteria.skillTypeIds || [], 
            startDate: searchCriteria.startDate || null,
            endDate: searchCriteria.endDate || null,
            userLatitude: null, 
            userLongitude: null, 
            radiusKm: searchCriteria.distanceKm || null,
        };

        console.log("Payload envoyé au backend:", payload);

        try {
            const response = await fetch("http://localhost:8080/api/rest/search/filter", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Erreur réponse:", errorText);
                setAllMissions([]);
                setModalMessage(errorText || "Erreur inconnue.");
                setShowModal(true);
                return;
            }

            const data = await response.json();
            console.log("Données reçues du backend:", data);

            // Filtrage des missions selon leur statut
            const filtered = data.filter((mission) => {
                const { label } = getMissionStatus(mission.period.startDate, mission.period.endDate);
                return label === "À venir" || label === "En cours";
            });

            if (filtered.length === 0) {
                setModalMessage("Aucune mission ne correspond aux critères.");
                setShowModal(true);
            }

            setAllMissions(filtered);
        } catch (err) {
            console.error("Erreur lors de la requête:", err);
            setModalMessage("Erreur lors de la requête.");
            setShowModal(true);
        }
    };

    const getMissionStatus = (start, end) => {
        const now = new Date();
        const startDate = new Date(start);
        const endDate = new Date(end);

        if (now < startDate) return { label: "À venir", color: "secondary" };
        if (now > endDate) return { label: "Terminée", color: "danger" };
        return { label: "En cours", color: "success" };
    };

    return (
        <>
            <SearchView
                allMissions={allMissions}
                skillTypes={skillTypes}
                onSearch={handleSearch}
                getMissionStatus={getMissionStatus}
            />
            {showModal && (
                <PopupModal
                    message={modalMessage}
                    onClose={() => setShowModal(false)}
                />
            )}
        </>
    );
}