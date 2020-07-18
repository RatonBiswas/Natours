// const locations =JSON.parse(document.getElementById('map').dataset.locations);
// console.log(locations);


export const displayMap = (locations)=>{
  mapboxgl.accessToken = 'pk.eyJ1IjoicmF0b25iaXN3YXMiLCJhIjoiY2tibDRrazExMTVmdzM1cXZldmEyb3R3eCJ9.VgmwUbi5DM-TYM-ixvsKJQ';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/ratonbiswas/ckbl4udxu03uy1jqqu0zepuxy',
    scrollZoom : false
    // center: [-118.113491, 34.111745],
    // zoom: 10,
    // interactive : false
});

const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    //  Add popup
    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates)
});

map.fitBounds(bounds,{
    padding:{
        top: 200,
    bottom: 200,
    left: 100,
    right: 100
    }
});
}
