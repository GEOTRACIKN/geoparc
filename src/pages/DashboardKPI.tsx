import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, InputGroup, Table, Dropdown } from 'react-bootstrap';

const Dashboard = () => {
  const [selectedUser, setSelectedUser] = useState('1');
  const [selectedGroup, setSelectedGroup] = useState('1');
  const [dateRange, setDateRange] = useState('2024-08-22');
  const [vehicleCount, setVehicleCount] = useState(25);
  const [totalDistance, setTotalDistance] = useState('375,00');
  const [speedExcess, setSpeedExcess] = useState(34);
  const [harshTurn, setHarshTurn] = useState(8);
  const [harshBraking, setHarshBraking] = useState(17);
  const [harshAcceleration, setHarshAcceleration] = useState(67);
  const [fuel, setFuel] = useState('236.52 L');
  const [alarmCount, setAlarmCount] = useState(28);
  const [score, setScore] = useState(3074);
  const [drivers, setDrivers] = useState(26);

  const users = [
    { id: '1', name: 'GEOT Géolocalisation' },
    { id: '2', name: 'Dellil Kader' },
    // Ajoutez plus de données fictives ici...
  ];


  const data = [
    {
      id: 1,
      psn: 'PSN12345',
      conducteurTag: 'John Doe / Tag123',
      vehicule: 'Toyota Prius',
      dateInfraction: '2024-08-01',
      excesVitesse: '120 km/h',
      freinageBrusque: 3,
      accelerationBrusque: 2,
      virageBrusque: 4,
    },
    {
      id: 2,
      psn: 'PSN67890',
      conducteurTag: 'Jane Smith / Tag456',
      vehicule: 'Honda Civic',
      dateInfraction: '2024-08-02',
      excesVitesse: '110 km/h',
      freinageBrusque: 2,
      accelerationBrusque: 1,
      virageBrusque: 5,
    },
    {
      id: 3,
      psn: 'PSN24680',
      conducteurTag: 'Michael Johnson / Tag789',
      vehicule: 'Ford Focus',
      dateInfraction: '2024-08-03',
      excesVitesse: '130 km/h',
      freinageBrusque: 4,
      accelerationBrusque: 3,
      virageBrusque: 2,
    },
    // Ajoutez autant d'entrées que nécessaire
  ];


  const groups = [
    { id: '1', name: 'IDENET' },
    { id: '114', name: 'DULCESOL' },
    // Ajoutez plus de groupes fictifs ici...
  ];

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUser(e.target.value);
  };

  const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGroup(e.target.value);
  };

  const launch = () => {
    console.log('Lancer la recherche');
  };

  return (
    <Container fluid style={{ background: "#fff", padding: "15px" }}>
      <Row>
        {/* <Col lg={2}>
          <div className="jarvismetro-tile big-cubes selected bg-color-white text-center">
            <img src="img/users/blank.png" style={{ width: '100px', padding: '5px', marginTop: '5px' }} alt="IDEGPS" />
            <p style={{ color: 'black', fontWeight: 500 }}>GEOT Géolocalisation</p>
          </div>
        </Col> */}
        <Col lg={12}>
          <Form id="vehicule-from">
            <Row>
              <Col md={4}>
                <Form.Group>
                  <Form.Control as="select" value={selectedUser}>
                    <option value="aucun">Utilisateurs</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                  </Form.Control>
                </Form.Group>

                <Form.Group>
                  <Form.Control as="select" value={selectedGroup} >
                    <option value="0">Groupe véhicule</option>
                    {groups.map(group => (
                      <option key={group.id} value={group.id}>{group.name}</option>
                    ))}
                  </Form.Control>
                </Form.Group>

                <Form.Group>
                  <InputGroup>
                    <Form.Control type="text" value={dateRange} readOnly />

                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Control type="text" placeholder="Recherche par véhicule" />
                <Form.Control type="text" placeholder="Recherche par conducteur" className="mt-2" />
                <Button variant="success" className="mr-2" onClick={launch}><i className="fa fa-play"></i> Lancer</Button>
                <Button variant="default"><i className="fa fa-cog"></i> Reconfigurer</Button>
              </Col>
              <Col md={4}>
                <div style={{ backgroundColor: '#f4f4f4', padding: '2px 5px', border: '1px solid #ccc' }}>
                  <Form.Check type="checkbox" label={`(${vehicleCount}) véhicules`} />
                </div>
                <div style={{ border: '1px solid #ccc', padding: '5px', overflow: 'auto', minHeight: '92px' }}>
                  <ul style={{ padding: 0, listStyleType: 'none' }}></ul>
                </div>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col lg={12}>
          <Row>
            <Col md={2}>
              <div className="sparks-info text-center" style={{ border: '1px solid #ddd', padding: '10px' }}>
                <h5>Total kilométrage</h5>
                <span className="txt-color-purple" style={{ fontSize: '24px' }}>{totalDistance} Km <i className="fa fa-tachometer"></i></span>
              </div>
            </Col>
            <Col md={2}>
              <div className="sparks-info text-center" style={{ border: '1px solid #ddd', padding: '10px' }}>
                <h5>No 24,9 %</h5>
                <span className="txt-color-purple">Yes 75,1 %</span>
              </div>
            </Col>
            <Col md={2}>
              <div className="sparks-info text-center" style={{ border: '1px solid #ddd', padding: '10px' }}>
                <h5>Véhicules</h5>
                <span className="txt-color-purple">{vehicleCount} <i className="fa fa-car"></i></span>
              </div>
            </Col>
            <Col md={2}>
              <div className="sparks-info text-center" style={{ border: '1px solid #ddd', padding: '10px' }}>
                <h5>Excès vitesse</h5>
                <span className="txt-color-purple">{speedExcess} <img src="./asset/images/ev.png" style={{ height: '22px' }} alt="Excès vitesse" /></span>
              </div>
            </Col>
            <Col md={2}>
              <div className="sparks-info text-center" style={{ border: '1px solid #ddd', padding: '10px' }}>
                <h5>Virage brusque</h5>
                <span className="txt-color-purple">{harshTurn} <i className="fa fa-tachometer"></i></span>
              </div>
            </Col>
            <Col md={2}>
              <div className="sparks-info text-center" style={{ border: '1px solid #ddd', padding: '10px' }}>
                <h5>Freinage brusque</h5>
                <span className="txt-color-purple">{harshBraking} <i className="fa fa-tachometer"></i></span>
              </div>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={2}>
              <div className="sparks-info text-center" style={{ border: '1px solid #ddd', padding: '10px' }}>
                <h5>Accélération brusque</h5>
                <span className="txt-color-purple">{harshAcceleration} <i className="fa fa-tachometer"></i></span>
              </div>
            </Col>
            <Col md={2}>
              <div className="sparks-info text-center" style={{ border: '1px solid #ddd', padding: '10px' }}>
                <h5>Conducteurs</h5>
                <span className="txt-color-purple">{drivers} <i className="fa fa-user"></i></span>
              </div>
            </Col>
            <Col md={2}>
              <div className="text-center" style={{ marginBottom: '6px' }}>
                <span className="txt-color-white" style={{padding: "0px 5px", backgroundColor: 'green',  color: "#fff", display: 'block' }}>Green 99,1 %</span>
                <span className="txt-color-black" style={{padding: "0px 5px", backgroundColor: 'yellow', color: "#000", display: 'block' }}>Yellow 0,01 %</span>
                <span className="txt-color-white" style={{padding: "0px 5px", backgroundColor: 'red', color: "#fff", display: 'block' }}>Red 0,0 %</span>
              </div>
            </Col>
            <Col md={2}>
              <div className="sparks-info text-center" style={{ border: '1px solid #ddd', padding: '10px' }}>
                <h5>Carburant</h5>
                <span className="txt-color-purple">{fuel} <i className="fa fa-fire"></i></span>
              </div>
            </Col>
            <Col md={2}>
              <div className="sparks-info text-center" style={{ border: '1px solid #ddd', padding: '10px' }}>
                <h5>Alarme</h5>
                <span className="txt-color-purple">{alarmCount} <i className="fa fa-bell"></i></span>
              </div>
            </Col>
            <Col md={2}>
              <div className="sparks-info text-center" style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#00af00', color: '#fff' }}>
                <h5>Score</h5>
                <span className="txt-color-white">{score}</span>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col lg={12}>
          <div className="jarviswidget jarviswidget-color-blueDark jarviswidget-sortable">
            <header>

            </header>
            <div>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>PSN</th>
                    <th>Conducteur / Tag</th>
                    <th>Véhicule</th>
                    <th>Date d'infraction</th>
                    <th>Excès vitesse</th>
                    <th>Freinage brusque</th>
                    <th>Accélération brusque</th>
                    <th>Virage brusque</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 ? (
                    data.map((row) => (
                      <tr key={row.id}>
                        <td>{row.id}</td>
                        <td>{row.psn}</td>
                        <td>{row.conducteurTag}</td>
                        <td>{row.vehicule}</td>
                        <td>{row.dateInfraction}</td>
                        <td>{row.excesVitesse}</td>
                        <td>{row.freinageBrusque}</td>
                        <td>{row.accelerationBrusque}</td>
                        <td>{row.virageBrusque}</td>
                        <td>
                          <Button variant="primary">Voir</Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={10} className="text-center">
                        Aucune donnée disponible
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
