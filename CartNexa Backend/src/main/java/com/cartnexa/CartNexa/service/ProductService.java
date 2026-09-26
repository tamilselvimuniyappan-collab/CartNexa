package com.cartnexa.CartNexa.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cartnexa.CartNexa.entity.Product;
import com.cartnexa.CartNexa.repository.ProductRepository;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    // Insert or Update Product
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    // Fetch All Products
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Fetch Product By ID
    public Product getProductById(int id) {
        return productRepository.findById(id).orElse(null);
    }

    // Delete Product
    public void deleteProduct(int id) {
        productRepository.deleteById(id);
    }
 // Fetch products expiring within the next 7 days
    public List<Product> getSoonToExpireProducts() {

        LocalDate today = LocalDate.now();
        LocalDate next7Days = today.plusDays(7);

        return productRepository.findByExpiryDateBetween(today, next7Days);
    }
 // Fetch low-stock products
    public List<Product> getLowStockProducts() {
        return productRepository.findByQuantityLessThan(10);
    }
}