<script>
  export let edge;

  let d = edge.points
    .map(p => `${p.x} ${p.y}`)
    .reduce((acc, p) => `${acc}${p} L`, "M")
    .replace(/ L$/, "");
</script>

<path
  {d}
  marker-end="url(#arrow)"
  fill="white"
  fill-opacity="0"
  stroke="gray"
  stroke-bind:clientWidth="0.5" />
