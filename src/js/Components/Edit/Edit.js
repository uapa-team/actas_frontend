import React from "react";
import { withRouter } from "react-router-dom";
import { Form, Row, Divider, Typography } from "antd";
import MutableComponent from "./MutableComponent";
import MutableTable from "./MutableTable";
import Backend from "../../../serviceBackend";
import Columns from "react-columns";

const { Title } = Typography;

class Edit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      full_name: "",
      decision_maker: "",
      fields: [],
      cls: "",
      id: this.props.match.params.id
    };
  }
  createInputs = () => {
    return this.state.fields.map(this.createInput);
  };
  createInput = i => {
    return <MutableComponent key={i[0]} fieldName={i[0]} metadata={i[1]} />;
  };
  createTables = () => {
    return this.state.fields.map(this.createTable);
  };
  createTable = i => {
    if (i[1].type === "Table") {
      return <MutableTable key={i[0]} fieldName={i[0]} metadata={i[1]} />;
    }
  };
  render() {
    return (
      <div>
        <Divider style={{ background: "#ffffff00" }} />
        <Row>
          <Title>Edición de solicitud</Title>
        </Row>
        <Row>
          <Form>
            <Columns gap={"50px"} columns={2}>
              {this.createInputs()}
            </Columns>
            <Divider style={{ background: "#ffffff00" }} />
            {this.createTables()}
          </Form>
        </Row>
        <Divider />
      </div>
    );
  }
  componentDidMount() {
    if (this.props.history.location.state) {
      this.setState({ cls: this.props.history.location.state._cls });
      Backend.sendRequest(
        "GET",
        `infocase?cls=${this.props.history.location.state._cls.split(".")[1]}`
      )
        .then(response => response.json())
        .then(data => {
          this.setState({ full_name: data.full_name });
          this.setState({ decision_maker: data.decision_maker });
          delete data.full_name;
          delete data.decision_maker;
          this.setState({ fields: Object.entries(data) });
        });
    } else {
      Backend.sendRequest("GET", `case?id=${this.state.id}`)
        .then(response => response.json())
        .then(json => {
          Backend.sendRequest(
            "GET",
            `infocase?cls=${json.cases[0]._cls.split(".")[1]}`
          )
            .then(response => response.json())
            .then(data => {
              this.setState({ full_name: data.full_name });
              this.setState({ decision_maker: data.decision_maker });
              delete data.full_name;
              delete data.decision_maker;
              this.setState({ fields: Object.entries(data) });
            });
        });
    }
  }
}

export default withRouter(Edit);
