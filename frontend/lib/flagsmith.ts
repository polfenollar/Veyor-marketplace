// Mock Flagsmith Client for Demo Purposes
import flagsmith from 'flagsmith';

const mockFlags: Record<string, { enabled: boolean; value?: string }> = {
    'abtest': { enabled: true, value: 'A' }, // Default to Version A
};

export const getFeatureFlag = (name: string, userId?: string) => {
    // Simulate user-based targeting
    if (name === 'company_profile_ui') {
        if (userId === '1@1.com') {
            return { enabled: true, value: 'B' };
        }
        return { enabled: true, value: 'A' };
    }
    return mockFlags[name] || { enabled: false };
};

export const initFlagsmith = async () => {
    // In a real app, you'd use flagsmith.init()
    console.log('Flagsmith initialized (Mocked)');
};
