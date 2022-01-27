package com.test.demojames.service;

import com.test.demojames.model.Location;

import java.util.List;

public interface GeoService {
    void addPostion(Location position);

    List<Long>  userNearBy(Long id,int radius);

    void delete(Long id);
}
