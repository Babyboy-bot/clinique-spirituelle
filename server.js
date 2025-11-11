const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir les fichiers statiques avec les bons content-types
app.use(express.static(path.join(__dirname), {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.xml')) {
            res.setHeader('Content-Type', 'application/xml');
        } else if (filePath.endsWith('.txt')) {
            res.setHeader('Content-Type', 'text/plain');
        }
    }
}));

// Database setup
const db = new sqlite3.Database('./consultations.db', (err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données:', err);
    } else {
        console.log('✅ Base de données connectée');
        createTable();
    }
});

// Create consultations table (adapté pour la clinique)
function createTable() {
    const sql = `
        CREATE TABLE IF NOT EXISTS consultations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            prenom TEXT NOT NULL,
            nom TEXT NOT NULL,
            email TEXT,
            telephone TEXT NOT NULL,
            pays TEXT NOT NULL,
            ville TEXT NOT NULL,
            probleme_specifique TEXT NOT NULL,
            niveau_urgence INTEGER DEFAULT 3,
            depuis_quand TEXT,
            message TEXT,
            date_consultation DATETIME DEFAULT CURRENT_TIMESTAMP,
            statut TEXT DEFAULT 'en_attente',
            session_id INTEGER,
            FOREIGN KEY (session_id) REFERENCES sessions(id)
        )
    `;
    
    db.run(sql, (err) => {
        if (err) {
            console.error('Erreur lors de la création de la table:', err);
        } else {
            console.log('✅ Table consultations créée/vérifiée');
        }
    });
    
    // Créer table témoignages
    const sqlTemoignages = `
        CREATE TABLE IF NOT EXISTS temoignages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nom TEXT NOT NULL,
            localisation TEXT,
            probleme_traite TEXT NOT NULL,
            temoignage TEXT NOT NULL,
            note INTEGER DEFAULT 5,
            type_session TEXT DEFAULT 'presentiel',
            date_soumission DATETIME DEFAULT CURRENT_TIMESTAMP,
            statut TEXT DEFAULT 'en_attente',
            valide_par TEXT,
            date_validation DATETIME
        )
    `;
    
    db.run(sqlTemoignages, (err) => {
        if (err) {
            console.error('Erreur lors de la création de la table témoignages:', err);
        } else {
            console.log('✅ Table témoignages créée/vérifiée');
        }
    });
    
    // Créer table sessions
    const sqlSessions = `
        CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date_debut TEXT NOT NULL,
            heure TEXT NOT NULL,
            places_total INTEGER DEFAULT 10,
            places_reservees INTEGER DEFAULT 0,
            statut TEXT DEFAULT 'ouverte',
            type_session TEXT DEFAULT 'en_ligne',
            description TEXT,
            date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
            date_modification DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `;
    
    db.run(sqlSessions, (err) => {
        if (err) {
            console.error('Erreur lors de la création de la table sessions:', err);
        } else {
            console.log('✅ Table sessions créée/vérifiée');
            
            // Vérifier s'il y a une session active, sinon en créer une par défaut
            db.get('SELECT COUNT(*) as count FROM sessions WHERE statut = "ouverte"', [], (err, row) => {
                if (!err && row.count === 0) {
                    db.run(`INSERT INTO sessions (date_debut, heure, places_total, statut, type_session, description) 
                            VALUES ('2025-11-04', '18:00', 10, 'ouverte', 'en_ligne', 'Session intensive de traitement spirituel - 12 heures (4h x 3 jours) (vendredi-dimanche)')`,
                        (err) => {
                            if (!err) {
                                console.log('✅ Session par défaut créée (4 Nov 2025)');
                            }
                        }
                    );
                }
            });
        }
    });
}

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'votre-email@gmail.com',
        pass: process.env.EMAIL_PASSWORD || 'votre-mot-de-passe'
    }
});

// Routes

// Home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API: Create consultation
app.post('/api/consultation', (req, res) => {
    const { prenom, nom, email, telephone, pays, ville, probleme_specifique, niveau_urgence, depuis_quand, message, session_id } = req.body;
    
    // Validation
    if (!prenom || !nom || !telephone || !pays || !ville || !probleme_specifique) {
        return res.status(400).json({ 
            error: 'Tous les champs obligatoires doivent être remplis' 
        });
    }
    
    // Insert into database
    const sql = `
        INSERT INTO consultations (prenom, nom, email, telephone, pays, ville, probleme_specifique, niveau_urgence, depuis_quand, message, session_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.run(sql, [prenom, nom, email || '', telephone, pays, ville, probleme_specifique, niveau_urgence || 3, depuis_quand || '', message || '', session_id || null], function(err) {
        if (err) {
            console.error('Erreur lors de l\'insertion:', err);
            return res.status(500).json({ error: 'Erreur lors de la réservation' });
        }
        
        const consultationId = this.lastID;
        
        // Send confirmation email
        if (email) {
            sendConfirmationEmail(email, prenom, nom);
        }
        
        // Send WhatsApp confirmation
        sendWhatsAppConfirmation(telephone, prenom, nom, probleme_specifique);
        
        // Send notification to admin
        sendAdminNotification({
            id: consultationId,
            prenom,
            nom,
            email,
            telephone,
            pays,
            ville,
            probleme_specifique,
            niveau_urgence,
            depuis_quand,
            message
        });
        
        res.status(201).json({ 
            message: 'Consultation réservée avec succès',
            id: consultationId
        });
    });
});

// API: Get all consultations (pour l'administrateur)
app.get('/api/consultations', (req, res) => {
    const sql = 'SELECT * FROM consultations ORDER BY date_consultation DESC';
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Erreur lors de la récupération:', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        res.json(rows);
    });
});

// API: Get consultation by ID
app.get('/api/consultations/:id', (req, res) => {
    const sql = 'SELECT * FROM consultations WHERE id = ?';
    
    db.get(sql, [req.params.id], (err, row) => {
        if (err) {
            console.error('Erreur:', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        if (!row) {
            return res.status(404).json({ error: 'Consultation non trouvée' });
        }
        res.json(row);
    });
});

// API: Update consultation status
app.put('/api/consultations/:id/status', (req, res) => {
    const { statut } = req.body;
    const sql = 'UPDATE consultations SET statut = ? WHERE id = ?';
    
    db.run(sql, [statut, req.params.id], function(err) {
        if (err) {
            console.error('Erreur:', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        res.json({ message: 'Statut mis à jour', changes: this.changes });
    });
});

// API: Delete consultation
app.delete('/api/consultations/:id', (req, res) => {
    const sql = 'DELETE FROM consultations WHERE id = ?';
    
    db.run(sql, [req.params.id], function(err) {
        if (err) {
            console.error('Erreur:', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        res.json({ message: 'Consultation supprimée', changes: this.changes });
    });
});

// ============ SESSIONS API ============

// API: Get session active (session actuelle + prochaine)
app.get('/api/session/active', (req, res) => {
    // Récupérer toutes les sessions ouvertes futures ou actuelles
    const sql = `SELECT * FROM sessions 
                 WHERE statut = 'ouverte' 
                 AND date(date_debut) >= date('now', '-3 days')
                 ORDER BY date_debut ASC 
                 LIMIT 2`;
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Erreur:', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        
        if (!rows || rows.length === 0) {
            return res.json({ 
                exists: false,
                message: 'Aucune session ouverte pour le moment'
            });
        }
        
        const now = new Date();
        const sessions = rows.map(row => ({
            ...row,
            places_disponibles: row.places_total - row.places_reservees,
            est_complete: row.places_reservees >= row.places_total,
            est_en_cours: new Date(row.date_debut) <= now && new Date(row.date_debut) >= new Date(now.getTime() - 3*24*60*60*1000),
            est_future: new Date(row.date_debut) > now
        }));
        
        // Identifier session actuelle (en cours) et prochaine (future)
        const sessionActuelle = sessions.find(s => s.est_en_cours);
        const sessionProchaine = sessions.find(s => s.est_future);
        
        // Si pas de session actuelle, la première devient la "prochaine"
        if (!sessionActuelle && sessions.length > 0) {
            return res.json({
                exists: true,
                sessionActuelle: null,
                sessionProchaine: sessions[0]
            });
        }
        
        res.json({
            exists: true,
            sessionActuelle: sessionActuelle || null,
            sessionProchaine: sessionProchaine || null
        });
    });
});

// API: Get all sessions (admin)
app.get('/api/sessions', (req, res) => {
    const sql = 'SELECT * FROM sessions ORDER BY date_debut DESC';
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Erreur:', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        res.json(rows);
    });
});

// API: Create session (admin)
app.post('/api/sessions', (req, res) => {
    const { date_debut, heure, places_total, type_session, description } = req.body;
    
    const sql = `INSERT INTO sessions (date_debut, heure, places_total, type_session, description, statut) 
                 VALUES (?, ?, ?, ?, ?, 'ouverte')`;
    
    db.run(sql, [date_debut, heure, places_total || 10, type_session || 'en_ligne', description], function(err) {
        if (err) {
            console.error('Erreur:', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        res.json({ 
            message: 'Session créée avec succès', 
            id: this.lastID 
        });
    });
});

// API: Update session (admin)
app.put('/api/sessions/:id', (req, res) => {
    const { date_debut, heure, places_total, statut, type_session, description } = req.body;
    
    const sql = `UPDATE sessions 
                 SET date_debut = ?, heure = ?, places_total = ?, statut = ?, 
                     type_session = ?, description = ?, date_modification = CURRENT_TIMESTAMP
                 WHERE id = ?`;
    
    db.run(sql, [date_debut, heure, places_total, statut, type_session, description, req.params.id], function(err) {
        if (err) {
            console.error('Erreur:', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        res.json({ message: 'Session mise à jour', changes: this.changes });
    });
});

// API: Delete session (admin)
app.delete('/api/sessions/:id', (req, res) => {
    const sql = 'DELETE FROM sessions WHERE id = ?';
    
    db.run(sql, [req.params.id], function(err) {
        if (err) {
            console.error('Erreur:', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        res.json({ message: 'Session supprimée', changes: this.changes });
    });
});

// API: Réserver une place (incrémente le compteur)
app.post('/api/sessions/:id/reserver', (req, res) => {
    // Vérifier d'abord si des places sont disponibles
    db.get('SELECT * FROM sessions WHERE id = ?', [req.params.id], (err, session) => {
        if (err) {
            console.error('Erreur:', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        
        if (!session) {
            return res.status(404).json({ error: 'Session introuvable' });
        }
        
        if (session.places_reservees >= session.places_total) {
            return res.status(400).json({ error: 'Session complète' });
        }
        
        // Incrémenter le compteur
        const sql = 'UPDATE sessions SET places_reservees = places_reservees + 1 WHERE id = ?';
        
        db.run(sql, [req.params.id], function(err) {
            if (err) {
                console.error('Erreur:', err);
                return res.status(500).json({ error: 'Erreur serveur' });
            }
            res.json({ 
                message: 'Place réservée', 
                places_restantes: session.places_total - session.places_reservees - 1 
            });
        });
    });
});

// ============ TÉMOIGNAGES API ============

// API: Get all témoignages
app.get('/api/temoignages', (req, res) => {
    const sql = 'SELECT * FROM temoignages ORDER BY date_soumission DESC';
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Erreur:', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        res.json(rows);
    });
});

// API: Get témoignages validés seulement (pour affichage public)
app.get('/api/temoignages/valides', (req, res) => {
    const sql = 'SELECT * FROM temoignages WHERE statut = "valide" ORDER BY date_validation DESC LIMIT 10';
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Erreur:', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        res.json(rows);
    });
});

// API: Submit témoignage
app.post('/api/temoignages', (req, res) => {
    const { nom, localisation, probleme_traite, temoignage, note, type_session } = req.body;
    
    const sql = `INSERT INTO temoignages (nom, localisation, probleme_traite, temoignage, note, type_session, statut) 
                 VALUES (?, ?, ?, ?, ?, ?, 'en_attente')`;
    
    db.run(sql, [nom, localisation, probleme_traite, temoignage, note || 5, type_session || 'presentiel'], function(err) {
        if (err) {
            console.error('Erreur:', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        res.json({ 
            message: 'Témoignage soumis avec succès. Il sera visible après validation.', 
            id: this.lastID 
        });
    });
});

// API: Valider témoignage
app.put('/api/temoignages/:id/valider', (req, res) => {
    const sql = `UPDATE temoignages 
                 SET statut = 'valide', date_validation = CURRENT_TIMESTAMP 
                 WHERE id = ?`;
    
    db.run(sql, [req.params.id], function(err) {
        if (err) {
            console.error('Erreur:', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        res.json({ message: 'Témoignage validé', changes: this.changes });
    });
});

// API: Rejeter témoignage
app.put('/api/temoignages/:id/rejeter', (req, res) => {
    const sql = 'UPDATE temoignages SET statut = "rejete" WHERE id = ?';
    
    db.run(sql, [req.params.id], function(err) {
        if (err) {
            console.error('Erreur:', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        res.json({ message: 'Témoignage rejeté', changes: this.changes });
    });
});

// API: Delete témoignage
app.delete('/api/temoignages/:id', (req, res) => {
    const sql = 'DELETE FROM temoignages WHERE id = ?';
    
    db.run(sql, [req.params.id], function(err) {
        if (err) {
            console.error('Erreur:', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        res.json({ message: 'Témoignage supprimé', changes: this.changes });
    });
});

// API: Get statistics
app.get('/api/stats', (req, res) => {
    const queries = {
        total: 'SELECT COUNT(*) as count FROM consultations',
        parProbleme: 'SELECT probleme_specifique, COUNT(*) as count FROM consultations GROUP BY probleme_specifique',
        parUrgence: 'SELECT niveau_urgence, COUNT(*) as count FROM consultations GROUP BY niveau_urgence ORDER BY niveau_urgence DESC',
        parPays: 'SELECT pays, COUNT(*) as count FROM consultations GROUP BY pays ORDER BY count DESC',
        recent: 'SELECT COUNT(*) as count FROM consultations WHERE date_consultation > datetime("now", "-7 days")'
    };
    
    const stats = {};
    let completed = 0;
    
    Object.keys(queries).forEach(key => {
        db.all(queries[key], [], (err, rows) => {
            if (!err) {
                stats[key] = key === 'total' || key === 'recent' ? rows[0].count : rows;
            }
            completed++;
            
            if (completed === Object.keys(queries).length) {
                res.json(stats);
            }
        });
    });
});

// Admin dashboard page
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Functions

function sendConfirmationEmail(email, prenom, nom) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: '✅ Consultation Confirmée - La Clinique Spirituelle Mont Carmel',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2C3E50;">🙏 Bienvenue à La Clinique Spirituelle, ${prenom} ${nom}!</h2>
                <p>Nous avons bien reçu votre demande de consultation.</p>
                
                <div style="background: #ECF0F1; padding: 20px; border-radius: 10px; margin: 20px 0;">
                    <h3 style="color: #E74C3C;">📋 Prochaines Étapes:</h3>
                    <ol>
                        <li>Effectuer le paiement de 50,000 FCFA via Wave ou Orange Money</li>
                        <li>Envoyer la preuve de paiement sur WhatsApp</li>
                        <li>Recevoir la confirmation et les détails du traitement</li>
                        <li>Préparer votre cœur pour recevoir votre délivrance</li>
                    </ol>
                </div>
                
                <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #F39C12;">
                    <h3 style="color: #856404;">💰 Modalités de Paiement</h3>
                    <p><strong>Montant:</strong> 50,000 FCFA</p>
                    
                    <p><strong>📱 Wave:</strong> ${process.env.WAVE_NUMBER || '[NUMÉRO À DEMANDER]'}</p>
                    <p><strong>📱 Orange Money:</strong> ${process.env.ORANGE_MONEY_NUMBER || '[NUMÉRO À DEMANDER]'}</p>
                    
                    <p style="margin-top: 15px;"><strong>Instructions:</strong></p>
                    <ol>
                        <li>Effectuez le transfert au numéro ci-dessus</li>
                        <li>Prenez une capture d'écran de la confirmation</li>
                        <li>Envoyez-la sur WhatsApp au: <strong>+225 0704764443</strong></li>
                        <li>Mentionnez votre nom complet dans le message</li>
                    </ol>
                </div>
                
                <div style="background: #d4edda; padding: 20px; border-radius: 10px; margin: 20px 0;">
                    <h3 style="color: #155724;">📅 Informations Traitement</h3>
                    <p><strong>Format:</strong> 3 jours (vendredi-dimanche) de traitement intensif</p>
                    <p><strong>Durée:</strong> 4h par jour</p>
                    <p><strong>Prochaine session:</strong> Mardi 4 Novembre 2024</p>
                    <p><strong>Prix:</strong> 50,000 FCFA</p>
                </div>
                
                <p style="color: #7F8C8D; font-size: 14px;">
                    Vous recevrez également ces informations par WhatsApp. Pour toute question, contactez-nous.
                </p>
                
                <p style="color: #E74C3C; font-weight: bold; text-align: center; margin-top: 20px;">
                    "Venez avec votre problème, repartez avec la solution"
                </p>
                
                <hr style="border: none; border-top: 1px solid #ECF0F1; margin: 20px 0;">
                <p style="color: #7F8C8D; font-size: 12px; text-align: center;">
                    La Clinique Spirituelle - Communauté du Mont Carmel<br>
                    Frère Elie Kassi Philippe<br>
                    📧 contact@montcarmel.org | 📱 WhatsApp: ${process.env.WHATSAPP_SUPPORT_NUMBER || '[À CONFIGURER]'}
                </p>
            </div>
        `
    };
    
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error('Erreur envoi email:', err);
        } else {
            console.log('Email envoyé:', info.response);
        }
    });
}

function sendWhatsAppConfirmation(telephone, prenom, nom, probleme) {
    const cleanPhone = telephone.replace(/\s+/g, '').replace(/^\+/, '');
    
    const message = `🙏 *Bienvenue à La Clinique Spirituelle, ${prenom} ${nom}!*

✅ Votre demande de consultation a été enregistrée.

🏥 *VOTRE PROBLÈME:* ${probleme}

📋 *PROCHAINES ÉTAPES:*

1️⃣ *Effectuer le paiement*
💰 Montant: *50,000 FCFA*

📱 *WAVE:* ${process.env.WAVE_NUMBER || '[Contactez-nous pour le numéro]'}
📱 *ORANGE MONEY:* ${process.env.ORANGE_MONEY_NUMBER || '[Contactez-nous pour le numéro]'}

2️⃣ *Envoyer la preuve*
• Prenez une capture d'écran de la confirmation
• Envoyez-la sur ce numéro WhatsApp
• Mentionnez votre nom: ${prenom} ${nom}

3️⃣ *Recevoir votre confirmation*
Après validation du paiement:
✓ Détails du traitement
✓ Date et horaires précis
✓ Instructions de préparation
✓ Groupe WhatsApp des participants

📅 *INFORMATIONS TRAITEMENT:*
• Format: 3 jours (vendredi-dimanche)
• Durée: 1h30 par jour
• Prochaine session: Mardi 4 Novembre 2024
• Type: Traitement spirituel intensif personnalisé

❓ *QUESTIONS?*
Répondez à ce message, nous sommes là pour vous aider!

_"Venez avec votre problème, repartez avec la solution"_ 🙏

---
*La Clinique Spirituelle - Mont Carmel*
8 personnes traitées la semaine dernière`;

    // Envoi WhatsApp (même logique que formation-spirituelle)
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
        const twilioClient = require('twilio')(
            process.env.TWILIO_ACCOUNT_SID,
            process.env.TWILIO_AUTH_TOKEN
        );
        
        twilioClient.messages
            .create({
                body: message,
                from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
                to: `whatsapp:+${cleanPhone}`
            })
            .then(msg => console.log('✅ WhatsApp envoyé via Twilio:', msg.sid))
            .catch(err => console.error('❌ Erreur WhatsApp Twilio:', err));
    }
    else if (process.env.WHATSAPP_API_URL && process.env.WHATSAPP_API_TOKEN) {
        axios.post(process.env.WHATSAPP_API_URL, {
            phone: cleanPhone,
            message: message
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => console.log('✅ WhatsApp envoyé:', response.data))
        .catch(err => console.error('❌ Erreur WhatsApp API:', err.message));
    }
    else {
        console.log('\n📱 MESSAGE WHATSAPP À ENVOYER:');
        console.log('Destinataire:', telephone);
        console.log('Message:\n', message);
        console.log('\n⚠️ Pour activer l\'envoi automatique, configurez .env\n');
    }
}

function sendAdminNotification(data) {
    const urgenceLabel = ['', 'Très faible', 'Faible', 'Moyenne', 'Élevée', 'URGENTE'][data.niveau_urgence] || 'Non définie';
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL || 'admin@montcarmel.org',
        subject: `🚨 Nouvelle Consultation - Clinique Spirituelle (Urgence: ${urgenceLabel})`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2C3E50;">Nouvelle Consultation #${data.id}</h2>
                
                <div style="background: ${data.niveau_urgence >= 4 ? '#ffebee' : '#ECF0F1'}; padding: 20px; border-radius: 10px; border-left: 4px solid ${data.niveau_urgence >= 4 ? '#c62828' : '#2196f3'};">
                    <p><strong>Nom:</strong> ${data.prenom} ${data.nom}</p>
                    <p><strong>Email:</strong> ${data.email || 'Non fourni'}</p>
                    <p><strong>Téléphone:</strong> ${data.telephone}</p>
                    <p><strong>Pays:</strong> ${data.pays}</p>
                    <p><strong>Ville:</strong> ${data.ville}</p>
                    <hr>
                    <p><strong>Problème spécifique:</strong> ${data.probleme_specifique}</p>
                    <p><strong>Niveau d'urgence:</strong> ${data.niveau_urgence}/5 - ${urgenceLabel}</p>
                    <p><strong>Depuis quand:</strong> ${data.depuis_quand || 'Non précisé'}</p>
                    ${data.message ? `<p><strong>Message:</strong> ${data.message}</p>` : ''}
                </div>
                
                <div style="background: #fff3cd; padding: 15px; border-radius: 10px; margin: 20px 0;">
                    <h3 style="color: #856404;">⚠️ Action Requise</h3>
                    <p>Cette personne attend les instructions de paiement (50,000 FCFA).</p>
                    <p>Assurez-vous que le message WhatsApp a été envoyé avec succès.</p>
                    ${data.niveau_urgence >= 4 ? '<p style="color: #c62828; font-weight: bold;">⚠️ CAS URGENT - Priorité élevée</p>' : ''}
                </div>
                
                <p style="margin-top: 20px;">
                    <a href="http://localhost:3001/admin" style="background: #E74C3C; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                        Voir dans le tableau de bord
                    </a>
                </p>
            </div>
        `
    };
    
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error('Erreur notification admin:', err);
        } else {
            console.log('Notification admin envoyée:', info.response);
        }
    });
}

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Serveur La Clinique Spirituelle démarré sur http://localhost:${PORT}`);
    console.log(`📊 Admin dashboard: http://localhost:${PORT}/admin`);
    console.log(`\n💡 NOTE: Port différent (3001) pour éviter conflit avec formation-spirituelle (3000)\n`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Erreur fermeture DB:', err);
        } else {
            console.log('✅ Base de données fermée');
        }
        process.exit(0);
    });
});
