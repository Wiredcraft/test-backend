package com.test.demojames.service;


import com.test.demojames.model.entity.User;
import com.test.demojames.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    private final GeoService geoService;

    public UserServiceImpl(UserRepository userRepository, GeoService geoService) {
        this.userRepository = userRepository;
        this.geoService = geoService;
    }


    public User get(Long id) {
        return userRepository.findUsersById(id);

    }

    @Override
    public void delete(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public User add(User user) {
        return userRepository.save(user);
    }

    @Override
    public User update(User user) {
        User usersById = userRepository.findUsersById(user.getId());
        if (usersById != null) {
            user.setId(usersById.getId());

        }
        return userRepository.save(user);

    }

    public List<User> getUserNearBy(Long id, int radius) {
        List<Long> userList = geoService.userNearBy(id, radius);
        if (CollectionUtils.isEmpty(userList)) {
            return null;
        }
        Iterable<User> allById = userRepository.findAllById(userList);
        List<User> result = new ArrayList<>();
        allById.iterator().forEachRemaining(result::add);
        return result;
    }


}
