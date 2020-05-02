<script>
  export let node;
  let radius =
    node.height < node.width
      ? node.height / 2 - node.padding
      : node.width / 2 - node.padding;
</script>

<svg class="node" x={node.x} y={node.y} width={node.width} height={node.height}>
  <rect class="node--inner" x="0" y="0" width="100%" height="100%" />
  <circle
    cx="50%"
    cy="50%"
    r={radius}
    fill="white"
    stroke="gray"
    stroke-width="0.5" />
  {#if node.type !== 'start' && node.type !== 'stop'}
    <text
      x="50%"
      y="50%"
      dominant-baseline="middle"
      text-anchor="middle"
      stroke="black"
      stroke-width="0"
      fill="black">
      {node.label}
    </text>
  {/if}
</svg>
