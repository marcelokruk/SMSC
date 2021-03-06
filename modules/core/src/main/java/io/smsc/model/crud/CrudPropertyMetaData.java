package io.smsc.model.crud;

import io.smsc.model.BaseEntity;
import org.hibernate.validator.constraints.NotEmpty;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

/**
 * Specifies CrudPropertyMetaData class as an mapped superclass. It's mapping information
 * is applied to the entities that inherit from it.
 *
 * @author  Nazar Lipkovskyy
 * @see     BaseEntity
 * @see     MappedSuperclass
 * @since   0.0.1-SNAPSHOT
 */
@MappedSuperclass
public class CrudPropertyMetaData extends BaseEntity {

    @Column(name = "PROPERTY", nullable = false)
    @NotEmpty(message = "{crud.property.meta.data.property.validation}")
    private String property;

    @Column(name = "EDITABLE", nullable = false)
    @NotNull(message = "{crud.property.meta.data.editable.validation}")
    private Boolean editable;

    @Column(name = "VISIBLE", nullable = false)
    @NotNull(message = "{crud.property.meta.data.visible.validation}")
    private Boolean visible;

    @Column(name = "DECORATOR")
    private String decorator;

    //PostgreSQL isn't supporting column name "ORDER"
    @Column(name = "ORDER_NUMBER", nullable = false)
    @NotNull(message = "{crud.property.meta.data.order.validation}")
    private Double order;

    public CrudPropertyMetaData() {
    }

    public CrudPropertyMetaData(Long id, String property, Boolean editable, Boolean visible, String decorator, Double order) {
        super(id);
        this.property = property;
        this.editable = editable;
        this.visible = visible;
        this.decorator = decorator;
        this.order = order;
    }

    public String getProperty() {
        return property;
    }

    public void setProperty(String property) {
        this.property = property;
    }

    public Boolean getEditable() {
        return editable;
    }

    public void setEditable(Boolean editable) {
        this.editable = editable;
    }

    public Boolean getVisible() {
        return visible;
    }

    public void setVisible(Boolean visible) {
        this.visible = visible;
    }

    public String getDecorator() {
        return decorator;
    }

    public void setDecorator(String decorator) {
        this.decorator = decorator;
    }

    public Double getOrder() {
        return order;
    }

    public void setOrder(Double order) {
        this.order = order;
    }

    @Override
    public String toString() {
        return "CrudPropertyMetaData{" +
                "property='" + property + '\'' +
                ", editable=" + editable +
                ", visible=" + visible +
                ", decorator='" + decorator + '\'' +
                ", order=" + order + '}';
    }
}
