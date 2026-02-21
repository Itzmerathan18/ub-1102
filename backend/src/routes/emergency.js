const express = require('express');
const prisma = require('../lib/prisma');

const router = express.Router();

// GET /emergency/:token  (public - no auth)
router.get('/:token', async (req, res) => {
    try {
        const access = await prisma.emergencyAccess.findUnique({
            where: { accessToken: req.params.token },
            include: { user: { include: { healthProfile: true, medications: true, emergencyContacts: true } } },
        });

        if (!access || !access.isActive) {
            return res.status(404).json({ error: 'Emergency access not found or inactive' });
        }

        // Update access count
        await prisma.emergencyAccess.update({
            where: { id: access.id },
            data: { accessCount: access.accessCount + 1, lastAccessed: new Date() },
        });

        const profile = access.user.healthProfile;

        let age = null;
        if (profile?.dob) {
            const birthDate = new Date(profile.dob);
            const today = new Date();
            age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
        }

        const data = {
            name: profile?.fullName,
            age,
            gender: profile?.gender,
            bloodGroup: access.showBloodGroup ? profile?.bloodGroup : null,
            allergies: access.showAllergies ? JSON.parse(profile?.allergies || '[]') : null,
            chronicConditions: access.showChronicConditions ? JSON.parse(profile?.chronicConditions || '[]') : null,
            medications: access.showMedications
                ? access.user.medications.filter(m => m.isActive).map(m => ({
                    name: m.medicineName,
                    dosage: m.dosage,
                    frequency: m.frequency,
                    system: m.medicineSystem,
                }))
                : null,
            emergencyContacts: access.user.emergencyContacts.map(c => ({
                name: c.name,
                relation: c.relation,
                phones: JSON.parse(c.phoneNumbers),
            })),
        };

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
