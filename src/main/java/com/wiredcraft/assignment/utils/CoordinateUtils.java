package com.wiredcraft.assignment.utils;

import com.spatial4j.core.context.SpatialContext;
import com.spatial4j.core.distance.DistanceUtils;
import com.spatial4j.core.shape.Rectangle;

/**
 * @author jarvis.jia
 * @date 2022/5/26
 */
public class CoordinateUtils {

    public static final double EARTH_RADIUS = 6378.137;

    public static Rectangle getRectangle(double distance, double userLng, double userLat) {
        SpatialContext spatialContext = SpatialContext.GEO;
        return spatialContext.getDistCalc()
                .calcBoxByDistFromPt(spatialContext.makePoint(userLng, userLat),
                        distance * DistanceUtils.KM_TO_DEG, spatialContext, null);
    }

    public static double rad(double d) {
        return d * Math.PI / 180.0;
    }



    public static double getDistance(double longitude1, double latitude1, double longitude2, double latitude2) {
        double radLat1 = rad(latitude1);
        double radLat2 = rad(latitude2);
        double a = radLat1 - radLat2;
        double b = rad(longitude1) - rad(longitude2);
        double distance = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
                Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
        distance = distance * EARTH_RADIUS;
        distance = Math.round(distance * 10000) / 10000.0;
        return distance;
    }
}
