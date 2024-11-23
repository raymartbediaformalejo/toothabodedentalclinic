const regionsAPI = "https://psgc.cloud/api";

const getAllRegions = async (request, response) => {
  try {
    const requestRegion = await fetch(`${regionsAPI}/regions`);
    if (!requestRegion.ok) {
      console.error("Failed to fetch regions:", requestRegion.statusText);
      return response.status(requestRegion.status).send({
        message: "Failed to fetch regions",
        ok: false,
      });
    }
    const data = await requestRegion.json();
    return response.status(200).send({ data, ok: true });
  } catch (error) {
    console.error("Error Regions Controller", error);
    return response
      .status(500)
      .send({ message: "Internal Server Error", ok: false });
  }
};

const getProvincesCities = async (request, response) => {
  const { regionID } = request.params;
  try {
    const [requestProvinces, requestCities] = await Promise.all([
      fetch(`${regionsAPI}/regions/${regionID}/provinces`),
      fetch(`${regionsAPI}/regions/${regionID}/cities`),
    ]);

    if (!requestProvinces.ok || !requestCities.ok) {
      console.error(
        "Error fetching provinces or cities:",
        requestProvinces.statusText,
        requestCities.statusText
      );
      return response
        .status(500)
        .send({ message: "Failed to fetch provinces or cities", ok: false });
    }

    const provinces = await requestProvinces.json();
    const cities = await requestCities.json();
    const provincesAndCities = [provinces, cities].flat();
    return response.status(200).send({ data: provincesAndCities, ok: true });
  } catch (error) {
    console.error("Error Regions Controller", error);
    return response
      .status(500)
      .send({ message: "Internal Server Error", ok: false });
  }
};

const getBrgys = async (request, response) => {
  const { provinceCityID } = request.params;
  try {
    const [requestBarangaysFromProvinces, requestBarangaysFromCities] =
      await Promise.all([
        fetch(`${regionsAPI}/provinces/${provinceCityID}/barangays`),
        fetch(`${regionsAPI}/cities/${provinceCityID}/barangays`),
      ]);

    if (requestBarangaysFromCities.ok) {
      const cities = await requestBarangaysFromCities.json();
      return response.status(200).send({ data: cities, ok: true });
    } else if (requestBarangaysFromProvinces.ok) {
      const provinces = await requestBarangaysFromProvinces.json();
      return response.status(200).send({ data: provinces, ok: true });
    } else {
      return response
        .status(404)
        .send({ message: "No barangays found", ok: false });
    }
  } catch (error) {
    console.error("Error Regions Controller", error);
    return response
      .status(500)
      .send({ message: "Internal Server Error", ok: false });
  }
};

module.exports = { getAllRegions, getProvincesCities, getBrgys };
