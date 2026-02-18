export const placeholderClasses = [
    { id: 1, title: "COM SCI 35L" },
    { id: 2, title: "MATH 61" },
    { id: 3, title: "PHYSICS 1A" },
    { id: 4, title: "PHYSICS 1B" },
    { id: 5, title: "PHYSICS 1C" },
    { id: 6, title: "COM SCI 180" },
    { id: 7, title: "EC ENGR 100" },
    { id: 8, title: "EC ENGR C147" },
    { id: 9, title: "COM SCI 31" },
    { id: 10, title: "COM SCI 32" },
    { id: 11, title: "COM SCI 33" },
    { id: 12, title: "COM SCI 111" },
    { id: 13, title: "COM SCI 131" },
    { id: 14, title: "COM SCI M151B" },
    { id: 15, title: "COM SCI 118" },
    { id: 16, title: "MATH 31A" },
    { id: 17, title: "MATH 31B" },
    { id: 18, title: "MATH 32A" },
    { id: 19, title: "MATH 32B" },
    { id: 20, title: "MATH 33A" },
    { id: 21, title: "MATH 33B" },
    { id: 22, title: "MATH 115A" },
    { id: 23, title: "PHYSICS 4AL" },
    { id: 24, title: "PHYSICS 4BL" },
    { id: 25, title: "EC ENGR 3" },
    { id: 26, title: "EC ENGR 10" },
    { id: 27, title: "EC ENGR 113" },
    { id: 28, title: "STATS 100A" },
];

// export const placeholderGroups = [
//     { id: 1, title: "CS 61A Study Group" },
//     { id: 2, title: "Algorithms Review" },
//     { id: 3, title: "Project Pairing" },
// ];

export const placeholderSchedules = [
    { id: 1, group_id: 1, day: 1, start_time: "18:00:00", end_time: "20:00:00" },
    { id: 2, group_id: 1, day: 3, start_time: "18:00:00", end_time: "20:00:00" },
    { id: 3, group_id: 2, day: 2, start_time: "15:00:00", end_time: "16:00:00" },
    { id: 4, group_id: 3, day: 1, start_time: "18:00:00", end_time: "20:00:00" },
    { id: 5, group_id: 3, day: 1, start_time: "15:00:00", end_time: "16:00:00" },
]

export const placeholderUsers = [
    {
        id: 1,
        name: "John Smith",
        major: "Computer Science",
        year: "Sophomore",
        phone: "(555) 123-4567",
        email: "jordan@example.com",
        bio: "Passionate about collaborative studying, algorithms, and building helpful tools for classmates.",
        classIds: [1, 2, 3],
        groupIds: [
            1,
            2,
            3
        ]
    },
    {
        id: 2,
        name: "Jane Doe",
        major: "Electrical Engineering",
        year: "Junior",
        phone: "(555) 987-6543",
        email: "jane@example.com",
        bio: "Likes EE",
        classIds: [25, 26, 27],
        groupIds: [
            4,
            5,
            6,
            7,
            21
        ]
    },
    {
        id: 3,
        name: "Alex Johnson",
        major: "Mechanical Engineering",
        year: "Senior",
        phone: "(555) 456-7890",
        email: "alex@example.com",
        bio: "Likes ME",
        classIds: [30, 31, 32],
        groupIds: [
            7,
            8,
        ]
    },
    {
        id: 4,
        name: "Emily Davis",
        major: "Computer Science",
        year: "Senior",
        phone: "(555) 676-7676",
        email: "emily@example.com",
        bio: "Likes CS 2",
        classIds: [1, 6, 10],
        groupIds: [1]
    }
];

export const placeholderGroups = [
    {
        id: 1,
        title: "CS Study Group",
        description: "A group for students in CS to study together and prepare for exams.",
        meeting_link: "https://ucla.zoom.us/j/1234567890",
        schedule_ids: [
            { day: 1, start_time: "18:00:00", end_time: "20:00:00" },
            { day: 3, start_time: "18:00:00", end_time: "20:00:00" },
        ],
        class_ids: [1, 6],
    },
    {
        id: 2,
        title: "Math 61 Review",
        description: "Review for math 61 because this class is too hard.",
        meeting_link: "https://meet.google.com/abg-defg-hij",
        schedule_ids: [
            { day: 1, start_time: "18:00:00", end_time: "20:00:00" },
            { day: 1, start_time: "15:00:00", end_time: "16:00:00" },
            { day: 1, start_time: "03:00:00", end_time: "05:00:00" },
        ],
        class_ids: [1],
    },
    {
        id: 3,
        title: "Eggert OS Survivors",
        description: "Trying to understand file systems before the deadline. Send help.",
        meeting_link: "https://ucla.zoom.us/j/9876543210",
        schedule_ids: [
            { day: 2, start_time: "20:00:00", end_time: "22:00:00" },
            { day: 4, start_time: "20:00:00", end_time: "22:00:00" },
        ],
        class_ids: [12], // CS 111
    },
    {
        id: 4,
        title: "CS 32 Project 3 Support Group",
        description: "A safe space for those currently being defeated by NachenBlaster or kontane.",
        meeting_link: "https://meet.google.com/xyz-pdq-rsu",
        schedule_ids: [
            { day: 6, start_time: "10:00:00", end_time: "14:00:00" },
        ],
        class_ids: [10], // CS 32
    },
    {
        id: 5,
        title: "Lower Div Math Grind",
        description: "General study group for the 31/32 Calculus series.",
        meeting_link: "https://ucla.zoom.us/j/5556667777",
        schedule_ids: [
            { day: 1, start_time: "16:00:00", end_time: "18:00:00" },
            { day: 3, start_time: "16:00:00", end_time: "18:00:00" },
        ],
        class_ids: [16, 17, 18, 19],
    },
    {
        id: 6,
        title: "Physics 4AL/BL Lab Reports",
        description: "Let's suffer through error analysis and Logger Pro together.",
        meeting_link: "https://meet.google.com/lab-help-ucla",
        schedule_ids: [
            { day: 4, start_time: "19:00:00", end_time: "21:00:00" },
        ],
        class_ids: [23, 24],
    },
    {
        id: 7,
        title: "CS 180 Algo Practice",
        description: "Focusing on Dynamic Programming and Greedy algorithms for the midterm.",
        meeting_link: "https://ucla.zoom.us/j/1112223333",
        schedule_ids: [
            { day: 2, start_time: "18:30:00", end_time: "20:30:00" },
        ],
        class_ids: [6], // CS 180
    },
    {
        id: 8,
        title: "Linear Algebra & Proofs",
        description: "For students in 33A or 115A. Transitioning from computation to proofs.",
        meeting_link: "https://ucla.zoom.us/j/4445556666",
        schedule_ids: [
            { day: 5, start_time: "14:00:00", end_time: "16:00:00" },
        ],
        class_ids: [20, 22],
    },
    {
        id: 9,
        title: "EE 100/113 Circuit Junkies",
        description: "Analyzing signals, systems, and why our breadboards aren't working.",
        meeting_link: "https://meet.google.com/ee-crew-ucla",
        schedule_ids: [
            { day: 3, start_time: "17:00:00", end_time: "19:00:00" },
        ],
        class_ids: [7, 27],
    },
    {
        id: 10,
        title: "CS 35L Scripting Gods",
        description: "Bash, React, and constant Git merge conflicts.",
        meeting_link: "https://ucla.zoom.us/j/8889990000",
        schedule_ids: [
            { day: 1, start_time: "19:00:00", end_time: "21:00:00" },
        ],
        class_ids: [1],
    },
    {
        id: 11,
        title: "Stats 100A Breakfast Club",
        description: "Early morning probability review before the 9am lecture.",
        meeting_link: "https://ucla.zoom.us/j/1010101010",
        schedule_ids: [
            { day: 2, start_time: "08:00:00", end_time: "09:00:00" },
            { day: 4, start_time: "08:00:00", end_time: "09:00:00" },
        ],
        class_ids: [28],
    },
    {
        id: 12,
        title: "CS 131 Haskell Horror",
        description: "Functional programming is hard. Let's talk about Python vs OCaml.",
        meeting_link: "https://meet.google.com/cs131-help",
        schedule_ids: [
            { day: 3, start_time: "21:00:00", end_time: "23:00:00" },
        ],
        class_ids: [13],
    },
    {
        id: 13,
        title: "Physics 1 Series Squad",
        description: "Covering 1A, 1B, and 1C topics. Good for premeds and engineers.",
        meeting_link: "https://ucla.zoom.us/j/2223334444",
        schedule_ids: [
            { day: 0, start_time: "13:00:00", end_time: "15:00:00" }, // Sunday session
        ],
        class_ids: [3, 4, 5],
    },
    {
        id: 14,
        title: "Deep Learning Enthusiasts",
        description: "Working through projects for EC ENGR C147.",
        meeting_link: "https://ucla.zoom.us/j/7778889999",
        schedule_ids: [
            { day: 5, start_time: "16:00:00", end_time: "18:00:00" },
        ],
        class_ids: [8],
    },
    {
        id: 15,
        title: "CS 31 Midnight Coders",
        description: "For the beginners. We learn cin/cout and basic loops.",
        meeting_link: "https://meet.google.com/cs31-night",
        schedule_ids: [
            { day: 1, start_time: "23:00:00", end_time: "01:00:00" },
        ],
        class_ids: [9],
    },
    {
        id: 16,
        title: "Assembly & Architecture",
        description: "Tracing x86_64 code until our eyes bleed (CS 33).",
        meeting_link: "https://ucla.zoom.us/j/1212121212",
        schedule_ids: [
            { day: 4, start_time: "15:00:00", end_time: "17:00:00" },
        ],
        class_ids: [11, 14],
    },
    {
        id: 17,
        title: "Math 33B Diff Eq Pros",
        description: "Solving ODEs and Systems for the weekly quizzes.",
        meeting_link: "https://meet.google.com/math-33b",
        schedule_ids: [
            { day: 2, start_time: "11:00:00", end_time: "12:30:00" },
        ],
        class_ids: [21],
    },
    {
        id: 18,
        title: "Networking Nerds",
        description: "CS 118 study group focusing on TCP/IP and HTTP protocols.",
        meeting_link: "https://ucla.zoom.us/j/3434343434",
        schedule_ids: [
            { day: 3, start_time: "14:00:00", end_time: "16:00:00" },
        ],
        class_ids: [15],
    },
    {
        id: 19,
        title: "EE 3 Intro Group",
        description: "Making sure we don't blow up our components in the lab.",
        meeting_link: "https://meet.google.com/ee3-basics",
        schedule_ids: [
            { day: 5, start_time: "10:00:00", end_time: "11:00:00" },
        ],
        class_ids: [25],
    },
    {
        id: 20,
        title: "Multivariable Calc (32B)",
        description: "Stuck on Green's Theorem and Stokes' Theorem.",
        meeting_link: "https://ucla.zoom.us/j/5656565656",
        schedule_ids: [
            { day: 1, start_time: "18:00:00", end_time: "20:00:00" },
        ],
        class_ids: [19],
    },
    {
        id: 21,
        title: "CS Transfer Students",
        description: "Social/study group for CS transfers taking 35L and 180.",
        meeting_link: "https://ucla.zoom.us/j/7878787878",
        schedule_ids: [
            { day: 6, start_time: "12:00:00", end_time: "14:00:00" },
        ],
        class_ids: [1, 6],
    },
    {
        id: 22,
        title: "Math 61 Discrete Duo",
        description: "Combinatorics and Graph Theory review.",
        meeting_link: "https://meet.google.com/math61-rev",
        schedule_ids: [
            { day: 4, start_time: "17:00:00", end_time: "18:30:00" },
        ],
        class_ids: [2],
    }
]