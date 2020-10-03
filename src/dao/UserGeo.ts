import {Redis} from "../database/Redis";
import {UserGeo} from "../model/UserGeo";
import {Config} from "../config/Config";

export const KEY_GLOBAL_GEO_ID = "GeoUsers";

export const saveUserGeo = async (userGeo: UserGeo): Promise<number> => {
  return await Redis.get().geoadd(KEY_GLOBAL_GEO_ID, userGeo.longitude, userGeo.latitude, userGeo.id);
};

export const getNearbyUserIds = async (userId: string): Promise<string[]> => {
  return await Redis.get().georadiusbymember(
    KEY_GLOBAL_GEO_ID, userId,
    parseInt(Config.get("SEARCH_RADIUS", "5")),
    Config.get("SEARCH_UNIT", "km"),
  );
};
