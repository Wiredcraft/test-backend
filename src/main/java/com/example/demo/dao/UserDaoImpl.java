package com.example.demo.dao;

import com.example.demo.model.User;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import java.util.List;

@Repository
public class UserDaoImpl implements UserDao {

    @Autowired
    private EntityManager entityManager;

    @Override
    public List<User> findAll() {
        return null;
    }

    @Override
    public User findById(int Id) {
        return null;
    }

    @Override
    public void save(User user) {
        // get the current hibernate session
        Session currentSession = entityManager.unwrap(Session.class);

        // save employee
        currentSession.saveOrUpdate(user);

    }

    @Override
    public void deleteById(int Id) {

    }
}
