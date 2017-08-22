/* ----------------------------------------------------------------------------------- */
/* Created and maintained by the Delaware Valley Regional Planning Commission--------- */
/* Author(s): Christopher Pollard, Robert Beatty, Michael Ruane, Jesse Strangfield --- */
/* Date Updated: August 2017 --------------------------------------------------------- */
/* Version: 1.0.1 Beta --------------------------------------------------------------- */ 
/* ----------------------------------------------------------------------------------- */
var jsonconverter;

//Extend L.GeoJSON -- add setOptions method
L.GeoJSON = L.GeoJSON.extend({
    setOptions: function(opts) {
        //save original json data
        this._data = this._data || this.toGeoJSON();
        //destory layer group
        this.clearLayers();
        L.setOptions(this, opts);
        //recreate layer group
        this.addData(this._data);
    },
    //return polygon layers that contain the given point
    identify: function(latlng) {
        var geopoint = {
                type: 'Point',
                coordinates: [latlng.lng, latlng.lat]
            },
            features = new L.FeatureGroup();
        this.eachLayer(function(layer) {
            if (gju.pointInPolygon(geopoint, layer.feature.geometry)) {
                features.addLayer(layer);
            }
        }); 
        return features;

    }
});


// Load map variable and set extent
        var mapLayers = [];
        var map;
        function initmap() {
            map = new L.map('mapDiv');
            var osmTile = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
            var attributes = '<a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> |   <a href="http://www.dvrpc.org/Mapping/Weblmaps/" target="_blank">Data and application created by DVRPC</a>';
            var osm = L.tileLayer(osmTile, {
                minZoom: 2,
                maxZoom: 20,
                attribution: attributes,
            });
            map.setView(new L.LatLng(39.9371, -75.1012), 9);
            map.addLayer(osm);
        };
    
    initmap();

    // Add Map Controls

        map.attributionControl.setPosition('topright');
        map.zoomControl.setPosition('topleft');
        var viewCenter = new L.Control.ViewCenter();
        map.addControl(viewCenter);

// D3 Things

    // Pie Chart
    function bakePie(dataset, text){

        // empty target element
        $("#layer-group-dos").empty();
        var size = $(".panel").width();
        $(".panel").change(function(){
            var size = $(".panel").width();
        });


        // dimensions

            var wPie =  size;
            var hPie = size;
            var rPie = Math.min(wPie, hPie)/2.5;
            var donut = 75;

        // color
            var fillColor = d3.scaleOrdinal(d3.schemeCategory20);

        // initialize container

            // chart

                var svg = d3.select("#layer-group-dos")
                    .append("svg")
                    .attr("width", wPie)
                    .attr("height", hPie);

                var chart = svg.append("g")
                    .attr("transform", "translate(" + (size/2)+ ", "+(size/1.8)+ ")");

        // make pie chart

            // define radius 

                var arc = d3.arc()
                    .innerRadius(rPie - donut)
                    .outerRadius(rPie);

            // define angles
                var pie = d3.pie()
                    .value(function(d){
                        return d.value;
                    })
                    .sort(null);

            // draw pie chart
                var path = chart.selectAll("path")
                    .data(pie(dataset))
                    .enter()
                    .append("path")
                    .attr("d", arc)
                    .attr("fill", function(d,i){
                        return fillColor(i)
                    })
                    .attr("class", "pie-slice")


            // title

                svg.append("text")
                    .attr("class", "svg-title")
                    .attr("x", size/2)
                    .attr("y", size*.08)
                    .attr("text-anchor", "middle")
                    .text(text + " County")
                    .attr("fill", "#22333B");

                svg.append("text")
                    .attr("class", "svg-subtitle")
                    .attr("x", size/2)
                    .attr("y", size*.13)
                    .attr("text-anchor", "middle")
                    .text("Municipal Smart Growth Tools")
                    .attr("fill", "#5E7B67");                   

        // chart actions

            // tooltip

                var tip = d3.select("#layer-group-dos")
                    .append("div")
                    .attr("class", "pie-tooltip");

                tip.append("div")
                    .attr("class", "tip-type");

                path.on("mouseover", function(d){
                    tip.select(".tip-type").html(d.data.name);
                    tip.style("display", "block");
                })

                path.on("mouseout", function(d){
                    tip.style("display", "none");
                })

                path.on("mousemove", function(d){
                    tip.style('top', (d3.event.pageY) + 'px')
                      .style('left', (d3.event.pageX) + 'px');
                  }); 



            // slice click creates legend
                path.on("click", function(d){
                    svg.select("circle")
                        .remove();
                    svg.selectAll(".inner-circle-text")
                        .remove();

                    var fill = $(this).attr("fill");
                    var cat = d.data.name;
                    var total = d3.sum(dataset.map(function(d){
                        return d.value;
                    }));
                    var percent = Math.round((d.value/total)*100);

                    var legendContent = [cat, d.value, percent];
                    console.log(legendContent);

                    var legend = chart.append("circle")
                        .attr("r", rPie*.5)
                        .attr("fill", fill)
                        .attr("stroke", "#fff")
                        .attr("stroke-width", ".5em");

                    svg.selectAll(".inner-circle-text")
                        .data(legendContent)
                        .enter()
                        .append("text")
                        .attr("class", "inner-circle-text")
                        .attr("x", function(d,i){
                            return size/2;
                        })
                        .attr("y", function(d,i){
                            return size/2 + i*20;
                        })
                        .text(function(d, i){
                            if(i === 0){
                                return null;
                            }
                            else if (i === 1){
                                return d +" Ordinances";
                            }
                            else if (i===2){
                                return d + "% of total";
                            }
                        })
                        .attr("fill", "#fff");
                })
            };



// Load GeoJSONs and add to map



    // DVRPC Region //

    var activeCounty = [];

        // functions

                // Styling functions

                    // primary layer = DVRPC counties

                        function primaryStyle(f){
                            return{
                                fillColor: '#67ABD0',
                                fillOpacity: .7, 
                                color: '#fff',
                                opacity: 1,
                                weight: 2
                            };
                        }

                    // secondary layer = DVRPC municipalites
                        function secondaryStyle(f){
                            // color gradient based on total smart growth actions 
                        }


            // municipality filter
                function joinCSV(layer, table){
                    // do something... 
                }
// 


                function muniFilter(f, layer){
                    return f.properties.CO_NAME == activeCounty;
                }




        // Actions

            function featureActions(f, fl){
                fl.on({
                    click: layerClick, // Action 1
                    mouseover: highlight, // Action 2
                    mouseout: resetHighlight, // Action 3
                    dblclick: zoomToFeature // Action 4
                });
            }

            // Action 1 (Click)

                function layerClick(e){
                    var layer = e.target
                    var props = layer.feature.properties
                    activeCounty  = props.CO_NAME
                    var array = [];
                    array.push(
                        {
                            "name": "Accessory Dwelling Unit",
                            "value": props.adu
                        },
                        {
                            "name": "Alternative Energy Ordinances",
                            "value": props.aeo
                        },
                        {
                            "name": "Form-Based Codes",
                            "value": props.fbc
                        },
                        {
                            "name": "Green Building Ordinances",
                            "value": props.gbo
                        },
                        {
                            "name": "Multi-Municipal Comprehensive Plans",
                            "value": props.mmcp
                        },
                        {
                            "name": "Official Maps",
                            "value": props.om
                        },
                        {
                            "name": "Reserve Parking Ordinances",
                            "value": props.park_res
                        },
                        {
                            "name": "Fee-in-Lieu Parking Ordinances",
                            "value": props.park_fee
                        },
                        {
                            "name": "Shared Parking Ordinances",
                            "value": props.park_share
                        },
                        {
                            "name": "Traditional Neighborhood Design Ordinances",
                            "value": props.tnd
                        },
                        {
                            "name": "Transit-Oriented Development",
                            "value": props.tod
                        },
                        {
                            "name": "Transit Village Designation",
                            "value": props.trans
                        },
                        {
                            "name": "Sustainable Jersey Designation",
                            "value": props.sustain
                        },
                        {
                            "name": "Complete Streets Ordinances or Resolutions",
                            "value": props.cso,
                        }); 
                    map.fitBounds(e.target.getBounds());
                    bakePie(array, activeCounty);

                    // get filtered muni layer

                    	 // This kind of works -- Loads all and then applies a filter
                        // var muni = L.geoJson(null,{
                        //     style: {
                        //         fillColor: "#000",
                        //         fillOpacity: .7,
                        //         color: '#fff',
                        //         weight: 1,
                        //         opacity: 1
                        //     },
                        //     clickable: false,
                        //     filter: muniFilter
                        // })
                        // $.getJSON("https://opendata.arcgis.com/datasets/418897de5e97478eb70da54bc1912f32_2.geojson", function(data){
                        //     muni.addData(data);
                        // });     
                        // muni.addTo(map); 


                        // working version using jsonConverter
                        jsonconverter = esriConverter();

                        var muni = L.geoJson(null,{
                            style: {
                                fillColor: "#000",
                                fillOpacity: .7,
                                color: '#fff',
                                weight: 1,
                                opacity: 1
                            },
                            clickable: false,
                        });
                        map.addLayer(muni);
                        var link = "http://arcgis.dvrpc.org/arcgis/rest/services/Boundaries/DVRPC_Boundaries/FeatureServer/2/query?where=CO_NAME%20%3D%20'"+activeCounty+"'&outFields=CO_NAME,OBJECTID,STATE_NAME,GEOID_10&outSR=4326&f=json"
                        $.get(link, parseJSONP, "JSONP");
                        function parseJSONP(data){
                            var geoData = jsonconverter.toGeoJson(data);
                            muni.addData(geoData);
                        }
                        
                }


            // Action 2 (Mouseover)

                function highlight(e) {
                    var layer = e.target;
                    var props = layer.feature.properties;
                    layer.setStyle({
                        weight: 5,
                        color: "yellow",
                        fillColor: "#0078AE"
                    });
                    // if (!L.Browser.ie && !L.Browser.opera) {
                    //     layer.bringToFront();
                    // }
                };

            // Action 3 (Mouseout)

                function resetHighlight(e) {
                    var layer = e.target;
                    //return layer to back of map
                    if (!L.Browser.ie && !L.Browser.opera) {
                        layer.bringToBack();
                    }
                    DVRPC.resetStyle(e.target);
                    layer.setStyle({
                        weight: 1.51
                    });
                }

            // Action 4 (Double Click)

                function zoomToFeature(e) {
                    map.fitBounds(e.target.getBounds());
                }               


        // Load DVRPC Region Data

            var DVRPC = L.geoJson(null, {
                style: primaryStyle,
                clickable: true,
                onEachFeature: featureActions
            })
            $.getJSON("lib/data/countyjoin.json", function(data) {
                DVRPC.addData(data);
            });
            DVRPC.addTo(map);


// Document Ready - jQuery
$(document).ready(function(){

    // Sidebar Toggle
    $('#sidebar-toggle').on('click', function(){
        var sidebarCheck = $('#sidebar').css('display');
        if (sidebarCheck == 'block'){
            $("#sidebar").css('display', 'none');
            $("#mapDiv").toggleClass('col-sm-9 col-lg-9 col-sm-12 col-lg-12');
            $("#sidebar-icon").toggleClass("glyphicon-menu-left glyphicon-menu-right")
        }
        else{
            $("#sidebar").css('display', 'block');
            $("#mapDiv").toggleClass('col-sm-12 col-lg-12 col-sm-9 col-lg-9');
            $("#sidebar-icon").toggleClass("glyphicon-menu-right glyphicon-menu-left")          
        };
    map.invalidateSize();
    return false;
    });

    // Layer Checkbox Stuff
    $("input:checkbox[name='layer-cont']").on('change', function(){
        var visibleLayers = [];
        if ($('#'+$(this).attr('id')).is(':checked')) {
            $(this).toggleClass("glyphicon-ok-sign glyphicon-remove-sign");
        }
        else {
            $(this).toggleClass("glyphicon-remove-sign glyphicon-ok-sign");
        }
    });


});