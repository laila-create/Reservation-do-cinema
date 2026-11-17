import { Router } from "express";
import { films, seances, prochainId, idValide } from "../data.js";

const router = Router();

// GET /films   (also ?genre=animation and/or ?tri=duree)
router.get("/", (req, res) => {
    const { genre, tri } = req.query;   // the values after the "?" in the URL
    let resultat = films.slice();       // slice() makes a COPY of the list

    if (genre) {
        resultat = resultat.filter(f => f.genre === genre); 
        // keep only the films of this genre
    }
    if (tri === "duree") {
        resultat.sort((a, b) => a.duree - b.duree); 
        // shortest first (a smaller duree goes first)
    }
    res.status(200).json(resultat);
});

// GET /films/:id   ->  one film
router.get("/:id", (req, res) => {
    const id = Number(req.params.id);
    if (!idValide(id)) {                                     
        return res.status(400).json({ erreur: "Id invalide" });
    }
    const film = films.find(f => f.id === id);
    if (!film) {                                               
        return res.status(404).json({ erreur: "Film introuvable" });
    }
    res.status(200).json(film);
});

// GET /films => the seances of one film
router.get("/:id/seances", (req, res) => {
    const id = Number(req.params.id);
    if (!idValide(id)) {
        return res.status(400).json({ erreur: "Id invalide" });
    }
    const film = films.find(f => f.id === id);
    if (!film) {
        return res.status(404).json({ erreur: "Film introuvable" });
    }
    const seancesDuFilm = seances.filter(s => s.filmId === id);
    res.status(200).json(seancesDuFilm);
});

//create a film
router.post("/", (req, res) => {
    const { titre, genre, duree } = req.body;

    // typeof duree gives the type of the value: we want a number, and bigger than 0
    if (!titre || !genre || typeof duree !== "number" || duree <= 0) {
        return res.status(400).json({ erreur: "titre, genre et duree (> 0) sont obligatoires" });
    }
    // 
    const existe = films.find(f => f.titre === titre);
    if (existe) {
        return res.status(409).json({ erreur: "Un film avec ce titre existe déjà" });
    }
    //  everything is fine: create the film
    const nouveau = { id: prochainId(films), titre, duree, genre };
    films.push(nouveau);
    res.status(201).json(nouveau);
});

// delete a film
router.delete("/:id", (req, res) => {
    const id = Number(req.params.id);
    if (!idValide(id)) {
        return res.status(400).json({ erreur: "Id invalide" });
    }
    // findIndex gives the POSITION of the film in the list
    const position = films.findIndex(f => f.id === id);
    if (position === -1) {
        return res.status(404).json({ erreur: "Film introuvable" });
    }
    // forbidden if the film still has seances -> 409
    const aDesSeances = seances.find(s => s.filmId === id);
    if (aDesSeances) {
        return res.status(409).json({ erreur: "Ce film a encore des séances" });
    }
    films.splice(position, 1);   // splice removes 1 item at this position
    res.status(204).send();      // 204 = done, nothing to send back
});

export default router;