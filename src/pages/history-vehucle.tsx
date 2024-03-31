import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import { useTranslate } from "../components/LanguageProvider";





const  HistoryVehucle: React.FC =() => {

    const { translate } = useTranslate();
    const userID = localStorage.getItem("userID");
    const [pageCount, setpageCount] = useState(0);
    const [list_history, setItems] = useState([]);
    let currentPage = 1;
    const [total, setTotal] = useState(0);  
    const [limit, setLimit] = useState(15);
    const backendUrl = process.env.REACT_APP_BACKEND_URL;




    useEffect(() => {
        const getHistoryTags = async (currentPage: number, limit: number) => {
          const total_pages = await fetch(
            `${backendUrl}/api/history/totalpage/${userID}`,
            {mode:'cors'}
          ); 
      
          const totalpages = await total_pages.json();
          const total = totalpages[0].total;
          setTotal(total);
      
          const calculatedPageCount = Math.ceil(total / limit);
          setpageCount(calculatedPageCount);
      
      
          const res = await fetch(
            `${backendUrl}/api/history/${userID}?page=${currentPage}&limit=${limit}`,
      
            {mode:'cors'}     
          );  
          const data = await res.json();
          setItems(data);
        };
        getHistoryTags(currentPage,limit);
      }, [limit, userID]);
        
      const fetchHistoryTag = async (currentPage:number,limit :number ) => {
        const res = await fetch(
          `${backendUrl}/api/history/${userID}?page=${currentPage}&limit=${limit}`,      
          {mode:'cors'}
        );
        const data = await res.json();
        return data;
      };

      const handlePageClick = async (data: any) => {
        let currentPage = data.selected + 1;
        const commentsFormServer = await fetchHistoryTag(currentPage,limit);
      
        setItems(commentsFormServer );
        window.scrollTo(0,0)

      };

      // Function to handle the change in the select element
const handleSelectChange = async (event:any) => {
  const newValue = event.target.value;
   setLimit(newValue);
  const commentsFormServer = await fetchHistoryTag(currentPage,newValue);
  setItems(commentsFormServer);
};


    return(
    <>
     <div style={{ display: 'flex', justifyContent: 'space-between' }}> 
            <h4>
             <i className="las la-car" data-rel="bootstrap-tooltip" title="Increased"></i>  {translate('History')}  {translate('Vehicule')}     ({total})   
            </h4>  
            <Link to="/Ibutton" className="btn btn-outline-success">
            <i className="las la-file"></i>
            Liste vehicules
             </Link>
        </div>
     <div id="DataTables_Table_0_wrapper" className="dataTables_wrapper dt-bootstrap4 no-footer">
        <div className="row">
          <div className="col-sm-12 col-md-6">
            <div className="dataTables_length" id="DataTables_Table_0_length">
            <label>
            {translate('Show')}  
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
                {translate('entries')}   
  
              </label>
            </div>
          </div>
          <div className="col-sm-12 col-md-6">
            <div id="DataTables_Table_0_filter" className="dataTables_filter mr-3">  
            </div>
          </div>
        </div>
     </div>
     <div className="row m-2">
                <Table>
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
                      <th>N°Tag</th>
                      <th>{translate('Driver')}</th>
                      <th>{translate('Date Assignment')}</th>
                      <th>{translate('User')}</th>   
                    </tr>
                  </thead>
                 
                  <tbody key="Ibutton" className="light-body">
                  {Array.isArray(list_history) && list_history.length !== 0 && list_history.map((item) => {
                    return (
                      <tr className={item["id_rel"]} key={item["id_rel"]}>
                        <td>
                          <div className="checkbox d-inline-block">
                            <input
                              type="checkbox"
                              className="checkbox-input"
                              id={`checkbox-${item["id_rel"]}`}
                            />
                            <label htmlFor={`checkbox-${item["id_rel"]}`} className="mb-0"></label>
                          </div>
                        </td>
                        <td>
                          <div>
                            <strong style={{ color: 'Green' }}>{translate('Tag Current')}:</strong> {item["tag_actuel"]}
                          </div>
                          <div>
                            <strong>{translate('Tag History')}:</strong> {item["tag_historique"] ? item["tag_historique"] : "-"}
                          </div>
                        </td>
                        <td>{item["nom_conducteur"]} {item["prenom_conducteur"]}</td>
                        <td>{new Date(item["date_creation_relation"]).toLocaleString()}</td>
                        <td>{item["nom_utilisateur"]} {item["prenom_utilisateur"]}</td>
                        
                      </tr>
                    );
                  })}
                </tbody>
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
    ) 
    
    
}

export default HistoryVehucle;

