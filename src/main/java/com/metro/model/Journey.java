package com.metro.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "journeys")
public class Journey {

    @Id
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "card_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Card card;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "entry_station_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Station entryStation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exit_station_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Station exitStation;

    @Column(nullable = false)
    private LocalDateTime entryTime;

    @Column(nullable = false)
    private LocalDateTime exitTime;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal fare;

    @Column(nullable = false)
    private Integer durationMinutes;

    public Journey() {
    }

    public Journey(Long id, Card card, Station entryStation, Station exitStation,
                   LocalDateTime entryTime, LocalDateTime exitTime,
                   BigDecimal fare, Integer durationMinutes) {
        this.id = id;
        this.card = card;
        this.entryStation = entryStation;
        this.exitStation = exitStation;
        this.entryTime = entryTime;
        this.exitTime = exitTime;
        this.fare = fare;
        this.durationMinutes = durationMinutes;
    }

    public Long getId() {
        return id;
    }

    public Card getCard() {
        return card;
    }

    public Station getEntryStation() {
        return entryStation;
    }

    public Station getExitStation() {
        return exitStation;
    }

    public LocalDateTime getEntryTime() {
        return entryTime;
    }

    public LocalDateTime getExitTime() {
        return exitTime;
    }

    public BigDecimal getFare() {
        return fare;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setCard(Card card) {
        this.card = card;
    }

    public void setEntryStation(Station entryStation) {
        this.entryStation = entryStation;
    }

    public void setExitStation(Station exitStation) {
        this.exitStation = exitStation;
    }

    public void setEntryTime(LocalDateTime entryTime) {
        this.entryTime = entryTime;
    }

    public void setExitTime(LocalDateTime exitTime) {
        this.exitTime = exitTime;
    }

    public void setFare(BigDecimal fare) {
        this.fare = fare;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }
}

// Made with Bob