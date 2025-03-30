// Mock data
import {DailyStats, Employee, MonthlyStats, WeeklyStats, WorkSession} from "../types.ts";
import {format} from "date-fns";

export const mockEmployees: Employee[] = [
    {
        id: 1,
        name: 'John Doe',
        position: 'Software Engineer',
        department: 'Engineering',
        email: 'john.doe@company.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop'
    },
    {
        id: 2,
        name: 'Jane Smith',
        position: 'Product Designer',
        department: 'Design',
        email: 'jane.smith@company.com',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop'
    },
    {
        id: 3,
        name: 'Michael Johnson',
        position: 'Frontend Developer',
        department: 'Engineering',
        email: 'michael.johnson@company.com',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&h=400&fit=crop'
    },
    {
        id: 4,
        name: 'Emily Chen',
        position: 'UX Researcher',
        department: 'Design',
        email: 'emily.chen@company.com',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop'
    },
    {
        id: 5,
        name: 'David Rodriguez',
        position: 'Backend Developer',
        department: 'Engineering',
        email: 'david.rodriguez@company.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
    },
    {
        id: 6,
        name: 'Sarah Williams',
        position: 'Project Manager',
        department: 'Product',
        email: 'sarah.williams@company.com',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop'
    }
];

// Sample application icons and data
const applicationData = [
    {
        name: 'Visual Studio Code',
        icon: 'https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@main/icons/vscode.svg'
    },
    {
        name: 'Chrome',
        icon: 'https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@main/icons/chrome.svg'
    },
    {
        name: 'Slack',
        icon: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/slack.svg'
    },
    {
        name: 'Figma',
        icon: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/figma.svg'
    },
    {
        name: 'Zoom',
        icon: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/zoom.svg'
    },
    {
        name: 'Terminal',
        icon: 'https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@main/icons/console.svg'
    }
];

// Sample websites
const websites = [
    { url: 'https://github.com', title: 'GitHub' },
    { url: 'https://stackoverflow.com', title: 'Stack Overflow' },
    { url: 'https://jira.company.com', title: 'JIRA' },
    { url: 'https://confluence.company.com', title: 'Confluence' },
    { url: 'https://docs.google.com', title: 'Google Docs' },
    { url: 'https://www.figma.com', title: 'Figma' }
];

// Helper function to generate random work sessions
const generateWorkSession = (id: number, employeeId: number, date: string): WorkSession => {
    const startHour = 8 + Math.floor(Math.random() * 2); // Start between 8-10 AM
    const workDuration = 7 + Math.random() * 2; // Work 7-9 hours
    const activePercent = 0.85 + Math.random() * 0.1; // 85-95% active time

    const startTime = `${date}T${String(startHour).padStart(2, '0')}:00:00`;
    const endHour = startHour + workDuration;
    const endTime = `${date}T${String(Math.floor(endHour)).padStart(2, '0')}:${String(Math.floor((endHour % 1) * 60)).padStart(2, '0')}:00`;

    const totalSeconds = workDuration * 3600;
    const activeTime = Math.floor(totalSeconds * activePercent);
    const idleTime = Math.floor(totalSeconds - activeTime);

    // Generate random screenshots
    const screenshotCount = 3 + Math.floor(Math.random() * 3); // 3-5 screenshots
    const screenshots = [];
    for (let i = 0; i < screenshotCount; i++) {
        const screenshotHour = startHour + (workDuration / screenshotCount) * i;
        const screenshotTime = `${date}T${String(Math.floor(screenshotHour)).padStart(2, '0')}:${String(Math.floor((screenshotHour % 1) * 60)).padStart(2, '0')}:00`;
        screenshots.push({
            id: id * 100 + i,
            timestamp: screenshotTime,
            imageUrl: `https://images.unsplash.com/photo-${1530000000 + Math.floor(Math.random() * 10000000)}?w=800&h=600&fit=crop`
        });
    }

    // Generate applications used
    const appCount = 3 + Math.floor(Math.random() * 3); // 3-5 apps
    const applications = [];
    const usedAppIndexes = new Set<number>();
    while (usedAppIndexes.size < appCount) {
        usedAppIndexes.add(Math.floor(Math.random() * applicationData.length));
    }

    let remainingTime = activeTime;
    Array.from(usedAppIndexes).forEach((appIndex, i) => {
        const isLast = i === usedAppIndexes.size - 1;
        const appData = applicationData[appIndex];
        const appTimePercent = isLast ? 1 : 0.2 + Math.random() * 0.3;
        const appTime = isLast ? remainingTime : Math.floor(activeTime * appTimePercent);
        remainingTime -= appTime;

        applications.push({
            id: id * 100 + i,
            name: appData.name,
            timeSpent: appTime,
            icon: appData.icon
        });
    });

    // Generate browsed links
    const linkCount = 2 + Math.floor(Math.random() * 4); // 2-5 links
    const links = [];
    for (let i = 0; i < linkCount; i++) {
        const linkHour = startHour + (workDuration / linkCount) * i;
        const linkTime = `${date}T${String(Math.floor(linkHour)).padStart(2, '0')}:${String(Math.floor((linkHour % 1) * 60)).padStart(2, '0')}:00`;
        const website = websites[Math.floor(Math.random() * websites.length)];
        links.push({
            id: id * 100 + i,
            url: website.url,
            title: website.title,
            timestamp: linkTime
        });
    }

    return {
        id,
        employeeId,
        startTime,
        endTime,
        activeTime,
        idleTime,
        screenshots,
        applications,
        links
    };
};

// Generate daily stats for February 2025
const februaryDays = [];
let sessionCounter = 1;
for (let day = 1; day <= 20; day++) {
    const date = `2025-02-${String(day).padStart(2, '0')}`;
    const sessions = [];

    // Skip weekends
    const dayOfWeek = new Date(date).getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;

    // Create sessions for different employees
    mockEmployees.forEach(employee => {
        // 80% chance an employee works on any given day
        if (Math.random() > 0.2) {
            const session = generateWorkSession(sessionCounter++, employee.id, date);
            sessions.push(session);
        }
    });

    // Calculate totals
    const totalHours = sessions.reduce((sum, session) => {
        const start = new Date(session.startTime).getTime();
        const end = new Date(session.endTime).getTime();
        return sum + (end - start) / 3600000;
    }, 0);

    const activeHours = sessions.reduce((sum, session) => sum + session.activeTime / 3600, 0);
    const idleHours = totalHours - activeHours;

    februaryDays.push({
        date,
        totalHours,
        activeHours,
        idleHours,
        sessionCount: sessions.length,
        sessions
    });
}

export const mockDailyStats: DailyStats[] = februaryDays;

// Generate weekly stats
export const mockWeeklyStats: WeeklyStats[] = [];
const weeksInFebruary = [
    { start: '2025-02-03', end: '2025-02-09' },
    { start: '2025-02-10', end: '2025-02-16' },
    { start: '2025-02-17', end: '2025-02-23' }
];

weeksInFebruary.forEach((week, index) => {
    const weekDays = mockDailyStats.filter(
        day => day.date >= week.start && day.date <= week.end
    );

    if (weekDays.length > 0) {
        const totalHours = weekDays.reduce((sum, day) => sum + day.totalHours, 0);
        const activeHours = weekDays.reduce((sum, day) => sum + day.activeHours, 0);
        const idleHours = weekDays.reduce((sum, day) => sum + day.idleHours, 0);
        const totalSessions = weekDays.reduce((sum, day) => sum + day.sessionCount, 0);

        mockWeeklyStats.push({
            weekStart: week.start,
            weekEnd: week.end,
            totalHours,
            activeHours,
            idleHours,
            averageSessionsPerDay: totalSessions / weekDays.length,
            dailyStats: weekDays
        });
    }
});

// Generate monthly stats
export const mockMonthlyStats: MonthlyStats[] = [
    {
        month: 'February',
        year: 2025,
        totalHours: mockWeeklyStats.reduce((sum, week) => sum + week.totalHours, 0),
        activeHours: mockWeeklyStats.reduce((sum, week) => sum + week.activeHours, 0),
        idleHours: mockWeeklyStats.reduce((sum, week) => sum + week.idleHours, 0),
        totalSessions: mockWeeklyStats.reduce((sum, week) =>
            sum + week.dailyStats.reduce((daySum, day) => daySum + day.sessionCount, 0), 0),
        weeklyStats: mockWeeklyStats
    }
];

// Generate a sample work session
export const mockWorkSession: WorkSession = mockDailyStats[0]?.sessions[0] || {
    id: 1,
    employeeId: 1,
    startTime: '2025-02-15T09:00:00',
    endTime: '2025-02-15T17:00:00',
    activeTime: 25200, // 7 hours
    idleTime: 3600, // 1 hour
    screenshots: [
        {
            id: 1,
            timestamp: '2025-02-15T09:30:00',
            imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&h=600&fit=crop'
        },
        {
            id: 2,
            timestamp: '2025-02-15T10:30:00',
            imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop'
        }
    ],
    applications: [
        {
            id: 1,
            name: 'Visual Studio Code',
            timeSpent: 14400,
            icon: 'https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@main/icons/vscode.svg'
        },
        {
            id: 2,
            name: 'Chrome',
            timeSpent: 7200,
            icon: 'https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@main/icons/chrome.svg'
        }
    ],
    links: [
        {
            id: 1,
            url: 'https://github.com',
            title: 'GitHub',
            timestamp: '2025-02-15T09:15:00'
        },
        {
            id: 2,
            url: 'https://stackoverflow.com',
            title: 'Stack Overflow',
            timestamp: '2025-02-15T10:45:00'
        }
    ]
};


// ============================================================
const WorkSession = {
    employeeId : "67c7226ad1f7f9949229f0c7",
    startTime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    endTime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    activeTime: 3600,   // Default to 1 hour in secondsidleTime: 900,
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
        ]
    },
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