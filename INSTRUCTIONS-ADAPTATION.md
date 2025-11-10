# 📝 Instructions pour Adapter index-base.html → index.html

Le fichier `index-base.html` est copié de formation-spirituelle. Voici les modifications à effectuer pour créer `index.html` de La Clinique Spirituelle :

## 🎯 CHANGEMENTS ESSENTIELS

### 1. HEADER (Lignes 35-56)
**AVANT** : `<span class="logo-text">L'école de la foi</span>`
**APRÈS** : `<span class="logo-text">La Clinique Spirituelle</span>`

**Navigation** :
- Remplacer "Le Traitement" → "Le Concept"
- Remplacer "Le Formateur" → "Le Médecin Spirituel"
- Remplacer "S'inscrire" → "Réserver"

### 2. HERO SECTION (Lignes 59-89)

**Badge** :
```html
AVANT: <i class="fas fa-video"></i> 100% EN LIGNE VIA ZOOM
APRÈS: <i class="fas fa-hospital"></i> TRAITEMENT INTENSIF 4 JOURS
```

**Titre principal** :
```html
AVANT: <h1>Vaincre la Peur, Débloquer sa Destinée</h1>
APRÈS: <h1>La Clinique Spirituelle</h1>
      <p style="font-size: 1.8rem; font-weight: 600;">"Venez avec votre problème, repartez avec la solution"</p>
```

**Sous-titre** :
```html
APRÈS: Un traitement spirituel intensif sur 3 jours intensifs (vendredi-dimanche) pour résoudre vos problèmes à la racine. 
       Diagnostic complet, traitement ciblé, guérison durable par la puissance de la Parole de Dieu.
```

**Stats** :
- 25 Ans → **4 Jours Consécutifs**
- 5000+ Vies → **8 Personnes Traitées (Semaine Dernière)**
- 100% Foi → **100% Traitement Personnalisé**

**Badge places** :
```html
APRÈS: Prochaine session : <strong>Mardi prochain</strong> [DATE À CONFIRMER]
```

### 3. PROBLEMS SECTION (Lignes 92-128)

**Titre** :
```html
AVANT: <h2>Vous Souffrez De...</h2>
APRÈS: <h2>Problèmes Traités à La Clinique</h2>
```

**Ajouter ces cartes problèmes** :
- Dépression & Découragement
- Crises Matrimoniales
- Infertilité & Stérilité

**Ton** : Plus médical/urgent (utiliser "traité", "soigner", "diagnostic")

### 4. SOLUTION SECTION (Lignes 130-167)

**Titre** :
```html
APRÈS: <h2>Le Concept de La Clinique Spirituelle</h2>
```

**Contenu principal** :
```
"Comme on va à l'hôpital pour un problème physique, venez à La Clinique Spirituelle pour un problème spirituel"

La Clinique Spirituelle n'est pas une formation, c'est un traitement médical spirituel.
```

**3 features** :
1. **Diagnostic Spirituel** (icône stethoscope)
2. **Traitement Ciblé** (icône pills)
3. **Guérison Durable** (icône heartbeat)

**AJOUTER** : Tableau comparatif Clinique vs Formation (2 colonnes)

### 5. TRAITEMENT/FORMATION SECTION (Lignes 169-296)

**Titre** :
```html
APRÈS: <h2>Le Traitement sur 4 Jours</h2>
```

**Programme** - Remplacer les 3 jours (vendredi-dimanche) par :
- **JOUR 1** : Consultation & Diagnostic
- **JOUR 2** : Traitement Phase 1
- **JOUR 3** : Traitement Phase 2  
- **JOUR 4** : Consolidation & Sortie

**Prix** :
```html
AVANT: 20,000 FCFA
APRÈS: 50,000 FCFA
```

**Durée** :
```html
AVANT: 3 jours (vendredi-dimanche) • 12 heures • Samedis 15h-18h (GMT)
APRÈS: 3 jours intensifs (vendredi-dimanche) • [HORAIRES À DÉFINIR]
```

**Prochaine session** :
```html
APRÈS: Mardi prochain [À CONFIRMER]
```

**AJOUTER après programme** :
```html
<div style="background: gradient violet; padding: 2rem; text-align: center; color: white;">
    <h3>✨ Résultats de la Semaine Dernière</h3>
    <p>8 personnes sont venues avec leurs problèmes. Après 3 jours, elles sont reparties avec leurs solutions.</p>
</div>
```

### 6. FORMATEUR → MÉDECIN SPIRITUEL (Lignes 378-449)

**Titre** :
```html
AVANT: <h2>Votre Formateur</h2>
APRÈS: <h2>Votre Médecin Spirituel</h2>
```

**Sous-titre** :
```html
APRÈS: Médecin Spirituel & Fondateur du Mont Carmel
```

**Description** - RÉÉCRIRE avec ton médical :
```
"Comme un médecin examine les symptômes pour identifier la maladie, Frère Elie discerne les racines spirituelles..."

"La Clinique Spirituelle est née de la demande de personnes ayant besoin d'intervention rapide et intensive..."
```

**Tags expertise** - Ajouter :
- Diagnostic Prophétique
- Rupture de Malédictions

**AJOUTER citation** :
```html
<div style="background: #fff3cd; padding: 1.5rem;">
    <em>"Chaque problème a une solution dans la Parole de Dieu. En 3 jours, nous traitons intensivement 
    ce que vous portez parfois depuis des années."</em>
    - Frère Elie
</div>
```

### 7. FAQ SECTION (Lignes 586-653)

**REMPLACER toutes les questions par** :

#### Q1 : Quelle est la différence entre La Clinique et la Formation ?
**R** : La Clinique = traitement intensif problème spécifique (3 jours, 50K). Formation = apprentissage général (3 jours (vendredi-dimanche), 20K).

#### Q2 : Comment se déroulent les 3 jours ?
**R** : Jour 1: Diagnostic. Jour 2: Traitement. Jour 3: Consolidation. [Horaires à définir]

#### Q3 : Présence physique ou en ligne ?
**R** : [À CONFIRMER AVEC FRÈRE ELIE]

#### Q4 : Le prix de 50,000 FCFA est-il fixe ?
**R** : Oui, tarif unique pour traitement complet sur 3 jours.

#### Q5 : Que faire après le traitement ?
**R** : Suivi WhatsApp, prescription post-traitement, maintenance spirituelle.

#### Q6 : Puis-je faire la clinique ET la formation ?
**R** : Oui ! Complémentaires. Clinique pour urgence, formation pour développement.

### 8. INSCRIPTION → CONSULTATION SECTION (Lignes 656-807)

**Titre** :
```html
AVANT: <h2>Inscrivez-vous Maintenant</h2>
APRÈS: <h2>Réserver Votre Consultation</h2>
```

**Sous-titre** :
```html
APRÈS: Présentez votre problème, recevez votre diagnostic, démarrez votre traitement
```

**FORMULAIRE - AJOUTER ces champs** :

```html
<!-- APRÈS le champ ville -->
<div class="form-group">
    <label for="probleme_specifique">Décrivez votre problème spécifique *</label>
    <textarea id="probleme_specifique" name="probleme_specifique" rows="4" required 
              placeholder="Expliquez en détail le problème pour lequel vous consultez..."></textarea>
</div>

<div class="form-group">
    <label for="niveau_urgence">Niveau d'urgence (1=Faible, 5=URGENT) *</label>
    <select id="niveau_urgence" name="niveau_urgence" required>
        <option value="">Sélectionnez...</option>
        <option value="1">1 - Très faible</option>
        <option value="2">2 - Faible</option>
        <option value="3">3 - Moyenne</option>
        <option value="4">4 - Élevée</option>
        <option value="5">5 - URGENTE</option>
    </select>
</div>

<div class="form-group">
    <label for="depuis_quand">Depuis quand souffrez-vous de ce problème ?</label>
    <input type="text" id="depuis_quand" name="depuis_quand" 
           placeholder="Ex: Depuis 5 ans, Depuis mon enfance...">
</div>
```

**REMPLACER champ "problemes"** :
```html
SUPPRIMER: <select id="problemes"> avec options pré-définies
GARDER: Seulement le textarea "probleme_specifique" ci-dessus
```

**Bouton submit** :
```html
AVANT: Confirmer Mon Inscription
APRÈS: <i class="fas fa-calendar-check"></i> Réserver Ma Consultation
```

**Note formulaire** :
```html
APRÈS: Vous recevrez une confirmation WhatsApp avec les instructions de paiement (50,000 FCFA) 
       et les détails de votre traitement sur 3 jours.
```

### 9. FOOTER (Lignes 971-1005)

**Garder identique** - Juste vérifier les liens sociaux et contacts.

### 10. WhatsApp Button (Lignes 1007-1014)

**Message** :
```html
AVANT: ?text=Bonjour,%20je%20suis%20intéressé(e)%20par%20le%20traitement%20spirituel%20Vaincre%20la%20Peur
APRÈS: ?text=Bonjour,%20je%20voudrais%20consulter%20à%20La%20Clinique%20Spirituelle
```

### 11. SCRIPTS (Lignes 1016-1030)

**SUPPRIMER** (pas de Firebase pour clinique) :
```html
<script src="firebase-config.js"></script>
<script src="inscription-auto.js"></script>
<script src="testimonials-firebase.js"></script>
```

**GARDER** :
```html
<script src="script.js"></script>
```

**REMPLACER l'API call dans le formulaire** :
```javascript
fetch('/api/consultation', {  // Au lieu de /api/inscription
    method: 'POST',
    ...
```

## 📋 CHECKLIST FINALE

- [ ] Tous les "formation" → "clinique"
- [ ] Tous les "apprendre" → "traiter"
- [ ] Tous les "étudiant" → "patient/consultant"
- [ ] Tous les "formateur" → "médecin spirituel"
- [ ] Prix 20,000 → 50,000
- [ ] 3 jours (vendredi-dimanche) → 3 jours intensifs (vendredi-dimanche)
- [ ] Prochaine session: À définir → Mardi prochain [DATE]
- [ ] Formulaire avec problème_specifique, niveau_urgence, depuis_quand
- [ ] Ton médical/urgent partout
- [ ] Tableau comparatif clinique vs formation
- [ ] Citation Frère Elie sur approche clinique
- [ ] Success story "8 personnes la semaine dernière"

## 🎨 VOCABULAIRE À UTILISER

**OUI** : traiter, guérir, consultation, diagnostic, prescription, remède, patient, médecin spirituel, clinique, traitement intensif, problème spécifique, solution rapide

**NON** : former, apprendre, étudier, cours, leçon, module, étudiant, professeur, école, programme long

---

**Temps estimé** : 1-2 heures d'adaptation manuelle
**OU** : Utilisez Cascade pour faire les remplacements automatiquement
