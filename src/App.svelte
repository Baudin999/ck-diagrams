<script>
  import { nodes } from "./data";
  import { Layout } from "./layout.ts";
  import Node from "./diagrams/node.svelte";
  import Line from "./diagrams/line.svelte";
  import Lane from "./diagrams/lane.svelte";

  let layout = new Layout(nodes);
</script>

<style>
  html,
  body {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
    overflow: auto;
  }
  /* svg {
    height: 100%;
    width: 100%;
    overflow: auto;
  } */
  svg {
    fill: white;
  }
  :global(.node) {
    /* opacity: 0; */
  }
  :global(.node .node--inner) {
    opacity: 0;
  }
</style>

<svg height={layout.height} width={layout.width}>
  <defs>
    <marker
      id="arrow"
      markerWidth="10"
      markerHeight="10"
      refX="8"
      refY="3"
      orient="auto"
      markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L9,3 z" fill="gray" />
    </marker>
  </defs>
  {#each layout.edges as edge}
    <Line {edge} />
  {/each}
  {#each layout.lanes as lane}
    <Lane {lane} />
  {/each}
  {#each layout.nodes as node}
    <Node {node} />
  {/each}
</svg>
