import { Card, CardBody } from "react-bootstrap";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

type VehicleItemProps = {
    id_vehicle: number;
    immatriculation_vehicule: string;
    vehicule_type: string;
    category_vehicule:string;
};


export function VehicleItem({ id_vehicle, immatriculation_vehicule, vehicule_type,category_vehicule }: VehicleItemProps) {
    return (
        <Card key={`vehicle_${id_vehicle}`}>
            <CardBody className="d-flex flex-column">
                <Card.Title>
                    <p>{immatriculation_vehicule}</p>
                    <span>{vehicule_type}</span>
                    <span> {category_vehicule}</span>
                </Card.Title>
            </CardBody>
        </Card>    
    );
}
