import React from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { Form, Row, Col, InputGroup } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import { useTranslate } from '../LanguageProvider';

interface DateSelectionProps {
  startDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  endDate: Date | null;
  onEndDateChange: (date: Date | null) => void;
}

const DateSelection: React.FC<DateSelectionProps> = ({ startDate, onStartDateChange, endDate, onEndDateChange }) => {
  // Calculate the date 24 hours ago
  const initialStartDate = new Date();
  initialStartDate.setHours(initialStartDate.getHours() - 24);
  
  const { translate } = useTranslate();

  const checkrTypeSelection = () => {
    // Handle the radio button click event for gen_type_manual
  };


  return (
  
      <>
        <Col md={12}> 
          <Form.Group controlId="datetime1" style={{ paddingTop: "25px"}}> 
            <InputGroup> 
            <Form.Label   style={{ paddingRight: "25px",}}>{translate("Start date")} </Form.Label>
              <DatePicker 
                selected={startDate || initialStartDate}
                onChange={(date) => onStartDateChange(date as Date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15} 
                dateFormat="yyyy-MM-dd HH:mm:ss" 
                className="date-control"
              /> 
              <InputGroup.Text>
                <i className="fa fa-calendar"></i>
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>
        </Col> 
        <Col md={12}>
          <Form.Group controlId="datetime2"  style={{ paddingTop: "25px"}}>
            
            <InputGroup> 
            <Form.Label style={{ paddingRight: "50px"}}>{translate("End date")} </Form.Label> 

              <DatePicker
                selected={endDate || new Date()}
                onChange={(date) => onEndDateChange(date as Date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="yyyy-MM-dd HH:mm:ss" 
                className="date-control" 
              />
              <InputGroup.Text>
                <i className="fa fa-calendar"></i>
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>
        </Col>
      </>
  );
};

export default DateSelection;
