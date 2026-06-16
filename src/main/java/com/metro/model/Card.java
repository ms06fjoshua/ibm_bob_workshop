package com.metro.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;

@Entity
@Table(name = "cards")
public class Card {

    @Id
    private Long id;

    @Column(nullable = false, unique = true, length = 30)
    private String cardNumber;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal balance;

    @Column(nullable = false, length = 30)
    private String cardType;
    public Card() {
    }

    public Card(Long id, String cardNumber, BigDecimal balance, String cardType) {
        this.id = id;
        this.cardNumber = cardNumber;
        this.balance = balance;
        this.cardType = cardType;
    }

    public Long getId() {
        return id;
    }

    public String getCardNumber() {
        return cardNumber;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public String getCardType() {
        return cardType;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setCardNumber(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public void setCardType(String cardType) {
        this.cardType = cardType;
    }
}

// Made with Bob
