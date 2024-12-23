import { Col, Row } from "antd";
import { formItemLayout } from "../constants/general.constant";

export const renderText = (label: string, text: string, formItemLayou: any = formItemLayout, textAlign: any = "end") => {
  return (
    <Row className="d-flex align-items-center mb-1">
      <Col xs={14} sm={14} md={12} lg={10} xl={8}>
        <h5>{label}: </h5>
      </Col>
      <Col xs={14} sm={14} md={12} lg={10} xl={8}>
        <div>{text}</div>
      </Col>
    </Row>
  );
}

