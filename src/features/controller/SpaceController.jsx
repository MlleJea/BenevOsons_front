import React, { useContext, useState, useEffect } from "react";
import { getBackUrl } from "@utils/backUrl";
import SpaceView from "@view/SpaceView";
import { myContext } from "../../index";
import { fetchGrades, fetchSkillTypes } from "@controller/ReferentielController";
import PopupModal from "@components/PopupModal";

export default function SpaceController() {
    const [contextUser] = useContext(myContext);
    const backUrl = getBackUrl();

    const [userToDisplay, setUserToDisplay] = useState(null);
    const [skillToDisplay, setSkillToDisplay] = useState(null);
    const [skillTypes, setSkillTypes] = useState([]);
    const [grades, setGrades] = useState([]);

    const [modalMessage, setModalMessage] = useState("");
    const [showModal, setShowModal] = useState(false);

    const id = contextUser.id || null;
    const token = contextUser.token;
    const role = contextUser.role;

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const userRes = await fetch(`${backUrl}/space/display/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!userRes.ok) throw new Error("Erreur utilisateur");
                const userData = await userRes.json();
                setUserToDisplay(userData);

                if (role === "VOLUNTEER") {
                    const skillRes = await fetch(`${backUrl}/space/displaySkill/${id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (skillRes.ok) {
                        const skills = await skillRes.json();
                        setSkillToDisplay(skills);
                    }
                }

                const types = await fetchSkillTypes(token);
                setSkillTypes(types);

                const gradeList = await fetchGrades(token);
                setGrades(gradeList);
            } catch (err) {
                console.error("Erreur chargement data :", err);
                setModalMessage("Erreur lors du chargement des données.");
                setShowModal(true);
            }
        };

        fetchAllData();
    }, [id, token, role]);

    const updateUser = async (updatedFields) => {
    const requestOptionsUpdate = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedFields),
    };

    try {
        const response = await fetch(`${backUrl}/space/update/${id}`, requestOptionsUpdate);

        let data;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) throw new Error(data);

        setModalMessage("Modifications enregistrées !");
        setShowModal(true);
        return { success: true, message: data };
    } catch (error) {
        console.error("Erreur update :", error);
        setModalMessage("Erreur lors de la modification.");
        setShowModal(true);
        return { success: false };
    }
};

    const addSkill = (skillToAdd) => {
        const requestOptionAddSkill = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(skillToAdd),
        };

        return fetch(`${backUrl}/space/addSkill/${id}`, requestOptionAddSkill)
            .then(response => {
                if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);
                return response.json();
            })
            .then(data => {
                setSkillToDisplay(prev => [...(prev || []), data]);
                setModalMessage("Compétence ajoutée avec succès !");
                setShowModal(true);
                return { success: true, data };
            })
            .catch(error => {
                console.error("Erreur addSkill :", error);
                setModalMessage("Erreur lors de l'ajout de la compétence.");
                setShowModal(true);
                return { success: false };
            });
    };

    return (
        <>
            <SpaceView
                user={userToDisplay}
                role={role}
                updateUser={updateUser}
                skills={skillToDisplay}
                addSkill={addSkill}
                skillTypes={skillTypes}
                grades={grades}
                id={id}
            />
            {showModal && (
                <PopupModal message={modalMessage} onClose={() => setShowModal(false)} />
            )}
        </>
    );
}
