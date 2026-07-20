import { useState, useEffect } from 'react'
import { achievementsWithStatus } from './services/achievementService';


function Achievements(){
    
    interface UserData {
        Id: number;
        name?: string;
    }

    const [user, setUser] = useState(null);
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const unlockedCount = achievements.filter((a) => a.unlocked).length; // Count how many achievements are unlocked
    const totalAchievements = achievements.length; // Total number of achievements

    useEffect(() => {
        loadAchievements();
    }, []);

        const loadAchievements = async () => {
        setLoading(true);
        setError(null);
        try {
        const userData = await getUser();
        setUser(userData);

        const data = await achievementsWithStatus(userData.id ?? null);

        setAchievements(data);
        } catch (err) {
        setError(err.message);
        } finally {
        setLoading(false);
        }
    };
    return (
        <>
            <div></div>
        </>
    )
}