let btn = document.querySelector('#btn');

let map = L.map('map').setView([39.2908816, -76.610759], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

btn.addEventListener('click', () => {
    let street = document.querySelector('#street').value;
    let city = document.querySelector('#city').value;
    let state = document.querySelector('#state').value;
    street = street.split(' ').join('+');
    let address = street + '+' + city + '+' + state;
    let url = `https://nominatim.openstreetmap.org/?addressdetails=1&q=${address}&format=json&limit=1`;
    fetch(url)
    .then(res => res.json())
    .then(data => {
        lat = data[0].lat;
        lon = data[0].lon;
        zip = data[0].address.postcode;
        map.flyTo([lat, lon], 19);
        marker = L.marker([lat, lon]).addTo(map);
        marker.bindTooltip(street.split('+').join(' ') + '<br>' + city + ', ' + state + ' ' + zip + '<br>' + `[${lat}, ${lon}]`).openTooltip();
    })
});

polyline = L.polyline([]).addTo(map);
map.on('click', e => {
    let marker = L.circleMarker(e.latlng).addTo(map);
    marker.on('mouseover', e => {
        let lat = e.latlng.lat;
        let lng = e.latlng.lng;
        let url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&limit=1`;
        fetch(url)
        .then(res => res.json())
        .then(data => {
            let street = data.address.house_number + ' ' + data.address.road;
            let city = data.address.city;
            let state = data.address["ISO3166-2-lvl4"].slice(3,5);
            let zip = data.address.postcode;
            marker.bindTooltip(street + '<br>' + city + ', ' + state + ' ' + zip + '<br>' + `[${lat}, ${lng}]`).openTooltip();
        })
    });
    polyline.addLatLng(e.latlng);
    // zoom the map to the polyline
    map.fitBounds(polyline.getBounds());
});