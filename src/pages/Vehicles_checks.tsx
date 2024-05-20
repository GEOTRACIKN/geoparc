import { Dropdown, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { useTranslate } from "../components/LanguageProvider";
import { useState, useEffect } from "react";

type Vehicles = {
  id_verif: number;
  Creation_date: string;
  checker: string;
  Driver_out: string;
  Driver_in: string;
  license_vhc: string;
  maintenance: number;
}

export function Vehicleschecks() {
  const { translate } = useTranslate();
  const [pageCount, setPageCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(15);
  const [list_Vehicleschecks, setItems] = useState<Vehicles[]>([]);
  let currentPage = 1;

  const getVehicleschecks = async (currentPage: number, limit: number) => {
    try {
      const total_pages = await fetch(``, { mode: 'cors' });
      const totalpages = await total_pages.json();
      const total = totalpages[0].count;
      setTotal(total);

      const calculatedPageCount = Math.ceil(total / limit);
      setPageCount(calculatedPageCount);

      const res = await fetch(``, { mode: 'cors' });
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error("Erreur lors du chargement des Vehicles Vérifié :", error);
    }
  };

  const fetchVehicleschecks = async (currentPage: number, limit: number) => {
    const res = await fetch(``, { mode: 'cors' });
    const data = await res.json();
    return data;
  };

  const handlePageClick = async (data: any) => {
    let currentPage = data.selected + 1;
    const commentsFormServer = await fetchVehicleschecks(currentPage, limit);
    setItems(commentsFormServer);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    getVehicleschecks(currentPage, limit);
  }, [currentPage, limit]);

  return (
    <>
      <div className="row">
        <div className="col-md-6 col-sm-12">
          <h4>
            <i className="las la-car" data-rel="bootstrap-tooltip" title="Increased"></i>{translate('Verified Vehicles')}
          </h4>
        </div>
        <div className="col-md-6 col-sm-12 text-right">
          <Link to="#" className="btn btn-primary mt-2 mr-1">
            <i className="las la-plus mr-3"></i>
            {translate('Add Verification')}
          </Link>
        </div>
      </div>
      <div className="row">
        <div className="col-md-4" style={{ margin: "0px 0px 10px 0px", padding: "10px" }}>
          <div className="input-group">
            <Dropdown>
              <Dropdown.Toggle variant="link" id="dropdown-basic">
                <i className="fas fa-chevron-down" style={{ color: 'black' }}></i>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>{translate('Verifier')}</Dropdown.Item>
                <Dropdown.Item>{translate('Outgoing Driver')}</Dropdown.Item>
                <Dropdown.Item>{translate('Incoming Driver')}</Dropdown.Item>
                <Dropdown.Item>{translate('Tractor Registration')}</Dropdown.Item>
                <Dropdown.Item>{translate('Trailer Registration')}</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <input type="text" placeholder="test" className="form-control" />
          </div>
        </div>
        <div className="col-md-8 d-flex justify-content-end align-items-center">
          <div className="dataTables_length" id="DataTables_Table_0_length">
            <label className="mr-2">
              {translate('Show')}
              <select
                name="DataTables_Table_0_length"
                aria-controls="DataTables_Table_0"
                className="custom-select custom-select-sm form-control form-control-sm ml-2"
                style={{ width: "66px" }}
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
              {translate('entries')}
            </label>
          </div>
          <Dropdown>
            <Dropdown.Toggle variant="link" id="dropdown-basic">
              Filtre
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>N</Dropdown.Item>
              <Dropdown.Item>{translate('Creation Date')}</Dropdown.Item>
              <Dropdown.Item>{translate('Verifier')}</Dropdown.Item>
              <Dropdown.Item>{translate('Outgoing Driver')}</Dropdown.Item>
              <Dropdown.Item>{translate('Incoming Driver')}</Dropdown.Item>
              <Dropdown.Item>{translate('Tractor Registration')}</Dropdown.Item>
              <Dropdown.Item>{translate('Trailer Registration')}</Dropdown.Item>
              <Dropdown.Item>{translate('Maintenance')}</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      <div className="row m-1">
        <Table>
          <thead className="bg-white text-uppercase">
            <tr className="ligth ligth-data">
              <th>
                <div className="form-check form-check-inline">
                  <input className="form-check-input" type="checkbox" />
                  <label className="form-check-label"></label>
                </div>
              </th>
              <th>N°</th>
              <th>{translate('Creation Date')}</th>
              <th>{translate('Verifier')}</th>
              <th>{translate('Outgoing Driver')}</th>
              <th>{translate('Incoming Driver')}</th>
              <th>{translate('Tractor Registration')}</th>
              <th>{translate('Trailer Registration')}</th>
              <th>{translate('Maintenance')}</th>
              <th>{translate('Actions')}</th>
            </tr>
          </thead>
          <tbody key="#" className="ligth-body">
            {list_Vehicleschecks.map((data) => (
              <tr className={''}>
                <td>
                  <div className="form-check form-check-inline">
                    <input type="checkbox" className="form-check-input" />
                  </div>
                </td>
                <td>{data.id_verif}</td>
                <td>{data.Creation_date}</td>
                <td>{data.checker}</td>
                <td>{data.Driver_out}</td>
                <td>{data.Driver_in}</td>
                <td>{data.license_vhc}</td>
                <td>{data.license_vhc}</td>
                <td>{data.maintenance}</td>
                <td>
                  <div className="d-flex align-items-center list-action">
                    <Link
                      to={`#`}
                      className="badge badge-success mr-2"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Détail"
                    >
                      <i className="fa fa-eye" style={{ fontSize: '1.2em' }}></i>
                    </Link>
                    <a
                      className="badge bg-warning mr-2"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Delete"
                      data-original-title="Delete"
                    >
                      <i className="ri-delete-bin-line mr-0" style={{ fontSize: '1.2em' }}></i>
                    </a>
                    <a
                      className="badge bg-primary mr-2"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="download"
                      data-original-title="download"
                    >
                      <i className="las la-download" style={{ fontSize: '1.2em' }}></i>
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <div className="row">
        <div className="col-md-6 d-flex align-items-center">
          <span>Affichage 1 à 5 sur 5 </span>
        </div>
        <div className="col-md-6">
          <ReactPaginate
            previousLabel={"previous"}
            nextLabel={"next"}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={handlePageClick}
            containerClassName={"pagination justify-content-end"}
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
      </div>
    </>
  )
}
