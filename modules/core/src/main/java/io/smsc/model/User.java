package io.smsc.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.smsc.model.customer.Customer;
import io.smsc.model.dashboard.Dashboard;
import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.NotEmpty;

import javax.persistence.*;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.util.Date;
import java.util.Set;

/**
 * Specifies User class as an entity class.
 *
 * @author  Nazar Lipkovskyy
 * @see     BaseEntity
 * @since   0.0.1-SNAPSHOT
 */
@Entity
@Table(name = "USER_ACCOUNT", uniqueConstraints = {@UniqueConstraint(columnNames = {"USERNAME","EMAIL"}, name = "users_username_email_idx")})
public class User extends BaseEntity {

    @Column(name = "USERNAME", nullable = false, unique = true)
    @NotEmpty(message = "{user.username.validation}")
    private String username;

    @Column(name = "PASSWORD", nullable = false)
    @NotEmpty(message = "{user.password.empty.validation}")
    private String password;

    @Column(name="SALT")
    private String salt;

    @Column(name = "FIRST_NAME", nullable = false)
    @NotEmpty(message = "{user.firstname.validation}")
    private String firstname;

    @Column(name = "SURNAME", nullable = false)
    @NotEmpty(message = "{user.surname.validation}")
    private String surname;

    @Column(name = "EMAIL", nullable = false, unique = true)
    @Email(message = "{user.email.format.validation}")
    @NotEmpty(message = "{user.email.empty.validation}")
    private String email;

    @Column(name = "ACTIVE")
    private Boolean active = true;

    @Column(name = "CREATED")
    @JsonFormat(shape=JsonFormat.Shape.STRING, pattern="yyyy-MM-dd HH:mm:ss", timezone="CET")
    private Date created = new Date();

    @Column(name = "BLOCKED")
    private Boolean blocked = false;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "USER_ROLE",
            joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "role_id", referencedColumnName = "id")
    )
    private Set<Role> roles;

    @ManyToMany(mappedBy = "users")
    @OrderBy
    @JsonBackReference
    private Set<Customer> customers;

    @OneToMany(mappedBy = "user", orphanRemoval = true)
    @OrderBy
    private Set<Dashboard> dashboards;

    /**
     * This method is used for removing all links on User entity from
     * appropriate Customer entities before entity is removed. Without
     * it deleting entity can cause <code>ConstraintViolationException<code/>
     */
    @PreRemove
    private void removeUsersFromCustomers() {
        for (Customer customer : customers) {
            customer.getUsers().remove(this);
        }
    }

    public User() {
    }

    public User(User user) {
        this(user.getId(),user.getUsername(),user.getPassword(),user.getFirstname(),user.getSurname(),user.getEmail(),user.isActive(),user.isBlocked());
    }

    public User(Long id, String username, String password, String firstname, String surname, String email, boolean active, boolean blocked) {
        super(id);
        this.username = username;
        this.password = password;
        this.firstname = firstname;
        this.surname = surname;
        this.email = email;
        this.active = active;
        this.blocked = blocked;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String userName) {
        this.username = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstName) {
        this.firstname = firstName;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surName) {
        this.surname = surName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public Date getCreated() {
        return created;
    }

    public void setCreated(Date created) {
        this.created = created;
    }

    public boolean isBlocked() {
        return blocked;
    }

    public void setBlocked(boolean blocked) {
        this.blocked = blocked;
    }

    public String getSalt() {
        return salt;
    }

    public void setSalt(String salt) {
        this.salt = salt;
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }

    public boolean addRole(Role role){
        return this.roles.add(role);
    }

    public boolean removeRole(Role role){
        return this.roles.remove(role);
    }

    public Set<Customer> getCustomers() {
        return customers;
    }

    public void setCustomers(Set<Customer> customers) {
        this.customers = customers;
    }

    public Set<Dashboard> getDashboards() {
        return dashboards;
    }

    public void setDashboards(Set<Dashboard> dashboards) {
        this.dashboards = dashboards;
    }

    public void addDashboard(Dashboard dashboard) {
        this.dashboards.add(dashboard);
    }

    public void removeDashboard(Dashboard dashboard) {
        this.dashboards.remove(dashboard);
    }

    public void addCustomer(Customer customer) {
        this.customers.add(customer);
    }

    public void removeCustomer(Customer customer) {
        this.customers.remove(customer);
    }

    @Override
    public String toString() {
        return "User{" +
                "userName='" + username + '\'' +
                ", password='" + password + '\'' +
                ", salt='" + salt + '\'' +
                ", firstName='" + firstname + '\'' +
                ", surName='" + surname + '\'' +
                ", email='" + email + '\'' +
                ", active=" + active +
                ", created=" + created +
                ", blocked=" + blocked +
                ", roles=" + roles +
                ", dashboards=" + dashboards +
                "} " + super.toString();
    }
}
