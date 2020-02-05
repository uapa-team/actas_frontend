import React from "react";
import { Table, Divider } from 'antd';
import auth from "../../../auth"
import { withRouter } from "react-router-dom"
import BackEndUrl from '../../../backendurl'

class CaseTable extends React.Component {
  constructor(props){ 
    super(props);
    this.state = {
      dataSource: [],
    }; 
  } 
  render() {
    var columns = [
      { title: 'Tipo', dataIndex: '_cls_display', key: '_cls_display', },
      { title: 'DNI', dataIndex: 'student_dni', key: 'student_dni', },
      { title: 'Nombres', dataIndex: 'student_name', key: 'student_name', },
      { title: 'Plan', dataIndex: 'academic_program', key: 'academic_program', },
      { title: 'Creación', dataIndex: 'date_stamp', key: 'date_stamp',  width: '10%'},
      { title: 'Radicación', dataIndex: 'date', key: 'date',  width: '10%'},
      { title: 'Número', dataIndex: 'consecutive_minute', key: 'consecutive_minute', },
      { title: 'Año', dataIndex: 'year', key: 'year', },
      { title: 'Periodo', dataIndex: 'academic_period', key: 'academic_period',  width: '8%'},
      { title: 'Rta CF', dataIndex: 'approval_status', key: 'approval_status',  width: '8%'},
      { title: 'Rta CA', dataIndex: 'advisor_response', key: 'advisor_response', width: '8%' },
      {
        title: 'Editar', key: 'edit', width: '8%', render: (text, record) => (
          <span>
            <a>Editar</a>
            <Divider type="vertical" />
            <a>Anular</a>
          </span>
        )}
    ]
    return (
      <Table dataSource={this.state.dataSource} columns={columns} />
    );
  }
  componentDidMount() {
    fetch(BackEndUrl + 'case', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + auth.getToken(),
      }
    }).then(response => response.json())
      .then(data => this.setState({ dataSource: data['cases'] }))
  }
}

export default withRouter(CaseTable)