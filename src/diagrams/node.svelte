<script>
  import Rect from "./rect.svelte";
  import Circle from "./circle.svelte";
  import Database from "./database.svelte";
  import Rhombus from "./rhombus.svelte";
  import Subprocess from "./subprocess.svelte";
  export let node;
</script>

{#if node.type === 'normal'}
  <Rect {node} />
{:else if node.type === 'start'}
  <Circle {node} />
{:else if node.type === 'stop'}
  <Circle {node} />
{:else if node.type === 'database'}
  <Database {node} />
{:else if node.type === 'choice'}
  <Rhombus {node} />
{:else if node.type === 'subprocess'}
  <Subprocess {node} />
{:else}
  <Rect {node} />
{/if}
{#each node.nodes as n}
  <svelte:self node={n} />
{/each}
