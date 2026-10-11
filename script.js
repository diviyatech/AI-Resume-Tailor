function scrollToAnalyzer() {
    showPage("analyzer");
}
function showPage(page) {
    const pages = ["home", "analyzer", "about"];

    pages.forEach(function (id) {
        const section = document.getElementById(id);

        if (section) {
            section.style.display = "none";
        }
    });

    const loading = document.getElementById("loading");
    const results = document.getElementById("results");

    if (loading) loading.style.display = "none";
    if (results) results.style.display = "none";

    const selectedPage = document.getElementById(page);

    if (selectedPage) {
        selectedPage.style.display = "block";
        window.scrollTo(0, 0);
    }
}

function analyzeResume() {
    const resume = document.getElementById("resumeInput").value.trim();
    const job = document.getElementById("jobInput").value.trim();

    if (!resume || !job) {
        alert("Please paste both your resume and the job description.");
        return;
    }

    const skills = [
        "HTML", "CSS", "JavaScript", "React", "Python",
        "Java", "SQL", "Git", "AWS", "Docker", "Node.js",
        "C++", "C", "Machine Learning", "Communication",
        "Problem Solving", "Excel", "MongoDB", "Linux",
        "REST API", "TypeScript"
    ];

    const resumeLower = resume.toLowerCase();
    const jobLower = job.toLowerCase();

    const requiredSkills = skills.filter(skill =>
        jobLower.includes(skill.toLowerCase())
    );

    if (requiredSkills.length === 0) {
        alert("The job description does not contain any recognised skills. Please include technical or professional skills.");
        return;
    }

    const matchingSkills = requiredSkills.filter(skill =>
        resumeLower.includes(skill.toLowerCase())
    );

    const missingSkills = requiredSkills.filter(skill =>
        !resumeLower.includes(skill.toLowerCase())
    );

    const score = Math.round(
        (matchingSkills.length / requiredSkills.length) * 100
    );

    const formattingIssues = [];

    if (!/professional summary|career objective|profile summary/i.test(resume)) {
        formattingIssues.push("Consider adding a professional summary or career objective.");
    }

    if (resume.length < 200) {
        formattingIssues.push("Your resume may need more details about your education, projects, and experience.");
    }

    if (!/education/i.test(resume)) {
        formattingIssues.push("Add an Education section.");
    }

    if (!/project/i.test(resume)) {
        formattingIssues.push("Consider including relevant academic or personal projects.");
    }

    const scoreElement = document.querySelector(".big-score strong");
    if (scoreElement) {
        scoreElement.textContent = score;
    }

    const resultHeading = document.querySelector("#results h2");
    if (resultHeading) {
        resultHeading.textContent =
            score >= 75 ? "Good Match" :
            score >= 40 ? "Moderate Match" :
            "Needs Improvement";
    }

    const resultText = document.querySelector("#results p");
    if (resultText) {
        resultText.textContent =
            `Your resume matches ${matchingSkills.length} out of ${requiredSkills.length} recognised skills in the job description.`;
    }

    const cards = document.querySelectorAll("#results .result-card");

    if (cards.length >= 3) {
        cards[0].innerHTML = `
            <h3>Matching Skills</h3>
            <div class="skill-list">
                ${matchingSkills.length
                    ? matchingSkills.map(skill => `<span class="skill-tag">${skill}</span>`).join("")
                    : "<p>No matching skills found.</p>"}
            </div>
        `;

        cards[1].innerHTML = `
            <h3>Skill Gaps</h3>
            <div class="skill-list">
                ${missingSkills.length
                    ? missingSkills.map(skill => `<span class="skill-tag">${skill}</span>`).join("")
                    : "<p>No recognised skill gaps found!</p>"}
            </div>
        `;

        cards[2].innerHTML = `
            <h3>Formatting Issues</h3>
            ${formattingIssues.length
                ? `<ul>${formattingIssues.map(issue => `<li>${issue}</li>`).join("")}</ul>`
                : "<p>No basic content issues detected.</p>"}
        `;
    }

    const recommendations = document.querySelector("#results .recommendations");

    if (recommendations) {
        recommendations.innerHTML = `
            <h3>How to Improve Your Resume</h3>
            <ul>
                ${missingSkills.length
                    ? `<li>Highlight relevant experience with: ${missingSkills.join(", ")}. Only include skills you genuinely have.</li>`
                    : "<li>Your resume includes all recognised skills listed in this job description.</li>"}
                ${formattingIssues.map(issue => `<li>${issue}</li>`).join("")}
                <li>Use specific examples from your projects to demonstrate your skills.</li>
            </ul>
        `;
    }

    document.getElementById("analyzer").style.display = "none";
    document.getElementById("loading").style.display = "none";

    const results = document.getElementById("results");
    results.style.display = "block";
    results.scrollIntoView({ behavior: "smooth" });
}
