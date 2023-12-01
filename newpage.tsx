"use client";
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import GTLINE from '../components/gtline';
import GTPoint from '../components/gtpoint';
import Line from '../components/Line';

interface Vertex {
  name: string;
  x: number;
  y: number;
}

interface Edge {
  start: Vertex;
  end: Vertex;
  weight: number;
}

class Graph {
  private adjacencyList: Map<Vertex, Edge[]>;

  constructor() {
    this.adjacencyList = new Map();
  }

  getAllEdges(): Edge[] {
    const allEdges: Edge[] = [];

    for (const edges of this.adjacencyList.values()) {
      allEdges.push(...edges);
    }

    return allEdges;
  }

  getAllVertices(): Vertex[] {
    return Array.from(this.adjacencyList.keys());
  }

  addVertex(vertex: Vertex): void {
    this.adjacencyList.set(vertex, []);
  }

  addEdge(vertex1: Vertex, vertex2: Vertex, weight: number = 1): void {
    const edge: Edge = { start: vertex1, end: vertex2, weight };
    this.adjacencyList.get(vertex1)?.push(edge);
    this.adjacencyList.get(vertex2)?.push(edge);
  }
  dijkstra(startVertex: Vertex, endVertex: Vertex): Edge[] | null {
    const visited: Set<Vertex> = new Set();
    const distances: Map<Vertex, number> = new Map();
    const previous: Map<Vertex, Edge | null> = new Map();

    this.getAllVertices().forEach((vertex) => {
      distances.set(vertex, Infinity);
      previous.set(vertex, null);
    });

    distances.set(startVertex, 0);

    while (visited.size !== this.getAllVertices().length) {
      const currentVertex = this.getMinDistanceVertex(distances, visited);
      visited.add(currentVertex!);

      this.adjacencyList.get(currentVertex!)?.forEach((edge) => {
        const neighbor = edge.start === currentVertex ? edge.end : edge.start;
        const newDistance = distances.get(currentVertex!)! + edge.weight;

        if (newDistance < distances.get(neighbor)!) {
          distances.set(neighbor, newDistance);
          previous.set(neighbor, edge);
        }
      });
    }

    return this.buildPath(startVertex, endVertex, previous);
  }

  private getMinDistanceVertex(distances: Map<Vertex, number>, visited: Set<Vertex>): Vertex | null {
    let minDistance = Infinity;
    let minVertex: Vertex | null = null;

    distances.forEach((distance, vertex) => {
      if (!visited.has(vertex) && distance < minDistance) {
        minDistance = distance;
        minVertex = vertex;
      }
    });

    return minVertex;
  }

  private buildPath(startVertex: Vertex, endVertex: Vertex, previous: Map<Vertex, Edge | null>): Edge[] | null {
    const path: Edge[] = [];
    let currentVertex = endVertex;

    while (currentVertex !== startVertex) {
      const edge = previous.get(currentVertex);
      if (!edge) {
        return null; // No path found
      }
      path.unshift(edge);
      currentVertex = edge.start === currentVertex ? edge.end : edge.start;
    }

    return path;
  }

}

const SimpleGraph = () => {
  const myGraph = new Graph();

  const locations: Vertex[] = [
    { name: 'Clifton', x: 150, y: 50 },
    { name: 'Saddar', x: 950, y: 40 },
    { name: 'Tariq Road', x: 400, y: 150 },
    { name: 'Korangi', x: 300, y: 100 },
    { name: 'Gulshan', x: 220, y: 250 },
    { name: 'North Nazimabad', x: 850, y: 300 },
    { name: 'Malir', x: 133, y: 250 },
    { name: 'Nazimabad', x: 653, y: 50 },
    { name: 'F.B. Area', x: 500, y: 350 },
    { name: 'Gulberg', x: 150, y: 500 },
    { name: 'Defence', x: 400, y: 550 },
    { name: 'Landhi', x: 750, y: 330 },
    { name: 'Gulistan-e-Jauhar', x: 250, y: 450 },
    { name: 'Shahra-e-Faisal', x: 1000, y: 500 },
    { name: 'bhens', x: 900, y: 550 },
    { name: 'Orangi', x: 300, y: 550 },
    { name: 'SITE', x: 500, y: 550 },
    { name: 'Kemari', x: 950, y: 400 },
  ];

  // Add vertices to the graph
  locations.forEach((location) => {
    myGraph.addVertex(location);
  });
  function getRandomVertices(vertices: Vertex[], currentIndex: number): number[] {
    const availableIndices = vertices
      .map((_, index) => index)
      .filter((index) => index !== currentIndex);

    // Shuffle the array
    for (let i = availableIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [availableIndices[i], availableIndices[j]] = [availableIndices[j], availableIndices[i]];
    }

    // Randomly select two or three vertices
    const numConnections = Math.floor(Math.random() * 1) + 1; // Random number between 2 and 3
    return availableIndices.slice(0, numConnections);
  }
  for (let i = 0; i < locations.length; i++) {
    // Randomly select two or three vertices
    const connectedVertices = getRandomVertices(locations, i);

    connectedVertices.forEach((j) => {
      const weight = Math.floor(Math.random() * 10) + 1; // Random weight between 1 and 10
      myGraph.addEdge(locations[i], locations[j], weight);
    });
  }
  const startVertex: Vertex = locations[0]; // Change this to your desired start vertex
  const endVertex: Vertex = locations[1];   // Change this to your desired end vertex
  const shortestPath = myGraph.dijkstra(startVertex, endVertex);
  console.log(`starting vertex ${startVertex.name} end vertex ${endVertex.name}`);
  console.log("the shortest path :", shortestPath);
  const allEdges = myGraph.getAllEdges();
  const allVertices = myGraph.getAllVertices();
  const [run, setRun] = useState<boolean>(false);
  const set = () => {

    setRun(true);
  }
  return (
    <div className="w-full h-full">
      <Button
        type='button'
        onClick={set}
      >set</Button>
      {run && allEdges.map((edge, index) => (
        <GTLINE
          key={index}
          x1={edge.start.x}
          y1={edge.start.y}
          x2={edge.end.x}
          y2={edge.end.y}
          weight={edge.weight}
          color='#A9A9A9'
        />
      ))}
      {allVertices.map((vertex, index) => (
        <GTPoint
          key={index}
          x={vertex.x}
          y={vertex.y}
          name={vertex.name} />
      ))}
      {run && shortestPath?.map((edge,index)=>(
          <GTLINE
          key={index}
          x1={edge.start.x}
          y1={edge.start.y}
          x2={edge.end.x}
          y2={edge.end.y}
          weight={edge.weight}
          color='orange'
          />
        ))
      }
    </div>
  );
};

export default SimpleGraph;
