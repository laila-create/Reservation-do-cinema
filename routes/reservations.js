import { Router } from "express";
import { seances, reservations, prochainId, placesRestantes, idValide } from "../data.js";

const router = Router();

// book places
router.post("/seances/:id/reservations", (req, res) => {
    const id = Number(req.params.id);
    if (!idValide(id)) {
        return res.status(400).json({ erreur: "Id invalide" });
    }
    const { nom, nbPlaces } = req.body;

    if (!nom || !Number.isInteger(nbPlaces) || nbPlaces < 1 || nbPlaces > 10) {
        return res.status(400).json({ erreur: "nom et nbPlaces (entier de 1 à 10) sont obligatoires" });
    }
    // the seance must exist -> 404
    const seance = seances.find(s => s.id === id);
    if (!seance) {
        return res.status(404).json({ erreur: "Séance introuvable" });
    }
    // enough places left? if not -> 409
    if (nbPlaces > placesRestantes(seance)) {
        return res.status(409).json({ erreur: "Pas assez de places restantes" });
    }
    // create the reservation
    const nouvelle = { id: prochainId(reservations), seanceId: id, nom, nbPlaces };
    reservations.push(nouvelle);
    res.status(201).json(nouvelle);
});

//  the reservations of one seance
router.get("/seances/:id/reservations", (req, res) => {
    const id = Number(req.params.id);
    if (!idValide(id)) {
        return res.status(400).json({ erreur: "Id invalide" });
    }
    const seance = seances.find(s => s.id === id);
    if (!seance) {
        return res.status(404).json({ erreur: "Séance introuvable" });
    }
    const resDeLaSeance = reservations.filter(r => r.seanceId === id);
    res.status(200).json(resDeLaSeance);
});

// DELETE /reservations/:id   ->  cancel a reservation
// The places become available again by themselves, because placesRestantes

router.delete("/reservations/:id", (req, res) => {
    const id = Number(req.params.id);
    if (!idValide(id)) {
        return res.status(400).json({ erreur: "Id invalide" });
    }
    const position = reservations.findIndex(r => r.id === id);
    if (position === -1) {
        return res.status(404).json({ erreur: "Réservation introuvable" });
    }
    reservations.splice(position, 1);
    res.status(204).send();
});

export default router;