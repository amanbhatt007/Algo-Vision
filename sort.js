// Bubble sort function with interactive explanations
function bubbleSort(arr) {
    let n = arr.length;
    let steps = [];  // To store the steps for visualization
    let explanations = [];  // To store the explanations for each step

    // Capture the initial state
    steps.push(arr.slice());
    explanations.push({
        text: 'Initial array: ',
        array: arr.slice()
    });

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            // Log the current state before any swap
            steps.push(arr.slice());
            explanations.push({
                text: `Comparing ${arr[j]} and ${arr[j + 1]} at positions ${j} and ${j + 1}`,
                array: arr.slice(),
                comparison: [j, j + 1]
            });

            if (arr[j] > arr[j + 1]) {
                // Swap arr[j] and arr[j + 1]
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];

                // Log the state after swapping
                steps.push(arr.slice());
                explanations.push({
                    text: `Swapped ${arr[j]} and ${arr[j + 1]}`,
                    array: arr.slice(),
                    swap: [j, j + 1]
                });
            }
        }
    }

    return { steps, explanations };
}

// Selection sort function with interactive explanations
function selectionSort(arr) {
    let n = arr.length;
    let steps = [];  // To store the steps for visualization
    let explanations = [];  // To store the explanations for each step

    // Capture the initial state
    steps.push(arr.slice());
    explanations.push({
        text: 'Initial array: ',
        array: arr.slice()
    });

    for (let i = 0; i < n - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < n; j++) {
            // Log the comparison
            steps.push(arr.slice());
            explanations.push({
                text: `Comparing ${arr[j]} at position ${j} with ${arr[minIndex]} at position ${minIndex}`,
                array: arr.slice(),
                comparison: [j, minIndex]
            });

            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        if (minIndex !== i) {
            // Swap arr[i] and arr[minIndex]
            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];

            // Log the state after swapping
            steps.push(arr.slice());
            explanations.push({
                text: `Swapped ${arr[i]} and ${arr[minIndex]}`,
                array: arr.slice(),
                swap: [i, minIndex]
            });
        }
    }

    return { steps, explanations };
}

// Quick sort function with interactive explanations
function quickSort(arr) {
    let steps = [];  // To store the steps for visualization
    let explanations = [];  // To store the explanations for each step

    // Helper function for partitioning
    function partition(low, high) {
        let pivot = arr[high]; // Choose the last element as the pivot
        let i = low - 1;

        // Log the pivot selection
        explanations.push({
            text: `Pivot selected: ${pivot} at position ${high}`,
            array: arr.slice(),
            pivot: high
        });
        steps.push(arr.slice());

        for (let j = low; j < high; j++) {
            // Log the comparison
            explanations.push({
                text: `Comparing ${arr[j]} at position ${j} with pivot ${pivot}`,
                array: arr.slice(),
                comparison: [j, high]
            });
            steps.push(arr.slice());

            if (arr[j] < pivot) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap smaller element to the left

                // Log the swap
                explanations.push({
                    text: `Swapped ${arr[i]} and ${arr[j]}`,
                    array: arr.slice(),
                    swap: [i, j]
                });
                steps.push(arr.slice());
            }
        }
        // Place the pivot in the correct position
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];

        explanations.push({
            text: `Placed pivot ${arr[i + 1]} in correct position at ${i + 1}`,
            array: arr.slice(),
            swap: [i + 1, high]
        });
        steps.push(arr.slice());

        return i + 1;
    }

    // Helper function for the recursive quick sort logic
    function quickSortHelper(low, high) {
        if (low < high) {
            let pi = partition(low, high);  // Partition the array

            // Recursively sort elements before and after partition
            quickSortHelper(low, pi - 1);
            quickSortHelper(pi + 1, high);
        }
    }

    // Initialize the sorting process
    quickSortHelper(0, arr.length - 1);

    return { steps, explanations };
}

function mergeSort(array) {
    let steps = [];
    let explanations = [];

    function merge(arr, start, mid, end) {
        let left = arr.slice(start, mid + 1);
        let right = arr.slice(mid + 1, end + 1);
        let i = 0, j = 0, k = start;

        explanations.push({
            text: `Merging two subarrays: Left (${left.join(', ')}) and Right (${right.join(', ')})`,
            array: [...arr],
            comparison: [start, end] // Highlight the current merge range
        });

        // Merge left and right arrays
        while (i < left.length && j < right.length) {
            if (left[i] <= right[j]) {
                arr[k] = left[i];
                i++;
            } else {
                arr[k] = right[j];
                j++;
            }
            steps.push([...arr]);

            explanations.push({
                text: `Comparing ${left[i - 1] || 'X'} and ${right[j - 1] || 'X'}`,
                array: [...arr],
                comparison: [k] // Highlight the current position in the merged array
            });

            k++;
        }

        // Copy remaining elements from left array
        while (i < left.length) {
            arr[k] = left[i];
            i++;
            k++;
            steps.push([...arr]);
            explanations.push({
                text: `Adding remaining element ${left[i - 1]} from left array`,
                array: [...arr],
                comparison: [k - 1] // Highlight the position of the addition
            });
        }

        // Copy remaining elements from right array
        while (j < right.length) {
            arr[k] = right[j];
            j++;
            k++;
            steps.push([...arr]);
            explanations.push({
                text: `Adding remaining element ${right[j - 1]} from right array`,
                array: [...arr],
                comparison: [k - 1] // Highlight the position of the addition
            });
        }

        explanations.push({
            text: `After merging: ${arr.slice(start, end + 1).join(', ')}`,
            array: [...arr]
        });
    }

    function divide(arr, start, end) {
        if (start < end) {
            let mid = Math.floor((start + end) / 2);

            explanations.push({
                text: `Dividing array: Left (${arr.slice(start, mid + 1).join(', ')}) and Right (${arr.slice(mid + 1, end + 1).join(', ')})`,
                array: [...arr],
                comparison: [start, end] // Highlight the division range
            });

            divide(arr, start, mid);
            divide(arr, mid + 1, end);
            merge(arr, start, mid, end);
        }
    }

    // Initial step to show the full array
    explanations.push({
        text: `Initial array: ${array.join(', ')}`,
        array: [...array]
    });
    steps.push([...array]);

    divide(array, 0, array.length - 1);

    return { steps, explanations };
}

// Insertion sort function with focused explanations on insertions and comparisons
function insertionSort(arr) {
    let steps = [];  // To store the steps for visualization
    let explanations = [];  // To store the explanations for each step

    // Capture the initial state
    steps.push(arr.slice());
    explanations.push({
        text: 'Initial array:',
        array: arr.slice()
    });

    for (let i = 1; i < arr.length; i++) {
        let key = arr[i];
        let j = i - 1;

        // Log the state before insertion
        let currentArray = arr.slice();
        explanations.push({
            text: `Preparing to insert ${key} into the sorted portion of the array`,
            array: currentArray,
            currentIndex: i,
            key: key
        });

        // Log comparisons and movements
        while (j >= 0) {
            // Log the comparison
            explanations.push({
                text: `Comparing ${arr[j]} at position ${j} with ${key}`,
                array: arr.slice(),
                comparison: [j, j+1]
            });

            if (arr[j] > key) {
                // Move arr[j] to arr[j + 1]
                arr[j + 1] = arr[j];
                arr[j] = `${key}`;
                currentArray = arr.slice();

                // Log the state after each move
                steps.push(currentArray);
                explanations.push({
                    text: `Swapped ${arr[j]} from position ${j+1} to position ${j}`,
                    array: currentArray,
                    move: [j+1, j]
                });

                j--;
            } else {
                break;  // Exit the loop if no more movements are needed
            }
        }
        arr[j + 1] = key;
        currentArray = arr.slice();

        // Log the state after insertion
        steps.push(currentArray);
        explanations.push({
            text: `Inserted ${key} at position ${j + 1}`,
            array: currentArray,
            insert: [j + 1],
            inserted: key
        });
    }

    return { steps, explanations };
}


// Function to generate input fields based on the number of elements
function generateInputFields() {
    let numElements = document.getElementById('numElements').value;
    let inputFieldsDiv = document.getElementById('inputFields');

    // Clear existing fields
    inputFieldsDiv.innerHTML = '';

    // Create new input fields
    for (let i = 0; i < numElements; i++) {
        let input = document.createElement('input');
        input.type = 'string';
        input.className = 'element-input';
        input.min = '0';  // Adjust min value as needed
        input.dataset.index = i;  // Store index for reference
        inputFieldsDiv.appendChild(input);

        // Add event listener for arrow key navigation
        input.addEventListener('keydown', function(event) {
            let currentInput = document.querySelector(`[data-index="${i}"]`);
            if (event.key === 'ArrowRight') {
                let nextInput = document.querySelector(`[data-index="${i + 1}"]`);
                if (nextInput) {
                    nextInput.focus();
                }
            } else if (event.key === 'ArrowLeft') {
                let prevInput = document.querySelector(`[data-index="${i - 1}"]`);
                if (prevInput) {
                    prevInput.focus();
                }
            }
        });
    }
}

// Function to collect array data from input fields
function getArrayFromInputs() {
    let inputs = document.querySelectorAll('.element-input');
    let array = Array.from(inputs).map(input => Number(input.value));
    return array;
}

// Function to initialize drag-and-drop
function initDragAndDrop() {
    let arrayContainer = document.querySelector('.array-container');
    if (arrayContainer) {
        Sortable.create(arrayContainer, {
            animation: 150,
            onEnd: function() {
                // Update the input fields when dragging ends
                let items = arrayContainer.querySelectorAll('span');
                let inputs = document.querySelectorAll('.element-input');
                Array.from(inputs).forEach((input, idx) => {
                    input.value = items[idx].textContent;
                });
            }
        });
    }
}

// Function to update the array visualization and initialize drag-and-drop
function updateArrayVisualization(array) {
    let arrayDiv = document.createElement('div');
    arrayDiv.className = 'array-container';
    array.forEach(num => {
        let span = document.createElement('span');
        span.textContent = num;
        arrayDiv.appendChild(span);
    });

    // Remove existing array container if it exists
    let existingArrayDiv = document.querySelector('.array-container');
    if (existingArrayDiv) {
        existingArrayDiv.remove();
    }

    document.getElementById('steps').insertBefore(arrayDiv, document.getElementById('result'));
    initDragAndDrop();  // Initialize drag-and-drop after updating the array
}

function sortArray(algorithm) {
    let array = getArrayFromInputs();  // Get array from input fields

    if (array.some(isNaN) || array.length === 0) {
        alert('Please enter valid numbers for all elements.');
        return;
    }

    let steps, explanations;
    if (algorithm === 'bubble') {
        ({ steps, explanations } = bubbleSort(array));
    } else if (algorithm === 'selection') {
        ({ steps, explanations } = selectionSort(array));
    } else if (algorithm === 'quick') {
        ({ steps, explanations } = quickSort(array));
    } else if (algorithm === 'merge') {
        ({ steps, explanations } = mergeSort(array));
    } else if (algorithm === 'insertion') {
        ({ steps, explanations } = insertionSort(array)); // Assuming you added insertion sort
    }

    // Display the sorted array
    document.getElementById('result').innerHTML = "<span style='color: darkblue;'>Final Sorted Array: " + steps[steps.length - 1].join(', ') + "</span>";

    // Display each step and explanation
    let stepsDiv = document.getElementById('steps');
    stepsDiv.innerHTML = '';  // Clear previous steps

    explanations.forEach((explanation, index) => {
        let stepDiv = document.createElement('div');
        stepDiv.innerHTML = `<span>${index + 1}. ${explanation.text}</span>`;
        let arrayDiv = document.createElement('div');
        arrayDiv.className = 'array-container';

        explanation.array.forEach((num, idx) => {
            let itemContainer = document.createElement('div');
            itemContainer.className = 'array-item-container';

            let span = document.createElement('span');
            span.textContent = num;

            if (explanation.comparison && explanation.comparison.includes(idx)) {
                span.className = 'compare'; // Apply compare class
                if (explanation.comparison.length === 2) {
                    let arrow = document.createElement('div');
                    arrow.className = 'arrow';
                    itemContainer.appendChild(arrow);
                }
            }

            itemContainer.appendChild(span);
            arrayDiv.appendChild(itemContainer);
        });

        stepDiv.appendChild(arrayDiv);
        stepsDiv.appendChild(stepDiv);
    });
}
function clearAllSteps() {
    document.getElementById('steps').innerHTML = ''; // Clear all steps
    document.getElementById('result').innerText = ''; // Clear result
}
// Function to clear all steps, explanations, and input fields
function clearAllSteps() {
    document.getElementById('steps').innerHTML = '';  // Clear all steps and explanations
    document.getElementById('result').innerText = '';  // Clear result
    document.getElementById('inputFields').innerHTML = '';  // Clear input fields
    document.getElementById('numElements').value = '';  // Clear the number of elements input
}