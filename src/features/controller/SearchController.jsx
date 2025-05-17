import React, { useState, useEffect } from "react";
import SearchView from "@view/SearchView";
import { fetchSkillTypes } from "@controller/ReferentielController";


export default function SearchController() {
    const [allMissions, setAllMissions] = useState([]);
    const [skillTypes, setSkillTypes] = useState([]);
    const [modalMessage, setModalMessage] = useState("");
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const types = await fetchSkillTypes(); // pas besoin de token ici si API publique
            setSkillTypes(types);
        };
        fetchData();
    }, []);

    const handleSearch = async (filters) => {
        const isEmpty = !filters.city && !filters.skillType && !filters.startDate && !filters.endDate && !filters.distanceKm;
        if (isEmpty) {
            setAllMissions([]);
            setModalMessage("Veuillez remplir au moins un critère de recherche.");
            setShowModal(true);
            return;
        }

        const payload = {
            city: filters.city || null,
            skillIds: filters.skillType ? [parseInt(filters.skillType, 10)] : null,
            startDate: filters.startDate || null,
            endDate: filters.endDate || null,
            latitude: null,
            longitude: null,
            radiusKm: filters.distanceKm ? parseFloat(filters.distanceKm) : null,
        };

        try {
            const response = await fetch("http://localhost:8080/api/rest/search/filter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorText = await response.text();
                setAllMissions([]);
                setModalMessage(errorText || "Erreur inconnue.");
                setShowModal(true);
                return;
            }

            const data = await response.json();

            const filtered = data.filter((mission) => {
                const { label } = getMissionStatus(mission.startDate, mission.endDate);
                return label === "À venir" || label === "En cours";
            });

            if (filtered.length === 0) {
                setModalMessage("Aucune mission ne correspond aux critères.");
                setShowModal(true);
            }

            setAllMissions(filtered);
        } catch (err) {
            console.error(err);
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
            )}        </>
    );
}
