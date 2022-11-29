// console.log(globalisclicked);
// console.log(globalvariablemonth);
// if (month == "11") {
//   map.setFilter("data-driven-circles", allfilter);
//   map.setFilter("heatmap", allfilter);
// } else {
//   if (globalisclicked == 1) {
//     map.setFilter("data-driven-circles", mnthfilter);
//     map.setFilter("heatmap", mnthfilter);
//     map.setFilter("data-driven-circles", bluefilter1);
//     map.setFilter("heatmap", bluefilter1);
//   } else if (globalisclicked == 2) {
//     map.setFilter("data-driven-circles", mnthfilter);
//     map.setFilter("heatmap", mnthfilter);
//     map.setFilter("data-driven-circles", redfilter1);
//     map.setFilter("heatmap", redfilter1);
//   } else {
//     console.log("else");
//     map.setFilter("data-driven-circles", mnthfilter);
//     map.setFilter("heatmap", mnthfilter);
//   }
// }

// const toggleableLayerIds = ["heatmap", "data-driven-circles"];
// // Set up the corresponding toggle button for each layer.
// for (const id of toggleableLayerIds) {
//   // Skip layers that already have a button set up.
//   if (document.getElementById(id)) {
//     continue;
//   }
//   // Create a link.
//   const link = document.createElement("a");
//   link.id = id;
//   link.href = "#";
//   link.textContent = id;
//   link.className = "active";
//   // Show or hide layer when the toggle is clicked.
//   link.onclick = function (e) {
//     const clickedLayer = this.textContent;
//     e.preventDefault();
//     e.stopPropagation();
//     const visibility = map.getLayoutProperty(clickedLayer, "visibility");
//     if (visibility === "visible") {
//       map.setLayoutProperty(clickedLayer, "visibility", "none");
//       this.className = "";
//     } else {
//       this.className = "active";
//       map.setLayoutProperty(clickedLayer, "visibility", "visible");
//     }
//   };
//   const layers = document.getElementById("menu");
//   layers.appendChild(link);
// }
