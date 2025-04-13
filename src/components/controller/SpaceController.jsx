import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getBackUrl } from "../controller/backUrl";
import SpaceView from "../view/SpaceView";
import { myContext } from "../../index";

export default function SpaceController() {
    const [contextUser] = useContext(myContext);
    const navigate = useNavigate();
    const backUrl = getBackUrl();

    const [userToDisplay, setUserToDisplay] = useState(null);
    const [skillToDisplay, setSkillToDisplay] = useState(null);
    const [skillTypes, setSkillTypes] = useState([]);
    const [grades, setGrades] = useState([]);


    const id = contextUser.id;
    const token = contextUser.token;
    const role = contextUser.role;

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                // 1. User
                const userRes = await fetch(`${backUrl}/space/display/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!userRes.ok) throw new Error("Erreur lors de la récupération de l'utilisateur");
                const userData = await userRes.json();
                console.log(userData);
                setUserToDisplay(userData);

                // 2. Skills
                if (role === "VOLUNTEER") {
                    const skillRes = await fetch(`${backUrl}/space/displaySkill/${id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (skillRes.ok) {
                        const skills = await skillRes.json();
                        setSkillToDisplay(skills);
                    }
                }

                // 3. Skill types
                const typesRes = await fetch(`${backUrl}/referentiel/displaySkillTypes`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (typesRes.ok) {
                    const types = await typesRes.json();
                    setSkillTypes(types);
                }

                // 4. Grades
                const gradesRes = await fetch(`${backUrl}/referentiel/displayGrades`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (gradesRes.ok) {
                    const gradeList = await gradesRes.json();
                    setGrades(gradeList);
                }
            } catch (err) {
                console.error("Erreur lors du chargement des données :", err);
            }
        };

        fetchAllData();
    }, [id, token, role, backUrl]);

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

        return fetch(`${backUrl}/space/update/${id}`, requestOptionsUpdate)
            .then(response => {
                if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
                return response.json();
            })
            .then(json => {
                return { success: true, message: "Modifications enregistrées", data: json };
            })
            .catch(error => {
                console.error("Erreur update :", error);
                return { success: false, message: "Erreur lors de la modification" };
            });
    };

    const addSkill = (skillToAdd) => {
        console.log(skillToAdd);
        const requestOptionAddSkill = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(skillToAdd),
        };

        return fetch(`${backUrl}/space/addSkill${id}`, requestOptionAddSkill)
            .then(response => {
                if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);
                return response.json();
            })
            .then(data => {
                setSkillToDisplay(prev => [...(prev || []), data]);
                return { success: true, data };
            })
            .catch(error => {
                console.error("Erreur addSkill :", error);
                return { success: false };
            });
    };

    return (
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
    );
}
