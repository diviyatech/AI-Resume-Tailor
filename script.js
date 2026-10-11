function scrollToAnalyzer() {
    document.getElementById("results").style.display = "none";
    document.getElementById("loading").style.display = "none";

    const analyzer = document.getElementById("analyzer");
    analyzer.style.display = "block";

    analyzer.scrollIntoView({ behavior: "smooth" });
}


// Common skills to identify in resumes and job descriptions
const skillDatabase = [
    "Python", "Java", "JavaScript", "C++", "C", "SQL",
    "HTML", "CSS", "React", "Node.js", "Angular",
    "AWS", "Azure", "Docker", "Git", "GitHub",
    "Machine Learning", "Data Analysis", "Excel",
    "Communication", "Problem Solving", "Leadership",
    "Django", "Flask", "MongoDB", "MySQL",
    "Power BI", "TensorFlow", "Linux", "REST API",
    "TypeScript", "PHP", "Spring Boot", "Kubernetes"
];


// Find skills mentioned in text
function extractSkills(text) {
    const normalizedText = text.toLowerCase();

    return skillDatabase.filter(skill => {
        const escapedSkill = skill
            .toLowerCase()
            .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        const pattern = new RegExp(
            "(^|[^a-z0-9+#.])" +
            escapedSkill +
            "(?=$|[^a-z0-9+#.])",
            "i"
        );

        return pattern.test(normalizedText);
    });
}


// Check basic resume formatting
function checkFormatting(resume) {
    const issues = [];
    const text = resume.toLowerCase();

    if (!/\b[\w.+-]+@[\w.-]+\.[a-z]{2,}\b/i.test(resume)) {
        issues.push("Email address not detected.");
    }

    if (!/\b(summary|profile|objective)\b/i.test(text)) {
        issues.push("Professional summary or objective is missing.");
    }

    if (!/\b(education|qualification|degree)\b/i.test(text)) {
        issues.push("Education section is missing or not recognized.");
    }

    if (!/\b(project|projects|experience|internship|internships)\b/i.test(text)) {
        issues.push("Projects or experience section is missing.");
    }

    if (resume.trim().length < 250) {
        issues.push("Resume content is very short. Add relevant details.");
    }

    if (resume.trim().length > 4000) {
        issues.push("Resume content is lengthy. Consider making it concise.");
    }

    if (!/\b(skills|technical skills|core competencies)\b/i.test(text)) {
        issues.push("A clearly labelled skills section is missing.");
    }

    return issues;
}


// Safely display text in an HTML element
function setText(selector, value) {
    const element = document.querySelector(selector);

    if (element) {
        element.textContent = value;
    }
}


// Update a result list
function updateList(selector, items, emptyMessage) {
    const container = document.querySelector(selector);

    if (!container) return;

    container.replaceChildren();

    if (items.length === 0) {
        const li = document.createElement("li");
        li.textContent = emptyMessage;
        container.appendChild(li);
        return;
    }

    items.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        container.appendChild(li);
    });
}


// Analyze the resume and job description
function analyzeResume() {
    const resume = document.getElementById("resumeInput").value.trim();
    const job = document.getElementById("jobInput").value.trim();

    if (!resume || !job) {
        alert("Please paste both your resume and the job description.");
        return;
    }

    const resumeSkills = extractSkills(resume);
    const jobSkills = extractSkills(job);

    const matchingSkills = jobSkills.filter(skill =>
        resumeSkills.includes(skill)
    );

    const missingSkills = jobSkills.filter(skill =>
        !resumeSkills.includes(skill)
    );

    // Calculate score using the skills found in the job description.
    // If no recognized skills are found, use text similarity as a fallback.
    let score;

    if (jobSkills.length > 0) {
        score = Math.round(
            (matchingSkills.length / jobSkills.length) * 100
        );
    } else {
        const resumeWords = new Set(
            resume.toLowerCase().match(/\b[a-z0-9+#.]+\b/g) || []
        );

        const jobWords =
            job.toLowerCase().match(/\b[a-z0-9+#.]+\b/g) || [];

        const meaningfulWords = jobWords.filter(
            word => word.length > 2
        );

        const uniqueJobWords = [...new Set(meaningfulWords)];

        const commonWords = uniqueJobWords.filter(
            word => resumeWords.has(word)
        );

        score = uniqueJobWords.length
            ? Math.round(
                commonWords.length / uniqueJobWords.length * 100
            )
            : 0;
    }

    const formattingIssues = checkFormatting(resume);

    const recommendations = [];

    if (missingSkills.length > 0) {
        recommendations.push(
            "Review these job requirements: " +
            missingSkills.join(", ") +
            ". Add them only if you genuinely have these skills."
        );
    }

    if (formattingIssues.length > 0) {
        recommendations.push(
            "Improve your resume structure by addressing the formatting issues listed."
        );
    }

    if (!/\b(action|built|developed|created|implemented|improved|designed)\b/i.test(resume)) {
        recommendations.push(
            "Describe your projects using action verbs such as developed, built, or implemented."
        );
    }

    if (matchingSkills.length > 0) {
        recommendations.push(
            "Highlight your matching skills: " +
            matchingSkills.join(", ") +
            " in your summary and relevant project descriptions."
        );
    }

    if (recommendations.length === 0) {
        recommendations.push(
            "Your resume contains the recognized job skills. Review the job requirements and tailor your project descriptions to them."
        );
    }

    // Update score
    const scoreElement = document.querySelector(".big-score strong");

    if (scoreElement) {
        scoreElement.textContent = score;
    }

    // Update the score circle if the existing design uses one
    const scoreCircle = document.querySelector(".score-circle");

    if (scoreCircle) {
        scoreCircle.style.background =
            `conic-gradient(#8b5cf6 ${score * 3.6}deg, #25243a 0deg)`;
    }

    // Update the result headings and lists when available
    updateList(
        "#results .matching-skills ul",
        matchingSkills,
        "No matching skills detected."
    );

    updateList(
        "#results .skill-gaps ul",
        missingSkills,
        "No missing recognized skills detected."
    );

    updateList(
        "#results .formatting-issues ul",
        formattingIssues,
        "No basic formatting issues detected."
    );

    updateList(
        "#results .recommendations ul",
        recommendations,
        "Review your resume against the job requirements."
    );

    // Keep compatibility with the existing loading animation
    document.getElementById("analyzer").style.display = "none";

    const loading = document.getElementById("loading");
    loading.style.display = "block";
    loading.scrollIntoView({ behavior: "smooth" });

    const loadingText = document.getElementById("loadingText");

    const steps = document.querySelectorAll(".loading-step");

    const messages = [
        "Scanning resume content...",
        "Comparing job requirements...",
        "Detecting skill gaps...",
        "Generating recommendations..."
    ];

    steps.forEach(step => step.classList.remove("active"));

    let currentStep = 0;

    loadingText.textContent = messages[0];

    const interval = setInterval(() => {
        if (currentStep < steps.length) {
            steps[currentStep].classList.add("active");
            loadingText.textContent =
                messages[Math.min(currentStep, messages.length - 1)];

            currentStep++;
        } else {
            clearInterval(interval);

            setTimeout(() => {
                loading.style.display = "none";

                const results = document.getElementById("results");
                results.style.display = "block";
                results.scrollIntoView({ behavior: "smooth" });
            }, 500);
        }
    }, 700);
}
