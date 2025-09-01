export const pricingPlans = [
    {
        name: 'Basic',
        price: '100 Kshs',
        period:'per month',
        features: [
            'Personalized health insights',
            'Symptom checker',
            'Basic health tracking'
        ],
        isPopular: false
    },
    {
        name: 'Pro',
        price: '500 Kshs',
        period: 'per month',
        features: [
            'Advanced analytics',
            'Personalized workout plans',
            'Health coach access',
            '24/7 AI health assistant',
            'Nutrition planning'
        ],
        isPopular: true
    },
    {
        name: 'Enterprise',
        price: '1000 Kshs',
        period: 'per month',
        features: [
            'All Pro Features',
            'Data Prediction',
            // 'Share Account (up to 6 users)',
            'Priority support',
            'Health data export',
            'Custom integrations',
            'Dedicated health consultant'
        ],
        isPopular: false
    }
]