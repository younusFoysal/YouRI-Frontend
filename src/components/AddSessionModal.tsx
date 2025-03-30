import React, { useState } from 'react';
import { format } from 'date-fns';
import { WorkSession } from '../types';

interface AddSessionModalProps {
    employeeId: string;
    onClose: () => void;
    onSuccess: () => void;
}

const AddSessionModal: React.FC<AddSessionModalProps> = ({ employeeId, onClose, onSuccess }) => {
    const [sessionData, setSessionData] = useState<Partial<WorkSession>>({
        employeeId,
        startTime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
        endTime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
        activeTime: 3600,   // Default to 1 hour in seconds
        idleTime: 900,      // Default to 15 minutes in seconds
        screenshots: [
            {
                timestamp: new Date().toISOString(),
                imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&h=600&fit=crop'
            },
            {
                timestamp: new Date().toISOString(),
                imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop'
            },
            {
                timestamp: new Date().toISOString(),
                imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop'
            },
            {
                timestamp: new Date().toISOString(),
                imageUrl: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800&h=600&fit=crop'
            },
            {
                timestamp: new Date().toISOString(),
                imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop'
            }
        ],
        applications: [
            {
                name: 'Visual Studio Code',
                timeSpent: 3600,
                icon: 'https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@main/icons/vscode.svg'
            },
            {
                name: 'Google Chrome',
                timeSpent: 7200,
                icon: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Google_Chrome_icon_%282011%29.svg'
            },
            {
                name: 'Slack',
                timeSpent: 1800,
                icon: 'https://upload.wikimedia.org/wikipedia/commons/7/76/Slack_Icon.png'
            },
            {
                name: 'Figma',
                timeSpent: 4500,
                icon: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg'
            },
            {
                name: 'Postman',
                timeSpent: 2700,
                icon: 'https://www.svgrepo.com/show/354202/postman-icon.svg'
            },
            {
                name: 'Spotify',
                timeSpent: 5400,
                icon: 'https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg'
            }
        ],
        links: [
            {
                url: 'https://github.com',
                title: 'GitHub',
                timestamp: new Date().toISOString()
            },
            {
                url: 'https://stackoverflow.com',
                title: 'Stack Overflow',
                timestamp: new Date().toISOString()
            },
            {
                url: 'https://developer.mozilla.org',
                title: 'MDN Web Docs',
                timestamp: new Date().toISOString()
            },
            {
                url: 'https://reactjs.org',
                title: 'React Official Docs',
                timestamp: new Date().toISOString()
            },
            {
                url: 'https://www.npmjs.com',
                title: 'NPM Packages',
                timestamp: new Date().toISOString()
            },
            {
                url: 'https://tailwindcss.com',
                title: 'Tailwind CSS',
                timestamp: new Date().toISOString()
            }
        ]
    });

    const formatTimeDisplay = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const totalSeconds = hours * 3600 + minutes * 60;
        const percentage = ((totalSeconds / (sessionData.activeTime + sessionData.idleTime)) * 100).toFixed(1);
        return `${hours}h ${minutes}m (${percentage}%)`;
    };

    const calculateTimes = (start: string, end: string) => {
        const startTime = new Date(start).getTime();
        const endTime = new Date(end).getTime();
        const totalSeconds = Math.max(0, (endTime - startTime) / 1000);
        return {
            activeTime: Math.floor(totalSeconds * 0.85),
            idleTime: Math.floor(totalSeconds * 0.15)
        };
    };


    const handleTimeChange = (field: 'startTime' | 'endTime', value: string) => {
        const times = calculateTimes(
            field === 'startTime' ? value : sessionData.startTime!,
            field === 'endTime' ? value : sessionData.endTime!
        );

        setSessionData({
            ...sessionData,
            [field]: value,
            ...times
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/sessions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(sessionData),
            });

            if (response.ok) {
                onSuccess();
                onClose();
            }
        } catch (error) {
            console.error('Error creating session:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-xl font-bold mb-4">Add New Session</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1">Start Time</label>
                        <input
                            type="datetime-local"
                            value={sessionData.startTime}
                            onChange={(e) => handleTimeChange('startTime', e.target.value)}
                            className="w-full border rounded p-2"
                        />
                    </div>
                    <div>
                        <label className="block mb-1">End Time</label>
                        <input
                            type="datetime-local"
                            value={sessionData.endTime}
                            onChange={(e) => handleTimeChange('endTime', e.target.value)}
                            className="w-full border rounded p-2"
                        />
                    </div>

                    <div>
                        <label className="block mb-1">Active Time</label>
                        <div className="w-full border rounded p-2 bg-gray-100">
                            {formatTimeDisplay(sessionData.activeTime)}
                        </div>
                    </div>
                    <div>
                        <label className="block mb-1">Idle Time</label>
                        <div className="w-full border rounded p-2 bg-gray-100">
                            {formatTimeDisplay(sessionData.idleTime)}
                        </div>
                    </div>
                    {/*<div>*/}
                    {/*    <label className="block mb-1">Active Time (seconds)</label>*/}
                    {/*    <input*/}
                    {/*        type="number"*/}
                    {/*        value={sessionData.activeTime}*/}
                    {/*        readOnly*/}
                    {/*        className="w-full border rounded p-2 bg-gray-100"*/}
                    {/*    />*/}
                    {/*</div>*/}
                    {/*<div>*/}
                    {/*    <label className="block mb-1">Idle Time (seconds)</label>*/}
                    {/*    <input*/}
                    {/*        type="number"*/}
                    {/*        value={sessionData.idleTime}*/}
                    {/*        readOnly*/}
                    {/*        className="w-full border rounded p-2 bg-gray-100"*/}
                    {/*    />*/}
                    {/*</div>*/}
                    <div className="flex space-x-2">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Create Session
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddSessionModal;
