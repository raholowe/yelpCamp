  mapboxgl.accessToken = mtoken;
  const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: campground.geolocation.coordinates, // starting position [lng, lat]
    zoom: 9, // starting zoom
  });

  new mapboxgl.Marker()
   .setLngLat(campground.geolocation.coordinates)
   .setPopup(
    new mapboxgl.Popup({offset:25})
    .setHTML(
      `<h3> ${campground.title}</h3>`
    )
   )
   .addTo(map)