import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { useTranslate } from "../components/LanguageProvider";
import { PropagateLoader } from "react-spinners";

const Userhistory: React.FC = () => {
  const { translate } = useTranslate();
  const userID = localStorage.getItem("userID");
  const [pageCount, setpageCount] = useState(0);
  const [userHistory, setUserHistory] = useState([]);
  let currentPage = 1;
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(15);
  const [loading, setLoading] = useState(true);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchUserHistory = async (currentPage: number, limit: number) => {
      setLoading(true);
      const total_pages = await fetch(
        `${backendUrl}/api/userhistory/totalpage/${userID}`,
        { mode: "cors" }
      );

      const totalpages = await total_pages.json();
      const total = totalpages[0].total;
      setTotal(total);
      console.log(total);

      const calculatedPageCount = Math.ceil(total / limit);
      setpageCount(calculatedPageCount);

      const res = await fetch(
        `${backendUrl}/api/userhistory/${userID}?page=${currentPage}&limit=${limit}`,

        { mode: "cors" }
      );
      const data = await res.json();
      setUserHistory(data);

      setLoading(false);
    };
    fetchUserHistory(currentPage, limit);
  }, [currentPage, limit, userID]);

  const fetchHistory = async (currentPage: number, limit: number) => {
    const res = await fetch(
      `${backendUrl}/api/userhistory/${userID}?page=${currentPage}&limit=${limit}`,
      { mode: "cors" }
    );
    const data = await res.json();
    return data;
  };
  useEffect(() => {
    fetchHistory(currentPage, limit);
  }, [userID, limit]);

  const handlePageClick = async (data: { selected: number }) => {
    const currentPage = data.selected + 1;

    const commentsFormServer = await fetchHistory(currentPage, limit);

    setUserHistory(commentsFormServer);
  };

  // Function to handle the change in the select element
  const handleSelectChange = async (event: any) => {
    const newValue = event.target.value;
    setLimit(newValue);
    const commentsFormServer = await fetchHistory(currentPage, newValue);
    setUserHistory(commentsFormServer);
  };

  return (
    <>
      <h4 className="mb-3">
        <i
          className="las la-history"
          data-rel="bootstrap-tooltip"
          title="history"
        ></i>{" "}
        {translate("Historique des utilisateurs")}({total})
      </h4>

      <div>
        <div className="row m-2">
          <div className="col-sm-12 col-md-6">
            <div className="dataTables_length" id="DataTables_Table_0_length">
              <label>
                {translate("Show")}
                <select
                  name="DataTables_Table_0_length"
                  aria-controls="DataTables_Table_0"
                  className="custom-select custom-select-sm form-control form-control-sm mr-2 ml-2"
                  style={{ width: "66px" }}
                  onChange={handleSelectChange}
                >
                  <option value="15">15</option>
                  <option value="30">30</option>
                  <option value="60">60</option>
                  <option value="90">90</option>
                  <option value="180">180</option>
                  <option value="300">300</option>
                  <option value="600">600</option>
                  <option value="900">900</option>
                </select>
                {translate("entries")}
              </label>
            </div>
          </div>
          <div className="col-sm-12 col-md-6 text-right">
            <div
              id="DataTables_Table_0_filter"
              className="dataTables_filter mr-3"
            >
              <a href="#" className="btn btn-outline-info mt-2">
                <i className="las la-plus mr-3"></i>
                {translate("Download CSV")}
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="row m-2">
        <Table responsive>
          <thead className="bg-white text-uppercase    ">
            <tr className="ligth">
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
              <th>{translate("Utilisateur")}</th>
              <th>{translate("Opération")}</th>
              <th>{translate("Module")}</th>
              <th>{translate("Type")}</th>
              <th>{translate("Date de l'Opération")}</th>
              <th>{translate("Informations")}</th>
            </tr>
          </thead>
          {loading ? (
            <tr>
              <td colSpan={12}>
                <div className="text-center">
                  <PropagateLoader
                    color={"#123abc"}
                    loading={loading}
                    size={20}
                  />
                </div>
              </td>
            </tr>
          ) : (
            <tbody key="connexion" className="light-body">
              {Array.isArray(userHistory) &&
                userHistory.length !== 0 &&
                userHistory.map((item) => {
                  return (
                    <tr className={item["idlog"]} key={item["idlog"]}>
                      <td>
                        <div className="checkbox d-inline-block">
                          <input
                            type="checkbox"
                            className="checkbox-input"
                            id={`checkbox-${item["idlog"]}`}
                          />
                          <label
                            htmlFor={`checkbox-${item["idlog"]}`}
                            className="mb-0"
                          ></label>
                        </div>
                      </td>
                      <td>
                        {item["nom_user"]} {item["prenom_user"]}
                      </td>
                      <td>{item["operation_user"]}</td>
                      <td>{item["table_operation"]}</td>
                      <td>{item["type_operation"]}</td>
                      <td>
                        {new Date(item["date_operation"]).toLocaleString()}
                      </td>
                      <td>{item["info_operation"]}</td>
                    </tr>
                  );
                })}
            </tbody>
          )}
        </Table>
      </div>
      <ReactPaginate
        previousLabel={"previous"}
        nextLabel={"next"}
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
    </>
  );
};

export default Userhistory;
