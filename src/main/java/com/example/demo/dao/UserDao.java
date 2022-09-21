package com.example.demo.dao;

import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserDao extends JpaRepository<User, Integer> {
    // public List<User> findAll();

    // public User findById(int Id);

    // public User save(User user);

    // public void deleteById(int Id);
}
