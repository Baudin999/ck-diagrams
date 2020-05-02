<script>
  import { onMount } from "svelte";
  import { Svg } from "./diagrams/svg.ts";

  function init() {
    let main = document.getElementById("main");

    var svg = new Svg(main);
    svg.rect("1");
    var r = svg.rhombus("2");
    r.x = 120;
    r.y = 180;

    var db = svg.database("3");
    db.x = 400;
    db.y = 200;

    svg.connect("1", "2");
  }

  onMount(init);
</script>

<style>
  #main {
    display: block;
    width: 100%;
    height: 100%;
  }
</style>

<div id="main" />
