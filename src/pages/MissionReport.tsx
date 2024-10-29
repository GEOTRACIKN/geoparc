import { useEffect, useState } from "react";
import { Dropdown, Table, Modal, Button, Form } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import { useTranslate } from "../components/LanguageProvider";
import { formatDateToTimestamp } from "../utilities/functions";
import ModalShowServicing from "../components/Servicing/ShowServicing";
import { PropagateLoader } from "react-spinners";
import ModalEditServicing from "../components/Servicing/EditServicing";



export function MissionReport() {
    return (
        <div>
            <h1>Hello Mission report</h1>
        </div>
    );
}