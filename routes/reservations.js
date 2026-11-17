import { Router } from "express";
import { seances, placesRestantes } from "./seances.js"; // to find the seance and count the seats left

const router = Router();

// The reservations data lives here
export const reservations = [];

// POST /seances/:id/reservations  ->  book seats
router.post("/seances/:id/reservations", (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ erreur: "Id invalide" });
    }
    const { nom, nbPlaces } = req.body;

    if (!nom || !Number.isInteger(nbPlaces) || nbPlaces < 1 || nbPlaces > 10) {
        return res.status(400).json({ erreur: "nom et nbPlaces (entier de 1 à 10) sont obligatoires" });
    }

    const seance = seances.find(s => s.id === id);
    if (!seance) return res.status(404).json({ erreur: "Séance introuvable" });

    if (nbPlaces > placesRestantes(seance)) {
        return res.status(409).json({ erreur: "Pas assez de places restantes" });
    }

    let nouvelId = 1;
    if (reservations.length > 0) nouvelId = reservations[reservations.length - 1].id + 1;

    const nouvelle = { id: nouvelId, seanceId: seance.id, nom, nbPlaces };
    reservations.push(nouvelle);
    res.status(201).json(nouvelle);
});

// GET /seances/:id/reservations  ->  the reservations of one seance
router.get("/seances/:id/reservations", (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ erreur: "Id invalide" });
    }
    const seance = seances.find(s => s.id === id);
    if (!seance) return res.status(404).json({ erreur: "SSeance not found" });

    const resDeLaSeance = reservations.filter(r => r.seanceId === seance.id);
    res.status(200).json(resDeLaSeance);
});


router.delete("/reservations/:id", (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ erreur: "Id invalide" });
    }
    const index = reservations.findIndex(r => r.id === id);
    if (index === -1) return res.status(404).json({ erreur: "Reservation not found" });

    reservations.splice(index, 1);
    res.status(204).send();
});

export default router;