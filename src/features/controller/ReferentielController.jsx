import { getBackUrl } from "@utils/backUrl";

const backUrl = getBackUrl();

export async function fetchSkillTypes(token) {
    try {
        const res = await fetch(`${backUrl}/referentiel/displaySkillTypes`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Erreur lors de la récupération des types de compétences");
        return await res.json();
    } catch (err) {
        console.error("Erreur fetchSkillTypes:", err);
        return [];
    }
}

export async function fetchGrades(token) {
    try {
        const res = await fetch(`${backUrl}/referentiel/displayGrades`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Erreur lors de la récupération des grades");
        return await res.json();
    } catch (err) {
        console.error("Erreur fetchGrades:", err);
        return [];
    }
}
