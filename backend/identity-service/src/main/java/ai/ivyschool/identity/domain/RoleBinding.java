package ai.ivyschool.identity.domain;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "role_bindings")
public class RoleBinding {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    // Null tenantId means the role applies platform-wide (e.g. Admin).
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id")
    private Tenant tenant;

    protected RoleBinding() {
    }

    public RoleBinding(User user, Role role, Tenant tenant) {
        this.user = user;
        this.role = role;
        this.tenant = tenant;
    }

    public UUID getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public Role getRole() {
        return role;
    }

    public Tenant getTenant() {
        return tenant;
    }
}
