/* eslint-disable jsx-a11y/anchor-is-valid */

import React from "react";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useTranslate } from "../hooks/LanguageProvider";


const NotFound: React.FC = () => { 
    const { translate } = useTranslate();
    return (
        <div className="wrapper">
            <div className="container">
                <div className="row no-gutters height-self-center">
                    <div className="col-sm-12 text-center align-self-center">
                        <div className="iq-error position-relative">
                            <img
                                src="/asset/images/error/404.png"
                                alt="404 error"
                                className="img-fluid iq-error-img"
                                width={500} 
                                height={300}
                            />
                            <h2 className="mb-0 mt-4">{translate("Oops! This Page is Not Found")}.</h2>
                            <p>{translate("The requested page does not exist")}.</p>
                            <Nav.Link to="/" className="btn btn-primary d-inline-flex align-items-center mt-3" as={NavLink}>
                                <i className="ri-home-4-line"></i>  {translate("Back to Home")}.
                            </Nav.Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;