import { FloatingLabel, Form, Row } from "react-bootstrap";
import { InvalidNumberInput } from "./InvalidInput";
import { ContentTabProps } from "../../utilities/interfaces";
import { DureeOption } from "../../utilities/selectOptions";

/**
 * Renders a form for entering vehicle details, including fields for PSN, power, year, maximum allowed total, circulation date, length, width, height, number of doors, chassis number, and number of seats.
 *
 * @param params - An object containing the form state and a function to handle changes to the form.
 * @param formState - The current state of the vehicle form.
 * @param handleChange - A function to handle changes to the form.
 */
const Leasing = ({ formState, handleChange }: ContentTabProps) => {
  return (
    <>
      <Form onSubmit={(e) => e.preventDefault()}>
        <Row>
          <Form.Group
            controlId="formBasicInput-Fournisseur"
            className="mt-2 col-md-6 col-xl-3"
          >
            <FloatingLabel
              className="text-truncate"
              style={{ maxWidth: "100%" }}
              controlId="floatingSelect"
              label="Fournisseur"
            >
              <Form.Control
                placeholder=" "
                type="text"
                name="Fournisseur"
                value={formState.values.Fournisseur}
                onChange={handleChange}
                className={formState.validations.Fournisseur ? "is-valid" : ""}
              />
            </FloatingLabel>
          </Form.Group>
          <InvalidNumberInput
            className="col-md-6 col-xl-3"
            label="Echeance :"
            name="Echeance"
            onChange={handleChange}
            value={formState.values.Echeance}
          />
          <Form.Group
            controlId="formBasicInput-NumContrat"
            className="mt-2 col-md-6 col-xl-3"
          >
            <FloatingLabel
              className="text-truncate"
              style={{ maxWidth: "100%" }}
              controlId="floatingSelect"
              label="Numéro du contrat"
            >
              <Form.Control
                placeholder="N° du contrat"
                type="text"
                name="NumContrat"
                value={formState.values.NumContrat}
                onChange={handleChange}
                className={formState.validations.NumContrat ? "is-valid" : ""}
              />
            </FloatingLabel>
          </Form.Group>
          <Form.Group
            controlId="formBasicInput-EcheanceRestante"
            className="mt-2 col-md-6 col-xl-3"
          >
            <FloatingLabel
              className="text-truncate"
              style={{ maxWidth: "100%" }}
              controlId="floatingSelect"
              label="Echéance restantes"
            >
              <Form.Control
                placeholder="Echéance restantes (Mois)"
                type="text"
                name="EcheanceRestante"
                value={formState.values.EcheanceRestante}
                onChange={handleChange}
                className={
                  formState.validations.EcheanceRestante ? "is-valid" : ""
                }
              />
            </FloatingLabel>
          </Form.Group>
        </Row>
        <Row>
          <Form.Group
            controlId="formBasicInput-Duree"
            className="mt-2 col-md-6 col-xl-3"
          >
            <FloatingLabel
              className="text-truncate"
              style={{ maxWidth: "100%" }}
              controlId="floatingSelect"
              label="Durée"
            >
              <Form.Select
                as="select"
                name="Duree"
                value={formState.values.Duree}
                onChange={(e: any) => handleChange(e)}
                className={formState.validations.Duree ? "is-valid" : ""}
              >
                <option value="">Sélectionnez une Durée</option>
                {DureeOption.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Select>
            </FloatingLabel>
          </Form.Group>
          <Form.Group
            controlId="formBasicInput-PayeAcejour"
            className="mt-2 col-md-6 col-xl-3"
          >
            <FloatingLabel
              className="text-truncate"
              style={{ maxWidth: "100%" }}
              controlId="floatingSelect"
              label="Payé à ce jour"
            >
              <Form.Control
                placeholder=" "
                type="text"
                name="PayeAcejour"
                value={formState.values.PayeAcejour}
                onChange={handleChange}
                className={formState.validations.PayeAcejour ? "is-valid" : ""}
              />
            </FloatingLabel>
          </Form.Group>
          <InvalidNumberInput
            className="col-md-6 col-xl-3"
            label="Apport :"
            name="Apport"
            onChange={handleChange}
            value={formState.values.Apport}
          />
          <Form.Group
            controlId="formBasicInput-DernierPaiment"
            className="mt-2 col-md-6 col-xl-3"
          >
            <FloatingLabel
              className="text-truncate"
              style={{ maxWidth: "100%" }}
              controlId="floatingSelect"
              label="Dernier paiement"
            >
              <Form.Control
                placeholder=" "
                type="text"
                name="DernierPaiment"
                value={formState.values.DernierPaiment}
                onChange={handleChange}
                className={
                  formState.validations.DernierPaiment ? "is-valid" : ""
                }
              />
            </FloatingLabel>
          </Form.Group>
        </Row>
        <Row className="w-full">
          <Form.Group
            controlId="formBasicInput-DatePremiereEcheance"
            className="mt-2 col-md-6 col-xl-3"
          >
            <FloatingLabel
              className="text-truncate"
              style={{ maxWidth: "100%" }}
              controlId="floatingSelect"
              label="Date 1ere échéance"
            >
              <Form.Control
                placeholder=" "
                type="date"
                name="DatePremiereEcheance"
                value={formState.values.DatePremiereEcheance}
                onChange={handleChange}
                className={
                  formState.validations.DatePremiereEcheance ? "is-valid" : ""
                }
              />
            </FloatingLabel>
          </Form.Group>

          <Form.Group
            controlId="formBasicInput-ProchaineEcheance"
            className="mt-2 col-md-6 col-xl-3"
          >
            <FloatingLabel
              className="text-truncate"
              style={{ maxWidth: "100%" }}
              controlId="floatingSelect"
              label="Prochaine échéance"
            >
              <Form.Control
                placeholder=" "
                type="text"
                name="ProchaineEcheance"
                value={formState.values.ProchaineEcheance}
                onChange={handleChange}
                className={
                  formState.validations.ProchaineEcheance ? "is-valid" : ""
                }
              />
            </FloatingLabel>
          </Form.Group>

          <InvalidNumberInput
            className="col-md-6 col-xl-3"
            label="Total leasing H.T :"
            name="TotalLeasing"
            onChange={handleChange}
            value={formState.values.TotalLeasing}
          />
        </Row>
      </Form>
    </>
  );
};

export default Leasing;
