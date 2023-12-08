<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Questions and Solutions</title>
    <style>
        .question-container {
            margin-bottom: 20px;
        }

        .solution {
            display: none;
            margin-top: 10px;
            background-color: #f3f3f3;
            padding: 10px;
            border: 1px solid #ccc;
        }
    </style>
</head>

<body>

    <div id="content"></div>
<script src="data.js"></script>
    <script>
        function toggleSolution(el) {
            const solutionDiv = el.nextElementSibling;
            if (solutionDiv.style.display === 'none') {
                solutionDiv.style.display = 'block';
            } else {
                solutionDiv.style.display = 'none';
            }
        }

        function renderQuestionsAndSolutions() {
            const contentDiv = document.getElementById('content');
            let html = '';

            data.forEach(item => {
                html += `
                    <div class="question-container">
                        <div class="question">${item.number}. ${item.question}</div>
                        <button onclick="toggleSolution(this)">Show Solution</button>
                        <div class="solution">${item.soln}</div>
                    </div>
                `;
            });

            contentDiv.innerHTML = html;
        }

        renderQuestionsAndSolutions();
    </script>

</body>

</html>
