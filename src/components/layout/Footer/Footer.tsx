

interface FooterProps {
    changFooter: boolean;
  }
  
  const Footer: React.FC<FooterProps> = ({ changFooter }) => {
        return (
           <footer className={`iq-footer ${ changFooter ? "footer-push" : "footer-pool" }`}>
            <div className="container-fluid">
                <div className="card">
                <div className="card-body">
                    <div className="row"> 
                        <div className="col-lg-6">
                            Last account activity <i className="fa fa-clock-o"></i> <strong>52 mins &nbsp;</strong> 
                        </div>
                        <div className="col-lg-6 text-right">
                            <span className="mr-1"> Solution IVMS  2008-<script>document.write(new Date().getFullYear())</script>2023©</span> <a href="#" className="">GEOPARC 2.0</a>.
                        </div>
                    </div>
                </div>
                </div>
            </div>
           </footer>
          );
    
}


export default Footer;