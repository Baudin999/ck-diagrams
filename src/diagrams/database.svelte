<script>
  export let node;
  export let className = null;

  let { padding } = node;
  let width = node.width - 2 * padding;
  let height = node.height - 2 * padding;
  let rx = width / 2;
  let ry = 7;
  let rectTop = ry + 4;
  let rectBottom = node.height - rectTop;
  let rectRight = node.width - padding;
  let strokeWidth = 1;
</script>

<style>

</style>

<svg
  class="node"
  x={node.x}
  y={node.y}
  width={node.width}
  height={node.height}
  on:click={() => console.log(node)}>
  <rect class="node--inner" x="0" y="0" width="100%" height="100%" />
  <ellipse
    cx={width / 2 + padding}
    cy={node.height - rectTop}
    {rx}
    {ry}
    fill="ornage"
    stroke="gray"
    stroke-width={strokeWidth} />
  <polyline
    class="rectangle"
    class:className
    points={`${padding},${rectBottom} ${padding},${rectTop} ${rectRight},${rectTop} ${rectRight},${rectBottom}`}
    x={node.padding}
    y={node.padding + 10}
    width={node.width - 2 * node.padding}
    height={node.height - 2 * node.padding - 20}
    fill="white"
    stroke="gray"
    stroke-width={strokeWidth} />
  <ellipse
    cx={width / 2 + padding}
    cy={rectTop}
    {rx}
    {ry}
    fill="ornage"
    stroke="gray"
    stroke-width={strokeWidth} />

  <text
    x="50%"
    y={node.height / 2 + ry}
    dominant-baseline="middle"
    text-anchor="middle"
    stroke="black"
    stroke-width="0"
    fill="black">
    {node.label}
  </text>
</svg>
