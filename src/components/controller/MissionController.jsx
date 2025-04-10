import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getBackUrl } from "../controller/backUrl";
import { myContext } from "../../index";
import MissionView from "../view/MissionView"

export default function MissionController() {
    const backUrl = getBackUrl();
    const [user, setUser] = useContext(myContext); 
    const [missionToDisplay, setMissionToDisplay] = useState(null);
    
    const id = user.id;
    const token = user.token;

    useEffect(() => 
        {const fetchAllData = async () => {
        try {
            // Mission List
            const missionRes = await fetch(`${backUrl}/mission/displayMyMissions/${id}`, 
                {headers: {Authorization: `Bearer ${token}`},}
            );
            if (!missionRes.ok) throw new Error("Erreur lors de la récupération des missions");
            const missionToDisplay = await missionRes.json();
            setMissionToDisplay(missionToDisplay);

            // SkillTypes
           const typesRes = await fetch(`${backUrl}/space/displaySkillTypes`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (typesRes.ok) {
                const types = await typesRes.json();
                setSkillTypes(types);
            }

        } catch (err) {
            console.error ("Erreur lors du chargement des données")
        }};
        fetchAllData();
    }
)

const addMission = (missionToAdd) => {
    const requestOptionAddMission = {
        method: "POST",
        headers: {
            "Content-Type" : "application/json",
            Authorization: `Bearer ${token}`,
        },
        body : JSON.stringify(missionToAdd),
    };

    return fetch(`${backUrl}/mission/add/${id}`, requestOptionAddMission)
    .then(response => {
        if(!response.ok) throw new Error(`Erreur : ${response.status}`);
        return response.json();
    })
    .then (data => { 
    setMissionToDisplay(prev => [...(prev || []),data]);
    return {sucess : true,data};
    })
    .catch(err => {
        console.error("Erreur addMission : ", err);
        return {success : false};
    });
}

    return (<MissionView
        addMission={addMission}
        missionsToDisplay = {missionToDisplay}
    ></MissionView>);
}
