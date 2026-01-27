/**
 * DevHub Agency - Estimate Form & Pricing Logic
 * 
 * PRICING RULES (modifiable):
 * 
 * Base prices by project type:
 * - Site vitrine: 400-800€
 * - Base de données: 500-1000€
 * - Outil interne: 800-1500€
 * - Recréation site: 500-1000€
 * 
 * Modifiers:
 * - Objective "vendre": +20%
 * - Objective "gagner-temps": +10%
 * - Timeline "urgent": +30%
 * - Timeline "flexible": -10%
 * - Complex sectors (ecommerce, sante): +15%
 */

const PRICING_CONFIG = {
    // Base price ranges [min, max]
    projectTypes: {
        'site-vitrine': [400, 800],
        'base-donnees': [500, 1000],
        'outil-interne': [800, 1500],
        'recreation-site': [500, 1000]
    },
    
    // Objective modifiers (multiplier)
    objectives: {
        'vendre': 1.20,
        'informer': 1.00,
        'gagner-temps': 1.10,
        'autre': 1.00
    },
    
    // Timeline modifiers (multiplier)
    timelines: {
        'urgent': 1.30,
        'standard': 1.00,
        'flexible': 0.90
    },
    
    // Sector complexity modifiers (multiplier)
    sectors: {
        'restauration': 1.00,
        'artisan': 1.00,
        'consulting': 1.00,
        'ecommerce': 1.15,
        'sante': 1.15,
        'immobilier': 1.05,
        'education': 1.00,
        'autre': 1.00
    },
    
    // Display labels
    labels: {
        projectTypes: {
            'site-vitrine': 'Site internet',
            'base-donnees': 'Base de données',
            'outil-interne': 'Outil interne',
            'recreation-site': 'Recréation de site'
        },
        objectives: {
            'vendre': 'Vendre',
            'informer': 'Informer',
            'gagner-temps': 'Gagner du temps',
            'autre': 'Autre'
        },
        timelines: {
            'urgent': 'Urgent (< 2 sem.)',
            'standard': 'Standard (2-4 sem.)',
            'flexible': 'Flexible'
        }
    }
};

/**
 * Calculate price estimate
 */
function calculateEstimate(formData) {
    const { projectType, objective, timeline, sector } = formData;
    
    // Get base price range
    const [baseMin, baseMax] = PRICING_CONFIG.projectTypes[projectType] || [500, 1000];
    
    // Calculate modifiers
    const objectiveModifier = PRICING_CONFIG.objectives[objective] || 1.00;
    const timelineModifier = PRICING_CONFIG.timelines[timeline] || 1.00;
    const sectorModifier = PRICING_CONFIG.sectors[sector] || 1.00;
    
    // Apply modifiers
    const totalModifier = objectiveModifier * timelineModifier * sectorModifier;
    
    let minPrice = Math.round(baseMin * totalModifier / 50) * 50; // Round to nearest 50
    let maxPrice = Math.round(baseMax * totalModifier / 50) * 50;
    
    // Ensure minimum gap
    if (maxPrice - minPrice < 100) {
        maxPrice = minPrice + 150;
    }
    
    return {
        min: minPrice,
        max: maxPrice,
        formatted: `${minPrice}€ - ${maxPrice}€`
    };
}

/**
 * Form Controller
 */
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('estimateForm');
    const result = document.getElementById('estimateResult');
    
    if (!form) return;
    
    const steps = form.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const progressFill = document.getElementById('progressFill');
    
    let currentStep = 1;
    const totalSteps = steps.length;
    
    // Initialize
    updateProgress();
    
    // Handle option card selections
    form.querySelectorAll('.option-card input').forEach(input => {
        input.addEventListener('change', function() {
            const step = this.closest('.form-step');
            const nextBtn = step.querySelector('.btn-next');
            if (nextBtn) {
                nextBtn.disabled = false;
            }
        });
    });
    
    // Handle next buttons
    form.querySelectorAll('.btn-next').forEach(btn => {
        btn.addEventListener('click', function() {
            if (currentStep < totalSteps) {
                goToStep(currentStep + 1);
            }
        });
    });
    
    // Handle prev buttons
    form.querySelectorAll('.btn-prev').forEach(btn => {
        btn.addEventListener('click', function() {
            if (currentStep > 1) {
                goToStep(currentStep - 1);
            }
        });
    });
    
    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Collect form data
        const formData = {
            projectType: form.querySelector('input[name="projectType"]:checked')?.value,
            objective: form.querySelector('input[name="objective"]:checked')?.value,
            timeline: form.querySelector('input[name="timeline"]:checked')?.value,
            sector: form.querySelector('select[name="sector"]')?.value,
            name: form.querySelector('input[name="name"]')?.value,
            email: form.querySelector('input[name="email"]')?.value,
            description: form.querySelector('textarea[name="description"]')?.value,
            inspiration: form.querySelector('input[name="inspiration"]')?.value
        };
        
        // Calculate estimate
        const estimate = calculateEstimate(formData);
        
        // Display result
        showResult(formData, estimate);
        
        // Store in localStorage for potential backend processing
        localStorage.setItem('devhub_estimate', JSON.stringify({
            ...formData,
            estimate: estimate,
            timestamp: new Date().toISOString()
        }));
        
        // TODO: Send to backend when available
        // sendToBackend(formData, estimate);
    });
    
    /**
     * Navigate to a specific step
     */
    function goToStep(step) {
        // Hide current step
        steps[currentStep - 1].classList.remove('active');
        progressSteps[currentStep - 1].classList.remove('active');
        progressSteps[currentStep - 1].classList.add('completed');
        
        // Show new step
        currentStep = step;
        steps[currentStep - 1].classList.add('active');
        progressSteps[currentStep - 1].classList.add('active');
        progressSteps[currentStep - 1].classList.remove('completed');
        
        // Update progress bar
        updateProgress();
        
        // Scroll to top of form
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    /**
     * Update progress bar
     */
    function updateProgress() {
        const progress = (currentStep / totalSteps) * 100;
        progressFill.style.width = `${progress}%`;
    }
    
    /**
     * Show result
     */
    function showResult(formData, estimate) {
        // Hide form
        form.style.display = 'none';
        
        // Update result display
        document.getElementById('resultProject').textContent = 
            PRICING_CONFIG.labels.projectTypes[formData.projectType] || formData.projectType;
        document.getElementById('resultObjective').textContent = 
            PRICING_CONFIG.labels.objectives[formData.objective] || formData.objective;
        document.getElementById('resultTimeline').textContent = 
            PRICING_CONFIG.labels.timelines[formData.timeline] || formData.timeline;
        document.getElementById('priceRange').textContent = estimate.formatted;
        document.getElementById('resultEmail').textContent = formData.email;
        
        // Show result
        result.classList.remove('hidden');
        
        // Scroll to result
        result.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
});

/**
 * Send data to backend (placeholder)
 * Uncomment and configure when backend is ready
 */
/*
async function sendToBackend(formData, estimate) {
    try {
        const response = await fetch('/api/estimates', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...formData,
                estimate: estimate,
                timestamp: new Date().toISOString()
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to submit estimate');
        }
        
        console.log('Estimate submitted successfully');
    } catch (error) {
        console.error('Error submitting estimate:', error);
        // Form still works offline, data is in localStorage
    }
}
*/
