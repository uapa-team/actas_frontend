import React from "react";
import { Table } from 'antd';
import { withRouter } from "react-router-dom"

class CaseTable extends React.Component {

    render() {
        var dataSource = [];
          
        var columns = [
          { title: 'Código',dataIndex: 'id',key: 'id',},
          { title: 'Tipo', dataIndex: '_cls_display', key: '_cls_display', },
          { title: 'DNI', dataIndex: 'student_dni', key: 'student_dni', },
          { title: 'Plan', dataIndex: 'academic_program', key: 'academic_program', },
          { title: 'Creación', dataIndex: 'date_stamp', key: 'date_stamp', },
          { title: 'Radicación', dataIndex: 'date', key: 'date', },
          { title: 'Número', dataIndex: 'consecutive_minute', key: 'consecutive_minute', },
          { title: 'Año', dataIndex: 'year', key: 'year', },
          { title: 'Periodo', dataIndex: 'academic_period', key: 'academic_period', },
          { title: 'Rta CF', dataIndex: 'approval_status', key: 'approval_status', },
          { title: 'Rta CA', dataIndex: 'advisor_response', key: 'advisor_response', },]
      return (
        <Table dataSource={dataSource} columns={columns} />
      );
    }
}

export default withRouter(CaseTable)