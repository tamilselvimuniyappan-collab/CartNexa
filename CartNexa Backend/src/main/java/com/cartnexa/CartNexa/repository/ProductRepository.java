package com.cartnexa.CartNexa.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cartnexa.CartNexa.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Integer> {

    // Find products based on expiry date range
    List<Product> findByExpiryDateBetween(LocalDate startDate, LocalDate endDate);
    List<Product> findByQuantityLessThan(int quantity);
}