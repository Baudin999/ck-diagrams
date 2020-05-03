<script>
  import Rect from "./rect.svelte";
  import Circle from "./circle.svelte";
  import Rhombus from "./rhombus.svelte";
  export let node;
</script>

{#if node.type === 'normal'}
  <Rect {node} />
{:else if node.type === 'start'}
  <Circle {node} />
{:else if node.type === 'stop'}
  <Circle {node} />
{:else if node.type === 'choice'}
  <Rhombus {node} />
{:else}
  <Rect {node} />
{/if}
{#each node.nodes as n}
  <svelte:self node={n} />
{/each}
