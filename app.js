import express from "express";
import filmsRouter from "./routes/films.js";
import seancesRouter from "./routes/seances.js";
import reservationsRouter from "./routes/reservations.js";

const app = express();
app.use(express.json());

// Connect the three routers
app.use("/films", filmsRouter);
app.use("/seances", seancesRouter);
app.use("/", reservationsRouter); // its routes already contain /seances/... and /reservations/...

// Any other URL: nothing above matched, so we answer 404
app.use((req, res) => {
    res.status(404).json({ erreur: "Route inconnue" });
});

app.listen(3000, () => console.log("Serveur sur http://localhost:7000"));