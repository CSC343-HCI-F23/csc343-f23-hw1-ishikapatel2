// index.js
const fs = require('fs');
const { getSystemErrorMap } = require('util');

class GraphClass {
  constructor() {
    this.graph = {
      nodes: [],
      edges: [],
      nodeDegrees: {}
    };
    this.degreeHistogram = {};
  }

  addEdge(source, target) {
    this.graph.edges.push([source, target]);
  }

  readGraphFromJSON(filePath) {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      if (data.nodes) {
        for (const movie of data.nodes) {
          const movieID = movie.id; 
          this.graph.nodes.push(movieID);
        }
      }
      if (data.links) {
        for (const link of data.links) {
          const sourceNode = link.source; 
          const targetNode = link.target; 
          this.addEdge(sourceNode, targetNode);
        }
      }
    } 
    catch (err) {
      console.error('Error reading the file:', err);
    }
  }

  writeGraphToJSON(filePath) {
    const data = JSON.stringify(this.degreeHistogram);
    try {
      fs.writeFileSync(filePath, data);
      console.log(`Graph data written to ${filePath}`);
    } 
    catch (error) {
      console.error(`Error writing graph data to ${filePath}: ${error.message}`);
    }

  }

  computeDegree(node) {
    var degree = 0;
    for (const edge of this.graph.edges) {
      if (edge[0] === node || edge[1] === node) {
        degree++;
      }
    }
    return degree;
  }

  addNodeDegreesAsAttributes() {
    for (const node of this.graph.nodes) {
      this.graph.nodeDegrees[node] = this.computeDegree(node);
    }
  }

  calculateDegreeHistogram() {
    for (const node in this.graph.nodeDegrees) {
      const degree = this.graph.nodeDegrees[node];

      if (this.degreeHistogram[degree]) {
        this.degreeHistogram[degree]++;
      } 
      else {
        this.degreeHistogram[degree] = 1;
      }
    }
    
    for (var i = 0; i < Object.keys(this.degreeHistogram).length; i++) {
      if (!this.degreeHistogram.hasOwnProperty(i)) {
          this.degreeHistogram[i] = 0;
      }
  }
  }

  displayHistogram() {
    const maxValue = Math.max(...Object.values(this.degreeHistogram));
    const svgWidth = 700;
    const svgHeight = 300;
    const margin = {top:20, right:20, bottom:40, left:40};
    const barSpacing = 5;
    const barCount = Object.keys(this.degreeHistogram).length;
    const barWidth = (svgWidth - margin.left - margin.right - (barCount - 1) * barSpacing) / barCount;
    let svgContent = `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">`;

    // x-axis
    svgContent += `<text x="${svgWidth / 2}" y="${svgHeight}" text-anchor="middle" font-size="14"># of Nodes</text>`;
    // y-axis 
    svgContent += `<text x="${-svgHeight / 2}" y="15" transform="rotate(-90)" font-size="14" text-anchor="middle"># of Edges</text>`;

    // x-axis number line and tick marks
    // credit to Chat GPT for helping me figure out who to draw tick marks 
    svgContent += `<line x1="${margin.left}" y1="${svgHeight - margin.bottom}" x2="${svgWidth - margin.right}" y2="${svgHeight - margin.bottom}" stroke="black" />`;
    for (const degree in this.degreeHistogram) {
      console.log(degree + " " + this.degreeHistogram[degree]);
      const xTick = margin.left + ((barWidth + barSpacing) * (parseInt(degree)) + barWidth / 2);
      svgContent += `<line x1="${xTick}" y1="${svgHeight - margin.bottom}" x2="${xTick}" y2="${svgHeight - margin.bottom + 5}" stroke="black" />`;
      svgContent += `<text x="${xTick}" y="${svgHeight - margin.bottom + 20}" text-anchor="middle" font-size="12">${degree}</text>`;
    }

    // y-axis number line and tick marks
    svgContent += `<line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${svgHeight - margin.bottom}" stroke="black" />`;
    const yTick = (maxValue / 5); 
    for (let i = 0; i <= 5; i++) {
      const yTickValue = Math.round(yTick * i);
      const yTickPosition = svgHeight - margin.bottom - (i / 5) * (svgHeight - margin.top - margin.bottom);
      svgContent += `<line x1="${margin.left - 5}" y1="${yTickPosition}" x2="${margin.left}" y2="${yTickPosition}" stroke="black" />`;
      svgContent += `<text x="${margin.left - 10}" y="${yTickPosition}" text-anchor="end" font-size="12">${yTickValue}</text>`;
    }

    let x = margin.left;
    for (const degree in this.degreeHistogram) {
      const barHeight = (this.degreeHistogram[degree] / maxValue) * (svgHeight - margin.top - margin.bottom);

      // adds a bar
      svgContent += `<rect x="${x}" y="${svgHeight - margin.bottom - barHeight}" width="${barWidth}" height="${barHeight}" fill="pink" />`;
      x += barWidth + barSpacing;
    }
  
    svgContent += '</svg>';
    fs.writeFileSync('histogram.svg', svgContent);
  }
}


module.exports = GraphClass;

// Example usage
const graphClass = new GraphClass();
graphClass.readGraphFromJSON('imdb_data.json');
graphClass.addNodeDegreesAsAttributes() 
graphClass.calculateDegreeHistogram();
graphClass.displayHistogram();
graphClass.writeGraphToJSON('output_graph.json');
