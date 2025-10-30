# 🚀 Guide de Déploiement - La Clinique Spirituelle

## Déploiement sur Render.com

### Étape 1 : Créer un compte GitHub (si pas déjà fait)
1. Allez sur https://github.com
2. Créez un compte gratuit

### Étape 2 : Pousser le code sur GitHub

```bash
# Dans le terminal, à la racine du projet
git init
git add .
git commit -m "Initial commit - La Clinique Spirituelle"

# Créez un nouveau repository sur GitHub, puis :
git remote add origin https://github.com/VOTRE-USERNAME/clinique-spirituelle.git
git branch -M main
git push -u origin main
```

### Étape 3 : Déployer sur Render

1. **Créer un compte Render** :
   - Allez sur https://render.com
   - Cliquez "Get Started for Free"
   - Connectez-vous avec GitHub

2. **Créer un nouveau Web Service** :
   - Cliquez "New +" → "Web Service"
   - Sélectionnez votre repository `clinique-spirituelle`
   - Cliquez "Connect"

3. **Configuration** :
   - **Name** : `clinique-spirituelle`
   - **Environment** : `Node`
   - **Build Command** : `npm install`
   - **Start Command** : `npm start`
   - **Plan** : `Free`

4. **Déployer** :
   - Cliquez "Create Web Service"
   - Attendez 2-3 minutes ⏳
   - Votre site sera disponible sur : `https://clinique-spirituelle.onrender.com`

### Étape 4 : Configuration du domaine personnalisé (Optionnel)

1. Dans Render, allez dans "Settings" → "Custom Domain"
2. Ajoutez votre domaine (ex: `lacliniquespirituelle.com`)
3. Configurez les DNS chez votre registrar

---

## ✅ Fonctionnalités après déploiement

- ✅ Site accessible 24/7
- ✅ HTTPS automatique (sécurisé)
- ✅ Base de données SQLite persistante
- ✅ Formulaires de réservation fonctionnels
- ✅ Admin panel accessible
- ✅ Témoignages dynamiques
- ✅ WhatsApp intégré

---

## 🔄 Mises à jour

Pour mettre à jour le site :

```bash
git add .
git commit -m "Description des changements"
git push
```

Render redéploiera automatiquement ! 🎉

---

## 📞 Support

En cas de problème :
- Documentation Render : https://render.com/docs
- Support Render : support@render.com
