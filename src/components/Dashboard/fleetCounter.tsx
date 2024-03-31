import { Link } from 'react-router-dom';

type FleetProps = {
    numberOfItem: number;
    title: string;
    icon: string;
    color: string;
};

const FleetCounter: React.FC<FleetProps & { linkTo: string }> = ({ numberOfItem, title, icon, color, linkTo }) => {
    return (
        <div className="card card-block card-stretch card-height">
            <div className="card-body">
                <Link to={linkTo} style={{ textDecoration: 'none', color: 'black' }}>
                    <div className="d-flex align-items-center mb-4 card-total-sale">
                        <div className={`icon iq-icon-box-2 ${color}`}>
                            <i className={`las la-${icon}`}></i>
                        </div>
                        <div>
                            <p className="mb-2">{title}</p>
                            <h4>{numberOfItem}</h4>
                        </div>
                    </div>
                </Link>
                <div className="iq-progress-bar mt-2">
                    <span className="bg-info iq-progress progress-1" data-percent={numberOfItem} style={{ transition: `width 2s ease 0s; width: ${numberOfItem}%` }}>
                    </span>
                </div>
            </div>
        </div>
    );
}

export default FleetCounter;
