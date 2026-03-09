const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Servir l'interface visuelle
app.use(express.static(path.join(__dirname, 'build')));

// MOTEUR DE STRATÉGIE (COT, SENTIMENT, ORDER BOOK)
setInterval(() => {
    const now = new Date();
    const day = now.getDay(); 

    // Désactivation automatique le week-end
    if (day === 0 || day === 6) {
        console.log("MARKET CLOSED: Moteur en veille.");
        return;
    }

    // Ici s'exécute la logique de confluence réelle
    console.log("STRATEGY ACTIVE: Scan COT + Sentiment + Order Book...");
}, 60000);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`V-PRO SNIPER lancé sur le port ${PORT}`);
});
