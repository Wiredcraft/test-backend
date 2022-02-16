package com.wiredcraft.myhomework.utils;

import com.wiredcraft.myhomework.common.GeoPosition;
import com.wiredcraft.myhomework.exception.UserException;
import org.springframework.util.StringUtils;

public class GeoUtils {

  public static void volidateGeo(GeoPosition geoPosition) throws UserException {
    if (geoPosition == null) {
      throw new UserException("user's geo position should not be null.");
    }

    if (!StringUtils.hasText(geoPosition.getUserName())) {
      throw new UserException("geo position should belong to a user.");
    }

    if (geoPosition.getLongitude() > 180 || geoPosition.getLongitude() < -180 || geoPosition.getLatitude() > 180 || geoPosition.getLatitude() < -180) {
      throw new UserException("User should be on Earth.");
    }

    if (geoPosition.getDistance() < 0) {
      throw new UserException("Distance could not be negative.");
    }
  }
}
