$(document).ready(function() {

    const center = L.bounds([1.56073, 104.11475], [1.16, 103.502]).getCenter();
    const map = L.map('mapdiv').setView([center.x, center.y], 13);

    const basemap = L.tileLayer('https://maps-{s}.onemap.sg/v3/Default/{z}/{x}/{y}.png', {
        detectRetina: true,
        maxZoom: 18,
        minZoom: 11,
        //Do not remove this attribution
        attribution: '<img src="https://docs.onemap.sg/maps/images/oneMap64-01.png" style="height:20px;width:20px;"/> New OneMap | Map data &copy; contributors, <a href="http://SLA.gov.sg">Singapore Land Authority</a>'
    });

    map.setMaxBounds([
        [1.56073, 104.1147],
        [1.16, 103.502]
    ]);

    basemap.addTo(map);
    map.invalidateSize();

    const openClose = function() {
        let action = 1;
        $('#hm-sectext-sub').on('click', function() {
            let textSelector = document.querySelector('#userTextInputDiv');
            if (action == 1) {
                textSelector.classList.remove('hidden');
                $('#hm-sectext-sub').css('color', 'red');
                action = 2;
                console.log(action);
            } else {
                textSelector.classList.add('hidden');
                $('#hm-sectext-sub').css('color', 'blue');
                action = 1;
                console.log(action);
            }
        })
    }

    $('#user-input').on('click', fetchUserInputAuto);
    $('#userTextInput').keydown(function(e) {
        let keyPressed = event.keyCode || event.which;
        if (keyPressed === 13) {
            fetchUserInput();
        }
    });
    openClose();

    function getLocation() {
        navigator.geolocation.getCurrentPosition(showPosition);
    }

    function showPosition(position) {
        marker = new L.Marker([position.coords.latitude, position.coords.longitude], {
            bounceOnAdd: false
        }).addTo(map);
        var popup = L.popup()
            .setLatLng([position.coords.latitude, position.coords.longitude])
            .setContent('You are here!')
            .openOn(map);
        map.setView([position.coords.latitude, position.coords.longitude], 18);
    }

    function fetchUserInput() {
        let userText = $('#userTextInput').val();
        console.log(userText);

        const onMapParams = new URLSearchParams({
            searchVal: userText,
            returnGeom: 'Y',
            getAddrDetails: 'Y'
        })
        const oneMapURL = `https://developers.onemap.sg/commonapi/search?${onMapParams.toString()}`;

        let mapLong;
        let mapLat;

        fetch(oneMapURL)
            .then(response => response.json())
            .then(data => {
                let mapLat = data.results[0].LATITUDE;
                let mapLong = data.results[0].LONGTITUDE;
                marker = new L.Marker([mapLat, mapLong], { bounceOnAdd: false }).addTo(map);
                let popup = L.popup()
                    .setLatLng([mapLat, mapLong])
                    .setContent('You are here!')
                    .openOn(map);
                map.setView([mapLat, mapLong], 17);
                console.log(mapLat, mapLong);
            }).catch(error => console.log(error));
    }

    function fetchUserInputAuto() {
        navigator.geolocation.getCurrentPosition(showPosition);

        function showPosition(position) {
            marker = new L.Marker([position.coords.latitude, position.coords.longitude], {
                bounceOnAdd: false
            }).addTo(map);
            var popup = L.popup()
                .setLatLng([position.coords.latitude, position.coords.longitude])
                .setContent('You are here!')
                .openOn(map);
            map.setView([position.coords.latitude, position.coords.longitude], 18);
        }
    }


})