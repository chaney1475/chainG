package com.ssafy.chaing.common.domain;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import java.time.ZonedDateTime;
import lombok.Getter;

@Getter
@MappedSuperclass
public abstract class BaseEntity {
    @Column(updatable = false)
    private ZonedDateTime createdAt;

    @Column
    private ZonedDateTime updatedAt;

    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean isDeleted = false;

    @Column(columnDefinition = "datetime(6)")
    private ZonedDateTime deletedAt;

    @PrePersist
    public void PrePersist() {
        this.createdAt = ZonedDateTime.now();
        this.updatedAt = ZonedDateTime.now();
    }

    @PreUpdate
    public void PreUpdate() {
        this.updatedAt = ZonedDateTime.now();
    }

    public boolean isDeleted() {
        return this.isDeleted;
    }

    public void softDelete(){
        this.isDeleted = true;
        this.deletedAt = ZonedDateTime.now();
    }
}
