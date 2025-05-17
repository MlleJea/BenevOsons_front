import React, { useContext, useState, useEffect } from "react";
import { getBackUrl } from "@utils/backUrl";
import { myContext } from "../../index";
import MissionView from "@view/MissionView";
import { fetchSkillTypes } from "@controller/ReferentielController";
import PopupModal from "@components/PopupModal";

export default function MissionController() {
    const backUrl = getBackUrl();
    const [user] = useContext(myContext);
    const [missionToDisplay, setMissionToDisplay] = useState(null);
    const [skillTypes, setSkillTypes] = useState([]);
    const [modalMessage, setModalMessage] = useState("");
    const [showModal, setShowModal] = useState(false);

    const { id, token } = user;

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const missionRes = await fetch(`${backUrl}/mission/displayMyMissions/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!missionRes.ok) throw new Error("Erreur lors de la récupération des missions");
                const missionData = await missionRes.json();
                setMissionToDisplay(missionData);

                const types = await fetchSkillTypes(token);
                setSkillTypes(types);

            } catch (err) {
                console.error("Erreur lors du chargement des données :", err);
                setModalMessage("Erreur de chargement des missions.");
                setShowModal(true);
            }
        };

        fetchAllData();
    }, [id, token]);

    const addMission = (missionToAdd) => {
        const requestOptionAddMission = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(missionToAdd),
        };

        return fetch(`${backUrl}/mission/add/${id}`, requestOptionAddMission)
            .then((response) => {
                if (!response.ok) throw new Error(`Erreur : ${response.status}`);
                return response.json();
            })
            .then((data) => {
                setMissionToDisplay((prev) => [...(prev || []), data]);
                setModalMessage("Mission ajoutée avec succès !");
                setShowModal(true);
                return { success: true, data };
            })
            .catch((err) => {
                console.error("Erreur addMission :", err);
                setModalMessage("Erreur lors de l'ajout de la mission.");
                setShowModal(true);
                return { success: false };
            });
    };

    return (
        <>
            <MissionView
                addMission={addMission}
                missionsToDisplay={missionToDisplay}
                skillTypes={skillTypes}
            />
            {showModal && (
                <PopupModal message={modalMessage} onClose={() => setShowModal(false)} />
            )}
        </>
    );
}
