package io.smsc.repository.crud.rest;

import io.smsc.model.crud.CrudMetaFormData;
import io.smsc.AbstractTest;
import org.junit.Test;
import org.springframework.security.test.context.support.WithMockUser;

import static io.smsc.test_data.CrudMetaFormDataTestData.*;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WithMockUser(username="Admin",roles = {"ADMIN"})
public class CrudMetaFormDataRestTest extends AbstractTest {

    @Test
    public void testGetSingleCrudMetaFormData() throws Exception {
        mockMvc.perform(get("/rest/repository/crud-meta-form-data/64"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(contentType))
                .andExpect(jsonPath("$.property", is(CRUD_META_FORM_DATA_1.getProperty())))
                .andExpect(jsonPath("$.editable", is(CRUD_META_FORM_DATA_1.getEditable())))
                .andExpect(jsonPath("$.visible", is(CRUD_META_FORM_DATA_1.getVisible())))
                .andExpect(jsonPath("$.decorator", is(CRUD_META_FORM_DATA_1.getDecorator())))
                .andExpect(jsonPath("$.order", is(CRUD_META_FORM_DATA_1.getOrder())))
                .andExpect(jsonPath("$.fieldLayoutGridPosition", is(CRUD_META_FORM_DATA_1.getFieldLayoutGridPosition())));
    }

    @Test
    public void testCrudMetaFormDataNotFound() throws Exception {
        mockMvc.perform(get("/rest/repository/crud-meta-form-data/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testGetAllCrudMetaFormDatas() throws Exception {
        mockMvc.perform(get("/rest/repository/crud-meta-form-data/search/findAll"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(contentType))
                // paginating is showing 20 items by default
                    .andExpect(jsonPath("$._embedded.crud-meta-form-data", hasSize(42)))
                .andExpect(jsonPath("$._embedded.crud-meta-form-data[0].property", is(CRUD_META_FORM_DATA_1.getProperty())))
                .andExpect(jsonPath("$._embedded.crud-meta-form-data[0].editable", is(CRUD_META_FORM_DATA_1.getEditable())))
                .andExpect(jsonPath("$._embedded.crud-meta-form-data[0].visible", is(CRUD_META_FORM_DATA_1.getVisible())))
                .andExpect(jsonPath("$._embedded.crud-meta-form-data[0].decorator", is(CRUD_META_FORM_DATA_1.getDecorator())))
                .andExpect(jsonPath("$._embedded.crud-meta-form-data[0].order", is(CRUD_META_FORM_DATA_1.getOrder())))
                .andExpect(jsonPath("$._embedded.crud-meta-form-data[0].fieldLayoutGridPosition", is(CRUD_META_FORM_DATA_1.getFieldLayoutGridPosition())))
                .andExpect(jsonPath("$._embedded.crud-meta-form-data[41].property", is(CRUD_META_FORM_DATA_42.getProperty())))
                .andExpect(jsonPath("$._embedded.crud-meta-form-data[41].editable", is(CRUD_META_FORM_DATA_42.getEditable())))
                .andExpect(jsonPath("$._embedded.crud-meta-form-data[41].visible", is(CRUD_META_FORM_DATA_42.getVisible())))
                .andExpect(jsonPath("$._embedded.crud-meta-form-data[41].decorator", is(CRUD_META_FORM_DATA_42.getDecorator())))
                .andExpect(jsonPath("$._embedded.crud-meta-form-data[41].order", is(CRUD_META_FORM_DATA_42.getOrder())))
                .andExpect(jsonPath("$._embedded.crud-meta-form-data[41].fieldLayoutGridPosition", is(CRUD_META_FORM_DATA_42.getFieldLayoutGridPosition())));
    }

    @Test
    public void testCreateCrudMetaFormData() throws Exception {
        CrudMetaFormData newCrudClassMetaData = new CrudMetaFormData(null,"defaultProperty", true,
                true, null, 10.0, "newFieldLayoutGridPosition");
        String crudClassMetaDataJson = json(newCrudClassMetaData);
        this.mockMvc.perform(post("/rest/repository/crud-meta-form-data")
                .contentType(contentType)
                .content(crudClassMetaDataJson))
                .andExpect(status().isCreated());
    }

    @Test
    public void testDeleteCrudMetaFormData() throws Exception {
        mockMvc.perform(delete("/rest/repository/crud-meta-form-data/64"));
        mockMvc.perform(post("/rest/repository/crud-meta-form-data/64"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testUpdateCrudMetaFormData() throws Exception {
        CrudMetaFormData updated = new CrudMetaFormData(CRUD_META_FORM_DATA_1);
        updated.setDecorator("newDecorator");
        updated.setEditable(false);
        updated.setOrder(20.0);
        updated.setProperty("newProperty");
        updated.setVisible(false);
        updated.setFieldLayoutGridPosition("newFieldLayoutGridPosition");
        String permissionJson = json(updated);
        mockMvc.perform(put("/rest/repository/crud-meta-form-data/64")
                .contentType(contentType)
                .content(permissionJson))
                .andExpect(status().isNoContent());
        mockMvc.perform(get("/rest/repository/crud-meta-form-data/64"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(contentType))
                .andExpect(jsonPath("$.property", is("newProperty")))
                .andExpect(jsonPath("$.editable", is(false)))
                .andExpect(jsonPath("$.visible", is(false)))
                .andExpect(jsonPath("$.decorator", is("newDecorator")))
                .andExpect(jsonPath("$.order", is(20.0)))
                .andExpect(jsonPath("$.fieldLayoutGridPosition", is("newFieldLayoutGridPosition")));
    }
}