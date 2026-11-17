import { Router } from "express";
import { films } from "./films.js";                 // to check that the film exists
import { reservations } from "./reservations.js";   // to count the reserved seats

const router = Router();

// The seances data lives here
export const seances = [
{ id: 1, filmId: 1, date: "2026-12-05", heure: "18:00", salle: "A", places: 40 },
{ id: 2, filmId: 2, date: "2026-12-05", heure: "14:00", salle: "B", places: 3 },
{ id: 3, filmId: 3, date: "2026-12-06", heure: "20:30", salle: "A", places: 40 }
];

// Remaining seats of a seance = places - seats already reserved.
export function placesRestantes(seance) {
    let reservees = 0;
    for (const r of reservations) {
        if (r.seanceId === seance.id) {
            reservees = reservees + r.nbPlaces;
        }
    }
    return seance.places - reservees;
}

// POST /seances  ->  create a seance
router.post("/", (req, res) => {
    const { filmId, date, heure, salle, places } = req.body;


    if (!date || !heure || !salle || !Number.isInteger(places) || places < 1) {
        return res.status(400).json({ erreur: "date, heure, salle et places (entier >= 1) sont obligatoires" });
    }

    const film = films.find(f => f.id === Number(filmId));
    if (!film) return res.status(404).json({ erreur: "Film not found" });


    let nouvelId = 1;
    if (seances.length > 0) nouvelId = seances[seances.length - 1].id + 1;

    const nouvelle = { id: nouvelId, filmId: film.id, date, heure, salle, places };
    seances.push(nouvelle);
    res.status(201).json(nouvelle);
});

// GET /seances/:id  ->  one seance + the field placesRestantes
router.get("/:id", (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ erreur: "Id invalid" });
    }
    const seance = seances.find(s => s.id === id);
    if (!seance) return res.status(404).json({ erreur: "Seance not found" });

    // {...seance} copies the seance, then we add one more field
    res.status(200).json({ ...seance, placesRestantes: placesRestantes(seance) });
});

export default router;