package com.test.demojames.repository;

import com.test.demojames.model.entity.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface UserRepository extends CrudRepository<User,Long> {
    User findUsersById(Long id);


//    Collection<User> findAllById(Collection<Long> idList);
}
