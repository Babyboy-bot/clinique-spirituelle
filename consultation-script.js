// Script pour le formulaire de consultation - La Clinique Spirituelle

const consultationForm = document.getElementById('consultationForm');
const successMessage = document.getElementById('successMessage');

if (consultationForm) {
    consultationForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(consultationForm);
        
        // Combiner préfixe et téléphone
        const phonePrefix = formData.get('phone_prefix');
        const phoneNumber = formData.get('telephone');
        const fullPhone = phonePrefix + phoneNumber;
        
        const data = {
            prenom: formData.get('prenom'),
            nom: formData.get('nom'),
            email: formData.get('email') || '',
            telephone: fullPhone,
            pays: formData.get('pays'),
            ville: formData.get('ville'),
            probleme_specifique: formData.get('probleme_specifique'),
            niveau_urgence: formData.get('niveau_urgence'),
            depuis_quand: formData.get('depuis_quand') || '',
            message: formData.get('message') || ''
        };
        
        // Show loading state
        const submitButton = consultationForm.querySelector('button[type="submit"]');
        const originalHTML = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Réservation en cours...';
        submitButton.disabled = true;
        
        try {
            // Send data to backend
            const response = await fetch('/api/consultation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (response.ok) {
                // Hide form and show success message
                consultationForm.style.display = 'none';
                successMessage.style.display = 'block';
                
                // Scroll to success message
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                console.log('Consultation réservée:', result);
            } else {
                throw new Error(result.error || 'Erreur lors de la réservation');
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Une erreur est survenue lors de la réservation. Veuillez réessayer ou nous contacter directement par WhatsApp.');
            submitButton.innerHTML = originalHTML;
            submitButton.disabled = false;
        }
    });
}

// Validation en temps réel du niveau d'urgence
const niveauUrgence = document.getElementById('niveau_urgence');
if (niveauUrgence) {
    niveauUrgence.addEventListener('change', (e) => {
        const value = parseInt(e.target.value);
        if (value >= 4) {
            e.target.style.borderColor = '#E74C3C';
            e.target.style.background = '#ffebee';
        } else {
            e.target.style.borderColor = '';
            e.target.style.background = '';
        }
    });
}
