import { useState, useEffect } from "react";
import {
  Table,
  Modal,
  Button,
  Form,
  Col,
  Row,
  InputGroup,
} from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import { useTranslate } from "../components/LanguageProvider";
import { PagePermission } from "../utilities/permissions";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

interface SnapshotsItem {
  id_snapshot: number;
  type_snapshot: string;
  id_dashcam: string;
  date_snapshot: string;
  location: string;
  psn_dispositif: string;
  nom_conducteur: string;
  prenom_conducteur: string;
  user_nom: string;
  user_prenom: string;
  totalsnapshots: number;
  id_user: string;
  imageUrl: string;

}


// END interface

// Conatante api
const API_BASE_URL = `${backendUrl}/api`;
// FR: Pagination du tableau
let currentPage = 1;

export function SnapshotPage() {
  // Start State
  const { translate } = useTranslate();
  const userID = localStorage.getItem("userID");

  const [snapshotsList, setSnapshotsList] = useState<SnapshotsItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number>(0);
  const [limit, setLimit] = useState<number>(15);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);



  const [affecteAOptions, setAffecteAOptions] = useState<
    Array<{ label: string; value: string }>
  >([]);

  const [showModal, setShowModal] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [titleModal, setTitleModal] = useState("");



  // Trie dans le tableux
  const [sortType, setSortType] = useState<
    | "id_snapshot"
    | "id_dashcam"
    | "type_snapshot"
    | "location"
    | "psn_dispositif"
    | "nom_conducteur"
    | "user_nom"
    | "date_snapshot"
  >("id_snapshot");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  // END State

  // Fonction pour recupure et affiche la data avec le nombre des puces
  const fetchSnapshots = async (
    currentPage: number,
    limit: number,
    sortType: string,
    sortDirection: string
  ) => {
    try {
      const [totalData, snapshotsData] = await Promise.all([
        fetch(`${API_BASE_URL}/snapshot/total/${userID}`, {
          mode: "cors",
        }).then((res) => res.json()),
        fetch(
          `${API_BASE_URL}/snapshot/getsnapshots/sort/${userID}?page=${currentPage}&limit=${limit}&sortColumn=${sortType}&sortOrder=${sortDirection}`,
          { mode: "cors" }
        ).then((res) => res.json()),
      ]);

      const total = totalData[0].total;
      setTotal(total);

      const calculatedPageCount = Math.ceil(total / limit);
      setPageCount(calculatedPageCount);

      setSnapshotsList(snapshotsData);
    } catch (error) {
      console.error(error);
    }
  };

  const refreshSnapshotData = async () => {
    fetchSnapshots(currentPage, limit, sortType, sortDirection);
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([refreshSnapshotData()]);
    };

    fetchData();
  }, [userID, limit, sortType, sortDirection]);

  const handlePageClick = async (data: { selected: number }) => {
    currentPage = data.selected + 1;
    refreshSnapshotData();
  };

  const handleSeeClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setShowModal(true); // Open the modal
 };
 





  // Start Fonction pour le trie dans le tableau

  const handleSort = async (
    type:
      | "id_snapshot"
      | "id_dashcam"
      | "type_snapshot"
      | "location"
      | "psn_dispositif"
      | "nom_conducteur"
      | "user_nom"
      | "date_snapshot"
  ) => {
    let sortOrder: "asc" | "desc" = "asc";

    if (type === sortType) {
      sortOrder = sortDirection === "asc" ? "desc" : "asc";
    }
    setSortType(type);
    setSortDirection(sortOrder);
  };

  const TableHeader = () => {
    return (
      <thead className="bg-white text-uppercase">
        <tr className="ligth ligth-data">
          <th>
            <div className="checkbox d-inline-block">
              <input
                type="checkbox"
                className="checkbox-input"
                id="checkbox1"
              />
              <label htmlFor="checkbox1" className="mb-0"></label>
            </div>
          </th>
          <th style={{ width: "199px", cursor: "pointer" }}>
            <span
              onClick={() => handleSort("id_snapshot")}
              style={{ color: "#140A57" }}
            >
              {translate("ID")}
              {sortType === "id_snapshot" && sortDirection === "asc" && " ▲"}
              {sortType === "id_snapshot" && sortDirection === "desc" && " ▼"}
            </span>
          </th>
          <th style={{ width: "199px", cursor: "pointer" }}>
            <span
              onClick={() => handleSort("id_dashcam")}
              style={{ color: "#140A57" }}
            >
              {translate("Dashcam")}
              {sortType === "id_dashcam" && sortDirection === "asc" && " ▲"}
              {sortType === "id_dashcam" &&
                sortDirection === "desc" &&
                " ▼"}
            </span>
          </th>
          <th style={{ width: "199px", cursor: "pointer" }}>
            <span
              onClick={() => handleSort("type_snapshot")}
              style={{ color: "#140A57" }}
            >
              {translate("Type")}
              {sortType === "type_snapshot" && sortDirection === "asc" && " ▲"}
              {sortType === "type_snapshot" && sortDirection === "desc" && " ▼"}
            </span>
          </th>
          <th style={{ width: "199px", cursor: "pointer" }}>
            <span
              onClick={() => handleSort("location")}
              style={{ color: "#140A57" }}
            >
              {translate("Adresse")}
              {sortType === "location" && sortDirection === "asc" && " ▲"}
              {sortType === "location" && sortDirection === "desc" && " ▼"}
            </span>
          </th>
          <th style={{ width: "199px", cursor: "pointer" }}>
            <span
              onClick={() => handleSort("psn_dispositif")}
              style={{ color: "#140A57" }}
            >
              {translate("PSN")}
              {sortType === "psn_dispositif" && sortDirection === "asc" && " ▲"}
              {sortType === "psn_dispositif" && sortDirection === "desc" && " ▼"}
            </span>
          </th>
          <th style={{ width: "199px", cursor: "pointer" }}>
            <span
              onClick={() => handleSort("nom_conducteur")}
              style={{ color: "#140A57" }}
            >
              {translate("Conducteur")}
              {sortType === "nom_conducteur" &&
                sortDirection === "asc" &&
                " ▲"}
              {sortType === "nom_conducteur" &&
                sortDirection === "desc" &&
                " ▼"}
            </span>
          </th>
          <th style={{ width: "199px", cursor: "pointer" }}>
            <span
              onClick={() => handleSort("user_nom")}
              style={{ color: "#140A57" }}
            >
              {translate("User")}
              {sortType === "user_nom" &&
                sortDirection === "asc" &&
                " ▲"}
              {sortType === "user_nom" &&
                sortDirection === "desc" &&
                " ▼"}
            </span>
          </th>
          <th style={{ width: "199px", cursor: "pointer" }}>
            <span
              onClick={() => handleSort("date_snapshot")}
              style={{ color: "#140A57" }}
            >
              {translate("Snapshot date")}
              {sortType === "date_snapshot" &&
                sortDirection === "asc" &&
                " ▲"}
              {sortType === "date_snapshot" &&
                sortDirection === "desc" &&
                " ▼"}
            </span>
          </th>

          <th>{translate("Actions")}</th>
        </tr>
      </thead>
    );
  };
  // END Fonction pour le trie dans le tableau







  



 






  return (
    <>
      <h4 className="mb-3">
        <i
          className="las la-car mr-2"
          data-rel="bootstrap-tooltip"
          title={translate("Increased")}
        ></i>
        {translate("Snapshots")} ( {total} )
      </h4>

      <div
        id="DataTables_Table_0_wrapper"
        className="dataTables_wrapper dt-bootstrap4 no-footer"
      >
        <div className="row">
          <div className="col-sm-12 col-md-6">
            <div className="dataTables_length" id="DataTables_Table_0_length">
              <label>
                {translate("Show")}
                <select
                  name="DataTables_Table_0_length"
                  aria-controls="DataTables_Table_0"
                  className="custom-select custom-select-sm form-control form-control-sm"
                  style={{ width: "66px" }}
                  value={limit}
                  onChange={(e) => {
                    setLimit(parseInt(e.target.value));
                    currentPage = 1;
                  }}
                >
                  <option value="15">15</option>
                  <option value="30">30</option>
                  <option value="60">60</option>
                </select>
                {translate("entries")}
              </label>
            </div>
          </div>
          <div className="col-sm-12 col-md-6">
            <div
              id="DataTables_Table_0_filter"
              className="dataTables_filter mr-3"
            >

              <a href="#" className="btn btn-outline-info mt-2">
                <i className="las la-plus mr-3"></i>
                {translate("Batch Download")}
              </a>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="row m-2">
          <Table>
            <TableHeader />
            {Array.isArray(snapshotsList) &&
              snapshotsList.length !== 0 &&
              snapshotsList.map((item) => {
                return (
                  <tbody key={item.id_snapshot} className="ligth-body">
                    <tr className={`checkbox-${item.id_snapshot}`}>
                      <td>
                        <div className="checkbox d-inline-block">
                          <input type="checkbox" className="checkbox-input" />
                          <label className="mb-0"></label>
                        </div>
                      </td>
                      <td>{item.id_snapshot}</td>
                      <td>{item.id_dashcam}</td>
                      <td>{item.type_snapshot}</td>
                      <td>{item.location}</td>
                      <td>{item.psn_dispositif}</td>
                      <td>{item.nom_conducteur} {item.prenom_conducteur}</td>
                      <td>{item.user_nom} {item.user_prenom}</td>
                      <td className="text-center">
                        {new Date(
                          item.date_snapshot
                        ).toLocaleDateString()}
                      </td>
                      <td>
                        {/* Actions */}
                        <div className="d-flex align-items-center list-action">
                          <a
                            className="badge badge-info mr-2 btn"
                            data-toggle="tooltip"
                            data-placement="top"
                            title="Donwload"
                            data-original-title="Donwload"

                          >
                            <i
                              className="las la-download"
                              style={{ height: "12px", width: "12px" }}
                            ></i>
                          </a>
                          <a
   className="badge badge-success mr-2 btn"
   data-toggle="tooltip"
   data-placement="top"
   title="See"
   data-original-title="See"
   onClick={() => handleSeeClick(item.imageUrl)} // Pass the image URL
>
   <i className="las la-eye"></i>
</a>

                         
                        </div>
                      </td>
                    </tr>
                  </tbody>
                );
              })}
          </Table>
        </div>
        {/* Pagination */}
        <ReactPaginate
          previousLabel={translate("previous")}
          nextLabel={translate("next")}
          breakLabel={"..."}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          containerClassName={"pagination justify-content-center"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousClassName={"page-item"}
          previousLinkClassName={"page-link"}
          nextClassName={"page-item"}
          nextLinkClassName={"page-link"}
          breakClassName={"page-item"}
          breakLinkClassName={"page-link"}
          activeClassName={"active"}
        />
      </div>

<Modal show={showModal} onHide={() => setShowModal(false)}>
   <Modal.Header closeButton>
      <Modal.Title>{translate("Image Preview")}</Modal.Title>
   </Modal.Header>
   <Modal.Body>
      {selectedImage && <img src={selectedImage} alt="Snapshot" style={{ width: '100%' }} />}
   </Modal.Body>
   <Modal.Footer>
      <Button variant="secondary" onClick={() => setShowModal(false)}>
         {translate("Close")}
      </Button>
   </Modal.Footer>
</Modal>
    </>
  );
}
