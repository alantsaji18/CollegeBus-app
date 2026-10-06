const placeCoordinates = {
  campus: [10.2315, 76.3985],
  fisat: [10.2315, 76.3985],
  ernakulam: [9.9816, 76.2999],
  thrissur: [10.5276, 76.2144],
  chalakkudy: [10.307, 76.337],
  chalakudy: [10.307, 76.337],
  kothamangalam: [10.064, 76.629],
  muvattupuzha: [9.984, 76.579],
  angamaly: [10.19, 76.38],
  koratty: [10.2667, 76.2167],
  aluva: [10.1004, 76.357],
};

export const getPlaceCoordinates = (place) => {
  const normalizedPlace = String(place || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");

  if (normalizedPlace.includes("federalinstitute") || normalizedPlace.includes("hormis")) {
    return placeCoordinates.campus;
  }

  return placeCoordinates[normalizedPlace] || null;
};

export const toTrackingBus = (bus) => {
  const busId = bus.busId || bus.bus_id;
  const startingPlace = bus.startingPlace || bus.starting_place;
  const endingPlace = bus.endingPlace || bus.ending_place;

  return {
    ...bus,
    busId,
    startingPlace,
    endingPlace,
    driverName: bus.driverName || bus.driver_name || "",
    route: `${startingPlace} → ${endingPlace}`,
    routePath: [getPlaceCoordinates(startingPlace), getPlaceCoordinates(endingPlace)],
  };
};
