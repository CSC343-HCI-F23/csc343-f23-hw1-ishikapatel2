// tests.js
const assert = require('assert');
const { describe, it } = require('mocha');
const GraphClass = require('./index'); // import GraphClass from ./index.js

// Import your graph class here
describe('Graph Class', () => {
    let graphClass;

    beforeEach(() => {
        graphClass = new GraphClass();
        graphClass.readGraphFromJSON('test_data.json'); // Provide the path to your test data JSON file
        graphClass.addNodeDegreesAsAttributes();
        graphClass.calculateDegreeHistogram();
    });
    
    it('test 1: should correctly read and populate nodes from a JSON file', () => {
        assert.strictEqual(graphClass.graph.nodes.length, 3); // Check the number of nodes read
    });

    it('test 2: should correctly add edges based on links in data', () => {
        assert.strictEqual(graphClass.graph.edges.length, 2); // Check the number of edges added
    });

    it('test 3: should correctly compute node degrees and add node degrees as attributes', () => {
        assert.strictEqual(graphClass.graph.nodeDegrees['1'], 2); // Check degree for node 1
        assert.strictEqual(graphClass.graph.nodeDegrees['2'], 1); // Check degree for node 2
        assert.strictEqual(graphClass.graph.nodeDegrees['3'], 1); // Check degree for node 2
    });

    it('test 4: should correctly calculate degree histogram', () => {
        assert.strictEqual(graphClass.degreeHistogram[2], 1); // Check histogram entry for degree 3
        assert.strictEqual(graphClass.degreeHistogram[1], 2); // Check histogram entry for degree 1
    });
    // Add more test cases if needed
});
