// DATA FILE: the lists live here, plus 3 small helper functions.
// "export" lets the other files import them.

export const films = [
{ id: 1, titre: "Les Ailes du désir", duree: 128, genre: "drame" },
{ id: 2, titre: "Coco", duree: 105, genre: "animation" },
{ id: 3, titre: "Inception", duree: 148, genre: "science-fiction" }
];

export const seances = [
{ id: 1, filmId: 1, date: "2026-12-05", heure: "18:00", salle: "A", places: 40 },
{ id: 2, filmId: 2, date: "2026-12-05", heure: "14:00", salle: "B", places: 3 },
{ id: 3, filmId: 3, date: "2026-12-06", heure: "20:30", salle: "A", places: 40 }
];

export const reservations = [];

// If the list is empty, the first id is 1.
export function prochainId(liste) {
    if (liste.length === 0) {
        return 1;
    }
    const dernier = liste[liste.length - 1];
    return dernier.id + 1;
}

// places of the seance - all the places already reserved for this seance.
export function placesRestantes(seance) {
    let total = 0; // total of places already reserved

    for (let i = 0; i < reservations.length; i++) {
        const r = reservations[i];
        if (r.seanceId === seance.id) {   // only the reservations of THIS seance
            total = total + r.nbPlaces;
        }
    }
    return seance.places - total;
}


export function idValide(id) {
    return Number.isInteger(id) && id > 0;
}