import { CrudMetaDataPage } from './crud-meta-data.page';

export const CRUD_META_DATA_SPEC_DEFINITIONS = () => {
    let ptor = protractor.wrapDriver(browser.driver);
    let crudMetaDataPage: CrudMetaDataPage = new CrudMetaDataPage();

    beforeEach(() => {
        ptor = protractor.wrapDriver(browser.driver);
    });

    it('log in smsc.io', () => {
        crudMetaDataPage.get();
        crudMetaDataPage.login.login();
        expect(crudMetaDataPage.isPresentLogo()).toBeTruthy();
    });

    it('should navigate to the customer', () => {
        crudMetaDataPage.clickOnCustomers();
        expect(crudMetaDataPage.isPresentCustomers()).toBeTruthy();
    });

    it('should navigate to the create', () => {
        let width = 1024,
            height = 768;
        ptor.manage().window().setSize(width, height);

        crudMetaDataPage.clickOnBtnAddRecord();
        expect(crudMetaDataPage.isPresentCrudCreateTag()).toBeTruthy();
    });

    it('readonly should be false', () => {
        crudMetaDataPage.customerIdField.getAttribute('readonly')
            .then(readonly => {
                expect(readonly).toBeNull();
            });
    });

    it('city field should be displayed', () => {
        expect(crudMetaDataPage.isPresentCityField()).toBeTruthy();
    });

    it('order should be descending', () => {
        crudMetaDataPage.firstFieldInForm.getAttribute('class')
            .then(classes => {
                expect(crudMetaDataPage.isExistClass(classes, 'customerId')).toBeTruthy();
            });
    });

    it('should navigate to the formMetaData', () => {
        crudMetaDataPage.clickOnMetaData();
        crudMetaDataPage.clickOnFormMetaData();
        expect(crudMetaDataPage.isPresentFormMetaData()).toBeTruthy();
    });

    it('should navigate to the formMetaData', () => {
        crudMetaDataPage.clickOnFormMetaData();
        expect(crudMetaDataPage.isPresentFormMetaData()).toBeTruthy();
    });

    it('should be change visible property', () => {
        crudMetaDataPage.hideProperty();
        expect(crudMetaDataPage.isPresentFormMetaData()).toBeTruthy();
    });

    it('should be change editable and order properties', () => {
        crudMetaDataPage.orderReadonlyProperty('3');
        expect(crudMetaDataPage.isPresentFormMetaData()).toBeTruthy();
    });

    it('should navigate to the customer', () => {
        crudMetaDataPage.clickOnCustomers();
        expect(crudMetaDataPage.isPresentCustomers()).toBeTruthy();
    });

    it('should navigate to the create', () => {
        crudMetaDataPage.clickOnBtnAddRecord();
        expect(crudMetaDataPage.isPresentCrudCreateTag()).toBeTruthy();
    });

    it('readonly should be true', () => {
        crudMetaDataPage.customerIdField.getAttribute('readonly')
            .then(readonly => {
                expect(readonly).toBeTruthy();
            });
    });

    it('city field should be hidden', () => {
        crudMetaDataPage.cityField.isDisplayed()
            .then(isDisplayed => {
                expect(isDisplayed).toBeFalsy();
            });
    });

    it('order should be ascending', () => {
        crudMetaDataPage.firstFieldInForm.getAttribute('class')
            .then(classes => {
                expect(crudMetaDataPage.isExistClass(classes, 'companyName')).toBeTruthy();
            });
    });

    it('should navigate to the formMetaData', () => {
        crudMetaDataPage.clickOnFormMetaData();
        expect(crudMetaDataPage.isPresentFormMetaData()).toBeTruthy();
    });

    it('should be change visible property', () => {
        crudMetaDataPage.hideProperty();
        expect(crudMetaDataPage.isPresentFormMetaData()).toBeTruthy();
    });

    it('should be change editable and order properties', () => {
        crudMetaDataPage.orderReadonlyProperty('1');
        expect(crudMetaDataPage.isPresentFormMetaData()).toBeTruthy();
    });

    it('should logout', () => {
        crudMetaDataPage.login.logout();
        expect(crudMetaDataPage.login.isPresentLogin()).toBeTruthy();
    });

};
