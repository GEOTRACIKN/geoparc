import { Form, Row } from "react-bootstrap";
import { ContentTabProps } from "../../utilities/interfaces";
import  InputFloating  from "./InputFloating";


const Purchase = ({ formState, handleChange }: ContentTabProps) => {

  return (
    <>
      <Form onSubmit={(e) => e.preventDefault()}>
        <Row>
          <InputFloating
            type="date"
            label="Date acquisition"
            name="DateAcquis"
            value={formState.values.DateAcquis}
            onChangeFunction={handleChange}
            xl={false}
            />
          <InputFloating
            label="Taxe véhicule neuf"
            name="Taxe"
            value={formState.values.Taxe}
            onChangeFunction={handleChange}
            xl={false}
            />
        </Row>
        <Row>
          <InputFloating
            label="Total achat"
            name="TotalAchat"
            value={formState.values.TotalAchat}
            onChangeFunction={handleChange}
            xl={false}
          />
        </Row>
      </Form>
    </>
  );
};

export default Purchase;
