import React, { Component, Fragment } from "react";
import moment from 'moment';
import DatePicker from 'react-datetime';
class DatePerson extends Component {


    constructor(props) {
        super(props);
        this.state = {
            userInput: ""
        };
    }


    disableCustomDt = current => {
        const { resultDiasNoLaborales } = this.props; 
        const { getAnosAtrasInvalidos } = this.props;
        const { bloqueaDiasFuturos } = this.props;
        


        var startDate = new Date()
        var year = startDate.getFullYear();
        var month = startDate.getMonth();
        var day = startDate.getDate();
        var pastDate = new Date(year - getAnosAtrasInvalidos, month, day);

        if(bloqueaDiasFuturos){
            return (!resultDiasNoLaborales.includes(current.format('YYYY-MM-DD')) && moment(current).isAfter(pastDate) && moment(current).isBefore(new Date()));
        }
        else{
            return (!resultDiasNoLaborales.includes(current.format('YYYY-MM-DD')) && moment(current).isAfter(pastDate));
        }

        
    }


    onChange = e => {
        try {
            const userInput = moment(e).format("YYYY-MM-DD");
            this.props.parentCallback(userInput);
        } catch (error) {
            console.error("Error " + error);
        }
    };

    render() {

        const {
            onChange,
            disableCustomDt,
            state: {
                userInput
            }
        } = this;

        return (
            <Fragment>


                <DatePicker locale='es' dateFormat="DD/MM/YYYY"
                    closeOnSelect={true} placeholder="dd/mm/yyyy"
                    timeFormat={false}
                    onChange={e => onChange(e)}
                    isValidDate={disableCustomDt}
                    value={userInput} />
            </Fragment>
        );
    }
}

export default DatePerson;