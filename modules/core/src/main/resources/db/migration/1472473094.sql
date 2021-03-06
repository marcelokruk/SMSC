let OUserRID = SELECT * FROM OUser WHERE name = 'admin';
let Dashboard = SELECT FROM (SELECT expand(classes) FROM metadata:schema) WHERE name = 'Dashboard';

if ($Dashboard.size() == 0) {
  console.log "Dashboard class not exists! Start creating process."

  CREATE Class Dashboard
  CREATE PROPERTY Dashboard.name STRING
  CREATE PROPERTY Dashboard.icon STRING
  CREATE PROPERTY Dashboard.user LINK OUser

  ALTER PROPERTY Dashboard.name MANDATORY true
  ALTER PROPERTY Dashboard.icon MANDATORY true
  ALTER PROPERTY Dashboard.user MANDATORY true

  CREATE INDEX UNIQUE_NAME_USER ON Dashboard (name, user) UNIQUE

  let defaultDashboard = INSERT INTO Dashboard SET name = 'default', icon = 'user', user = $OUserRID['@rid'][0]

  console.log "Creating process for Dashboard class is done."

  let DashboardBoxType = SELECT FROM (SELECT expand(classes) FROM metadata:schema) WHERE name = 'DashboardBoxType';

  if ($DashboardBoxType.size() == 0) {
    console.log "DashboardBoxType class not exists! Start creating process."

    CREATE Class DashboardBoxType EXTENDS OTriggered

    CREATE PROPERTY DashboardBoxType.name STRING
    CREATE PROPERTY DashboardBoxType.type STRING
    CREATE PROPERTY DashboardBoxType.kind STRING
    CREATE PROPERTY DashboardBoxType.codeLanguage STRING
    CREATE PROPERTY DashboardBoxType.code STRING

    ALTER PROPERTY DashboardBoxType.name MANDATORY true
    ALTER PROPERTY DashboardBoxType.type MANDATORY true
    ALTER PROPERTY DashboardBoxType.type CUSTOM type='status,chart'
    ALTER PROPERTY DashboardBoxType.kind MANDATORY true
    ALTER PROPERTY DashboardBoxType.kind CUSTOM type='Pie chart, Serial chart, Feedback status, Profit status, Orders status, Users status'
    ALTER PROPERTY DashboardBoxType.codeLanguage MANDATORY true
    ALTER PROPERTY DashboardBoxType.codeLanguage CUSTOM type='SQL,JavaScript'
    ALTER PROPERTY DashboardBoxType.code MANDATORY true

    CREATE INDEX DashboardBoxType.name UNIQUE

    let statusType = INSERT INTO DashboardBoxType SET name = 'Ivan feeds', type = 'status', kind = 'Feedback status', code = '', codeLanguage = 'SQL'
    let pieChartType = INSERT INTO DashboardBoxType SET name = 'Petia profit', type = 'chart', kind = 'Pie chart', code = 'function getStr() { var text = ""; var possible = "abcdefghijklmnopqrstuvwxyz"; for( var i=0; i < 5; i++ ) text += possible.charAt(Math.floor(Math.random() * possible.length)); return text; } var res = []; var len = Math.ceil(Math.random()*15); for(var i = 0; i < len; i++) { res.push({ country: getStr(), litres: Math.ceil(Math.random()*100) }); } return res;', codeLanguage = 'JavaScript'
    let serialChartType = INSERT INTO DashboardBoxType SET name = 'Rusia chart profit', type = 'chart', kind = 'Serial chart', code = 'var res = []; for (var i = 1; i <= 12; i++) { for (var y = 1; y <= 2; y++) { var date = new Date(2016, i, y*5); var day = date.getDate(); var monthIndex = date.getMonth(); var year = date.getFullYear(); res.push({ date: (monthIndex + " " + year), value: Math.ceil(Math.random()*1000), value0: Math.ceil(Math.random()*1000) }); } } return res;', codeLanguage = 'JavaScript'
    let lineChartType = INSERT INTO DashboardBoxType SET name = 'Ivan chart profit', type = 'chart', kind = 'Line chart', code = 'var res = []; for(var i = 1900; i < 2016; i++) { var single = Math.random()*10; single = single > 5 ? 1 : -1; res.push({ year: String(i), value: Math.ceil(Math.random()*100)*single }); } return res;', codeLanguage = 'JavaScript'
    let barChartType = INSERT INTO DashboardBoxType SET name = 'Kolia chart profit', type = 'chart', kind = 'Bar chart', code = 'function getStr() { var text = ""; var possible = "abcdefghijklmnopqrstuvwxyz"; for( var i=0; i < 5; i++ ) text += possible.charAt(Math.floor(Math.random() * possible.length)); return text; } var res = []; var len = Math.ceil(Math.random()*50); for(var i = 0; i < len; i++) { res.push({ country: getStr(), visits: Math.ceil(Math.random()*10000) }); } return res;', codeLanguage = 'JavaScript'
    let bubbleChartType = INSERT INTO DashboardBoxType SET name = 'Masha bubble chartаt', type = 'chart', kind = 'Bubble chart', code = 'var res = []; for(var i = 0; i < Math.ceil(Math.random()*30); i++) { res.push({ y: Math.ceil(Math.random()*50), x: Math.ceil(Math.random()*50), value: Math.ceil(Math.random()*50), y2: Math.ceil(Math.random()*50), x2: Math.ceil(Math.random()*50), value2: Math.ceil(Math.random()*50) }); } return res;', codeLanguage = 'JavaScript'

    console.log "Creating process for DashboardBoxType class is done."
  }

  let DashboardBox = SELECT FROM (SELECT expand(classes) FROM metadata:schema) WHERE name = 'DashboardBox';

  if ($DashboardBox.size() == 0) {
    console.log "DashboardBox class not exists! Start creating process."

    let statusType = select * from DashboardBoxType where name = 'Ivan feeds'
    let pieChartType = select * from DashboardBoxType where name = 'Petia profit'
    let serialChartType = select * from DashboardBoxType where name = 'Rusia chart profit'
    let lineChartType = select * from DashboardBoxType where name = 'Ivan chart profit'
    let barChartType = select * from DashboardBoxType where name = 'Kolia chart profit'
    let bubbleChartType = select * from DashboardBoxType where name = 'Masha bubble chartаt'
    let defaultDashboard = select * from Dashboard where name = 'default'

    CREATE Class DashboardBox

    CREATE PROPERTY DashboardBox.width EMBEDDEDLIST
    CREATE PROPERTY DashboardBox.height EMBEDDEDLIST
    CREATE PROPERTY DashboardBox.order INTEGER
    CREATE PROPERTY DashboardBox.name STRING
    CREATE PROPERTY DashboardBox.description STRING
    CREATE PROPERTY DashboardBox.dashboard LINK Dashboard
    CREATE PROPERTY DashboardBox.type LINK DashboardBoxType

    ALTER PROPERTY DashboardBox.width MANDATORY true
    ALTER PROPERTY DashboardBox.width CUSTOM type='25,50,75,100'
    ALTER PROPERTY DashboardBox.height MANDATORY true
    ALTER PROPERTY DashboardBox.height CUSTOM type='25,50,75,100'
    ALTER PROPERTY DashboardBox.order MANDATORY true
    ALTER PROPERTY DashboardBox.name MANDATORY true
    ALTER PROPERTY DashboardBox.description MANDATORY true
    ALTER PROPERTY DashboardBox.dashboard MANDATORY true
    ALTER PROPERTY DashboardBox.type MANDATORY true

    INSERT INTO DashboardBox SET width = 25, height = 25, order = 1, dashboard = $defaultDashboard['@rid'][0], type = $statusType['@rid'][0], name = 'Box 1', description = 'Box 1 desc'
    INSERT INTO DashboardBox SET width = 25, height = 25, order = 2, dashboard = $defaultDashboard['@rid'][0], type = $statusType['@rid'][0], name = 'Box 2', description = 'Box 2 desc'
    INSERT INTO DashboardBox SET width = 25, height = 25, order = 3, dashboard = $defaultDashboard['@rid'][0], type = $statusType['@rid'][0], name = 'Box 3', description = 'Box 3 desc'
    INSERT INTO DashboardBox SET width = 25, height = 25, order = 4, dashboard = $defaultDashboard['@rid'][0], type = $statusType['@rid'][0], name = 'Box 4', description = 'Box 4 desc'

    INSERT INTO DashboardBox SET width = 50, height = 50, order = 5, dashboard = $defaultDashboard['@rid'][0], type = $pieChartType['@rid'][0], name = 'Box 5', description = 'Box 5 desc'
    INSERT INTO DashboardBox SET width = 50, height = 50, order = 6, dashboard = $defaultDashboard['@rid'][0], type = $serialChartType['@rid'][0], name = 'Box 6', description = 'Box 6 desc'
    INSERT INTO DashboardBox SET width = 50, height = 50, order = 7, dashboard = $defaultDashboard['@rid'][0], type = $lineChartType['@rid'][0], name = 'Box 7', description = 'Box 7 desc'
    INSERT INTO DashboardBox SET width = 50, height = 50, order = 8, dashboard = $defaultDashboard['@rid'][0], type = $barChartType['@rid'][0], name = 'Box 8', description = 'Box 8 desc'
    INSERT INTO DashboardBox SET width = 50, height = 50, order = 8, dashboard = $defaultDashboard['@rid'][0], type = $bubbleChartType['@rid'][0], name = 'Box 9', description = 'Box 9 desc'

    console.log "Creating process for DashboardBox class is done."
  }

  console.log "Insert into Crud Meta"

  INSERT INTO CrudClassMetaData SET class = 'Dashboard', titleColumns = 'name', editable = true
  INSERT INTO CrudClassMetaData SET class = 'DashboardBox', titleColumns = 'name', editable = true
  INSERT INTO CrudClassMetaData SET class = 'DashboardBoxType', titleColumns = 'name', editable = true

  let CrudClassMetaData_Dashboard = SELECT * FROM CrudClassMetaData WHERE class = 'Dashboard'
  let CrudClassMetaData_DashboardBox = SELECT * FROM CrudClassMetaData WHERE class = 'DashboardBox'
  let CrudClassMetaData_DashboardBoxType = SELECT * FROM CrudClassMetaData WHERE class = 'DashboardBoxType'

  INSERT INTO CrudMetaFormData  SET property = 'name', editable = true, visible = true, order = 1, crudClassMetaData = $CrudClassMetaData_Dashboard['@rid'][0]

  INSERT INTO CrudMetaFormData  SET property = 'name', editable = true, visible = true, order = 1, crudClassMetaData = $CrudClassMetaData_DashboardBox['@rid'][0]
  INSERT INTO CrudMetaFormData  SET property = 'description', editable = true, visible = true, order = 2, crudClassMetaData = $CrudClassMetaData_DashboardBox['@rid'][0]
  INSERT INTO CrudMetaFormData  SET property = 'type', editable = true, visible = true, order = 3, crudClassMetaData = $CrudClassMetaData_DashboardBox['@rid'][0]
  INSERT INTO CrudMetaFormData  SET property = 'dashboard', editable = true, visible = false, order = 4, crudClassMetaData = $CrudClassMetaData_DashboardBox['@rid'][0]
  INSERT INTO CrudMetaFormData  SET property = 'width', editable = true, visible = true, order = 5, crudClassMetaData = $CrudClassMetaData_DashboardBox['@rid'][0]
  INSERT INTO CrudMetaFormData  SET property = 'height', editable = true, visible = true, order = 6, crudClassMetaData = $CrudClassMetaData_DashboardBox['@rid'][0]
  INSERT INTO CrudMetaFormData  SET property = 'order', editable = true, visible = true, order = 7, crudClassMetaData = $CrudClassMetaData_DashboardBox['@rid'][0]

  INSERT INTO CrudMetaFormData  SET property = 'name', editable = true, visible = true, order = 1, crudClassMetaData = $CrudClassMetaData_DashboardBoxType['@rid'][0]
  INSERT INTO CrudMetaFormData  SET property = 'type', editable = true, visible = true, order = 2, crudClassMetaData = $CrudClassMetaData_DashboardBoxType['@rid'][0]
  INSERT INTO CrudMetaFormData  SET property = 'kind', editable = true, visible = true, order = 3, crudClassMetaData = $CrudClassMetaData_DashboardBoxType['@rid'][0]
  INSERT INTO CrudMetaFormData  SET property = 'codeLanguage', editable = true, visible = true, order = 4, crudClassMetaData = $CrudClassMetaData_DashboardBoxType['@rid'][0]
  INSERT INTO CrudMetaFormData  SET property = 'code', editable = true, visible = true, order = 5, crudClassMetaData = $CrudClassMetaData_DashboardBoxType['@rid'][0]
}

return true
