import React from "react";
import { withRouter } from "react-router-dom"
import { Typography, Row, Divider } from "antd";

const { Title } = Typography;

class Edit extends React.Component {
    render() {
        return (
            <div>
                <Divider />
                <Row>
                    <Title>
                        Edición de solicitud
                    </Title>
                </Row>
                <Row>
                    Aquí van los componentes
                    {console.log(this.props.match.params.id)}
                </Row>
                <Divider />
            </div>
        );
    }
}

export default withRouter(Edit)