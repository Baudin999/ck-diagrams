<script>
  import Node from "./node.svelte";
  export let lane;
</script>

<svg x={lane.x} y={lane.y} width={lane.width} height={lane.height}>
  <rect
    x="0"
    y="0"
    width={lane.width}
    height={lane.laneTop - 4}
    fill="white"
    stroke="black"
    stroke-width="0.5" />
  <rect
    x={0}
    y={0}
    width={lane.width}
    height={lane.height}
    fill="white"
    opacity="0"
    stroke="gray"
    stroke-width="0.5" />

  <text
    x="50%"
    y="15"
    dominant-baseline="middle"
    text-anchor="middle"
    stroke="black"
    stroke-width="0"
    fill="black">
    {lane.label}
  </text>

  {#each lane.nodes as node}
    <Node {node} />
  {/each}
</svg>
