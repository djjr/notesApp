document.getElementById('sampleTemplateButton').addEventListener('click', function() {
    const sampleTemplate = `[[headline]]\nIn 2024 SRI ran a workshop called [[name of workshop,24]] . In attendance were representatives of stakeholder groups such as [[stakeholder group,24]] and[[stakeholder group,24]] and [[stakeholder group,24]] . Over the following six months [[entity/organization,24]] and [[entity/organization,24]] and [[entity/organization,24]] collaborated to produce [[event, document, or entity,36]]. Around the same time [[Name of a startup,24]] figured out a way to [[something important for AI regulation,24]] and [[government entity,24]] recognized that [[issue for regulatory agencies,24]] and so proposed to [[something government agencies can do,24]] based on [[concept or idea, 24]].`;

    document.getElementById('madlibTemplate').value = sampleTemplate;
});

document.getElementById('gameModeButton').addEventListener('click', function() {
    const template = document.getElementById('madlibTemplate').value;
    //reconstructText(template, isGameMode = false);
    const formSection = document.getElementById('formSection');
    formSection.innerHTML = ''; // Clear previous form



    let modifiedTemplate = template;
    let headlineInputHtml = '';

    // Check if template starts with [[headline]]
    if (template.trim().startsWith('[[headline]]')) {
        modifiedTemplate = template.replace('[[headline]]', '');
        headlineInputHtml = `<input type="text" id="headlineInput" placeholder="Enter headline" style="width:100%;"><br>`;
    }

    // Regular expression to find placeholders
    const regex = /\[\[(.*?)\]\]/g;
    let match;
    let lastIndex = 0;
    let formHtml = headlineInputHtml;

    let inputCounter = 0;


    while ((match = regex.exec(modifiedTemplate)) !== null) {
        // Add text before placeholder
        //formHtml += modifiedTemplate.substring(lastIndex, match.index);

        // Extract hint and size
        const lastCommaIndex = match[1].lastIndexOf(',');
        let hint, size;

        // Check if there is a size parameter
        if (lastCommaIndex > -1 && lastCommaIndex != match[1].length - 1) {
            hint = match[1].substring(0, lastCommaIndex).trim();
            size = match[1].substring(lastCommaIndex + 1).trim();
        } else {
            hint = match[1].trim();
            size = "20"; // Default size
        }


        // Create a line for each hint followed by an input field
        //formHtml += `<div>${hint}: <input type="text" id="input${inputCounter}" style="width:${size}em;"></div>`;
        formHtml += `<input type="text" id="input${inputCounter}" placeholder="${hint}" style="width:${size}em;">`;
        inputCounter++;


        lastIndex = regex.lastIndex;
    }

    // Add submit button
    formHtml += '<button id="submitFormButton">Submit Mad Lib</button>';
    formSection.innerHTML = formHtml;

    // // Handle form submission for game mode...
        // Handle form submission
    document.getElementById('submitFormButton').addEventListener('click', function() {
        //const template = document.getElementById('madlibTemplate').value;
        reconstructText(modifiedTemplate, isGameMode = false);
    })
});

document.getElementById('produceMadLibButton').addEventListener('click', function() {
    const template = document.getElementById('madlibTemplate').value;
    const formSection = document.getElementById('formSection');
    formSection.innerHTML = ''; // Clear previous form


    let modifiedTemplate = template;
    let headlineInputHtml = '';

    // Check if template starts with [[headline]]
    if (template.trim().startsWith('[[headline]]')) {
        modifiedTemplate = template.replace('[[headline]]', '');
        headlineInputHtml = `<input type="text" id="headlineInput" placeholder="Enter headline" style="width:100%;"><br>`;
    }

    // Regular expression to find placeholders
    const regex = /\[\[(.*?)\]\]/g;
    let match;
    let lastIndex = 0;
    let formHtml = '';

    let inputCounter = 0;


    while ((match = regex.exec(modifiedTemplate)) !== null) {
        // Add text before placeholder
        formHtml += modifiedTemplate.substring(lastIndex, match.index);

        // Extract hint and size
        const lastCommaIndex = match[1].lastIndexOf(',');
        const hint = match[1].substring(0, lastCommaIndex).trim();
        const size = match[1].substring(lastCommaIndex + 1).trim();
        

        // Create inline input field with placeholder
        //formHtml += `<span class="inline-input"><input type="text" id="input${regex.lastIndex}" placeholder="${hint}" style="width:${size}em;"></span>`;
        formHtml += `<span class="inline-input"><input type="text" id="input${inputCounter}" placeholder="${hint}" style="width:${size}em;"></span>`;
        inputCounter++;


        lastIndex = regex.lastIndex;
    }

    // Add remaining text
    formHtml += modifiedTemplate.substring(lastIndex);

    // Add submit button
    formHtml += '<button id="submitFormButton">Submit Mad Lib</button>';
    formSection.innerHTML = headlineInputHtml + formHtml;

    // Handle form submission
    document.getElementById('submitFormButton').addEventListener('click', function() {
        //const template = document.getElementById('madlibTemplate').value;
        reconstructText(modifiedTemplate, isGameMode = false)

    });
});


function reconstructText(template, isGameMode = false) {
    let result = template;
    let inputCounter = 0;
    const regex = /\[\[(.*?)\]\]/g;
    let match;

    let headline = '';

    // Check if headline input is present
    if (document.getElementById('headlineInput')) {
        console.log(`input${inputCounter}`)
        headline = document.getElementById('headlineInput').value;
        document.getElementById('headline').innerHTML = `<div><h1>${headline}</h1></div>`;
    }

    //inputCounter = 0; // Reset counter before reusing

    while ((match = regex.exec(template)) !== null) {
        const inputElement = document.getElementById(`input${inputCounter}`);
        console.log(`Match: ${match[0]}, Input ID: input${inputCounter}`);
        if (inputElement) {
            userInput = document.getElementById(`input${inputCounter}`).value;
            result = result.replace(match[0], `<span class="user-input">${userInput}</span>`);
        }
        inputCounter++;
    }
    document.getElementById('banner').innerHTML ='<img src="banner.png" width="100%">'
    document.getElementById('result').innerHTML = result;
    document.getElementById('resultSection').style.display = 'block';
}
