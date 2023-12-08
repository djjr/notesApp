// Assuming the data from the first file is stored in a variable named data1
// And the data from the second file is stored in a variable named data2

// Function to merge the two datasets
function mergeData(data1, data2) {
    // Creating a dictionary from data2 for easy lookup
    const data2Dict = data2.reduce((acc, item) => {
        acc[item.question.substring(1)] = item.tags;  // Removing the leading 'Q' and storing tags
        return acc;
    }, {});

    // Merging the data
    return data1.map(item => {
        const questionNumber = item.number.substring(1); // Removing the leading 'Q'
        const tags = data2Dict[questionNumber] || [];    // Getting tags if available
        return { 
            number: item.number, 
            question: item.question, 
            soln: item.soln, 
            tags: tags 
        };
    });
}

// Performing the merge
const mergedData = mergeData(data1, data2);

// Output the merged data in a formatted way
console.log(JSON.stringify(mergedData, null, 2));
