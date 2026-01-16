package com.example.meeting.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "participants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Participant {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String season;

    @Column(nullable = false, unique = true)
    private String phone;

    @OneToOne(mappedBy = "participant", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private Profile profile;

    @ManyToMany(mappedBy = "participants", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Meeting> meetings = new ArrayList<>();

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
