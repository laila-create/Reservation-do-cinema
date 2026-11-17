import { Router } from "express";
import { films, seances, prochainId, placesRestantes, idValide } from "../data.js";

const router = Router();

//  create a seance
router.post("/", (req, res) => {
    const { filmId, date, heure, salle, places } = req.body;

    // check the body -> 400
    // Number.isInteger(places) is true only for whole numbers (1, 2, 3...)
    if (!date || !heure || !salle || !Number.isInteger(places) || places < 1) {
        return res.status(400).json({ erreur: "date, heure, salle et places (entier >= 1) sont obligatoires" });
    }
    // the film must exist -> 404
    const film = films.find(f => f.id === filmId);
    if (!film) {
        return res.status(404).json({ erreur: "Film introuvable" });
    }
    // create the seance
    const nouvelle = { id: prochainId(seances), filmId, date, heure, salle, places };
    seances.push(nouvelle);
    res.status(201).json(nouvelle);
});

// GET /seances/:id   ->  one seance, with one more field: placesRestantes
router.get("/:id", (req, res) => {
    const id = Number(req.params.id);
    if (!idValide(id)) {
        return res.status(400).json({ erreur: "Id invalide" });
    }
    const seance = seances.find(s => s.id === id);
    if (!seance) {
        return res.status(404).json({ erreur: "Séance introuvable" });
    }
    //the fields of the seance + placesRestantes
    const reponse = {
        id: seance.id,
        filmId: seance.filmId,
        date: seance.date,
        heure: seance.heure,
        salle: seance.salle,
        places: seance.places,
        placesRestantes: placesRestantes(seance)
    };
    res.status(200).json(reponse);
});

export default router;