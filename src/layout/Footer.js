import React, { Component } from 'react';

class Footer extends Component {

    render() {
        return(
            <footer id="page-footer" className="bg-body-light">
                <div className="content py-0">
                    <div className="row font-size-sm">
                        <div className="col-sm-6 order-sm-2 mb-1 mb-sm-0 text-center text-sm-right">
                            Desarrollado por
                        </div>
                        <div className="col-sm-6 order-sm-1 text-center text-sm-left">
                            <a className="font-w600" target="_blank">Personería</a> &copy; <span data-toggle="year-copy"></span>
                        </div>
                    </div>
                </div>
            </footer>
        )
    }

}

export default Footer;