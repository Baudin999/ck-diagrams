<script>
  export let node;
  export let className = null;

  let { padding } = node;
  let width = node.width - 2 * node.padding;
  let subpadding = padding + 10;
  console.log(subpadding);
</script>

<svg
  class="node"
  x={node.x}
  y={node.y}
  width={node.width}
  height={node.height}
  on:click={() => console.log(node)}>
  <rect class="node--inner" x="0" y="0" width="100%" height="100%" />
  <rect
    class="rectangle"
    class:className
    x={node.padding}
    y={node.padding}
    {width}
    height={node.height - 2 * node.padding}
    fill="white"
    stroke="gray"
    stroke-width="0.5" />
  <rect
    class="rectangle"
    class:className
    x={subpadding}
    y={node.padding}
    width={width - subpadding}
    height={node.height - 2 * node.padding}
    fill="white"
    stroke="gray"
    stroke-width="0.5" />
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
</svg>
