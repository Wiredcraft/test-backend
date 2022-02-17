package com.wiredcraft.myhomework.utils;

import com.wiredcraft.myhomework.common.GeoPosition;
import com.wiredcraft.myhomework.exception.UserException;
import org.testng.annotations.Test;

public class GeoUtilsTest {

  @Test(expectedExceptions = UserException.class, expectedExceptionsMessageRegExp = "user's geo position should not be null.")
  public void testValidateWithException() throws UserException {
    GeoUtils.validateGeo(null);
  }

  @Test(expectedExceptions = UserException.class, expectedExceptionsMessageRegExp = "geo position should belong to a user.")
  public void testValidateWithException2() throws UserException {
    GeoPosition geo = new GeoPosition();
    geo.setUserName("");
    GeoUtils.validateGeo(geo);
  }

  @Test(expectedExceptions = UserException.class, expectedExceptionsMessageRegExp = "User should be on Earth.")
  public void testValidateWithException3() throws UserException {
    GeoPosition geo = new GeoPosition();
    geo.setUserName("admin");
    geo.setLongitude(-181);
    geo.setLatitude(171);
    GeoUtils.validateGeo(geo);
  }

  @Test(expectedExceptions = UserException.class, expectedExceptionsMessageRegExp = "User should be on Earth.")
  public void testValidateWithException4() throws UserException {
    GeoPosition geo = new GeoPosition();
    geo.setUserName("admin");
    geo.setLongitude(181);
    geo.setLatitude(171);
    GeoUtils.validateGeo(geo);
  }

  @Test(expectedExceptions = UserException.class, expectedExceptionsMessageRegExp = "User should be on Earth.")
  public void testValidateWithException5() throws UserException {
    GeoPosition geo = new GeoPosition();
    geo.setUserName("admin");
    geo.setLongitude(171);
    geo.setLatitude(-181);
    GeoUtils.validateGeo(geo);
  }

  @Test(expectedExceptions = UserException.class, expectedExceptionsMessageRegExp = "User should be on Earth.")
  public void testValidateWithException6() throws UserException {
    GeoPosition geo = new GeoPosition();
    geo.setUserName("admin");
    geo.setLongitude(171);
    geo.setLatitude(181);
    GeoUtils.validateGeo(geo);
  }

  @Test(expectedExceptions = UserException.class, expectedExceptionsMessageRegExp = "Distance could not be negative.")
  public void testValidateWithException7() throws UserException {
    GeoPosition geo = new GeoPosition();
    geo.setUserName("admin");
    geo.setLongitude(171.0);
    geo.setLatitude(171.0);
    geo.setDistance(-1);
    GeoUtils.validateGeo(geo);
  }

}
