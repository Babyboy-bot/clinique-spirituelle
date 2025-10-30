// ===== CHARGEMENT DES TÉMOIGNAGES VALIDÉS =====
async function loadValidatedTestimonials() {
    try {
        const response = await fetch('/api/temoignages/valides');
        const temoignages = await response.json();
        
        console.log('Témoignages reçus:', temoignages);
        
        if (temoignages.length > 0) {
            displayTestimonials(temoignages);
            displayTestimonialsInModal(temoignages);
        } else {
            console.warn('Aucun témoignage validé trouvé');
            showNoTestimonialsMessage();
        }
    } catch (error) {
        console.error('Erreur chargement témoignages:', error);
    }
}

function showNoTestimonialsMessage() {
    const carouselTrack = document.querySelector('.carousel-testimonials');
    if (carouselTrack) {
        carouselTrack.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: white;">
                <i class="fas fa-comments" style="font-size: 3rem; opacity: 0.3; margin-bottom: 1rem;"></i>
                <p style="font-size: 1.1rem; opacity: 0.8;">Aucun témoignage pour le moment</p>
                <p style="font-size: 0.9rem; opacity: 0.6; margin-top: 0.5rem;">Soyez le premier à partager votre expérience !</p>
            </div>
        `;
    }
    
    const dynamicTestimonials = document.getElementById('dynamicTestimonials');
    if (dynamicTestimonials) {
        dynamicTestimonials.innerHTML = `
            <div style="text-align: center; padding: 3rem; background: #f5f7fa; border-radius: 15px;">
                <i class="fas fa-comments" style="font-size: 3rem; color: #999; margin-bottom: 1rem;"></i>
                <p style="font-size: 1.1rem; color: #666;">Aucun témoignage validé pour le moment</p>
                <p style="font-size: 0.9rem; color: #999; margin-top: 0.5rem;">Les témoignages apparaîtront ici après validation par l'administrateur</p>
            </div>
        `;
    }
}

function displayTestimonialsInModal(temoignages) {
    const dynamicTestimonials = document.getElementById('dynamicTestimonials');
    if (!dynamicTestimonials) return;
    
    dynamicTestimonials.innerHTML = temoignages.map(t => `
        <div style="background: linear-gradient(135deg, #f5f7fa 0%, #e8eaf6 100%); padding: 2rem; border-radius: 15px; border-left: 4px solid #667eea; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; color: white; font-size: 1.2rem;">
                    ${t.nom.charAt(0)}${t.nom.split(' ')[1] ? t.nom.split(' ')[1].charAt(0) : ''}
                </div>
                <div style="flex: 1;">
                    <strong style="color: var(--primary-color); display: block; font-size: 1.1rem;">${t.nom}</strong>
                    <span style="color: var(--text-light); font-size: 0.9rem;">
                        ${t.localisation || 'Non spécifié'}
                    </span>
                </div>
                <div style="color: #FFD700; font-size: 1.2rem;">
                    ${'⭐'.repeat(t.note || 5)}
                </div>
            </div>
            <div style="background: white; padding: 1.5rem; border-radius: 10px; margin-bottom: 1rem;">
                <p style="color: var(--text-dark); font-size: 1rem; line-height: 1.8; font-style: italic; margin: 0;">
                    "${t.temoignage}"
                </p>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <span style="background: #e8f5e9; color: #2e7d32; padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.85rem; font-weight: 600;">
                        <i class="fas fa-check-circle"></i> ${t.probleme_traite}
                    </span>
                    <span style="background: ${t.type_session === 'en_ligne' ? '#e3f2fd' : '#fff3e0'}; color: ${t.type_session === 'en_ligne' ? '#1565c0' : '#e65100'}; padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.85rem; font-weight: 600;">
                        ${t.type_session === 'en_ligne' ? '📹 En ligne' : '🏛️ Présentiel'}
                    </span>
                </div>
                <span style="color: var(--text-light); font-size: 0.85rem;">
                    <i class="fas fa-calendar"></i> ${new Date(t.date_validation || t.date_soumission).toLocaleDateString('fr-FR')}
                </span>
            </div>
        </div>
    `).join('');
    
    // Mettre à jour le compteur dans le modal
    const totalTestimonials = document.getElementById('totalTestimonials');
    if (totalTestimonials) {
        totalTestimonials.textContent = temoignages.length;
    }
}

function displayTestimonials(temoignages) {
    // Trouver le carousel
    const carouselTrack = document.querySelector('.carousel-testimonials');
    if (!carouselTrack) {
        console.error('Carousel testimonials introuvable !');
        return;
    }
    
    console.log(`Chargement de ${temoignages.length} témoignages...`);
    
    // Vider et remplir avec les témoignages réels
    carouselTrack.innerHTML = temoignages.map((t, index) => `
        <div class="carousel-item ${index === 0 ? 'active' : ''}" 
             style="min-width: 100%; background: linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%); 
                    padding: 3rem; border-radius: 20px; color: white; position: relative;">
            <i class="fas fa-quote-left" style="position: absolute; top: 1.5rem; left: 2rem; font-size: 3rem; opacity: 0.2;"></i>
            <p style="font-size: 1.1rem; line-height: 1.9; margin-bottom: 2rem; position: relative; z-index: 1;">
                ${t.temoignage}
            </p>
            <div style="display: flex; align-items: center; gap: 1rem; margin-top: 2rem;">
                <div style="width: 50px; height: 50px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #667eea; font-size: 1.2rem;">
                    ${t.nom.charAt(0)}${t.nom.split(' ')[1] ? t.nom.split(' ')[1].charAt(0) : ''}
                </div>
                <div>
                    <strong style="color: white; display: block; font-size: 1.1rem;">${t.nom}</strong>
                    <span style="color: rgba(255,255,255,0.8); font-size: 0.9rem;">
                        ${t.localisation || 'Non spécifié'} • ${t.probleme_traite}
                    </span>
                    <div style="margin-top: 0.3rem;">
                        <span style="background: rgba(255,255,255,0.2); padding: 0.2rem 0.6rem; border-radius: 10px; font-size: 0.75rem; color: white;">
                            ${t.type_session === 'en_ligne' ? '📹 En ligne' : '🏛️ Présentiel'}
                        </span>
                    </div>
                    <div style="color: #FFD700; margin-top: 0.3rem; font-size: 1.1rem;">
                        ${'⭐'.repeat(t.note || 5)}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    // Mettre à jour les indicateurs
    const indicators = document.querySelector('.carousel-indicators');
    if (indicators && temoignages.length > 0) {
        indicators.innerHTML = temoignages.map((_, index) => `
            <span class="indicator ${index === 0 ? 'active' : ''}" 
                  data-slide="${index}" 
                  style="width: 10px; height: 10px; background: ${index === 0 ? 'white' : 'rgba(255,255,255,0.4)'}; border-radius: 50%; cursor: pointer; transition: all 0.3s;">
            </span>
        `).join('');
        
        // Réattacher les événements des indicateurs
        document.querySelectorAll('.indicator').forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                showSlide(index);
                resetCarouselInterval();
            });
        });
    }
    
    // Mettre à jour le compteur
    const totalTestimonialsBox = document.getElementById('totalTestimonialsBox');
    if (totalTestimonialsBox) {
        totalTestimonialsBox.textContent = temoignages.length;
    }
    
    // Réinitialiser le carousel
    setTimeout(() => {
        currentSlide = 0;
        const newSlides = document.querySelectorAll('.carousel-item');
        if (newSlides.length > 0) {
            showSlide(0);
            if (typeof startCarousel === 'function') {
                resetCarouselInterval();
            }
        }
    }, 100);
}

// ===== GESTION DES SESSIONS ET PLACES =====
let sessionActuelle = null;
let sessionProchaine = null;
let sessionPourReservation = null; // La session pour laquelle on réserve

async function loadActiveSession() {
    try {
        const response = await fetch('/api/session/active');
        const data = await response.json();
        
        if (data.exists) {
            sessionActuelle = data.sessionActuelle;
            sessionProchaine = data.sessionProchaine;
            
            // Déterminer pour quelle session on réserve
            if (sessionProchaine && (!sessionActuelle || sessionActuelle.est_complete)) {
                // Réserver pour la prochaine si actuelle n'existe pas ou est complète
                sessionPourReservation = sessionProchaine;
            } else if (sessionActuelle && !sessionActuelle.est_complete) {
                // Réserver pour l'actuelle si elle a des places
                sessionPourReservation = sessionActuelle;
            } else if (sessionProchaine) {
                sessionPourReservation = sessionProchaine;
            }
            
            updateSessionUI(sessionActuelle, sessionProchaine);
        } else {
            showNoSessionMessage();
        }
    } catch (error) {
        console.error('Erreur chargement session:', error);
    }
}

function updateSessionUI(sessionActuelle, sessionProchaine) {
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formatted = date.toLocaleDateString('fr-FR', options);
        return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    };
    
    const sessionDateBadge = document.getElementById('sessionDateBadge');
    const placesBadge = document.getElementById('placesBadge');
    
    // SCÉNARIO 1: Session actuelle en cours + prochaine existe
    if (sessionActuelle && sessionActuelle.est_en_cours && sessionProchaine) {
        const placesProchaine = sessionProchaine.places_disponibles;
        let couleur = placesProchaine <= 5 ? '#e74c3c' : placesProchaine <= 10 ? '#f39c12' : '#27ae60';
        
        if (sessionDateBadge) {
            sessionDateBadge.innerHTML = `<i class="fas fa-play-circle"></i> Session actuelle : <strong>${formatDate(sessionActuelle.date_debut)} (EN COURS)</strong>`;
            sessionDateBadge.style.background = 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)';
        }
        
        if (placesBadge) {
            placesBadge.innerHTML = `
                <i class="fas fa-calendar-plus"></i> 
                Réservez pour le <strong>${formatDate(sessionProchaine.date_debut)}</strong> • 
                <strong style="color: white; font-size: 1.2em;">${placesProchaine}/${sessionProchaine.places_total}</strong> places
            `;
            placesBadge.style.background = 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)';
        }
        
        showReservationMessage('actuelle_en_cours', sessionActuelle, sessionProchaine);
    }
    // SCÉNARIO 2: Session actuelle complète + prochaine existe
    else if (sessionActuelle && sessionActuelle.est_complete && sessionProchaine) {
        const placesProchaine = sessionProchaine.places_disponibles;
        let couleur = placesProchaine <= 5 ? '#e74c3c' : placesProchaine <= 10 ? '#f39c12' : '#27ae60';
        
        if (sessionDateBadge) {
            sessionDateBadge.innerHTML = `<i class="fas fa-times-circle"></i> Session du <strong>${formatDate(sessionActuelle.date_debut)} COMPLÈTE</strong>`;
            sessionDateBadge.style.background = 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)';
        }
        
        if (placesBadge) {
            placesBadge.innerHTML = `
                <i class="fas fa-calendar-plus"></i> 
                Réservez pour le <strong>${formatDate(sessionProchaine.date_debut)}</strong> • 
                <strong style="color: white; font-size: 1.2em;">${placesProchaine}/${sessionProchaine.places_total}</strong> places
            `;
            placesBadge.style.background = 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)';
        }
        
        showReservationMessage('actuelle_complete', sessionActuelle, sessionProchaine);
    }
    // SCÉNARIO 3: Session actuelle avec places (pas encore commencée ou juste commencée)
    else if (sessionActuelle && !sessionActuelle.est_complete) {
        const placesRestantes = sessionActuelle.places_disponibles;
        let couleur = placesRestantes <= 5 ? '#e74c3c' : placesRestantes <= 10 ? '#f39c12' : '#27ae60';
        
        if (sessionDateBadge) {
            sessionDateBadge.innerHTML = `<i class="fas fa-calendar-check"></i> Prochaine session : <strong>${formatDate(sessionActuelle.date_debut)}</strong>`;
            sessionDateBadge.style.background = '';
        }
        
        if (placesBadge) {
            placesBadge.innerHTML = `
                <i class="fas fa-users"></i> 
                <strong style="color: white; font-size: 1.2em;">${placesRestantes}</strong> 
                places disponibles sur ${sessionActuelle.places_total}
            `;
            placesBadge.style.background = '';
        }
    }
    // SCÉNARIO 4: Seulement prochaine session (pas d'actuelle)
    else if (sessionProchaine) {
        const placesRestantes = sessionProchaine.places_disponibles;
        let couleur = placesRestantes <= 5 ? '#e74c3c' : placesRestantes <= 10 ? '#f39c12' : '#27ae60';
        
        if (sessionDateBadge) {
            sessionDateBadge.innerHTML = `<i class="fas fa-calendar-check"></i> Prochaine session : <strong>${formatDate(sessionProchaine.date_debut)}</strong>`;
            sessionDateBadge.style.background = '';
        }
        
        if (placesBadge) {
            placesBadge.innerHTML = `
                <i class="fas fa-users"></i> 
                <strong style="color: white; font-size: 1.2em;">${placesRestantes}</strong> 
                places disponibles sur ${sessionProchaine.places_total}
            `;
            placesBadge.style.background = '';
        }
    }
}

function showReservationMessage(scenario, sessionActuelle, sessionProchaine) {
    const formContainer = document.querySelector('.inscription-content');
    if (!formContainer) return;
    
    // Ajouter message avant le formulaire
    let existingMessage = document.getElementById('sessionInfoMessage');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).charAt(0).toUpperCase() + date.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).slice(1);
    };
    
    let message = '';
    
    if (scenario === 'actuelle_en_cours') {
        message = `
            <div id="sessionInfoMessage" style="background: linear-gradient(135deg, #fff3cd 0%, #ffe0b2 100%); padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem; border-left: 4px solid #f39c12;">
                <p style="margin: 0; font-size: 1.05rem; line-height: 1.8; color: #333;">
                    <i class="fas fa-info-circle"></i> <strong>Session du ${formatDate(sessionActuelle.date_debut)} en cours</strong><br>
                    Vous pouvez réserver votre place pour la <strong>prochaine session du ${formatDate(sessionProchaine.date_debut)}</strong> !
                </p>
            </div>
        `;
    } else if (scenario === 'actuelle_complete') {
        message = `
            <div id="sessionInfoMessage" style="background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%); padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem; border-left: 4px solid #e74c3c;">
                <p style="margin: 0; font-size: 1.05rem; line-height: 1.8; color: #333;">
                    <i class="fas fa-exclamation-circle"></i> <strong>Session du ${formatDate(sessionActuelle.date_debut)} COMPLÈTE</strong><br>
                    Réservez dès maintenant pour la <strong>prochaine session du ${formatDate(sessionProchaine.date_debut)}</strong> !
                </p>
            </div>
        `;
    }
    
    if (message) {
        formContainer.insertAdjacentHTML('afterbegin', message);
    }
}

function updatePlacesDisplay(session) {
    const placesBadge = document.getElementById('placesBadge');
    if (!placesBadge || !session) return;
    
    const placesRestantes = session.places_disponibles;
    let couleur = '#27ae60';
    
    if (placesRestantes <= 5) {
        couleur = '#e74c3c';
    } else if (placesRestantes <= 10) {
        couleur = '#f39c12';
    }
    
    if (session.est_complete) {
        placesBadge.innerHTML = `<i class="fas fa-times-circle"></i> <strong>SESSION COMPLÈTE</strong>`;
        placesBadge.style.background = 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)';
    } else {
        placesBadge.innerHTML = `
            <i class="fas fa-users"></i> 
            <strong style="color: white; font-size: 1.2em;">${placesRestantes}</strong> 
            places disponibles sur ${session.places_total}
        `;
        placesBadge.style.background = '';
    }
}

function showNoSessionMessage() {
    const sessionDateBadge = document.getElementById('sessionDateBadge');
    if (sessionDateBadge) {
        sessionDateBadge.innerHTML = `<i class="fas fa-info-circle"></i> Aucune session programmée pour le moment`;
        sessionDateBadge.style.background = 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)';
    }
    
    const placesBadge = document.getElementById('placesBadge');
    if (placesBadge) {
        placesBadge.innerHTML = `<i class="fas fa-ban"></i> Aucune place disponible`;
        placesBadge.style.background = 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)';
    }
    
    const formContainer = document.querySelector('.inscription-content');
    if (formContainer) {
        formContainer.innerHTML = `
            <div style="text-align: center; padding: 3rem; background: linear-gradient(135deg, #ecf0f1 0%, #bdc3c7 100%); border-radius: 15px;">
                <i class="fas fa-calendar-times" style="font-size: 4rem; color: #95a5a6; margin-bottom: 1rem;"></i>
                <h3 style="color: #7f8c8d; margin-bottom: 1rem;">Aucune Session Programmée</h3>
                <p style="font-size: 1.1rem; color: #555; margin-bottom: 2rem;">
                    Il n'y a pas de session ouverte pour le moment.
                </p>
                <p style="color: #666;">
                    <i class="fas fa-phone"></i> Pour être informé de la prochaine session, contactez-nous sur WhatsApp.
                </p>
            </div>
        `;
    }
}

// ===== FORMULAIRE DE CONSULTATION =====
const consultationForm = document.getElementById('consultationForm');

if (consultationForm) {
    consultationForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Vérifier qu'une session est disponible
        if (!sessionPourReservation) {
            alert('❌ Aucune session disponible pour le moment. Veuillez réessayer plus tard.');
            return;
        }
        
        // Récupérer les données du formulaire
        const formData = {
            prenom: document.getElementById('prenom').value,
            nom: document.getElementById('nom').value,
            email: document.getElementById('email').value,
            telephone: document.getElementById('phone_prefix').value + document.getElementById('telephone').value,
            pays: document.getElementById('pays').value,
            ville: document.getElementById('ville').value,
            probleme_specifique: document.getElementById('probleme_specifique').value,
            niveau_urgence: document.getElementById('niveau_urgence').value,
            depuis_quand: document.getElementById('depuis_quand').value,
            message: document.getElementById('message').value,
            session_id: sessionPourReservation.id  // Ajouter l'ID de la session
        };
        
        const submitButton = consultationForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Réservation en cours...';
        submitButton.disabled = true;
        
        try {
            // 1. Envoyer la consultation
            const consultationResponse = await fetch('/api/consultation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            if (!consultationResponse.ok) {
                throw new Error('Erreur lors de la réservation');
            }
            
            // 2. Réserver une place dans la session
            const reservationResponse = await fetch(`/api/sessions/${sessionPourReservation.id}/reserver`, {
                method: 'POST'
            });
            
            if (!reservationResponse.ok) {
                throw new Error('Erreur lors de la réservation de place');
            }
            
            const reservationData = await reservationResponse.json();
            
            // Succès !
            consultationForm.style.display = 'none';
            
            const successMessage = document.createElement('div');
            successMessage.style.cssText = 'text-align: center; padding: 3rem; background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%); border-radius: 15px; margin-top: 2rem;';
            successMessage.innerHTML = `
                <i class="fas fa-check-circle" style="font-size: 4rem; color: #28a745; margin-bottom: 1rem;"></i>
                <h3 style="color: #155724; margin-bottom: 1rem;">✅ Réservation Confirmée !</h3>
                <p style="font-size: 1.1rem; color: #155724; margin-bottom: 1.5rem;">
                    Votre place a été réservée pour la session du <strong>${new Date(sessionPourReservation.date_debut).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>
                </p>
                <div style="background: white; padding: 1.5rem; border-radius: 10px; margin-bottom: 1.5rem; border-left: 4px solid #28a745;">
                    <p style="margin: 0 0 0.5rem 0; color: #666;"><i class="fas fa-users"></i> <strong>Places restantes :</strong> ${reservationData.places_restantes} sur ${sessionPourReservation.places_total}</p>
                </div>
                <p style="color: #155724; font-size: 1rem; margin-bottom: 1.5rem;">
                    <i class="fab fa-whatsapp"></i> Vous allez recevoir les instructions de paiement par <strong>WhatsApp</strong> dans quelques instants.
                </p>
                <p style="color: #666; font-size: 0.9rem;">
                    Nous vous enverrons également toutes les informations nécessaires (lien Zoom ou adresse du centre, horaires, recommandations).
                </p>
            `;
            
            consultationForm.parentElement.appendChild(successMessage);
            
            // Mettre à jour immédiatement le badge des places
            sessionPourReservation.places_reservees = (sessionPourReservation.places_reservees || 0) + 1;
            sessionPourReservation.places_disponibles = sessionPourReservation.places_total - sessionPourReservation.places_reservees;
            sessionPourReservation.est_complete = sessionPourReservation.places_disponibles <= 0;
            updatePlacesDisplay(sessionPourReservation);
            
            // Recharger la session pour mettre à jour le compteur
            setTimeout(() => loadActiveSession(), 500);
            
            // Scroll vers le message
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
        } catch (error) {
            console.error('Erreur:', error);
            alert('❌ Une erreur est survenue lors de la réservation. Veuillez réessayer ou nous contacter sur WhatsApp.');
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    });
}

// Charger au démarrage
document.addEventListener('DOMContentLoaded', () => {
    loadValidatedTestimonials();
    loadActiveSession();
});

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// FAQ Accordion
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        // Close other items
        faqItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
            }
        });
        
        // Toggle current item
        item.classList.toggle('active');
    });
});

// Smooth Scroll with offset for fixed header
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80; // Height of fixed header
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// ANCIEN SYSTÈME D'INSCRIPTION (DÉSACTIVÉ)
// Maintenant géré par inscription-auto.js + Firebase
// ========================================

/*
const inscriptionForm = document.getElementById('inscriptionForm');
const successMessage = document.getElementById('successMessage');

inscriptionForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(inscriptionForm);
    const data = Object.fromEntries(formData);
    
    // Show loading state
    const submitButton = inscriptionForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = '⏳ Inscription en cours...';
    submitButton.disabled = true;
    
    try {
        // Send data to backend
        const response = await fetch('/api/inscription', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            // Hide form and show success message
            inscriptionForm.style.display = 'none';
            successMessage.style.display = 'block';
            
            // Scroll to success message
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Send confirmation email (handled by backend)
            console.log('Inscription réussie:', data);
        } else {
            throw new Error('Erreur lors de l\'inscription');
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Une erreur est survenue lors de l\'inscription. Veuillez réessayer ou nous contacter directement par WhatsApp.');
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
});
*/

// Navbar scroll effect
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and sections - VERSION RAPIDE
document.querySelectorAll('.problem-card, .testimonial-card, .feature, .formation-content, .step-item, .faq-item, .gallery-item').forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.4s ease ${index * 0.05}s, transform 0.4s ease ${index * 0.05}s`;
    observer.observe(el);
});

// Phone number formatting (Désactivé - utilisation d'un sélecteur de préfixe)
/*
const phoneInput = document.getElementById('telephone');
phoneInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.startsWith('225')) {
        value = '+' + value;
    } else if (value.startsWith('0')) {
        value = '+225' + value.substring(1);
    }
    e.target.value = value;
});
*/

// Form validation feedback (Désactivé - géré par inscription-auto.js)
/*
const inputs = inscriptionForm.querySelectorAll('input[required], select[required]');
inputs.forEach(input => {
    input.addEventListener('blur', () => {
        if (input.value.trim() === '') {
            input.style.borderColor = '#E74C3C';
        } else {
            input.style.borderColor = '#27AE60';
        }
    });
    
    input.addEventListener('input', () => {
        if (input.style.borderColor === 'rgb(231, 76, 60)') {
            input.style.borderColor = '#ECF0F1';
        }
    });
});
*/

// Email validation (Désactivé - géré par inscription-auto.js)
/*
const emailInput = document.getElementById('email');
emailInput.addEventListener('blur', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
        emailInput.style.borderColor = '#E74C3C';
    } else {
        emailInput.style.borderColor = '#27AE60';
    }
});
*/

// Add loading animation
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }
    .loading {
        animation: pulse 1.5s ease-in-out infinite;
    }
`;
document.head.appendChild(style);

// ===== COMPTEUR ANIMÉ =====
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const suffix = element.dataset.suffix || '';
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target.toLocaleString() + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start).toLocaleString() + suffix;
        }
    }, 16);
}

// Observer pour les stats
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');
            const target = parseInt(entry.target.dataset.target);
            animateCounter(entry.target, target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(stat => {
    const text = stat.textContent.trim();
    if (text.includes('+')) {
        stat.dataset.target = text.replace(/\D/g, '');
        stat.dataset.suffix = '+';
        stat.textContent = '0';
        statsObserver.observe(stat);
    } else if (text === '100%') {
        stat.dataset.target = '100';
        stat.dataset.suffix = '%';
        stat.textContent = '0';
        statsObserver.observe(stat);
    } else {
        stat.dataset.target = text;
        stat.textContent = '0';
        statsObserver.observe(stat);
    }
});

// ===== BARRE DE PROGRESSION =====
const progressBar = document.createElement('div');
progressBar.className = 'reading-progress';
progressBar.innerHTML = '<div class="reading-progress-fill"></div>';
document.body.appendChild(progressBar);

const progressFill = document.querySelector('.reading-progress-fill');

window.addEventListener('scroll', () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrolled = window.scrollY;
    const progress = (scrolled / documentHeight) * 100;
    progressFill.style.width = progress + '%';
});

// ===== CAROUSEL TÉMOIGNAGES AUTO-DÉFILANT =====
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-item');
const indicators = document.querySelectorAll('.indicator');
const totalSlides = slides.length;
let carouselInterval;

// Fonction pour afficher une slide
function showSlide(index) {
    // Protection: ne rien faire si pas de slides
    if (!slides || slides.length === 0) {
        console.log('Aucune slide disponible');
        return;
    }
    
    // Gérer le bouclage
    if (index >= totalSlides) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = totalSlides - 1;
    } else {
        currentSlide = index;
    }

    // Masquer toutes les slides
    slides.forEach(slide => {
        slide.classList.remove('active');
        slide.style.opacity = '0';
        slide.style.transform = 'translateX(20px)';
        slide.style.position = 'absolute';
        slide.style.top = '0';
        slide.style.left = '0';
        slide.style.right = '0';
        slide.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    // Afficher la slide actuelle
    if (slides[currentSlide]) {
        slides[currentSlide].classList.add('active');
        slides[currentSlide].style.opacity = '1';
        slides[currentSlide].style.transform = 'translateX(0)';
        slides[currentSlide].style.position = 'relative';
    }

    // Mettre à jour les indicateurs
    if (indicators) {
        indicators.forEach((indicator, i) => {
            if (i === currentSlide) {
                indicator.classList.add('active');
                indicator.style.background = 'white';
            } else {
                indicator.classList.remove('active');
                indicator.style.background = 'rgba(255,255,255,0.4)';
            }
        });
    }
}

// Navigation prev/next
document.querySelector('.carousel-prev').addEventListener('click', () => {
    showSlide(currentSlide - 1);
    resetCarouselInterval();
});

document.querySelector('.carousel-next').addEventListener('click', () => {
    showSlide(currentSlide + 1);
    resetCarouselInterval();
});

// Navigation par indicateurs
indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        showSlide(index);
        resetCarouselInterval();
    });
});

// Auto-défilement toutes les 6 secondes
function startCarousel() {
    carouselInterval = setInterval(() => {
        showSlide(currentSlide + 1);
    }, 6000);
}

function resetCarouselInterval() {
    clearInterval(carouselInterval);
    startCarousel();
}

// Initialiser le carousel seulement s'il y a des slides
if (slides && slides.length > 0) {
    showSlide(0);
    startCarousel();

    // Pause au survol
    document.querySelector('.carousel-testimonials').addEventListener('mouseenter', () => {
        clearInterval(carouselInterval);
    });

    document.querySelector('.carousel-testimonials').addEventListener('mouseleave', () => {
        resetCarouselInterval();
    });
} else {
    console.log('Carrousel non initialisé: aucun témoignage à afficher');
}

// ===== MODAL TÉMOIGNAGES =====
const modal = document.getElementById('testimonialsModal');
const openModalBtn = document.getElementById('openTestimonialsModal');
const closeModalBtn = document.getElementById('closeModal');

// Ouvrir le modal
openModalBtn.addEventListener('click', () => {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Bloquer scroll du body
});

// Fermer le modal
closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// Fermer le modal en cliquant en dehors
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// ===== SYSTÈME D'ÉTOILES CLIQUABLES =====
const starRating = document.querySelector('.star-rating');
const stars = starRating.querySelectorAll('span');
const ratingInput = document.getElementById('testimonialRating');
let selectedRating = 0;

stars.forEach((star, index) => {
    // Hover effect
    star.addEventListener('mouseenter', () => {
        stars.forEach((s, i) => {
            if (i <= index) {
                s.textContent = '★';
                s.style.color = '#FFD700';
            } else {
                s.textContent = '☆';
                s.style.color = '#ddd';
            }
        });
    });

    // Click effect
    star.addEventListener('click', () => {
        selectedRating = index + 1;
        ratingInput.value = selectedRating;
        stars.forEach((s, i) => {
            if (i <= index) {
                s.textContent = '★';
                s.style.color = '#FFD700';
            }
        });
    });
});

// Reset on mouse leave
starRating.addEventListener('mouseleave', () => {
    stars.forEach((s, i) => {
        if (i < selectedRating) {
            s.textContent = '★';
            s.style.color = '#FFD700';
        } else {
            s.textContent = '☆';
            s.style.color = '#ddd';
        }
    });
});

// ===== FORMULAIRE TÉMOIGNAGE =====
const testimonialForm = document.getElementById('testimonialForm');

testimonialForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('testimonialName').value;
    const location = document.getElementById('testimonialLocation').value;
    const probleme = document.getElementById('testimonialProbleme').value;
    const typeSession = document.getElementById('testimonialTypeSession').value;
    const rating = document.getElementById('testimonialRating').value;
    const text = document.getElementById('testimonialText').value;

    if (!rating) {
        alert('Veuillez sélectionner une note (étoiles)');
        return;
    }
    
    if (!typeSession) {
        alert('Veuillez sélectionner le type de session');
        return;
    }

    const testimonialData = {
        nom: name,
        localisation: location,
        probleme_traite: probleme,
        temoignage: text,
        note: parseInt(rating),
        type_session: typeSession
    };

    const submitButton = testimonialForm.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
    submitButton.disabled = true;

    try {
        // Envoyer vers l'API témoignages
        const response = await fetch('/api/temoignages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testimonialData)
        });

        if (response.ok) {
            alert('✅ Merci pour votre témoignage ! Il sera publié après validation par Frère Elie.');
            testimonialForm.reset();
            selectedRating = 0;
            stars.forEach(s => {
                s.textContent = '☆';
                s.style.color = '#ddd';
            });
        } else {
            alert('❌ Erreur lors de l\'envoi. Veuillez réessayer.');
        }
        
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;

    } catch (error) {
        console.error('Erreur:', error);
        alert('Une erreur est survenue. Veuillez réessayer.');
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
});

