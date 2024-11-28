const canvas = document.getElementById('graphCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

let nodes = [];
let edges = [];
let currentEdge = null;
let draggingNode = null;
let isCreatingEdge = false;
let phase = 1; // 1 for node creation phase, 2 for edge creation phase
let sourceNode = null; // Variable to store the selected source node
const explanationDiv = document.getElementById('traversalSteps'); // Explanation div

document.getElementById('runAlgorithmButton').addEventListener('click', () => {
    applyAlgorithm(); // This will run the selected algorithm
});

// Function to draw nodes and edges on the canvas
function drawGraph() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw edges
    edges.forEach(edge => {
        ctx.beginPath();
        ctx.moveTo(edge.from.x, edge.from.y);
        ctx.lineTo(edge.to.x, edge.to.y);
        ctx.strokeStyle = '#888';
        ctx.lineWidth = 2;  // Make edge lines thicker
        ctx.stroke();

        // Display the edge weight
        let midX = (edge.from.x + edge.to.x) / 2;
        let midY = (edge.from.y + edge.to.y) / 2 - 10; // Adjusting y position for better visibility
        ctx.fillStyle = 'black';
        ctx.font = '20px Arial'; // Increased text size for better clarity
        ctx.fillText(edge.weight, midX, midY); // Use adjusted midY for text position
    });

    // Draw nodes
    nodes.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 25, 0, Math.PI * 2); // Increased node size to 25
        ctx.fillStyle = '#4a90e2';
        ctx.fill();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = 'white';
        ctx.font = '18px Arial'; // Improved node ID visibility
        ctx.fillText(node.id, node.x - 6, node.y + 6);

        // Highlight the source node if selected
        if (node === sourceNode) {
            ctx.lineWidth = 4;
            ctx.strokeStyle = '#FF5733'; // Highlight color
            ctx.stroke();
            ctx.lineWidth = 2; // Reset line width for other nodes
        }
    });

    // If dragging an edge
    if (currentEdge) {
        ctx.beginPath();
        ctx.moveTo(currentEdge.from.x, currentEdge.from.y);
        ctx.lineTo(currentEdge.to.x, currentEdge.to.y);
        ctx.strokeStyle = '#888';
        ctx.stroke();
    }
}


// Add a node where the user clicks, only in phase 1 (node creation)
canvas.addEventListener('click', (e) => {
    if (phase === 1) { // Node creation phase
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Add node
        nodes.push({ x, y, id: nodes.length });
        drawGraph();
    } else if (phase === 2 && sourceNode === null) { // Edge creation phase & no source node selected
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Check if a node is clicked to set as source
        nodes.forEach(node => {
            const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
            if (distance < 25) { // Adjusted for increased node size
                sourceNode = node; // Set the clicked node as source
                alert(`Source node set to Node ${node.id}`);
            }
        });
    }
});

// Handle mouse down event to start creating an edge (only in phase 2)
canvas.addEventListener('mousedown', (e) => {
    if (phase !== 2 || sourceNode === null) return; // Only allow edge creation in phase 2

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Find the node being clicked on (start node for the edge)
    nodes.forEach(node => {
        const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
        if (distance < 25) { // Adjusted for increased node size
            draggingNode = node; // Set the node to start the edge
            isCreatingEdge = true; // Set the flag indicating we're creating an edge
        }
    });
});

// Handle mouse move to drag an edge (only in phase 2)
canvas.addEventListener('mousemove', (e) => {
    if (!draggingNode || phase !== 2) return;  // Only start drawing if we're dragging from a node and in phase 2

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Draw the edge while dragging
    currentEdge = { from: draggingNode, to: { x, y } };
    drawGraph();
});

// Handle mouse up to finish creating an edge (only in phase 2)
canvas.addEventListener('mouseup', (e) => {
    if (!draggingNode || phase !== 2) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let targetNode = null;
    // Find the node where the drag ended (target node for the edge)
    nodes.forEach(node => {
        const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
        if (distance < 25 && node !== draggingNode) { // Adjusted for increased node size
            targetNode = node; // Node found to connect to
        }
    });

    if (targetNode) {
        const weight = prompt("Enter weight of the edge:");
        if (weight) {
            // Only create the edge if a weight is entered and nodes are different
            edges.push({ from: draggingNode, to: targetNode, weight: parseInt(weight) });
        }
    }

    // Reset dragging node and edge
    draggingNode = null;
    currentEdge = null;
    isCreatingEdge = false;  // Reset the flag to allow node creation
    drawGraph();
});

// Switch between phases
function switchPhase() {
    if (phase === 1) {
        phase = 2;
        document.getElementById('phase-indicator').innerText = "Current Phase: Edge Creation"; // Update phase indicator
        document.getElementById('graphCanvas').classList.add('edge-creation'); // Add edge creation class
        alert("Switched to Edge Creation Phase.");
    } else {
        phase = 1;
        document.getElementById('phase-indicator').innerText = "Current Phase: Node Creation"; // Update phase indicator
        sourceNode = null; // Reset source node when switching back to node creation
        explanationDiv.innerHTML = ""; // Clear explanation on phase switch
        document.getElementById('graphCanvas').classList.remove('edge-creation'); // Remove edge creation class
        alert("Switched to Node Creation Phase.");
    }
}


// Reset the graph
function resetGraph() {
    nodes = [];
    edges = [];
    phase = 1;  // Reset to node creation phase
    sourceNode = null; // Reset source node
    explanationDiv.innerHTML = ""; // Clear explanation on reset
    drawGraph();
}

// Set the source node based on input ID
function setSourceNode() {
    const sourceNodeId = parseInt(document.getElementById('sourceNodeInput').value);
    const selectedNode = nodes.find(node => node.id === sourceNodeId); // Find node by ID

    if (selectedNode) {
        sourceNode = selectedNode; // Set source node
        alert(`Source node set to Node ${selectedNode.id}`);
    } else {
        alert("Invalid Node ID. Please enter a valid ID.");
    }
}


function applyAlgorithm() {
    const selectedAlgorithm = document.getElementById('algorithmSelect').value;

    if (selectedAlgorithm === 'prim') {
        applyPrims();
    } else if (selectedAlgorithm === 'kruskal') {
        applyKruskal();
    } else if (selectedAlgorithm === 'dijkstra') {
        applyDijkstra();
    }
    else if (selectedAlgorithm === 'bellman-ford') {
        applyBellmanFord();
    } 
    else if (selectedAlgorithm === 'floyd-warshall') {
        applyFloydWarshall();
    }
}

// Function to apply Kruskal's Algorithm
function applyKruskal() {
    // Helper function to find the root of a node
    function find(parent, i) {
        if (parent[i] === -1) {
            return i;
        }
        return find(parent, parent[i]);
    }

    // Helper function to perform union of two subsets
    function union(parent, rank, x, y) {
        const xroot = find(parent, x);
        const yroot = find(parent, y);

        if (rank[xroot] < rank[yroot]) {
            parent[xroot] = yroot;
        } else if (rank[xroot] > rank[yroot]) {
            parent[yroot] = xroot;
        } else {
            parent[yroot] = xroot;
            rank[xroot]++;
        }
    }

    // Kruskal's algorithm implementation
    const mst = [];
    const parent = new Array(nodes.length).fill(-1);
    const rank = new Array(nodes.length).fill(0);
    const edgesSorted = edges.slice().sort((a, b) => a.weight - b.weight); // Sort edges by weight

    let steps = []; // Store steps for traversal explanation

    edgesSorted.forEach(edge => {
        const u = edge.from.id;
        const v = edge.to.id;

        const uRoot = find(parent, u);
        const vRoot = find(parent, v);

        // If including this edge does not cause a cycle
        if (uRoot !== vRoot) {
            mst.push(edge);
            union(parent, rank, uRoot, vRoot);
            steps.push(`<span class="bold">Add edge from Node ${u} to Node ${v} with weight ${edge.weight}.</span>`);
        }
    });

    // Display steps in the explanation area
    explanationDiv.innerHTML = steps.join('<br>');

    // Visualize the MST
    visualizeMST(mst, 'kruskal');
}



// Apply Prim's Algorithm
function applyPrims() {
    if (!sourceNode) {
        alert("Please select a source node before running Prim's algorithm.");
        return;
    }

    const mst = [];
    const visited = new Set();
    const edgeList = [];
    let steps = []; // Store steps for traversal explanation

    visited.add(sourceNode);
    steps.push(`<span class="bold">Start from Node ${sourceNode.id}</span>`);

    // Initialize edgeList with edges connected to the source node
    edges.forEach(edge => {
        if (edge.from === sourceNode || edge.to === sourceNode) {
            edgeList.push(edge);
        }
    });

    while (visited.size < nodes.length) {
        // Sort edges by weight
        edgeList.sort((a, b) => a.weight - b.weight);

        // Get the smallest edge
        let smallestEdge = edgeList.shift();

        if (!smallestEdge) {
            steps.push("<span class='bold'>No valid edge found, algorithm is complete.</span>");
            break;
        }

        let newNode = null;
        if (!visited.has(smallestEdge.from)) {
            newNode = smallestEdge.from;
        } else if (!visited.has(smallestEdge.to)) {
            newNode = smallestEdge.to;
        }

        if (newNode) {
            mst.push(smallestEdge);
            visited.add(newNode);
            steps.push(`<span class="bold">Add edge from Node ${smallestEdge.from.id} to Node ${smallestEdge.to.id} with weight ${smallestEdge.weight}.</span>`);

            // Add edges connected to the new node
            edges.forEach(edge => {
                if ((edge.from === newNode && !visited.has(edge.to)) || 
                    (edge.to === newNode && !visited.has(edge.from))) {
                    edgeList.push(edge);
                }
            });
        }
    }

    // Display steps in the explanation area
    explanationDiv.innerHTML = steps.join('<br>');

    // Visualize the MST
    visualizeMST(mst, 'prim');
}

function visualizeMST(mst, algorithm) {
    let i = 0;
    const nodeRadius = 10; // Adjust this value based on your node radius

    function animateStep() {
        if (i < mst.length) {
            const edge = mst[i];

            // Calculate the adjusted positions for the edge to touch the nodes
            const fromNode = edge.from;
            const toNode = edge.to;

            // Calculate the angle to the destination node
            const angle = Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x);
            
            // Calculate positions to ensure edges only touch the node
            const fromX = fromNode.x + (nodeRadius + 1) * Math.cos(angle); // Adjusted fromNode position
            const fromY = fromNode.y + (nodeRadius + 1) * Math.sin(angle); // Adjusted fromNode position
            const toX = toNode.x - (nodeRadius + 1) * Math.cos(angle); // Adjusted toNode position
            const toY = toNode.y - (nodeRadius + 1) * Math.sin(angle); // Adjusted toNode position

            // Draw the edge of the MST
            ctx.beginPath();
            ctx.moveTo(fromX, fromY);
            ctx.lineTo(toX, toY);
            
            // Set color based on the algorithm
            ctx.strokeStyle = algorithm === 'kruskal' ? 'orange' : 'green';
            ctx.lineWidth = 4; // Thickness of the edges
            ctx.stroke();

            // Highlight edge weight during visualization
            let midX = (fromX + toX) / 2;
            let midY = (fromY + toY) / 2 - 10;
            ctx.fillStyle = 'black';
            ctx.font = '20px Arial';
            ctx.fillText(edge.weight, midX, midY);

            i++;
            setTimeout(animateStep, 1000); // Delay for the next step
        }
    }

    animateStep(); // Start the animation
}




// Add a direction property to edges for Dijkstra's algorithm
canvas.addEventListener('mouseup', (e) => {
    if (!draggingNode || phase !== 2) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let targetNode = null;
    nodes.forEach(node => {
        const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
        if (distance < 25 && node !== draggingNode) {
            targetNode = node;
        }
    });

    if (targetNode) {
        const weight = prompt("Enter weight of the edge:");
        const direction = confirm("Is this edge directed? Click 'OK' for Yes, 'Cancel' for No.");
        if (weight) {
            edges.push({ 
                from: draggingNode, 
                to: targetNode, 
                weight: parseInt(weight), 
                directed: direction  // New property for edge direction
            });
        }
    }

    draggingNode = null;
    currentEdge = null;
    isCreatingEdge = false;
    drawGraph();
});

// Update the drawing function to display directionality
function drawGraph() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw edges
    edges.forEach(edge => {
        ctx.beginPath();
        ctx.moveTo(edge.from.x, edge.from.y);
        ctx.lineTo(edge.to.x, edge.to.y);
        ctx.strokeStyle = '#888';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Display the edge weight
        let midX = (edge.from.x + edge.to.x) / 2;
        let midY = (edge.from.y + edge.to.y) / 2 - 10;
        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.fillText(edge.weight, midX, midY);

        // If the edge is directed, draw an arrow
        if (edge.directed) {
            const arrowLength = 10;
            const angle = Math.atan2(edge.to.y - edge.from.y, edge.to.x - edge.from.x);
            const arrowX = edge.to.x - arrowLength * Math.cos(angle);
            const arrowY = edge.to.y - arrowLength * Math.sin(angle);
            ctx.beginPath();
            ctx.moveTo(arrowX, arrowY);
            ctx.lineTo(edge.to.x, edge.to.y);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    });

    // Draw nodes
    nodes.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 25, 0, Math.PI * 2);
        ctx.fillStyle = '#4a90e2';
        ctx.fill();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = 'white';
        ctx.font = '18px Arial';
        ctx.fillText(node.id, node.x - 6, node.y + 6);

        if (node === sourceNode) {
            ctx.lineWidth = 4;
            ctx.strokeStyle = '#FF5733';
            ctx.stroke();
            ctx.lineWidth = 2;
        }
    });

    if (currentEdge) {
        ctx.beginPath();
        ctx.moveTo(currentEdge.from.x, currentEdge.from.y);
        ctx.lineTo(currentEdge.to.x, currentEdge.to.y);
        ctx.strokeStyle = '#888';
        ctx.stroke();
    }
}



// Implement Dijkstra's Algorithm
function applyDijkstra() {
    if (!sourceNode) {
        alert("Please select a source node before running Dijkstra's algorithm.");
        return;
    }

    const distances = {};
    const previous = {};
    const unvisited = new Set(nodes);
    let steps = [];

    // Initialize distances
    nodes.forEach(node => {
        distances[node.id] = Infinity;
        previous[node.id] = null;
    });
    distances[sourceNode.id] = 0;

    while (unvisited.size > 0) {
        // Get the node with the smallest distance
        const current = Array.from(unvisited).reduce((minNode, node) => 
            distances[node.id] < distances[minNode.id] ? node : minNode
        );

        unvisited.delete(current);

        // Process each neighbor of the current node
        edges.forEach(edge => {
            const neighbor = edge.from === current ? edge.to : edge.from === current ? edge.from : null;
            if (neighbor && unvisited.has(neighbor) && (!edge.directed || edge.from === current)) {
                const newDistance = distances[current.id] + edge.weight;
                if (newDistance < distances[neighbor.id]) {
                    distances[neighbor.id] = newDistance;
                    previous[neighbor.id] = current.id;
                    steps.push(`<span class="bold">Update distance for Node ${neighbor.id}: ${newDistance}</span>`);
                }
            }
        });

        if (distances[current.id] === Infinity) break;  // Remaining nodes are inaccessible
    }

    explanationDiv.innerHTML = steps.join('<br>');
    visualizeShortestPath(previous, distances);
}


// Visualize the shortest path computed by Dijkstra
function visualizeShortestPath(previous, distances, nodeRadius = 10) {
    nodes.forEach(node => {
        if (previous[node.id] !== null) {
            const fromNode = nodes[previous[node.id]];
            const toNode = node;

            // Calculate the angle to the target node
            const angle = Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x);
            
            // Calculate adjusted positions for the line to avoid overlapping
            const fromAdjustedX = fromNode.x + nodeRadius * Math.cos(angle);
            const fromAdjustedY = fromNode.y + nodeRadius * Math.sin(angle);
            const toAdjustedX = toNode.x - nodeRadius * Math.cos(angle);
            const toAdjustedY = toNode.y - nodeRadius * Math.sin(angle);

            // Draw the edge without overlapping the nodes
            ctx.beginPath();
            ctx.moveTo(fromAdjustedX, fromAdjustedY);
            ctx.lineTo(toAdjustedX, toAdjustedY);
            ctx.strokeStyle = '#FF5733'; // Color for the shortest path
            ctx.lineWidth = 4; // Thickness of the edges
            ctx.stroke();
        }
    });
}


const graph = {
    vertices: [],
    edges: [],
    addVertex: function(vertex) {
        this.vertices.push(vertex);
    },
    addEdge: function(source, target, weight) {
        this.edges.push({ source, target, weight });
    }
};

drawGraph();

