package com.cartnexa.CartNexa;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.cartnexa.CartNexa")
public class CartNexaApplication {

    public static void main(String[] args) {
        SpringApplication.run(CartNexaApplication.class, args);
    }
}