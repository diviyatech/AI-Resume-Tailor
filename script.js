function scrollToAnalyzer() {
    document.getElementById("analyzer").scrollIntoView({
        behavior: "smooth"
    });
}


function analyzeResume() {

    const resume = document.getElementById("resumeInput").value.trim();
    const job = document.getElementById("jobInput").value.trim();

    // Check if inputs are empty
    if (resume === "" || job === "") {

        alert("Please paste both your resume and the job description.");

        return;
    }


    // Hide analyzer
    document.getElementById("analyzer").style.display = "none";

    // Show loading section
    const loading = document.getElementById("loading");

    loading.style.display = "block";

    loading.scrollIntoView({
        behavior: "smooth"
    });


    // Loading messages
    const loadingText = document.getElementById("loadingText");

    const steps = document.querySelectorAll(".loading-step");

    const messages = [
        "Scanning resume content...",
        "Comparing job requirements...",
        "Detecting skill gaps...",
        "Generating recommendations..."
    ];


    let currentStep = 0;


    const interval = setInterval(() => {

        if (currentStep < steps.length) {

            steps[currentStep].classList.add("active");

            loadingText.textContent = messages[currentStep];

            currentStep++;

        } else {

            clearInterval(interval);

            setTimeout(showResults, 700);

        }

    }, 900);

}



function showResults() {

    // Hide loading
    document.getElementById("loading").style.display = "none";


    // Show results
    const results = document.getElementById("results");

    results.style.display = "block";

    results.scrollIntoView({
        behavior: "smooth"
    });


    // Animate score
    animateScore();

}



function animateScore() {

    const scoreElement = document.querySelector(".big-score strong");

    let score = 0;

    const targetScore = 78;


    const animation = setInterval(() => {

        score++;

        scoreElement.textContent = score;

        if (score >= targetScore) {

            clearInterval(animation);

        }

    }, 20);

}
