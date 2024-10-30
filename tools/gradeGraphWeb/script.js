let yValue = 250;

// Function to get scores from input or file
async function getScores() {
    const inputText = $('#scoreInput').val().trim();
    if (inputText) {
        try {
            let scores;
            if (inputText.startsWith('[') && inputText.endsWith(']')) {
                scores = JSON.parse(inputText);
            } else {
                scores = inputText.split(/\s+/).map(Number);
            }

            if (scores.some(isNaN)) throw new Error("All elements must be numbers.");
            return scores;
        } catch (error) {
            alert("Invalid input: " + error.message);
            return null;
        }
    }

    const fileInput = $('#fileInput')[0];
    if (fileInput.files.length > 0) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function(event) {
                const scores = event.target.result.trim().split(/\s+/).map(Number);
                resolve(scores);
            };
            reader.onerror = reject;
            reader.readAsText(fileInput.files[0]);
        });
    }

    alert("Please enter scores or select a file.");
    return null;
}

// Function to analyze scores and display results
async function runAnalysis() {
    try {
        let scores = await getScores();

        if (!scores || scores.length === 0) {
            alert("No scores available. Please check your input.");
            return;
        }

        console.log("Scores received:", scores);

        const mean = calculateMean(scores);
        const stdDev = calculateStandardDeviation(scores);
        const countAboveMean = scores.filter(score => score > mean).length;
        const countBelowMean = scores.filter(score => score < mean).length;

        console.log("Mean:", mean);
        console.log("Standard Deviation:", stdDev);
        console.log("Count Above Mean:", countAboveMean);
        console.log("Count Below Mean:", countBelowMean);

        $('#result').text(
            `Mean: ${mean.toFixed(2)}\n` +
            `Standard Deviation: ${stdDev.toFixed(2)}\n` +
            `Count Above Mean: ${countAboveMean}\n` +
            `Count Below Mean: ${countBelowMean}`
        );

        const granularity = parseInt($('#granularity').val(), 10);
        if (isNaN(granularity) || granularity <= 0) {
            alert("Please enter a valid granularity for histogram plotting.");
            return;
        }

        plotHistogram(scores, granularity, mean, stdDev);
        plotBellCurve(scores, mean, stdDev);

    } catch (error) {
        console.error("An error occurred during analysis:", error);
        alert("An error occurred during analysis. Please check the console for details.");
    }
}

// Function to calculate mean
function calculateMean(scores) {
    const sum = scores.reduce((acc, val) => acc + val, 0);
    return sum / scores.length;
}

// Function to calculate standard deviation
function calculateStandardDeviation(scores) {
    const mean = calculateMean(scores);
    const variance = scores.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / scores.length;
    return Math.sqrt(variance);
}

// Function to plot histogram
function plotHistogram(scores, bins, mean, stdDev) {
    const ctx = $('#histogramChart')[0].getContext('2d');
    const histogramData = new Array(bins).fill(0);

    const minScore = Math.min(...scores);
    const maxScore = Math.max(...scores);
    const binSize = (maxScore - minScore) / bins;

    scores.forEach(score => {
        const binIndex = Math.min(Math.floor((score - minScore) / binSize), bins - 1);
        histogramData[binIndex]++;
    });

    const labels = Array.from({ length: bins }, (_, i) => (minScore + i * binSize).toFixed(2));

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Histogram',
                data: histogramData,
                backgroundColor: 'rgba(75, 192, 192, 0.6)'
            }]
        },
        options: {
            scales: {
                x: { title: { display: true, text: 'Scores' } },
                y: { title: { display: true, text: 'Count' } }
            }
        }
    });
}

// Function to plot bell curve with mean and ±1 z-score lines
function plotBellCurve(scores, mean, stdDev) {
    const ctx = $('#bellCurveChart')[0].getContext('2d');
    const xValues = [];
    const yValues = [];
    const step = (100 - 60) / 100; // Adjusted step calculation for 60 to 100

    for (let x = 60; x <= 100; x += step) { // Limit x range from 60 to 100
        const y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
        xValues.push(x.toFixed(2));
        yValues.push(y * scores.length);
    }

    const meanIndex = xValues.findIndex(x => parseFloat(x) >= mean);
    const plusOneZIndex = xValues.findIndex(x => parseFloat(x) >= (mean + stdDev));
    const minusOneZIndex = xValues.findIndex(x => parseFloat(x) >= (mean - stdDev));

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: xValues,
            datasets: [{
                label: 'Bell Curve',
                data: yValues,
                fill: true,
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: { title: { display: true, text: 'Scores' } },
                y: { title: { display: true, text: 'Density' } }
            },
            plugins: {
                annotation: {
                    annotations: {
                        meanLine: {
                            type: 'line',
                            scaleID: 'x',
                            value: meanIndex,
                            borderColor: 'red',
                            borderWidth: 2,
                            label: {
                                content: `Mean: ${mean.toFixed(2)}`,
                                enabled: true,
                                position: 'start',
                                yAdjust: yValue,
                                backgroundColor: 'rgba(255, 99, 132, 0.25)',
                                color: 'black'
                            }
                        },
                        plusOneZLine: {
                            type: 'line',
                            scaleID: 'x',
                            value: plusOneZIndex,
                            borderColor: 'blue',
                            borderWidth: 2,
                            label: {
                                content: `+1 Z: ${(mean + stdDev).toFixed(2)}`,
                                enabled: true,
                                position: 'start',
                                yAdjust: yValue,
                                backgroundColor: 'rgba(54, 162, 235, 0.25)',
                                color: 'black'
                            }
                        },
                        minusOneZLine: {
                            type: 'line',
                            scaleID: 'x',
                            value: minusOneZIndex,
                            borderColor: 'blue',
                            borderWidth: 2,
                            label: {
                                content: `-1 Z: ${(mean - stdDev).toFixed(2)}`,
                                enabled: true,
                                position: 'start',
                                yAdjust: yValue,
                                backgroundColor: 'rgba(54, 162, 235, 0.25)',
                                color: 'black'
                            }
                        }
                    }
                }
            }
        }
    });
}

// Theme Toggle Function
$(document).ready(function() {
    $('#themeToggle').click(function() {
        $('body').toggleClass('dark-theme');
        if ($('body').hasClass('dark-theme')) {
            $(this).text('Switch to Light Theme');
        } else {
            $(this).text('Switch to Dark Theme');
        }
    });
});
