
import React from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface UserProfile {
    name: string;
    email: string;
    gender: string;
    age: number;
    city: string;
}

export const Account: React.FC = () => {
    const [profile, setProfile] = useLocalStorage<UserProfile>('lumera-user-profile', {
        name: 'Alex Doe',
        email: 'alex.doe@example.com',
        gender: 'Prefer not to say',
        age: 28,
        city: 'Digital City'
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: name === 'age' ? parseInt(value) || 0 : value
        }));
    };

    const InputField: React.FC<{label: string, name: keyof UserProfile, value: string | number, type?: string, children?: React.ReactNode}> = ({label, name, value, type='text', children}) => (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{label}</label>
            {children ? (
                <select id={name} name={name} value={value} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 bg-white dark:bg-gray-700">
                    {children}
                </select>
            ) : (
                <input type={type} id={name} name={name} value={value} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 bg-white dark:bg-gray-700" />
            )}
        </div>
    );

    return (
        <div className="p-4 sm:p-6 md:p-8 h-full overflow-y-auto">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Account Profile</h2>
            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                <div className="flex flex-col items-center mb-8">
                    <img src={`https://i.pravatar.cc/150?u=${profile.email}`} alt="User Avatar" className="w-32 h-32 rounded-full mb-4 ring-4 ring-sky-300 dark:ring-sky-600" />
                    <h3 className="text-2xl font-semibold">{profile.name}</h3>
                    <p className="text-gray-500 dark:text-gray-400">{profile.email}</p>
                </div>
                <form className="space-y-6">
                    <InputField label="Name" name="name" value={profile.name} />
                    <InputField label="Email" name="email" value={profile.email} type="email" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <InputField label="Age" name="age" value={profile.age} type="number" />
                         <InputField label="Gender" name="gender" value={profile.gender}>
                            <option>Female</option>
                            <option>Male</option>
                            <option>Non-binary</option>
                            <option>Prefer not to say</option>
                        </InputField>
                    </div>
                    <InputField label="City" name="city" value={profile.city} />
                    <p className="text-xs text-center text-gray-500 dark:text-gray-400 pt-4">Your changes are saved automatically.</p>
                </form>
            </div>
        </div>
    );
};
