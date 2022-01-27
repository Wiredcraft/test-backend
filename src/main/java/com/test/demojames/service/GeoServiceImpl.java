package com.test.demojames.service;

import com.test.demojames.model.Location;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.GeoResults;
import org.springframework.data.geo.Point;
import org.springframework.data.redis.connection.RedisGeoCommands;
import org.springframework.data.redis.core.GeoOperations;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@Service
public class GeoServiceImpl implements GeoService {
    private final String point = "point";
    @Autowired
    private StringRedisTemplate redisTemplate;


    public void addPostion(Location position) {

        GeoOperations<String, String> ops = redisTemplate.opsForGeo();
        ops.add(point, new Point(position.getX(), position.getY()), String.valueOf(position.getId()));
    }

    public List<Long> userNearBy(Long id, int radius) {

        GeoResults<RedisGeoCommands.GeoLocation<String>> userRadius = getUserRadius(id,radius);
        return userRadius.getContent().stream().map(it ->Long.valueOf( it.getContent().getName())).collect(Collectors.toList());

    }

    @Override
    public void delete(Long id) {
        GeoOperations<String, String> ops = redisTemplate.opsForGeo();
        ops.remove(point, String.valueOf(id));
    }

    private GeoResults<RedisGeoCommands.GeoLocation<String>> getUserRadius(Long id,int radius) {
        GeoOperations<String, String> opsForGeo = redisTemplate.opsForGeo();
        return opsForGeo.radius(point, String.valueOf(id), new Distance(radius, RedisGeoCommands.DistanceUnit.KILOMETERS));

    }

}
