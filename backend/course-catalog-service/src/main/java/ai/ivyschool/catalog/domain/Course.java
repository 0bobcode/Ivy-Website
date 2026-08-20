package ai.ivyschool.catalog.domain;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "teacher_id", nullable = false)
    private UUID teacherId;

    @Column(name = "tenant_id")
    private UUID tenantId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String description = "";

    @Column(name = "grade_label", nullable = false)
    private String gradeLabel = "";

    @Column(nullable = false)
    private String provider = "";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CourseStatus status = CourseStatus.DRAFT;

    // Hero image for the course card. Nullable — cards without one fall back
    // to a placeholder client-side rather than requiring an upload.
    @Column(name = "image_url")
    private String imageUrl;

    // Null = "Coming Soon" card treatment (no enrollment yet); a number,
    // including zero, means the course is actually bookable.
    @Column(name = "seats_left")
    private Integer seatsLeft;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(columnDefinition = "text[]", nullable = false)
    private List<String> features = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    // Eager: a course's lesson list is small, and DTO mapping happens outside
    // the service's transaction boundary (open-in-view is off by design) —
    // lazy here would throw LazyInitializationException on every read.
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @OrderBy("sortOrder asc")
    private List<Lesson> lessons = new ArrayList<>();

    protected Course() {
    }

    public Course(UUID teacherId, String title) {
        this.teacherId = teacherId;
        this.title = title;
    }

    public UUID getId() {
        return id;
    }

    public UUID getTeacherId() {
        return teacherId;
    }

    public UUID getTenantId() {
        return tenantId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
        touch();
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
        touch();
    }

    public String getGradeLabel() {
        return gradeLabel;
    }

    public void setGradeLabel(String gradeLabel) {
        this.gradeLabel = gradeLabel;
        touch();
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
        touch();
    }

    public CourseStatus getStatus() {
        return status;
    }

    public void publish() {
        this.status = CourseStatus.PUBLISHED;
        touch();
    }

    public void unpublish() {
        this.status = CourseStatus.DRAFT;
        touch();
    }

    public boolean isOwnedBy(UUID userId) {
        return teacherId.equals(userId);
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
        touch();
    }

    public Integer getSeatsLeft() {
        return seatsLeft;
    }

    public void setSeatsLeft(Integer seatsLeft) {
        this.seatsLeft = seatsLeft;
        touch();
    }

    public List<String> getFeatures() {
        return features;
    }

    public void setFeatures(List<String> features) {
        this.features = features != null ? features : new ArrayList<>();
        touch();
    }

    public List<Lesson> getLessons() {
        return lessons;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    private void touch() {
        this.updatedAt = Instant.now();
    }
}
