export type Lang = 'en' | 'hi' | 'kn';

export const translations: Record<Lang, Record<string, string>> = {
    en: {
        // Nav
        dashboard: 'Dashboard',
        ayurveda: 'Ayurveda',
        english_medicine: 'English Medicine',
        history: 'History',
        profile: 'Profile',
        logout: 'Logout',

        // Auth
        login: 'Sign In',
        register: 'Create Account',
        email: 'Email Address',
        password: 'Password',
        name: 'Full Name',
        sign_in: 'Sign In',
        sign_up: 'Sign Up',
        no_account: "Don't have an account?",
        have_account: 'Already have an account?',
        tagline: 'Tradition Meets Science',
        subtitle: 'Your integrative health platform',

        // Dashboard
        welcome: 'Welcome back',
        start_ayurveda: 'Start Ayurveda Assessment',
        start_health: 'Start Health Assessment',
        recent_activity: 'Recent Activity',
        no_activity: 'No assessments yet. Start your health journey!',

        // Ayurveda
        dosha_assessment: 'Dosha Assessment',
        take_assessment: 'Take Assessment',
        discover_dosha: 'Discover Your Dosha',
        dosha_subtitle: 'Answer 15 questions to understand your Ayurvedic body constitution',
        question: 'Question',
        of: 'of',
        next: 'Next',
        previous: 'Previous',
        submit: 'Submit',
        your_dosha: 'Your Dosha Type',
        save_history: 'Save to History',
        saved: 'Saved!',

        // English Medicine
        health_assessment: 'Health Assessment',
        bmi_check: 'BMI & Lifestyle Check',
        health_subtitle: 'Complete 15 questions for your personalized wellness summary',
        bmi: 'BMI',
        risk_level: 'Risk Level',
        risk_low: 'Low',
        risk_moderate: 'Moderate',
        risk_high: 'High',

        // History
        ayurveda_history: 'Ayurveda History',
        health_history: 'Health History',
        prescriptions: 'Prescriptions',
        delete: 'Delete',
        view_details: 'View Details',
        download_pdf: 'Download PDF',
        no_records: 'No records found.',
        upload_prescription: 'Upload Prescription',

        // Language
        language: 'Language',
        english: 'English',
        hindi: 'हिंदी',
        kannada: 'ಕನ್ನಡ',
    },

    hi: {
        // Nav
        dashboard: 'डैशबोर्ड',
        ayurveda: 'आयुर्वेद',
        english_medicine: 'अंग्रेजी चिकित्सा',
        history: 'इतिहास',
        profile: 'प्रोफ़ाइल',
        logout: 'लॉग आउट',

        // Auth
        login: 'लॉग इन करें',
        register: 'खाता बनाएं',
        email: 'ईमेल पता',
        password: 'पासवर्ड',
        name: 'पूरा नाम',
        sign_in: 'लॉग इन करें',
        sign_up: 'रजिस्टर करें',
        no_account: 'खाता नहीं है?',
        have_account: 'पहले से खाता है?',
        tagline: 'परंपरा और विज्ञान',
        subtitle: 'आपका एकीकृत स्वास्थ्य मंच',

        // Dashboard
        welcome: 'स्वागत है',
        start_ayurveda: 'आयुर्वेद मूल्यांकन शुरू करें',
        start_health: 'स्वास्थ्य मूल्यांकन शुरू करें',
        recent_activity: 'हाल की गतिविधि',
        no_activity: 'अभी तक कोई मूल्यांकन नहीं। अपनी स्वास्थ्य यात्रा शुरू करें!',

        // Ayurveda
        dosha_assessment: 'दोष मूल्यांकन',
        take_assessment: 'मूल्यांकन करें',
        discover_dosha: 'अपना दोष जानें',
        dosha_subtitle: 'अपनी आयुर्वेदिक प्रकृति जानने के लिए 15 प्रश्नों के उत्तर दें',
        question: 'प्रश्न',
        of: 'में से',
        next: 'अगला',
        previous: 'पिछला',
        submit: 'जमा करें',
        your_dosha: 'आपका दोष प्रकार',
        save_history: 'इतिहास में सहेजें',
        saved: 'सहेजा गया!',

        // English Medicine
        health_assessment: 'स्वास्थ्य मूल्यांकन',
        bmi_check: 'बीएमआई और जीवनशैली जांच',
        health_subtitle: 'अपना व्यक्तिगत स्वास्थ्य सारांश पाने के लिए 15 प्रश्नों को पूरा करें',
        bmi: 'बीएमआई',
        risk_level: 'जोखिम स्तर',
        risk_low: 'कम',
        risk_moderate: 'मध्यम',
        risk_high: 'उच्च',

        // History
        ayurveda_history: 'आयुर्वेद इतिहास',
        health_history: 'स्वास्थ्य इतिहास',
        prescriptions: 'नुस्खे',
        delete: 'हटाएं',
        view_details: 'विवरण देखें',
        download_pdf: 'पीडीएफ डाउनलोड करें',
        no_records: 'कोई रिकॉर्ड नहीं मिला।',
        upload_prescription: 'नुस्खा अपलोड करें',

        // Language
        language: 'भाषा',
        english: 'English',
        hindi: 'हिंदी',
        kannada: 'ಕನ್ನಡ',
    },

    kn: {
        // Nav
        dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
        ayurveda: 'ಆಯುರ್ವೇದ',
        english_medicine: 'ಆಧುನಿಕ ವೈದ್ಯಕೀಯ',
        history: 'ಇತಿಹಾಸ',
        profile: 'ಪ್ರೊಫೈಲ್',
        logout: 'ಲಾಗ್ ಔಟ್',

        // Auth
        login: 'ಲಾಗಿನ್ ಮಾಡಿ',
        register: 'ಖಾತೆ ರಚಿಸಿ',
        email: 'ಇಮೇಲ್ ವಿಳಾಸ',
        password: 'ಪಾಸ್‌ವರ್ಡ್',
        name: 'ಪೂರ್ಣ ಹೆಸರು',
        sign_in: 'ಲಾಗಿನ್ ಮಾಡಿ',
        sign_up: 'ನೋಂದಣಿ ಮಾಡಿ',
        no_account: 'ಖಾತೆ ಇಲ್ಲವೇ?',
        have_account: 'ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ?',
        tagline: 'ಸಂಪ್ರದಾಯ ಮತ್ತು ವಿಜ್ಞಾನ',
        subtitle: 'ನಿಮ್ಮ ಸಮಗ್ರ ಆರೋಗ್ಯ ವೇದಿಕೆ',

        // Dashboard
        welcome: 'ಸ್ವಾಗತ',
        start_ayurveda: 'ಆಯುರ್ವೇದ ಮೌಲ್ಯಮಾಪನ ಪ್ರಾರಂಭಿಸಿ',
        start_health: 'ಆರೋಗ್ಯ ಮೌಲ್ಯಮಾಪನ ಪ್ರಾರಂಭಿಸಿ',
        recent_activity: 'ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆ',
        no_activity: 'ಇನ್ನೂ ಯಾವುದೇ ಮೌಲ್ಯಮಾಪನ ಇಲ್ಲ. ನಿಮ್ಮ ಆರೋಗ್ಯ ಪ್ರಯಾಣ ಪ್ರಾರಂಭಿಸಿ!',

        // Ayurveda
        dosha_assessment: 'ದೋಷ ಮೌಲ್ಯಮಾಪನ',
        take_assessment: 'ಮೌಲ್ಯಮಾಪನ ಮಾಡಿ',
        discover_dosha: 'ನಿಮ್ಮ ದೋಷ ತಿಳಿಯಿರಿ',
        dosha_subtitle: '15 ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಿ ನಿಮ್ಮ ಆಯುರ್ವೇದ ಪ್ರಕೃತಿ ತಿಳಿಯಿರಿ',
        question: 'ಪ್ರಶ್ನೆ',
        of: 'ರಲ್ಲಿ',
        next: 'ಮುಂದೆ',
        previous: 'ಹಿಂದೆ',
        submit: 'ಸಲ್ಲಿಸಿ',
        your_dosha: 'ನಿಮ್ಮ ದೋಷ ಪ್ರಕಾರ',
        save_history: 'ಇತಿಹಾಸಕ್ಕೆ ಉಳಿಸಿ',
        saved: 'ಉಳಿಸಲಾಗಿದೆ!',

        // English Medicine
        health_assessment: 'ಆರೋಗ್ಯ ಮೌಲ್ಯಮಾಪನ',
        bmi_check: 'ಬಿಎಂಐ ಮತ್ತು ಜೀವನಶೈಲಿ ಪರೀಕ್ಷೆ',
        health_subtitle: '15 ಪ್ರಶ್ನೆಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ ನಿಮ್ಮ ಆರೋಗ್ಯ ಸಾರಾಂಶ ಪಡೆಯಿರಿ',
        bmi: 'ಬಿಎಂಐ',
        risk_level: 'ಅಪಾಯ ಮಟ್ಟ',
        risk_low: 'ಕಡಿಮೆ',
        risk_moderate: 'ಮಧ್ಯಮ',
        risk_high: 'ಹೆಚ್ಚು',

        // History
        ayurveda_history: 'ಆಯುರ್ವೇದ ಇತಿಹಾಸ',
        health_history: 'ಆರೋಗ್ಯ ಇತಿಹಾಸ',
        prescriptions: 'ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್‌ಗಳು',
        delete: 'ಅಳಿಸಿ',
        view_details: 'ವಿವರ ನೋಡಿ',
        download_pdf: 'ಪಿಡಿಎಫ್ ಡೌನ್‌ಲೋಡ್',
        no_records: 'ಯಾವುದೇ ದಾಖಲೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ.',
        upload_prescription: 'ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',

        // Language
        language: 'ಭಾಷೆ',
        english: 'English',
        hindi: 'हिंदी',
        kannada: 'ಕನ್ನಡ',
    },
};
