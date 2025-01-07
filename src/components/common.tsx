import { Col, Row } from "antd";
import { formItemLayout } from "../constants/general.constant";

export const renderText = (label: string, text: string, isRed: boolean = false, formItemLayou: any = formItemLayout, textAlign: any = "end") => {
  return (
    <Row className="d-flex align-items-center mb-1">
      <Col xs={14} sm={14} md={12} lg={10} xl={8}>
        <h5>{label}: </h5>
      </Col>
      <Col xs={14} sm={14} md={12} lg={10} xl={8}>
        <div style={{color: `${isRed ? 'red' : 'black'}`, fontWeight: `${isRed ? '600' : '450'}`}}>{text}</div>
      </Col>
    </Row>
  );
}

