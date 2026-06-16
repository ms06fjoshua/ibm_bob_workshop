package com.metro.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
@Entity
@Table(name = "stations")
public class Station {

    @Id
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String stationName;

    @Column(nullable = false, length = 30)
    private String lineName;
    public Station() {
    }

    public Station(Long id, String stationName, String lineName) {
        this.id = id;
        this.stationName = stationName;
        this.lineName = lineName;
    }

    public Long getId() {
        return id;
    }

    public String getStationName() {
        return stationName;
    }

    public String getLineName() {
        return lineName;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setStationName(String stationName) {
        this.stationName = stationName;
    }

    public void setLineName(String lineName) {
        this.lineName = lineName;
    }
}

// Made with Bob
