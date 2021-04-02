/*global kakao*/
import React, { Fragment, useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { RouteComponentProps } from "@reach/router";
import dotenv from "dotenv";
dotenv.config();

declare global {
  interface Window {
    kakao: any;
  }
}

const GET_COORDS = gql`
  query GetCoords {
    coord @client
  }
`;

interface MapProps extends RouteComponentProps {}

const Map: React.FC<MapProps> = () => {
  const { data, loading, error } = useQuery(GET_COORDS);
  const [mapObj, setMapObj] = useState();
  let markerList: any = [];
  let infoWindowList: any = [];

  function makeOverListener(map: any, marker: any, infowindow: any) {
    return function () {
      infowindow.open(map, marker);
    };
  }

  function makeOutListener(infowindow: any) {
    return function () {
      infowindow.close();
    };
  }

  useEffect(() => {
    if (!data.coord.length) return;

    function panTo(map: any, lat: any, lng: any) {
      var moveLatLon = new window.kakao.maps.LatLng(lat, lng);
      map.panTo(moveLatLon);
    }

    // after clicking a list item
    if (data.coord.length === 1) {
      if (!data.coord[0].location.lat || !data.coord[0].location.long) return;

      const marker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(
          data.coord[0].location.lat,
          data.coord[0].location.long
        ),
      });

      const infoWindow = new window.kakao.maps.InfoWindow({
        position: new window.kakao.maps.LatLng(
          data.coord[0].location.lat,
          data.coord[0].location.long
        ),
        content: "<div class='onmap'>" + data.coord[0].name + "</div>",
      });

      marker.setMap(mapObj);
      infoWindow.open(mapObj, marker);
      panTo(mapObj, data.coord[0].location.lat, data.coord[0].location.long);

      markerList.push(marker);
      infoWindowList.push(infoWindow);
    } else {
      data.coord.map((item: any) => {
        const marker = new window.kakao.maps.Marker({
          map: mapObj,
          position: new window.kakao.maps.LatLng(
            item.location.lat,
            item.location.long
          ),
        });

        const infoWindow = new window.kakao.maps.InfoWindow({
          content: "<div class='onmap'>" + item.name + "</div>",
        });

        window.kakao.maps.event.addListener(
          marker,
          "mouseover",
          makeOverListener(mapObj, marker, infoWindow)
        );
        window.kakao.maps.event.addListener(
          marker,
          "mouseout",
          makeOutListener(infoWindow)
        );

        markerList.push(marker);
      });
    }

    return () => {
      markerList.map((item: any) => item.setMap(null));
      markerList = [];
      if (infoWindowList.length) {
        infoWindowList.map((item: any) => item.close());
        infoWindowList = [];
      }
    };
  }, [data]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_MAP_KEY_DEV}&autoload=false`;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        let container = document.getElementById("map");
        let options = {
          center: new window.kakao.maps.LatLng(37.6027778, 127.143088),
          level: 6,
          draggable: true,
          scrollwheel: true,
          keyboardShortcuts: true,
        };
        const map = new window.kakao.maps.Map(container, options);
        setMapObj(map);
      });
    };
  }, []);

  if (loading) return <p>LOADING</p>;
  if (error) return <p>ERROR: {error.message}</p>;
  // if (data) {
  //   console.log("coord", data);
  // }
  return (
    <Fragment>
      <div id="map" className="map"></div>
    </Fragment>
  );
};

export default Map;