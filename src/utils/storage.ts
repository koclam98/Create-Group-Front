export interface CastMember {
    id: number;
    name: string;
    season: string;
    phone: string;
    profileImage?: string; // Base64 string
}

const STORAGE_KEY = 'castMembers';

const INITIAL_DATA: CastMember[] = [];

export const getParticipants = (): CastMember[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
        return JSON.parse(data);
    }
    // Initialize with sample data if empty
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
    return INITIAL_DATA;
};

export const saveParticipant = (participant: Omit<CastMember, 'id'>) => {
    const currentData = getParticipants();
    const newId = currentData.length > 0 ? Math.max(...currentData.map((p) => p.id)) + 1 : 1;
    const newParticipant = { ...participant, id: newId };
    const newData = [newParticipant, ...currentData]; // Add to top
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    return newParticipant;
};

export const clearParticipants = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
};
