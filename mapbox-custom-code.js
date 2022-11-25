const bounds = [
  [30.49348619306887, 31.56433881543822], // SW coordinates
  [39.32964629136373, 29.36986947049448], // NE coordinates
];
mapboxgl.accessToken =
  "pk.eyJ1IjoicGF2YWtwYXRlbCIsImEiOiJja3IwbnNqejUxdHpmMm5tbnFoa2tsNDcxIn0.Mi-o-UdZ0hTFy2iN7QBHrg";
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/pavakpatel/cl9goeb54004914o0f9zfa9ah",
  center: [35.1708741, 31.9485955],
  minZoom: 6,
  //maxBounds: bounds
});
let wbevents = [];
const popup = new mapboxgl.Popup({
  closeButton: false,
});

const filterGroup = document.getElementById("filter-group");
const filterEl = document.getElementById("feature-filter");
const listingEl = document.getElementById("feature-listing");
function renderListings(features) {
  const empty = document.createElement("p");
  // Clear any existing listings
  listingEl.innerHTML = "";
  if (features.length) {
    for (const feature of features) {
      const itemLink = document.createElement("a");
      itemLink.href = "#";
      itemLink.target = "_blank";
      itemLink.className = "title";
      if (
        feature.properties.Group == "Militant" ||
        feature.properties.Group == "Militants"
      ) {
        itemLink.innerHTML = `<b> <p class ="bold-listing-title-mil">${feature.properties.Group} &nbsp | &nbsp ${feature.properties.Date} &nbsp | • &nbsp   ${feature.properties.Type} </p> </b> <p class="white"> ${feature.properties.Notes} </p>`;
      } else {
        itemLink.innerHTML = `<b> <p class ="bold-listing-title-idf">${feature.properties.Group} &nbsp | &nbsp ${feature.properties.Date} &nbsp | • &nbsp   ${feature.properties.Type} </p> </b> <p class="white"> ${feature.properties.Notes} </p>`;
      }
      itemLink.addEventListener("mouseover", () => {
        popup
          .setLngLat(feature.geometry.coordinates)
          .setHTML(
            "<b>" +
              feature.properties.Date +
              " | " +
              feature.properties.Geocode_Name +
              "</b><p>" +
              feature.properties.Notes +
              "</p>"
            // +
            //     '</p><p> <img width="200px" src="https://github.com/fddvisuals/west-bank-images/blob/main/ezgif-5-fedaa64c27.gif?raw=true"</p>'
          )
          .addTo(map);
      });
      itemLink.onclick = function () {
        // setActive(listing);

        // When a menu item is clicked, animate the map to center
        // its associated locale and open its popup.
        map.flyTo({
          center: feature.geometry.coordinates,
          zoom: 16,
        });
        //locale.openPopup();
        return false;
      };
      listingEl.appendChild(itemLink);
    }
    // Show the filter input
    filterEl.parentNode.style.display = "none";
  } else if (features.length === 0 && filterEl.value !== "") {
    empty.textContent = "No results found";
    listingEl.appendChild(empty);
  } else {
    empty.textContent = "";
    listingEl.appendChild(empty);
    // Hide the filter input
    filterEl.parentNode.style.display = "none";
    // remove features filter
    map.setFilter("data-driven-circles", ["has", "Group"]);
  }
}
const months = [
  "January 2022",
  "February 2022",
  "March 2022",
  "April 2022",
  "May 2022",
  "June 2022",
  "July 2022",
  "August 2022",
  "September 2022",
  "October 2022",
  "All (Mar to Oct 22)",
];

var globalvariablemonth;
function filterBy(month) {
  const mnthfilter = ["==", "mm", month + 1];
  if (month == "10") {
    map.setFilter("data-driven-circles", ["has", "Group"]);
  } else {
    map.setFilter("data-driven-circles", mnthfilter);
    map.setFilter("heatmap", mnthfilter);
  }
  // Set the label to the month
  document.getElementById("month").textContent = months[month];
  globalThis.globalvariablemonth = month + 1;
}
function normalize(string) {
  return string.trim().toLowerCase();
}
function getUniqueFeatures(features, comparatorProperty) {
  const uniqueIds = new Set();
  const uniqueFeatures = [];
  for (const feature of features) {
    const id = feature.properties[comparatorProperty];
    if (!uniqueIds.has(id)) {
      uniqueIds.add(id);
      uniqueFeatures.push(feature);
    }
  }
  return uniqueFeatures;
}
map.on("load", () => {
  map.on("click", "data-driven-circles", (e) => {
    map.flyTo({
      center: e.features[0].geometry.coordinates,
      zoom: 16,
    });
  });
  map.on("movestart", () => {});
  map.on("moveend", () => {
    const features = map.queryRenderedFeatures({
      layers: ["data-driven-circles"],
    });
    if (features) {
      const uniqueFeatures = getUniqueFeatures(features, "");
      // Populate features for the listing overlay.
      renderListings(uniqueFeatures);
      // Clear the input container
      filterEl.value = "";
      // Store the current features in sn `wbevents` variable to later use for filtering on `keyup`.
      wbevents = uniqueFeatures;
    }
  });
  map.on("mousemove", "data-driven-circles", (e) => {
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = "pointer";
    // Populate the popup and set its coordinates based on the feature.
    const feature = e.features[0];
    popup
      .setLngLat(feature.geometry.coordinates)
      .setHTML(
        "<b>" +
          feature.properties.Date +
          " | " +
          feature.properties.Geocode_Name +
          "</b><p>" +
          feature.properties.Notes +
          "</p>" +
          '</p><p> <img width="200px" src="https://drive.google.com/file/d/16wylaZmhKuZL5mCu2PRXXnxvh-KBgrnK/view?usp=sharing"</p>'
      )
      .addTo(map);
  });
  map.on("mouseleave", "data-driven-circles", () => {
    map.getCanvas().style.cursor = "";
    popup.remove();
  });
  filterEl.addEventListener("keyup", (e) => {
    const value = normalize(e.target.value);
    // Filter visible features that match the input value.
    const filtered = [];
    for (const feature of wbevents) {
      const mm2 = normalize(feature.properties.mm);
      if (mm2 == month) {
        filtered.push(feature);
      }
    }
    // Populate the sidebar with filtered results
    renderListings(filtered);
    // Set the filter to populate features into the layer.
    if (filtered.length) {
      map.setFilter("data-driven-circles", [
        "match",
        ["get", "Group"],
        filtered.map((feature) => {
          return feature.properties.Group;
        }),
        true,
        false,
      ]);
    }
  });
  map.on("idle", () => {
    if (!map.getLayer("heatmap") || !map.getLayer("data-driven-circles")) {
      return;
    }
    // Enumerate ids of the layers.
    const toggleableLayerIds = ["heatmap", "data-driven-circles"];
    // Set up the corresponding toggle button for each layer.
    for (const id of toggleableLayerIds) {
      // Skip layers that already have a button set up.
      if (document.getElementById(id)) {
        continue;
      }
      // Create a link.
      const link = document.createElement("a");
      link.id = id;
      link.href = "#";
      link.textContent = id;
      link.className = "active";
      // Show or hide layer when the toggle is clicked.
      link.onclick = function (e) {
        const clickedLayer = this.textContent;
        e.preventDefault();
        e.stopPropagation();
        const visibility = map.getLayoutProperty(clickedLayer, "visibility");
        if (visibility === "visible") {
          map.setLayoutProperty(clickedLayer, "visibility", "none");
          this.className = "";
        } else {
          this.className = "active";
          map.setLayoutProperty(clickedLayer, "visibility", "visible");
        }
      };
      const layers = document.getElementById("menu");
      layers.appendChild(link);
    }
    var blue = document.getElementById("idf-button");
    var red = document.getElementById("mil-button");
    var all = document.getElementById("show-all-button");

    let bluefilter = [
      "all",
      [
        "match",
        ["get", "Group"],
        [
          "IDF, Shin Bet",
          "IDF",
          "Shin Bet",
          "Israel Police, Shin Bet",
          "Israel Police",
          "IDF, Israel Police",
        ],
        true,
        false,
      ],
      ["match", ["get", "mm"], [globalvariablemonth], true, false],
    ];
    let redfilter = [
      "all",
      [
        "match",
        ["get", "Group"],
        ["Militants", "Militant", "Clash"],
        true,
        false,
      ],
      ["match", ["get", "mm"], [globalvariablemonth], true, false],
    ];
    let monthfilter = [
      "all",
      ["match", ["get", "mm"], [globalvariablemonth], true, false],
    ];

    blue.onclick = function (e) {
      red.className = "filter-button red";
      this.className = "filter-button bluew active";
      all.className = "filter-button all";
      !map.setFilter("data-driven-circles", bluefilter);
      !map.setFilter("heatmap", bluefilter);
    };
    red.onclick = function (e) {
      blue.className = "filter-button bluew";
      this.className = "filter-button red active";
      all.className = "filter-button all";
      map.setFilter("data-driven-circles", redfilter);
      map.setFilter("heatmap", redfilter);
    };
    all.onclick = function (e) {
      red.className = "filter-button red";
      blue.className = "filter-button bluew";
      this.className = "filter-button all active";
      map.setFilter("data-driven-circles", null);
      map.setFilter("heatmap", null);
      map.setFilter("data-driven-circles", monthfilter);
      map.setFilter("heatmap", monthfilter);
    };
  });
  filterBy(10);
  document.getElementById("slider").addEventListener("input", (e) => {
    const month = parseInt(e.target.value, 10);
    filterBy(month);
    globalThis.globalvariablemonth = month + 1;
  });
  renderListings([]);
});
