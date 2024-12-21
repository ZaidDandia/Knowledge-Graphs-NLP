import React, { useEffect, useRef } from "react";
import { Network } from "vis-network/standalone";
import { DataSet } from "vis-data";
import neo4j from "neo4j-driver";

const KnowledgeGraph: React.FC = () => {
  const graphRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const driver = neo4j.driver(
      "neo4j://localhost:7687", // Replace with your Neo4j URI
      neo4j.auth.basic("neo4j", "Testing123#") // Replace with your credentials
    );

    const session = driver.session();

    const fetchGraphData = async () => {
      try {
        const result = await session.run(
          `
          MATCH (n)-[r]->(m)
          RETURN n, r, m
          `
        );

        const nodes: any[] = [];
        const edges: any[] = [];

        result.records.forEach((record) => {
          const sourceNode = record.get("n");
          const targetNode = record.get("m");
          const relationship = record.get("r");

          // Add source node if not already in nodes
          if (!nodes.find((node) => node.id === sourceNode.identity.toString())) {
            nodes.push({
              id: sourceNode.identity.toString(),
              label: sourceNode.properties.name || "Node",
              color: "#4caf50", // Green for nodes
            });
          }

          // Add target node if not already in nodes
          if (!nodes.find((node) => node.id === targetNode.identity.toString())) {
            console.log(targetNode)
            nodes.push({
              id: targetNode.identity.toString(),
              label: targetNode.properties.id || "Node",
              color: "#4caf50",
            });
          }

          // Add edge
          edges.push({
            from: sourceNode.identity.toString(),
            to: targetNode.identity.toString(),
            label: relationship.type || "REL",
            color: {
              color: "#42a5f5", // Blue for edges
            },
            arrows: { to: true }, // Add arrow
          });
        });

        if (graphRef.current) {
          const data = { nodes: new DataSet(nodes), edges: new DataSet(edges) };
          const options = {
            nodes: {
              shape: "dot",
              size: 15,
              font: { size: 12, color: "#ffffff" },
            },
            edges: {
              font: { align: "middle" },
              arrows: { to: { enabled: true } },
            },
            physics: {
              enabled: true, // Enable physics for layout
            },
            interaction: {
              hover: true, // Enable hover effects
            },
          };

          new Network(graphRef.current, data, options);
        }
      } catch (error) {
        console.error("Error fetching data from Neo4j:", error);
      } finally {
        await session.close();
        await driver.close();
      }
    };

    fetchGraphData();
  }, []);

  return (
    <div
      ref={graphRef}
      style={{
        height: "calc(100vh)", // Adjust height as needed
        width: "100%",
        backgroundColor: "#1e1e1e", // Dark background
      }}
    />
  );
};

export default KnowledgeGraph;

