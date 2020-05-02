<script>
  export let node;

  let p1 = { x: 0 + node.width / 2, y: node.padding };
  let p2 = { x: node.width - node.padding, y: node.height / 2 };
  let p3 = { x: node.width / 2, y: node.height - node.padding };
  let p4 = { x: node.padding, y: node.height / 2 };

  let d = `M${p1.x} ${p1.y} L${p2.x} ${p2.y} L${p3.x} ${p3.y} L${p4.x} ${p4.y} Z`;
</script>

<svg class="node" x={node.x} y={node.y} width={node.width} height={node.height}>
  <rect class="node--inner" x="0" y="0" width="100%" height="100%" />
  <path {d} fill="white" stroke="gray" stroke-width="0.5" />
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
