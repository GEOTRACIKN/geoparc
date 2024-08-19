import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsMore from 'highcharts/highcharts-more';
import SolidGauge from 'highcharts/modules/solid-gauge';

// Initialize Highcharts modules
HighchartsMore(Highcharts);
SolidGauge(Highcharts);

type AlertCounterProps = {
    value: number;
    max: number; // Used for calculation
    color: string;
    label: string;
    modalId: string;
};

const AlertCounter: React.FC<AlertCounterProps> = ({ value, max, color, label, modalId }) => {
    const [showModal, setShowModal] = React.useState(false);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const options: Highcharts.Options = {
        chart: {
            type: 'solidgauge',
           // height: 'auto',
            backgroundColor: 'transparent',
            events: {
                click: handleShow,
            },
        },
        title: undefined, // Use undefined instead of null
        pane: {
            center: ['50%', '50%'],
            size: '100%',
            startAngle: -90,
            endAngle: 90,
            background: undefined,
        },
        tooltip: {
            enabled: false,
        },
        yAxis: {
            min: 0, // Required for calculations
            max: max, // Used for the scale of the gauge
            lineWidth: 0,
            tickWidth: 0,
            title: {
                text: "",
                y: -20, // Adjust if needed
            },
            labels: {
                enabled: false, // Hide the labels
            },
        },
        plotOptions: {
            solidgauge: {
                dataLabels: {
                    y: -10,
                    borderWidth: 0,
                    useHTML: true,
                    formatter: function () {
                        return `<div style="text-align:center;">
                                    <span style="font-size:18px;">${this.y}</span><br/>
                                    <span>${label}</span>
                                </div>`;
                    },
                },
            },
        },
        series: [
            {
                type: 'solidgauge', // Ensure you include the type
                name: label,
                data: [value],
                color: color, // Apply the color
            },
        ],
        credits: {
            enabled: false, // Disable the Highcharts credits
        },
    };

    return (
        <div className="text-center">
            <Button onClick={handleShow} variant="link" className="p-0">
                <HighchartsReact
                    highcharts={Highcharts}
                    options={options}
                />
            </Button>

            <Modal show={showModal} onHide={handleClose} id={modalId}>
                <Modal.Header closeButton>
                    <Modal.Title>{label}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Contenu de la modal */}
                    Détails pour {label}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Fermer
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AlertCounter;
