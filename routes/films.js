import { Router } from "express";
import { seances } from "./seances.js";

const router = Router();


export const films = [
{ id: 1, titre: "Les Ailes du désir", duree: 128, genre: "drame" },
{ id: 2, titre: "Coco", duree: 105, genre: "animation" },
{ id: 3, titre: "Inception", duree: 148, genre: "science-fiction" }
];

// GET /films  
router.get("/", (req, res) => {
    const { genre, tri } = req.query;
    let resultat = [...films];   // 

    if (genre) {
        resultat = resultat.filter(f => f.genre === genre);   
    }
    if (tri === "duree") {
        resultat.sort((a, b) => a.duree - b.duree);          
    }
    res.status(200).json(resultat);
});

// GET /films/:id  ->  one film
router.get("/:id", (req, res) => {
    const id = Number(req.params.id);                       
    if (!Number.isInteger(id) || id <= 0) {                  // id must be a positive integer -> 400
        return res.status(400).json({ erreur: "Id invalide" });
    }
    const film = films.find(f => f.id === id);
    if (!film) return res.status(404).json({ erreur: "Film not found" });
    res.status(200).json(film);
});

// GET /films/:id/seances  ->  the seances of one film
router.get("/:id/seances", (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ erreur: "Id invalide" });
    }
    const film = films.find(f => f.id === id);
    if (!film) return res.status(404).json({ erreur: "Film not found" });

    const seancesDuFilm = seances.filter(s => s.filmId === film.id);
    res.status(200).json(seancesDuFilm);
});

// POST /films  ->  create a film
router.post("/", (req, res) => {
    const { titre, genre, duree } = req.body;

    // check the body -> 400
    if (!titre || !genre || typeof duree !== "number" || duree <= 0) {
        return res.status(400).json({ erreur: "titre, genre et duree (> 0) sont obligatoires" });
    }
    // business rule: same title already exists -> 409
    const existe = films.find(f => f.titre === titre);
    if (existe) {
        return res.status(409).json({ erreur: "Un film avec ce titre existe déjà" });
    }
    // next id = id of the last film + 1 (or 1 if the list is empty)
    let nouvelId = 1;
    if (films.length > 0) nouvelId = films[films.length - 1].id + 1;

    const nouveau = { id: nouvelId, titre, duree, genre };
    films.push(nouveau);
    res.status(201).json(nouveau);
});

// delete a film
router.delete("/:id", (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ erreur: "Id invalide" });
    }
    const index = films.findIndex(f => f.id === id);
    if (index === -1) return res.status(404).json({ erreur: "Film not found" });

    const aDesSeances = seances.find(s => s.filmId === id);
    if (aDesSeances) {
        return res.status(409).json({ erreur: "Ce film a encore des séances" });
    }

    films.splice(index, 1);  
    res.status(204).send();  
});

export default router;