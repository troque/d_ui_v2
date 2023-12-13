import React, { Component } from 'react';
import UserHeaderOptions from './UserHeaderOptions';

class NavbarHeader extends Component {

    render() {
        return (
            <header id="page-header">
                <div className="content-header">
                    <div>
                        <button type="button" className="btn btn-dual mr-1" data-toggle="layout" data-action="sidebar_toggle">
                            <i className="fa fa-fw fa-bars"></i>
                        </button>
                    </div>
                    <UserHeaderOptions />
                </div>
            </header>
        )
    }

}

export default NavbarHeader;