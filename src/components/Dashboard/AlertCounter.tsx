import React from "react";
import { Modal, Button } from "react-bootstrap";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsMore from "highcharts/highcharts-more";
import SolidGauge from "highcharts/modules/solid-gauge";
import { useNavigate } from "react-router-dom";

// Initialize Highcharts modules
HighchartsMore(Highcharts);
SolidGauge(Highcharts);

type AlertCounterProps = {
    id: string;
    value: number;
    max: number; // Used for calculation
    color: string;
    label: string;
    modalId: string;
    height: number;
};

const AlertCounter: React.FC<AlertCounterProps> = ({
    value,
    id,
    max,
    color,
    label,
    modalId,
    height,
}) => {

    
    const navigate = useNavigate();
    const handleNavigate = () => {
        navigate(`/deadline/${id}`);
    };

    const [showModal, setShowModal] = React.useState(false);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const options: Highcharts.Options = {
        chart: {
            type: "solidgauge",
            height: height,
            backgroundColor: "transparent",
            events: {
                click: handleNavigate,
            },
        },
        title: undefined, // Use undefined instead of null
        pane: {
            center: ["50%", "50%"],
            size: "100%",
            startAngle: -90,
            endAngle: 90,
            background: undefined,
        },
        tooltip: {
            enabled: false,
        },
        yAxis: {
            min: 0, // Required for calculations
            max: max,
            stops: [
                [1, color], // Couleur de la jauge au point maximum
            ], // Used for the scale of the gauge
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
                    // style: {
                    //     color: color, // Assure la couleur du texte
                    // },
                },
            },
        },
        series: [
            {
                type: "solidgauge", // Ensure you include the type
                name: label,
                data: [value],
                color: color, // Apply the color
                dataLabels: {
                    style: {
                        color: "#000", // Assure la couleur du label
                    },
                },
            },
        ],
        credits: {
            enabled: false, // Disable the Highcharts credits
        },
    };

    return (
        <div className="text-center">
        <div onClick={handleNavigate} style={{ cursor: "pointer" }}>
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    </div>
    );
};

export default AlertCounter;
